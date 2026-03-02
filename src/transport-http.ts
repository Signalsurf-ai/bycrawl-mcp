import { randomUUID } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "./server.js";
import { apiContextStorage } from "./api-context.js";

import type { Request, Response } from "express";

const PORT = parseInt(process.env.PORT ?? "3100", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

// Session storage
const transports: Record<string, StreamableHTTPServerTransport> = {};

function extractApiKey(req: Request): string | undefined {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith("Bearer ")) return bearer.slice(7);

  const header = req.headers["x-bycrawl-api-key"];
  if (typeof header === "string") return header;

  return undefined;
}

/** Returns true if the request was rejected (caller should return early). */
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

export async function startHttp(): Promise<void> {
  const app = createMcpExpressApp({ host: HOST });

  // Health check
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
      if (sessionId && transports[sessionId]) {
        await transports[sessionId].handleRequest(req, res, req.body);
        return;
      }

      // New session (must be initialize request)
      if (!sessionId && isInitializeRequest(req.body)) {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid: string) => {
            transports[sid] = transport;
          },
        });

        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && transports[sid]) delete transports[sid];
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
    const sessionId = req.headers["mcp-session-id"] as string;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    await transports[sessionId].handleRequest(req, res);
  });

  // DELETE /mcp — End session
  app.delete("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    await transports[sessionId].handleRequest(req, res);
  });

  app.listen(PORT, HOST, () => {
    console.log(`ByCrawl MCP HTTP server listening on http://${HOST}:${PORT}/mcp`);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down...");
    for (const sid of Object.keys(transports)) {
      await transports[sid].close();
      delete transports[sid];
    }
    process.exit(0);
  });
}
