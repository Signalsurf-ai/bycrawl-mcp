import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerTiktokTools(server: McpServer) {
  server.tool(
    "tiktok_get_video",
    "Get TikTok video metadata by video ID",
    { videoId: z.string().describe("TikTok video ID") },
    async ({ videoId }) => bycrawlGet(`/tiktok/videos/${videoId}`),
  );

  server.tool(
    "tiktok_get_user",
    "Get TikTok user info and recent videos",
    {
      username: z.string().describe("TikTok username"),
      count: z.number().optional().describe("Number of recent videos (max 50)"),
    },
    async ({ username, count }) => bycrawlGet(`/tiktok/users/${username}`, { count }),
  );

  server.tool(
    "tiktok_get_user_videos",
    "Get TikTok user's video list",
    {
      username: z.string().describe("TikTok username"),
      count: z.number().optional().describe("Number of videos (max 50)"),
    },
    async ({ username, count }) => bycrawlGet(`/tiktok/users/${username}/videos`, { count }),
  );

  server.tool(
    "tiktok_get_category_videos",
    "Browse TikTok videos by category",
    {
      category: z.string().optional().describe("Category name (e.g. Food, Dance, Comedy). Omit for trending"),
      count: z.number().optional().describe("Number of videos (max 50)"),
    },
    async ({ category, count }) => bycrawlGet("/tiktok/categories", { category, count }),
  );
}
