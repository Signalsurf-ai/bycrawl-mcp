import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerYoutubeTools(server: McpServer) {
  server.tool(
    "youtube_get_video",
    "Get YouTube video details by ID",
    { videoId: z.string().describe("YouTube video ID") },
    async ({ videoId }) => bycrawlGet(`/youtube/videos/${videoId}`),
  );

  server.tool(
    "youtube_get_channel",
    "Get YouTube channel info by channel ID or @handle",
    { channelId: z.string().describe("YouTube channel ID or @handle") },
    async ({ channelId }) => bycrawlGet(`/youtube/channels/${channelId}`),
  );

  server.tool(
    "youtube_search_videos",
    "Search YouTube videos by keyword",
    {
      q: z.string().describe("Search query"),
      count: z.number().optional().describe("Number of results (max 20)"),
    },
    async ({ q, count }) => bycrawlGet("/youtube/search", { q, count }),
  );

  server.tool(
    "youtube_get_video_comments",
    "Get YouTube video comments",
    {
      videoId: z.string().describe("YouTube video ID"),
      count: z.number().optional().describe("Number of comments (max 50)"),
      cursor: z.string().optional().describe("Continuation token for pagination"),
    },
    async ({ videoId, count, cursor }) =>
      bycrawlGet(`/youtube/videos/${videoId}/comments`, { count, cursor }),
  );
}
