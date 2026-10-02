# Publora MCP Server

[![smithery badge](https://smithery.ai/badge/publora/publora-mcp)](https://smithery.ai/servers/publora/publora-mcp)

Official [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for [Publora](https://publora.com) — control your social media scheduling directly from AI assistants like Claude, Cursor, and any MCP-compatible client.

**No coding required.** Just describe what you want in plain English:

> "Schedule a LinkedIn post for tomorrow at 9am"
> "How did my last post perform?"
> "Post this to Twitter and LinkedIn"

## Quick Start

### Remote Server (Recommended)

Publora hosts an MCP server at `mcp.publora.com/mcp` — no installation needed.

**Using Claude?** Install it from the connectors directory: [claude.ai/directory/publora](https://claude.ai/directory/publora). Select **Connect**, sign in to Publora, approve. No API key, no config file — on web, desktop and mobile alike.

**Every other client:**

**1. Get your API key** at [app.publora.com/dashboard/api](https://app.publora.com/dashboard/api) (**API** in the dashboard sidebar)

**2. Add to your MCP client:**

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com/mcp",
      "headers": {
        "Authorization": "Bearer sk_YOUR_API_KEY"
      }
    }
  }
}
```

Clients that support OAuth (Claude Code, Cursor, VS Code, Codex and others) can leave out `headers` and sign in through the browser instead.

**3. Restart your client** and start talking to your AI about social media!

---

## Client Setup

<details>
<summary><b>Claude Code (CLI)</b></summary>

```bash
claude mcp add --transport http --scope user publora https://mcp.publora.com/mcp
```

Run `/mcp`, select **publora**, choose **Authenticate** and sign in to Publora in the browser. No API key needed.

For CI or headless machines, send a static key instead:

```bash
claude mcp add --transport http --scope user publora https://mcp.publora.com/mcp \
  --header "Authorization: Bearer sk_YOUR_API_KEY"
```

The same entry can go in `~/.claude.json` or a project `.mcp.json` (JSON above). Verify with the `/mcp` command.
</details>

<details>
<summary><b>Claude Desktop</b></summary>

Claude Desktop uses the same connectors as Claude on the web: open [claude.ai/directory/publora](https://claude.ai/directory/publora) and select **Connect**. There is no config file to edit.

**Settings → Developer → Edit Config** is only needed to run this repository locally over stdio, after cloning it and running `npm install` (see **Local Development** for how its tools differ from the hosted server):

```json
{
  "mcpServers": {
    "publora": {
      "command": "node",
      "args": ["/path/to/mcp-server/src/stdio.js"],
      "env": {
        "PUBLORA_API_KEY": "sk_YOUR_API_KEY"
      }
    }
  }
}
```
</details>

<details>
<summary><b>Cursor</b></summary>

Create `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com/mcp",
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

The code in this repository is an April 2026 snapshot of the server. Its tool set is older: it has LinkedIn analytics and workspace tools, and lacks `attach_media`, `complete_media`, `delete_media`, `prune_media_reference`, `account_context`, `post_stats`, `profile_stats`, `linkedin_create_reshare`, `linkedin_list_mentionables` and the `company_*` Agency tools. Use the hosted server for the current tools.
</details>

---

## Available Tools (20)

The hosted server at `mcp.publora.com/mcp` exposes:

### Posts
| Tool | Description |
|------|-------------|
| `list_posts` | List posts with filters (status, platform, dates) |
| `create_post` | Create a draft or schedule a post; accepts `mediaUrls` and `platformSettings` |
| `get_post` | Get post details and status |
| `update_post` | Edit a draft or scheduled post: content, platforms, schedule, status |
| `delete_post` | Delete a post |

### Media
| Tool | Description |
|------|-------------|
| `attach_media` | Attach an image or video from ChatGPT to an existing post; leaves the post in draft |
| `get_upload_url` | Get a presigned URL for media upload |
| `complete_media` | Finalize a file uploaded via `get_upload_url` |
| `delete_media` | Remove a media slot from a post |
| `prune_media_reference` | Remove a stale media reference that `delete_media` cannot handle |

### Account and connections
| Tool | Description |
|------|-------------|
| `account_context` | Your plan, available features, publishing quotas and schedule horizon — check before a batch of posts or after a quota error |
| `list_connections` | List connected social accounts |

### Statistics (Mastodon and Bluesky, Pro or Premium plan)
| Tool | Description |
|------|-------------|
| `post_stats` | Engagement counters for published posts |
| `profile_stats` | Followers, following and post count of a connected account |

### LinkedIn Engagement
| Tool | Description |
|------|-------------|
| `linkedin_create_reaction` | React to a post |
| `linkedin_delete_reaction` | Remove a reaction |
| `linkedin_create_comment` | Post a comment on a LinkedIn post |
| `linkedin_delete_comment` | Delete a comment |
| `linkedin_create_reshare` | Repost/reshare a LinkedIn post |
| `linkedin_list_mentionables` | List people you can @mention in a LinkedIn post |

LinkedIn analytics and workspace management are available through the [REST API](https://docs.publora.com), not MCP. Full parameters: [MCP Tools Reference](https://docs.publora.com/mcp/tools-reference).

---

## Example Conversations

**Schedule a post:**
> You: Schedule "Excited about our product launch!" to LinkedIn for tomorrow 9am
> AI: Done! Post scheduled for tomorrow at 9am EST.

**Cross-platform posting:**
> You: Post "We're hiring!" to all my accounts
> AI: Published to Twitter, LinkedIn, and Bluesky.

**Check engagement (Mastodon, Bluesky):**
> You: How did my last Bluesky post do?
> AI: 42 likes, 7 reposts and 3 replies so far.

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

Clients that support OAuth 2.1 (Claude, Claude Code, Cursor, VS Code, Codex and others) sign in through the browser — no key to copy.

Everywhere else, use your Publora API key via:
- `Authorization: Bearer sk_...` (recommended)
- `x-publora-key: sk_...`

Get your key: [app.publora.com/dashboard/api](https://app.publora.com/dashboard/api)

---

## Verification

```bash
# Health check
curl https://mcp.publora.com/health

# Test MCP handshake
curl -X POST https://mcp.publora.com/mcp \
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
