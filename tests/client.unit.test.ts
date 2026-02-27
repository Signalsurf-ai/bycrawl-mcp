import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Unit tests for bycrawlGet() URL construction and error handling.
 * These mock global fetch to avoid network calls.
 */

// We need to set env vars before importing client
const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.BYCRAWL_API_URL = "https://test.bycrawl.com";
  process.env.BYCRAWL_API_KEY = "sk_byc_test123";
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

// Dynamic import so env vars are set before module loads
async function loadClient() {
  // Clear module cache to pick up new env vars
  vi.resetModules();
  const mod = await import("../src/client.js");
  return mod.bycrawlGet;
}

describe("bycrawlGet", () => {
  it("constructs correct URL from path and params", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"ok":true}', { status: 200 }),
    );
    const bycrawlGet = await loadClient();

    await bycrawlGet("/threads/posts/search", { q: "hello", count: 5 });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url] = fetchSpy.mock.calls[0];
    expect((url as URL).toString()).toBe(
      "https://test.bycrawl.com/threads/posts/search?q=hello&count=5",
    );
  });

  it("filters out null and undefined params", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"ok":true}', { status: 200 }),
    );
    const bycrawlGet = await loadClient();

    await bycrawlGet("/test", { a: "keep", b: null, c: undefined, d: "" });

    const [url] = fetchSpy.mock.calls[0];
    const search = (url as URL).searchParams;
    expect(search.get("a")).toBe("keep");
    expect(search.has("b")).toBe(false);
    expect(search.has("c")).toBe(false);
    expect(search.has("d")).toBe(false); // empty string also filtered
  });

  it("sets x-api-key header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{}', { status: 200 }),
    );
    const bycrawlGet = await loadClient();

    await bycrawlGet("/test");

    const [, options] = fetchSpy.mock.calls[0];
    expect((options as RequestInit).headers).toEqual({ "x-api-key": "sk_byc_test123" });
  });

  it("returns MCP content format on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"data":"value"}', { status: 200 }),
    );
    const bycrawlGet = await loadClient();

    const result = await bycrawlGet("/test");

    expect(result).toEqual({
      content: [{ type: "text", text: '{"data":"value"}' }],
    });
  });

  it("returns error in MCP content format on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network failure"));
    const bycrawlGet = await loadClient();

    const result = await bycrawlGet("/test");

    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("Network failure");
  });

  it("configures abort signal with timeout", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{}', { status: 200 }),
    );
    const bycrawlGet = await loadClient();

    await bycrawlGet("/test");

    const [, options] = fetchSpy.mock.calls[0];
    expect((options as RequestInit).signal).toBeDefined();
  });

  it("handles boolean params correctly", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{}', { status: 200 }),
    );
    const bycrawlGet = await loadClient();

    await bycrawlGet("/test", { flag: true });

    const [url] = fetchSpy.mock.calls[0];
    expect((url as URL).searchParams.get("flag")).toBe("true");
  });
});
