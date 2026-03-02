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

  server.tool(
    "instagram_get_post",
    "Get Instagram post by shortcode",
    { shortcode: z.string().describe("Post shortcode (from URL, e.g. CxBcDeFgHiJ)") },
    async ({ shortcode }) => bycrawlGet(`/instagram/posts/${shortcode}`),
  );

  server.tool(
    "instagram_get_post_comments",
    "Get comments on an Instagram post with pagination",
    {
      shortcode: z.string().describe("Post shortcode"),
      cursor: z.string().optional().describe("Pagination cursor from previous response"),
    },
    async ({ shortcode, cursor }) =>
      bycrawlGet(`/instagram/posts/${shortcode}/comments`, {
        ...(cursor ? { cursor } : {}),
      }),
  );

  server.tool(
    "instagram_get_user_posts",
    "Get an Instagram user's posts with pagination",
    {
      username: z.string().describe("Instagram username"),
      cursor: z.string().optional().describe("Pagination cursor from previous response"),
    },
    async ({ username, cursor }) =>
      bycrawlGet(`/instagram/users/${username}/posts`, {
        ...(cursor ? { cursor } : {}),
      }),
  );
}
