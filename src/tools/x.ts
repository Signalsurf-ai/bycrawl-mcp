import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerXTools(server: McpServer) {
  server.tool(
    "x_get_user",
    "Get X/Twitter user profile by username",
    { username: z.string().describe("X username") },
    async ({ username }) => bycrawlGet(`/x/users/${username}`),
  );

  server.tool(
    "x_get_user_posts",
    "Get X/Twitter user's timeline tweets",
    {
      username: z.string().describe("X username"),
      count: z.number().optional().describe("Number of tweets (max 40)"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ username, count, cursor }) => bycrawlGet(`/x/users/${username}/posts`, { count, cursor }),
  );

  server.tool(
    "x_get_post",
    "Get a single X/Twitter post (tweet) by ID",
    { postId: z.string().describe("Tweet ID") },
    async ({ postId }) => bycrawlGet(`/x/posts/${postId}`),
  );

  server.tool(
    "x_search_posts",
    "Search X/Twitter posts by keyword",
    {
      query: z.string().describe("Search query"),
      count: z.number().optional().describe("Number of tweets (10-100)"),
      cursor: z.string().optional().describe("Pagination cursor"),
      product: z.enum(["Top", "Latest"]).optional().describe("Search tab: Top or Latest"),
    },
    async ({ query, count, cursor, product }) => bycrawlGet("/x/posts/search", { q: query, count, cursor, product }),
  );
}
