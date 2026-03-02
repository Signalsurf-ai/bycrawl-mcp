import { AsyncLocalStorage } from "node:async_hooks";

export const apiContextStorage = new AsyncLocalStorage<{ apiKey: string }>();

export function getApiKey(): string {
  return apiContextStorage.getStore()?.apiKey ?? process.env.BYCRAWL_API_KEY ?? "";
}
