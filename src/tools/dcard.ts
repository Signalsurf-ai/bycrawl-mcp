import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerDcardTools(server: McpServer) {
  server.tool(
    "dcard_get_post",
    "Get a Dcard post by ID",
    { postId: z.string().describe("Dcard post ID") },
    async ({ postId }) => bycrawlGet(`/dcard/posts/${postId}`),
  );

  server.tool(
    "dcard_get_post_comments",
    "Get comments for a Dcard post",
    {
      postId: z.string().describe("Dcard post ID"),
      sort: z
        .enum(["oldest", "newest", "popular"])
        .optional()
        .describe("Sort order"),
    },
    async ({ postId, sort }) =>
      bycrawlGet(`/dcard/posts/${postId}/comments`, { sort }),
  );

  server.tool(
    "dcard_get_forum",
    "Get Dcard forum info by alias",
    { alias: z.string().describe("Forum alias (e.g. trending, talk, mood)") },
    async ({ alias }) => bycrawlGet(`/dcard/forums/${alias}`),
  );

  server.tool(
    "dcard_get_forum_posts",
    "Get posts from a Dcard forum",
    {
      alias: z.string().describe("Forum alias (e.g. trending, talk, mood)"),
      limit: z.number().optional().describe("Number of posts (1-30)"),
      popular: z.boolean().optional().describe("Show popular posts only"),
    },
    async ({ alias, limit, popular }) =>
      bycrawlGet(`/dcard/forums/${alias}/posts`, { limit, popular }),
  );

  server.tool(
    "dcard_search_posts",
    "Search Dcard posts by keyword",
    {
      q: z.string().describe("Search query"),
      limit: z.number().optional().describe("Number of results (1-100)"),
      offset: z.number().optional().describe("Offset for pagination"),
    },
    async ({ q, limit, offset }) =>
      bycrawlGet("/dcard/search/posts", { q, limit, offset }),
  );

  server.tool(
    "dcard_get_persona",
    "Get a Dcard persona by UID",
    { uid: z.string().describe("Dcard persona UID") },
    async ({ uid }) => bycrawlGet(`/dcard/personas/${uid}`),
  );
}
