import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { youtube as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("youtube", () => {
  it("youtube_get_video", async () => {
    const { json, isError } = await callTool("youtube_get_video", {
      videoId: f.videoId,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("youtube_get_channel", async () => {
    const { json, isError } = await callTool("youtube_get_channel", {
      channelId: f.channelId,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("youtube_search_videos", async () => {
    const { json, isError } = await callTool("youtube_search_videos", {
      q: f.searchQuery,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("youtube_get_video_comments", async () => {
    const { json, isError } = await callTool("youtube_get_video_comments", {
      videoId: f.videoId,
      count: 5,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });
});
