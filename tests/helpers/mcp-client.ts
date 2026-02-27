import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { resolve } from "node:path";
import { loadKeys } from "./keys.js";

const DEBUG = process.env.DEBUG_MCP === "true";

const SERVER_PATH = resolve(import.meta.dirname, "../../build/index.js");

let _client: Client | null = null;
let _transport: StdioClientTransport | null = null;

/**
 * Get or create a shared MCP client connected to the ByCrawl server.
 * The client is spawned once and reused across all tests in a run.
 */
export async function getClient(): Promise<Client> {
  if (_client) return _client;

  const keys = loadKeys();

  _transport = new StdioClientTransport({
    command: "node",
    args: [SERVER_PATH],
    env: {
      ...process.env as Record<string, string>,
      BYCRAWL_API_KEY: keys.apiKey,
      BYCRAWL_API_URL: keys.apiUrl,
    },
    stderr: DEBUG ? "inherit" : "pipe",
  });

  _client = new Client({ name: "bycrawl-test", version: "1.0.0" });
  await _client.connect(_transport);

  return _client;
}

/**
 * Close the MCP client and kill the server process.
 */
export async function closeClient(): Promise<void> {
  if (_client) {
    await _client.close();
    _client = null;
    _transport = null;
  }
}

/**
 * Call an MCP tool and return the parsed result.
 * If DEBUG_MCP=true, logs the full response.
 */
export async function callTool(name: string, args: Record<string, unknown> = {}): Promise<{
  raw: string;
  json: unknown;
  isError: boolean;
}> {
  const client = await getClient();
  const result = await client.callTool({ name, arguments: args });

  const text = (result.content as Array<{ type: string; text: string }>)[0]?.text ?? "";
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  if (DEBUG) {
    console.log(`\n[DEBUG] ${name}(${JSON.stringify(args)}):`);
    console.log(json ? JSON.stringify(json, null, 2) : text);
  }

  return {
    raw: text,
    json,
    isError: result.isError === true,
  };
}
