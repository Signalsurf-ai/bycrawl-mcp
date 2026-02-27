import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { facebook as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("facebook", () => {
  it("facebook_get_page", async () => {
    const { json, isError } = await callTool("facebook_get_page", {
      username: f.pageUsername,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("facebook_get_page_posts", async () => {
    const { json, isError } = await callTool("facebook_get_page_posts", {
      username: f.pageUsername,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("facebook_search_posts", async () => {
    const { json, isError } = await callTool("facebook_search_posts", {
      query: f.searchQuery,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("facebook_get_post (by URL)", async () => {
    const { raw, isError } = await callTool("facebook_get_post", {
      url: f.postUrl,
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });
});
