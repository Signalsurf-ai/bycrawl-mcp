import { describe, it, expect, afterAll } from "vitest";
import { callTool, closeClient } from "../helpers/mcp-client.js";
import { linkedin as f } from "../helpers/fixtures.js";

afterAll(() => closeClient());

describe("linkedin", () => {
  it("linkedin_get_company", async () => {
    const { json, isError } = await callTool("linkedin_get_company", {
      companyId: f.companyId,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("linkedin_get_company_jobs", async () => {
    const { json, isError } = await callTool("linkedin_get_company_jobs", {
      companyId: f.companyId,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("linkedin_search_jobs", async () => {
    const { json, isError } = await callTool("linkedin_search_jobs", {
      query: f.searchQuery,
      location: f.searchLocation,
      count: 2,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("linkedin_get_user", async () => {
    const { json, isError } = await callTool("linkedin_get_user", {
      username: f.username,
    });
    expect(isError).toBe(false);
    expect(json).toBeDefined();
  });

  it("linkedin_get_job (placeholder ID)", async () => {
    const { raw, isError } = await callTool("linkedin_get_job", {
      jobId: "1234567890",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });

  it("linkedin_get_post (placeholder ID)", async () => {
    const { raw, isError } = await callTool("linkedin_get_post", {
      postId: "1234567890",
    });
    expect(isError).toBe(false);
    expect(raw).toBeTruthy();
  });
});
