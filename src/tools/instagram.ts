import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerInstagramTools(server: McpServer) {
  server.tool(
    "instagram_search_tags",
    "Search Instagram hashtags by keyword",
    { query: z.string().describe("Hashtag to search") },
    async ({ query }) => bycrawlGet("/instagram/tags/search", { q: query }),
  );

  server.tool(
    "instagram_get_user",
    "Get Instagram user profile with recent posts",
    { username: z.string().describe("Instagram username") },
    async ({ username }) => bycrawlGet(`/instagram/users/${username}`),
  );
}
