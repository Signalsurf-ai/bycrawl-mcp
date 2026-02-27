import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { x as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("x", () => {
  it("x_get_user", async () => {
    const { json, isError } = await callTool("x_get_user", {
      username: f.username,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("x_get_user_posts", async () => {
    const { json, isError } = await callTool("x_get_user_posts", {
      username: f.username,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("x_search_posts", async () => {
    const { json, isError } = await callTool("x_search_posts", {
      query: f.searchQuery,
      count: 10,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("x_get_post (known tweet)", async () => {
    // Use a placeholder — validates the tool responds without MCP protocol error
    const { raw, isError } = await callTool("x_get_post", {
      postId: "1234567890",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });
});
