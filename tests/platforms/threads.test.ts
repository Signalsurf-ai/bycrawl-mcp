import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { threads as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("threads", () => {
  it("threads_search_posts", async () => {
    const { json, isError } = await callTool("threads_search_posts", {
      query: f.searchQuery,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("threads_search_users", async () => {
    const { json, isError } = await callTool("threads_search_users", {
      query: f.username,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("threads_get_user", async () => {
    const { json, isError } = await callTool("threads_get_user", {
      username: f.username,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("threads_get_user_posts", async () => {
    const { json, isError } = await callTool("threads_get_user_posts", {
      userId: f.userId,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("threads_get_public_feed", async () => {
    const { json, isError } = await callTool("threads_get_public_feed", {
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  // threads_get_post and threads_get_posts_batch require known IDs
  // which may vary — these test that the tool responds without protocol error
  it("threads_get_post (with username-based shortcode)", async () => {
    const { raw, isError } = await callTool("threads_get_post", {
      postId: "C1234567890",
    });
    expect(isError).toBe(false);
    // Even if the post doesn't exist, we should get a valid API response (not MCP error)
    expect(raw).toBeTruthy();
  });

  it("threads_get_posts_batch", async () => {
    const { raw, isError } = await callTool("threads_get_posts_batch", {
      ids: "C1234567890",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });
});
