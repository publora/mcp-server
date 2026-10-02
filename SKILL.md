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

## Available Tools (20 total)

### Posts

| Tool | Description |
|------|-------------|
| `list_posts` | List posts with filters |
| `create_post` | Schedule or publish a post |
| `get_post` | Get post details |
| `update_post` | Reschedule or change status |
| `delete_post` | Delete a post |

### Media

| Tool | Description |
|------|-------------|
| `attach_media` | Attach an image or video from ChatGPT to an existing post |
| `get_upload_url` | Get media upload URL |
| `complete_media` | Finalize an uploaded file |
| `delete_media` | Remove a media file from a post |
| `prune_media_reference` | Remove a stale media reference |

### Account and connections

| Tool | Description |
|------|-------------|
| `account_context` | Plan, features, publishing quotas and schedule horizon |
| `list_connections` | List connected social accounts |

### Statistics (Mastodon and Bluesky, Pro or Premium plan)

| Tool | Description |
|------|-------------|
| `post_stats` | Get post engagement counters |
| `profile_stats` | Get followers, following and post count |

### LinkedIn Engagement

| Tool | Description |
|------|-------------|
| `linkedin_create_reaction` | React to a post |
| `linkedin_delete_reaction` | Remove reaction |
| `linkedin_create_comment` | Comment on a post |
| `linkedin_delete_comment` | Delete a comment |
| `linkedin_create_reshare` | Reshare a post |
| `linkedin_list_mentionables` | List people you can @mention |

LinkedIn statistics and workspace (managed-user) administration are REST only. Clients also list 12 `company_*` tools; they are for Agency client work and only work on Agency accounts.

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
