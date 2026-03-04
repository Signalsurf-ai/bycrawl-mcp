MCP server for [ByCrawl](https://bycrawl.com) — query 8 social media platforms from AI agents like Claude and Cursor.

**Supported platforms:** Threads, X/Twitter, Facebook, Reddit, LinkedIn, Xiaohongshu (RED), TikTok, Instagram

## Setup

### Claude Code

```bash
claude mcp add bycrawl -e BYCRAWL_API_KEY=sk_byc_xxx -- npx -y @bycrawl/mcp
```

### Claude Desktop / Cursor

Add to your MCP config:

```json
{
  "mcpServers": {
    "bycrawl": {
      "command": "npx",
      "args": ["-y", "@bycrawl/mcp"],
      "env": {
        "BYCRAWL_API_KEY": "sk_byc_xxx"
      }
    }
  }
}
```

## Tools (41)

| Platform | Tools | Examples |
|----------|-------|---------|
| Threads | 7 | Search posts, get user profile, public feed |
| X/Twitter | 4 | Search tweets, get user timeline |
| Facebook | 4 | Get page, search posts, get post by URL |
| Reddit | 5 | Get subreddit, search posts, get user |
| LinkedIn | 6 | Get company, search jobs, get post |
| Xiaohongshu | 9 | Search notes, get comments, resolve share URL |
| TikTok | 4 | Get video, browse by category |
| Instagram | 1 | Search hashtags |
| System | 1 | Health check |

## API Key

Get your API key at [bycrawl.com](https://bycrawl.com).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BYCRAWL_API_KEY` | Yes | — | Your ByCrawl API key |
| `BYCRAWL_API_URL` | No | `https://api.bycrawl.com` | API base URL (for self-hosting) |

## License

MIT
