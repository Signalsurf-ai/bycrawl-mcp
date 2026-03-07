import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { bycrawlGet } from "../client.js";

export function registerSystemTools(server: McpServer) {
  server.tool(
    "bycrawl_health",
    "Check ByCrawl API health status",
    {},
    async () => bycrawlGet("/health"),
  );

  server.tool(
    "bycrawl_get_account",
    "Get current account info: plan, credits, subscription status, and API key details",
    {},
    async () => bycrawlGet("/account"),
  );
}
