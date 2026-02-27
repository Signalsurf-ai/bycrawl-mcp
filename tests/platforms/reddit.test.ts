import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { reddit as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("reddit", () => {
  it("reddit_get_subreddit", async () => {
    const { json, isError } = await callTool("reddit_get_subreddit", {
      name: f.subreddit,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("reddit_get_subreddit_posts", async () => {
    const { json, isError } = await callTool("reddit_get_subreddit_posts", {
      name: f.subreddit,
      sort: "hot",
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("reddit_search_posts", async () => {
    const { json, isError } = await callTool("reddit_search_posts", {
      query: f.searchQuery,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("reddit_get_user", async () => {
    const { json, isError } = await callTool("reddit_get_user", {
      username: f.username,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("reddit_get_post (placeholder ID)", async () => {
    const { raw, isError } = await callTool("reddit_get_post", {
      postId: "t3_abc123",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });
});
