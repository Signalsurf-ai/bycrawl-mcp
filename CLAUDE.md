# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ByCrawl MCP (`@bycrawl/mcp`) is a Model Context Protocol server that provides AI agents with tools to query 8 social media platforms (Threads, X/Twitter, Facebook, Reddit, LinkedIn, Xiaohongshu, TikTok, Instagram) via the ByCrawl REST API. It communicates over stdio transport.

## Build & Development Commands

- `npm run build` — Compile TypeScript to `build/` directory
- `npm run dev` — Run the server directly with tsx (no build step needed)
- `npm run test:unit` — Unit tests (mocked fetch, no network, ~2s)
- `npm run test:smoke` — Smoke tests (spawns MCP server, validates tool registration, ~5s)
- `npm run test:integration` — Integration tests against real API (41 tools, costs credits)
- `npm run test` — Run all tests
- `ENV=prod npm run test:integration` — Test against production API
- `DEBUG_MCP=true npx vitest run tests/platforms/threads.test.ts` — Debug a single platform

## Architecture

The codebase follows a plugin/registry pattern with three layers:

1. **Entry point** (`src/index.ts`): Creates the MCP server, registers all platform tool modules, and connects via stdio transport.
2. **API client** (`src/client.ts`): Single `bycrawlGet()` function that wraps all ByCrawl REST API calls — handles URL construction, query params, `x-api-key` auth header, 120s timeout, error handling, and returns MCP-formatted `{ content: [{ type: "text", text: ... }] }` responses.
3. **Tool modules** (`src/tools/*.ts`): Each platform has a file exporting a `register{Platform}Tools(server)` function. Each tool is registered via `server.tool(name, description, zodSchema, handler)` where the handler calls `bycrawlGet()`.

## Adding a New Tool

Follow the existing pattern: define a tool name (snake_case with platform prefix, e.g. `threads_search_posts`), a Zod schema for input validation with `.describe()` on each field, and an async handler that calls `bycrawlGet()` with the API endpoint and params. Register it in the platform's `register*Tools` function, which is called from `src/index.ts`.

## Key Conventions

- ES Modules throughout (`"type": "module"` in package.json, `Node16` module resolution)
- TypeScript strict mode enabled
- Only two production dependencies: `@modelcontextprotocol/sdk` and `zod`
- Environment variable `BYCRAWL_API_KEY` is required; `BYCRAWL_API_URL` is optional (defaults to `https://api.bycrawl.com`)
