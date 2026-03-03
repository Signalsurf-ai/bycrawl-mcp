import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerThreadsTools(server: McpServer) {
  server.tool(
    "threads_search_posts",
    "Search Threads posts by keyword",
    {
      query: z.string().describe("Search keyword"),
      count: z.number().optional().describe("Number of results (max 25)"),
      search_type: z.string().optional().describe("Sort order: top (default) or recent"),
      cursor: z.string().optional().describe("Pagination cursor from previous response"),
    },
    async ({ query, count, search_type, cursor }) =>
      bycrawlGet("/threads/posts/search", { q: query, count, search_type, cursor }),
  );

  server.tool(
    "threads_get_post",
    "Get a single Threads post by ID or shortcode",
    { postId: z.string().describe("Post ID or shortcode"), mode: z.enum(["full"]).optional().describe("Use 'full' for view counts") },
    async ({ postId, mode }) => bycrawlGet(`/threads/posts/${postId}`, { mode }),
  );

  server.tool(
    "threads_get_posts_batch",
    "Get multiple Threads posts by IDs (batch)",
    { ids: z.string().describe("Comma-separated post IDs or shortcodes"), mode: z.enum(["full"]).optional().describe("Use 'full' for view counts") },
    async ({ ids, mode }) => bycrawlGet("/threads/posts", { ids, mode }),
  );

  server.tool(
    "threads_search_users",
    "Search Threads users by username or name",
    { query: z.string().describe("Search query"), count: z.number().optional().describe("Number of results (max 25)") },
    async ({ query, count }) => bycrawlGet("/threads/users/search", { q: query, count }),
  );

  server.tool(
    "threads_get_user",
    "Get a Threads user profile by username",
    { username: z.string().describe("Username") },
    async ({ username }) => bycrawlGet(`/threads/users/${username}`),
  );

  server.tool(
    "threads_get_user_posts",
    "Get a Threads user's posts with pagination",
    {
      userId: z.string().describe("Numeric user ID"),
      cursor: z.string().optional().describe("Pagination cursor"),
      count: z.number().optional().describe("Number of results"),
    },
    async ({ userId, cursor, count }) => bycrawlGet(`/threads/users/${userId}/posts`, { cursor, count }),
  );

  server.tool(
    "threads_get_public_feed",
    "Get Threads public For You feed",
    {
      cursor: z.string().optional().describe("Pagination cursor"),
      count: z.number().optional().describe("Number of items"),
      country: z.string().optional().describe("Country code (default: TW)"),
    },
    async ({ cursor, count, country }) => bycrawlGet("/threads/feed/public", { cursor, count, country }),
  );
}
