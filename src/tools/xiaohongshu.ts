import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerXiaohongshuTools(server: McpServer) {
  server.tool(
    "xiaohongshu_search_notes",
    "Search Xiaohongshu (RED) notes by keyword",
    {
      keyword: z.string().describe("Search keyword"),
      page: z.number().optional().describe("Page number (starts at 1)"),
      sort: z.enum(["general", "time_descending", "popularity_descending"]).optional().describe("Sort order"),
    },
    async ({ keyword, page, sort }) => bycrawlGet("/xiaohongshu/notes/search", { keyword, page, sort }),
  );

  server.tool(
    "xiaohongshu_get_note",
    "Get a Xiaohongshu note (post) by ID",
    { noteId: z.string().describe("Xiaohongshu note ID") },
    async ({ noteId }) => bycrawlGet(`/xiaohongshu/notes/${noteId}`),
  );

  server.tool(
    "xiaohongshu_get_note_comments",
    "Get comments on a Xiaohongshu note",
    {
      noteId: z.string().describe("Xiaohongshu note ID"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ noteId, cursor }) => bycrawlGet(`/xiaohongshu/notes/${noteId}/comments`, { cursor }),
  );

  server.tool(
    "xiaohongshu_get_comment_replies",
    "Get replies (sub-comments) for a specific comment on a Xiaohongshu note",
    {
      noteId: z.string().describe("Xiaohongshu note ID"),
      commentId: z.string().describe("Parent comment ID"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ noteId, commentId, cursor }) => bycrawlGet(`/xiaohongshu/notes/${noteId}/comments/${commentId}/replies`, { cursor }),
  );

  server.tool(
    "xiaohongshu_search_users",
    "Search Xiaohongshu users by keyword",
    {
      keyword: z.string().describe("Search keyword"),
      page: z.number().optional().describe("Page number (starts at 1)"),
    },
    async ({ keyword, page }) => bycrawlGet("/xiaohongshu/users/search", { keyword, page }),
  );

  server.tool(
    "xiaohongshu_get_user",
    "Get a Xiaohongshu user profile by ID",
    { userId: z.string().describe("Xiaohongshu user ID") },
    async ({ userId }) => bycrawlGet(`/xiaohongshu/users/${userId}`),
  );

  server.tool(
    "xiaohongshu_get_user_notes",
    "Get notes posted by a Xiaohongshu user",
    {
      userId: z.string().describe("Xiaohongshu user ID"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ userId, cursor }) => bycrawlGet(`/xiaohongshu/users/${userId}/notes`, { cursor }),
  );

  server.tool(
    "xiaohongshu_get_feed",
    "Get Xiaohongshu discovery feed",
    { cursor: z.string().optional().describe("Pagination cursor") },
    async ({ cursor }) => bycrawlGet("/xiaohongshu/feed", { cursor }),
  );

  server.tool(
    "xiaohongshu_resolve_share_url",
    "Resolve a Xiaohongshu share URL to get note/user data",
    { url: z.string().describe("Xiaohongshu share URL") },
    async ({ url }) => bycrawlGet("/xiaohongshu/share/resolve", { url }),
  );
}
