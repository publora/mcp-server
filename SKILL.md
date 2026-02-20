---
name: publora-mcp
description: Use this skill when connecting AI assistants to social media via MCP (Model Context Protocol). Covers setup for Claude Desktop, Cursor, Windsurf, Cline, OpenClaw, and other MCP-compatible clients to schedule posts, get analytics, and manage social accounts.
---

# Publora MCP Skill

This skill provides documentation for connecting AI assistants to Publora via MCP.

## When to Use This Skill

- Setting up Publora MCP in Claude Desktop, Cursor, or other clients
- Using AI assistants to schedule social media posts
- Getting LinkedIn analytics through natural language
- Building autonomous social media agents with OpenClaw
- Troubleshooting MCP connection issues

## MCP Server

**URL:** `https://mcp.publora.com`

**Transport:** Streamable HTTP

## Authentication

Publora uses **API keys** (not OAuth tokens). Keys never expire and don't require refresh.

**Get your key:** publora.com → Settings → API Keys

**MCP Header:** `Authorization: Bearer sk_your_api_key`

**Note:** The REST API uses `x-publora-key: sk_...` instead. Same key, different header format for MCP compatibility.

## Quick Setup

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com",
      "headers": {
        "Authorization": "Bearer sk_your_api_key"
      }
    }
  }
}
```

### Cursor

Add to MCP settings:

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com",
      "headers": {
        "Authorization": "Bearer sk_your_api_key"
      }
    }
  }
}
```

### OpenClaw (mcporter)

```bash
mcporter add publora --transport http --url https://mcp.publora.com --header "Authorization: Bearer sk_your_api_key"
```

## Available Tools (16 total)

### Posts

| Tool | Description |
|------|-------------|
| `list_posts` | List posts with filters |
| `create_post` | Schedule or publish a post |
| `get_post` | Get post details |
| `update_post` | Reschedule or change status |
| `delete_post` | Delete a post |
| `get_upload_url` | Get media upload URL |

### Connections

| Tool | Description |
|------|-------------|
| `list_connections` | List connected social accounts |

### LinkedIn Analytics

| Tool | Description |
|------|-------------|
| `linkedin_post_stats` | Get post metrics |
| `linkedin_account_stats` | Get account metrics |
| `linkedin_followers` | Get follower count/growth |
| `linkedin_profile_summary` | Get profile overview |
| `linkedin_create_reaction` | React to a post |
| `linkedin_delete_reaction` | Remove reaction |

### Workspace

| Tool | Description |
|------|-------------|
| `list_workspace_users` | List team members |
| `create_workspace_user` | Add team member |
| `workspace_detach_user` | Remove team member |

## Example Prompts

Once configured, use natural language:

- "Show my connected accounts"
- "Schedule 'Hello world!' to LinkedIn for tomorrow at 9am"
- "How did my last LinkedIn post perform?"
- "List all my scheduled posts"
- "Delete the post scheduled for Friday"
- "How many LinkedIn followers do I have?"

## Tool Parameters

### create_post

```json
{
  "content": "Post text here",
  "platforms": ["linkedin-ABC123"],
  "scheduledTime": "2026-03-01T14:00:00Z"
}
```

### list_posts

```json
{
  "status": "scheduled",
  "platform": "linkedin",
  "limit": 20
}
```

### linkedin_post_stats

```json
{
  "postedId": "urn:li:share:123456",
  "platformId": "linkedin-ABC123",
  "queryTypes": ["IMPRESSION", "REACTION", "COMMENT"]
}
```

## Key Concepts

### Platform IDs

Get from `list_connections`:
- `twitter-123456789`
- `linkedin-Tz9W5i6ZYG`
- `instagram-17841412345678`

### Scheduled Time

ISO 8601 UTC format: `2026-03-15T14:00:00Z`

Must be in the future.

### LinkedIn Metrics

Available: `IMPRESSION`, `MEMBERS_REACHED`, `RESHARE`, `REACTION`, `COMMENT`

## Troubleshooting

### "Invalid API key"

Check your API key starts with `sk_` and is correctly set in Authorization header.

### "Tool not found"

Verify MCP server URL is `https://mcp.publora.com` (not `/mcp` path).

### Connection timeout

Check internet connection. The MCP server requires HTTPS.

### No connected platforms

Connect social accounts at [app.publora.com](https://app.publora.com) first.

## Resources

See the `docs/` directory for:
- `docs/getting-started.md` - Setup guide
- `docs/tools/overview.md` - All tools reference
- `docs/examples.md` - Conversation examples
- `docs/troubleshooting.md` - Common issues
