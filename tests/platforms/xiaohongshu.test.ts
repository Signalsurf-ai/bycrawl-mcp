import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { xiaohongshu as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("xiaohongshu", () => {
  it("xiaohongshu_search_notes", async () => {
    const { json, isError } = await callTool("xiaohongshu_search_notes", {
      keyword: f.searchKeyword,
      page: 1,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("xiaohongshu_search_users", async () => {
    const { json, isError } = await callTool("xiaohongshu_search_users", {
      keyword: f.userSearchKeyword,
      page: 1,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("xiaohongshu_get_feed", async () => {
    const { json, isError } = await callTool("xiaohongshu_get_feed", {});
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("xiaohongshu_get_note (placeholder ID)", async () => {
    const { raw, isError } = await callTool("xiaohongshu_get_note", {
      noteId: "000000000000000000000000",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });

  it("xiaohongshu_get_note_comments (placeholder ID)", async () => {
    const { raw, isError } = await callTool("xiaohongshu_get_note_comments", {
      noteId: "000000000000000000000000",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });

  it("xiaohongshu_get_comment_replies (placeholder IDs)", async () => {
    const { raw, isError } = await callTool("xiaohongshu_get_comment_replies", {
      noteId: "000000000000000000000000",
      commentId: "000000000000000000000000",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });

  it("xiaohongshu_get_user (placeholder ID)", async () => {
    const { raw, isError } = await callTool("xiaohongshu_get_user", {
      userId: "000000000000000000000000",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });

  it("xiaohongshu_get_user_notes (placeholder ID)", async () => {
    const { raw, isError } = await callTool("xiaohongshu_get_user_notes", {
      userId: "000000000000000000000000",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });

  it("xiaohongshu_resolve_share_url (placeholder URL)", async () => {
    const { raw, isError } = await callTool("xiaohongshu_resolve_share_url", {
      url: "https://www.xiaohongshu.com/explore/000000000000000000000000",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });
});
