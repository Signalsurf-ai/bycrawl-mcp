import { describe, it, expect, afterAll } from "vitest";
import { getClient, closeClient, callTool } from "./helpers/mcp-client.js";

const EXPECTED_TOOLS = [
  // Threads (8)
  "threads_search_posts",
  "threads_get_post",
  "threads_get_posts_batch",
  "threads_search_users",
  "threads_get_user",
  "threads_get_user_posts",
  "threads_get_user_replies",
  "threads_get_public_feed",
  // X (4)
  "x_get_user",
  "x_get_user_posts",
  "x_get_post",
  "x_search_posts",
  // Facebook (5)
  "facebook_get_page",
  "facebook_get_page_posts",
  "facebook_get_post",
  "facebook_search_posts",
  "facebook_get_post_comments",
  // Reddit (5)
  "reddit_get_subreddit",
  "reddit_get_subreddit_posts",
  "reddit_search_posts",
  "reddit_get_post",
  "reddit_get_user",
  // LinkedIn (7)
  "linkedin_get_company",
  "linkedin_get_company_jobs",
  "linkedin_search_jobs",
  "linkedin_get_job",
  "linkedin_get_post",
  "linkedin_get_user",
  // Xiaohongshu (9)
  "xiaohongshu_search_notes",
  "xiaohongshu_get_note",
  "xiaohongshu_get_note_comments",
  "xiaohongshu_get_comment_replies",
  "xiaohongshu_search_users",
  "xiaohongshu_get_user",
  "xiaohongshu_get_user_notes",
  "xiaohongshu_get_feed",
  "xiaohongshu_resolve_share_url",
  // LinkedIn user search (1)
  "linkedin_search_users",
  // TikTok (7)
  "tiktok_get_video",
  "tiktok_get_user",
  "tiktok_get_user_videos",
  "tiktok_get_category_videos",
  "tiktok_get_video_comments",
  "tiktok_search_videos",
  "tiktok_get_video_subtitles",
  // Instagram (5)
  "instagram_search_tags",
  "instagram_get_user",
  "instagram_get_post",
  "instagram_get_post_comments",
  "instagram_get_user_posts",
  // YouTube (5)
  "youtube_get_video",
  "youtube_get_channel",
  "youtube_search_videos",
  "youtube_get_video_comments",
  "youtube_get_video_transcription",
  // Dcard (6)
  "dcard_get_post",
  "dcard_get_post_comments",
  "dcard_get_forum",
  "dcard_get_forum_posts",
  "dcard_search_posts",
  "dcard_get_persona",
  // Job104 (3)
  "job104_search_jobs",
  "job104_get_company",
  "job104_get_job",
  // System (1)
  "bycrawl_health",
];

afterAll(async () => {
  await closeClient();
});

describe("smoke", () => {
  it("server starts and lists tools", async () => {
    const client = await getClient();
    const { tools } = await client.listTools();
    expect(tools.length).toBe(EXPECTED_TOOLS.length);
  });

  it("all expected tool names are present", async () => {
    const client = await getClient();
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);
    for (const expected of EXPECTED_TOOLS) {
      expect(names, `missing tool: ${expected}`).toContain(expected);
    }
  });

  it("every tool has a description and input schema", async () => {
    const client = await getClient();
    const { tools } = await client.listTools();
    for (const tool of tools) {
      expect(tool.description, `${tool.name} missing description`).toBeTruthy();
      expect(tool.inputSchema, `${tool.name} missing inputSchema`).toBeDefined();
    }
  });

  it("bycrawl_health returns a response", async () => {
    const { json, isError } = await callTool("bycrawl_health");
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });
});
