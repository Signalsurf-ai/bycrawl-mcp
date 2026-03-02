import { randomUUID } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "./server.js";
import { apiContextStorage } from "./api-context.js";

import type { Request, Response, NextFunction } from "express";

const PORT = parseInt(process.env.PORT ?? "3100", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

// Session TTL: clean up sessions idle for more than 30 minutes
const SESSION_TTL_MS = 30 * 60 * 1000;

interface SessionEntry {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
}

const sessions: Record<string, SessionEntry> = {};

// --- Session TTL cleanup ---
setInterval(() => {
  const now = Date.now();
  for (const sid of Object.keys(sessions)) {
    if (now - sessions[sid].lastActivity > SESSION_TTL_MS) {
      console.log(`Session ${sid} expired (idle > ${SESSION_TTL_MS / 60000}min), closing`);
      sessions[sid].transport.close().catch(() => {});
      delete sessions[sid];
    }
  }
}, 60_000); // check every minute

// --- API key helpers ---

function extractApiKey(req: Request): string | undefined {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith("Bearer ")) return bearer.slice(7);

  const header = req.headers["x-bycrawl-api-key"];
  if (typeof header === "string") return header;

  return undefined;
}

function requireApiKey(req: Request, res: Response): string | undefined {
  const apiKey = extractApiKey(req);
  if (!apiKey) {
    res.status(401).json({
      error: "Missing API key. Provide via Authorization: Bearer <key> or x-bycrawl-api-key header.",
    });
    return undefined;
  }
  return apiKey;
}

function withApiKey(apiKey: string, handler: () => Promise<void>): Promise<void> {
  return apiContextStorage.run({ apiKey }, handler);
}

// --- Session helpers ---

function getSession(sessionId: string): SessionEntry | undefined {
  const entry = sessions[sessionId];
  if (entry) entry.lastActivity = Date.now();
  return entry;
}

export async function startHttp(): Promise<void> {
  const app = createMcpExpressApp({ host: HOST });

  // Health check (no auth needed)
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // POST /mcp — MCP requests (initialize + subsequent calls)
  app.post("/mcp", async (req: Request, res: Response) => {
    const apiKey = requireApiKey(req, res);
    if (!apiKey) return;

    await withApiKey(apiKey, async () => {
      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      // Existing session
      if (sessionId) {
        const entry = getSession(sessionId);
        if (entry) {
          await entry.transport.handleRequest(req, res, req.body);
          return;
        }
      }

      // New session (must be initialize request)
      if (!sessionId && isInitializeRequest(req.body)) {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid: string) => {
            sessions[sid] = { transport, lastActivity: Date.now() };
          },
        });

        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && sessions[sid]) delete sessions[sid];
        };

        const server = createServer();
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        return;
      }

      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: No valid session ID provided" },
        id: null,
      });
    });
  });

  // GET /mcp — SSE stream (server-to-client notifications)
  app.get("/mcp", async (req: Request, res: Response) => {
    const apiKey = requireApiKey(req, res);
    if (!apiKey) return;

    const sessionId = req.headers["mcp-session-id"] as string;
    const entry = getSession(sessionId);
    if (!sessionId || !entry) {
      res.status(400).json({ error: "Invalid or missing session ID" });
      return;
    }
    await entry.transport.handleRequest(req, res);
  });

  // DELETE /mcp — End session
  app.delete("/mcp", async (req: Request, res: Response) => {
    const apiKey = requireApiKey(req, res);
    if (!apiKey) return;

    const sessionId = req.headers["mcp-session-id"] as string;
    const entry = getSession(sessionId);
    if (!sessionId || !entry) {
      res.status(400).json({ error: "Invalid or missing session ID" });
      return;
    }
    await entry.transport.handleRequest(req, res);
  });

  // Catch-all: any other route → 404 JSON
  app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ error: "Not found" });
  });

  app.listen(PORT, HOST, () => {
    console.log(`ByCrawl MCP HTTP server listening on http://${HOST}:${PORT}/mcp`);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down...");
    for (const sid of Object.keys(sessions)) {
      await sessions[sid].transport.close().catch(() => {});
      delete sessions[sid];
    }
    process.exit(0);
  });
}
