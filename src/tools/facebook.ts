import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerFacebookTools(server: McpServer) {
  server.tool(
    "facebook_get_page",
    "Get Facebook page profile by username",
    { username: z.string().describe("Facebook page username") },
    async ({ username }) => bycrawlGet(`/facebook/users/${username}`),
  );

  server.tool(
    "facebook_get_page_posts",
    "Get Facebook page posts by username",
    { username: z.string().describe("Facebook page username") },
    async ({ username }) => bycrawlGet(`/facebook/users/${username}/posts`),
  );

  server.tool(
    "facebook_get_post",
    "Get a Facebook post by URL (supports posts, reels, videos, share links)",
    { url: z.string().describe("Facebook post URL") },
    async ({ url }) => bycrawlGet("/facebook/posts", { url }),
  );

  server.tool(
    "facebook_search_posts",
    "Search public Facebook posts by keyword",
    {
      query: z.string().describe("Search keyword"),
      count: z.number().optional().describe("Number of results (max 5)"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ query, count, cursor }) => bycrawlGet("/facebook/posts/search", { q: query, count, cursor }),
  );
}
