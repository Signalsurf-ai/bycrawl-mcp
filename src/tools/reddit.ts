import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerRedditTools(server: McpServer) {
  server.tool(
    "reddit_get_subreddit",
    "Get subreddit info by name",
    { name: z.string().describe("Subreddit name (without r/)") },
    async ({ name }) => bycrawlGet(`/reddit/subreddits/${name}`),
  );

  server.tool(
    "reddit_get_subreddit_posts",
    "Get posts from a subreddit",
    {
      name: z.string().describe("Subreddit name (without r/)"),
      sort: z.enum(["hot", "new", "top", "rising"]).optional().describe("Sort order"),
      count: z.number().optional().describe("Number of posts (max 100)"),
    },
    async ({ name, sort, count }) => bycrawlGet(`/reddit/subreddits/${name}/posts`, { sort, count }),
  );

  server.tool(
    "reddit_search_posts",
    "Search Reddit posts by keyword",
    {
      query: z.string().describe("Search query"),
      sort: z.enum(["relevance", "hot", "top", "new", "comments"]).optional().describe("Sort order"),
      count: z.number().optional().describe("Number of results (max 100)"),
    },
    async ({ query, sort, count }) => bycrawlGet("/reddit/posts/search", { q: query, sort, count }),
  );

  server.tool(
    "reddit_get_post",
    "Get a Reddit post by ID",
    { postId: z.string().describe("Reddit post ID") },
    async ({ postId }) => bycrawlGet(`/reddit/posts/${postId}`),
  );

  server.tool(
    "reddit_get_user",
    "Get Reddit user profile by username",
    { username: z.string().describe("Reddit username") },
    async ({ username }) => bycrawlGet(`/reddit/users/${username}`),
  );
}
