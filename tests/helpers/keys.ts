import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface EnvKeys {
  apiUrl: string;
  apiKey: string;
}

/**
 * Load API keys for the selected environment.
 *
 * Priority:
 * 1. BYCRAWL_API_KEY + BYCRAWL_API_URL env vars (for CI)
 * 2. .keys.json file with ENV=dev|prod selection (default: dev)
 */
export function loadKeys(): EnvKeys {
  // CI / explicit env vars take priority
  if (process.env.BYCRAWL_API_KEY) {
    return {
      apiUrl: process.env.BYCRAWL_API_URL ?? "https://api.bycrawl.com",
      apiKey: process.env.BYCRAWL_API_KEY,
    };
  }

  const keysPath = resolve(import.meta.dirname, "../../.keys.json");
  if (!existsSync(keysPath)) {
    throw new Error(
      `Missing .keys.json — copy .keys.example.json and fill in your API keys.\n` +
        `Or set BYCRAWL_API_KEY env var directly.`,
    );
  }

  const env = (process.env.ENV ?? "dev") as "dev" | "prod";
  const keys = JSON.parse(readFileSync(keysPath, "utf-8"));
  const entry = keys[env];

  if (!entry?.apiKey) {
    throw new Error(`No apiKey found for env "${env}" in .keys.json`);
  }

  return {
    apiUrl: entry.apiUrl ?? "https://api.bycrawl.com",
    apiKey: entry.apiKey,
  };
}
