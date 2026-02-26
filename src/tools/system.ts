import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { bycrawlGet } from "../client.js";

export function registerSystemTools(server: McpServer) {
  server.tool(
    "bycrawl_health",
    "Check ByCrawl API health status",
    {},
    async () => bycrawlGet("/health"),
  );
}
