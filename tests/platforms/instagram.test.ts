import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { instagram as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("instagram", () => {
  it("instagram_search_tags", async () => {
    const { json, isError } = await callTool("instagram_search_tags", {
      query: f.tagQuery,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });
});
