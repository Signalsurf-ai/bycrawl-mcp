#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerThreadsTools } from "./tools/threads.js";
import { registerXTools } from "./tools/x.js";
import { registerFacebookTools } from "./tools/facebook.js";
import { registerRedditTools } from "./tools/reddit.js";
import { registerLinkedinTools } from "./tools/linkedin.js";
import { registerXiaohongshuTools } from "./tools/xiaohongshu.js";
import { registerTiktokTools } from "./tools/tiktok.js";
import { registerInstagramTools } from "./tools/instagram.js";
import { registerSystemTools } from "./tools/system.js";
import { registerJob104Tools } from "./tools/job104.js";

const server = new McpServer({
  name: "bycrawl",
  version: "0.1.0",
});

registerThreadsTools(server);
registerXTools(server);
registerFacebookTools(server);
registerRedditTools(server);
registerLinkedinTools(server);
registerXiaohongshuTools(server);
registerTiktokTools(server);
registerInstagramTools(server);
registerJob104Tools(server);
registerSystemTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("ByCrawl MCP server running on stdio");
