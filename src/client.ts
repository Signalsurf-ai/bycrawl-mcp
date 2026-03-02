import { getApiKey } from "./api-context.js";

const API_URL = process.env.BYCRAWL_API_URL ?? "https://api.bycrawl.com";

type McpContent = { content: Array<{ type: "text"; text: string }> };

export async function bycrawlGet(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): Promise<McpContent> {
  try {
    const url = new URL(path, API_URL);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v != null && v !== "") url.searchParams.set(k, String(v));
      }
    }

    const res = await fetch(url, {
      headers: { "x-api-key": getApiKey() },
      signal: AbortSignal.timeout(120_000),
    });

    const body = await res.text();
    return { content: [{ type: "text", text: body }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text", text: JSON.stringify({ error: message }) }] };
  }
}
