# Publora MCP Server

Official [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for [Publora](https://publora.com) — control your social media scheduling directly from AI assistants like Claude, Cursor, and any MCP-compatible client.

**No coding required.** Just describe what you want in plain English:

> "Schedule a LinkedIn post for tomorrow at 9am"
> "How did my last post perform?"
> "Post this to Twitter and LinkedIn"

## Quick Start

### Remote Server (Recommended)

Publora hosts an MCP server at `mcp.publora.com` — no installation needed.

**1. Get your API key** at [publora.com](https://publora.com) → Settings → API

**2. Add to your MCP client:**

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

**3. Restart your client** and start talking to your AI about social media!

---

## Client Setup

<details>
<summary><b>Claude Code (CLI)</b></summary>

Edit `~/.claude.json` or create `.mcp.json` in your project:

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com",
      "headers": {
        "Authorization": "Bearer sk_YOUR_API_KEY"
      }
    }
  }
}
```

Restart Claude Code. Verify with `/mcp` command.
</details>

<details>
<summary><b>Claude Desktop</b></summary>

1. Open Claude Desktop → **Settings** → **Developer** → **Edit Config**
2. Add the Publora server (same JSON as above)
3. Restart Claude Desktop
</details>

<details>
<summary><b>Cursor</b></summary>

Create `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com",
      "headers": {
        "Authorization": "Bearer sk_YOUR_API_KEY"
      }
    }
  }
}
```
</details>

<details>
<summary><b>Local Development</b></summary>

Run your own instance:

```bash
git clone https://github.com/publora/mcp-server.git
cd mcp-server
npm install
PUBLORA_API_URL=https://api.publora.com npm start
```

Server runs on `http://localhost:3100`
</details>

---

## Available Tools (16)

### Posts
| Tool | Description |
|------|-------------|
| `list_posts` | List posts with filters (status, platform, dates) |
| `create_post` | Schedule a post to one or more platforms |
| `get_post` | Get post details and status |
| `update_post` | Reschedule or change status |
| `delete_post` | Delete a post |
| `get_upload_url` | Get presigned URL for media upload |

### Connections
| Tool | Description |
|------|-------------|
| `list_connections` | List connected social accounts |

### LinkedIn Analytics
| Tool | Description |
|------|-------------|
| `linkedin_post_stats` | Post engagement metrics |
| `linkedin_account_stats` | Account-level statistics |
| `linkedin_followers` | Follower count and growth |
| `linkedin_profile_summary` | Combined profile overview |
| `linkedin_create_reaction` | React to a post |
| `linkedin_delete_reaction` | Remove a reaction |

### Workspace (B2B)
| Tool | Description |
|------|-------------|
| `list_workspace_users` | List team members |
| `create_workspace_user` | Add a user |
| `workspace_detach_user` | Remove a user |

---

## Example Conversations

**Schedule a post:**
> You: Schedule "Excited about our product launch!" to LinkedIn for tomorrow 9am
> AI: Done! Post scheduled for tomorrow at 9am EST.

**Cross-platform posting:**
> You: Post "We're hiring!" to all my accounts
> AI: Published to Twitter, LinkedIn, and Bluesky.

**Check analytics:**
> You: How did my LinkedIn posts perform this week?
> AI: 5 posts, 4,230 impressions, 89 reactions. Best: Monday's update (1,850 impressions).

**Content calendar:**
> You: What do I have scheduled for next week?
> AI: 5 posts: Mon LinkedIn, Tue Twitter+LinkedIn, Wed LinkedIn...

---

## Who Is This For?

- **Marketers** — manage campaigns and check analytics via AI chat
- **Content creators** — schedule posts without switching apps
- **Business owners** — delegate social media tasks to AI
- **Developers** — integrate Publora into AI-powered workflows

---

## Supported Platforms

Twitter/X · LinkedIn · Instagram · Threads · TikTok · YouTube · Facebook · Bluesky · Mastodon · Telegram

---

## Authentication

Use your Publora API key via:
- `Authorization: Bearer sk_...` (recommended)
- `x-publora-key: sk_...`

Get your key: [publora.com](https://publora.com) → Settings → API

---

## Verification

```bash
# Health check
curl https://mcp.publora.com/health

# Test MCP handshake
curl -X POST https://mcp.publora.com \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer sk_YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}'
```

---

## Documentation

- **MCP Setup Guide:** [docs.publora.com/guides/mcp-server](https://docs.publora.com/guides/mcp-server)
- **REST API Docs:** [docs.publora.com](https://docs.publora.com)
- **MCP Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

## Development

```bash
# Install
npm install

# Run locally
PUBLORA_API_URL=https://api.publora.com npm start

# Run tests
npm test
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3100` | Server port |
| `PUBLORA_API_URL` | `https://api.publora.com` | Backend API URL |

---

## Related

- [Publora](https://publora.com) — Social media scheduling platform
- [Publora API Docs](https://docs.publora.com) — REST API documentation
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) — Community MCP servers list

---

## License

[MIT](LICENSE)

---

**[Publora](https://publora.com)** — Affordable social media API starting at $5.40/month
