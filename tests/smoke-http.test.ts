import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ChildProcess, spawn } from "node:child_process";
import { resolve } from "node:path";

const PORT = 3111; // Use a unique port to avoid conflicts
const SERVER_URL = `http://127.0.0.1:${PORT}`;
const SERVER_PATH = resolve(import.meta.dirname, "../build/index.js");

let serverProcess: ChildProcess;

beforeAll(async () => {
  // Start the HTTP server
  serverProcess = spawn("node", [SERVER_PATH], {
    env: {
      ...process.env,
      TRANSPORT: "http",
      PORT: String(PORT),
      HOST: "127.0.0.1",
      BYCRAWL_API_KEY: "sk_test_dummy",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  // Wait for server to be ready (log goes to stdout via console.log)
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Server start timeout")), 10_000);

    const onData = (data: Buffer) => {
      if (data.toString().includes("listening")) {
        clearTimeout(timeout);
        resolve();
      }
    };

    serverProcess.stdout?.on("data", onData);
    serverProcess.stderr?.on("data", onData);

    serverProcess.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
});

afterAll(() => {
  serverProcess?.kill("SIGINT");
});

describe("smoke-http", () => {
  it("health endpoint returns ok", async () => {
    const res = await fetch(`${SERVER_URL}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });

  it("MCP client connects via HTTP and lists tools", async () => {
    const transport = new StreamableHTTPClientTransport(
      new URL(`${SERVER_URL}/mcp`),
    );
    const client = new Client({ name: "http-smoke-test", version: "1.0.0" });

    await client.connect(transport);

    const { tools } = await client.listTools();
    expect(tools.length).toBeGreaterThan(40);

    // Spot-check a few tools
    const names = tools.map((t) => t.name);
    expect(names).toContain("threads_search_posts");
    expect(names).toContain("bycrawl_health");

    await client.close();
  });
});
