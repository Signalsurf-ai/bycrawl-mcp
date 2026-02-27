import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { tiktok as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("tiktok", () => {
  it("tiktok_get_user", async () => {
    const { json, isError } = await callTool("tiktok_get_user", {
      username: f.username,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("tiktok_get_user_videos", async () => {
    const { json, isError } = await callTool("tiktok_get_user_videos", {
      username: f.username,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("tiktok_get_category_videos", async () => {
    const { json, isError } = await callTool("tiktok_get_category_videos", {
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("tiktok_get_video (placeholder ID)", async () => {
    const { raw, isError } = await callTool("tiktok_get_video", {
      videoId: "1234567890",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });
});
