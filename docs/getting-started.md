# Getting Started with Publora MCP Server

Control your social media directly from AI assistants like Claude, Cursor, or any MCP-compatible client.

## What You Can Do

- Schedule posts to 10 platforms with natural language
- Check analytics and engagement metrics
- Manage your content calendar
- Cross-post to multiple platforms at once

**No coding required.** Just describe what you want:

> "Schedule a LinkedIn post for tomorrow at 9am"
> "How did my posts perform this week?"
> "Post this to Twitter and LinkedIn"

## Step 1: Get Your API Key

1. Sign up at [publora.com](https://publora.com)
2. Go to **Settings** → **API**
3. Click **Generate API Key**
4. Copy your key (starts with `sk_`)

## Step 2: Connect a Social Account

1. In the Publora dashboard, click **Connect Account**
2. Select a platform (Twitter, LinkedIn, Instagram, etc.)
3. Authorize Publora to post on your behalf

## Step 3: Configure Your AI Client

Add Publora to your MCP configuration:

### Claude Code

```bash
# Add to your global config
claude mcp add publora --transport http https://mcp.publora.com --header "Authorization: Bearer sk_YOUR_API_KEY"
```

Or edit `~/.claude.json`:

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

### Cursor

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

### Claude Desktop

1. Open **Settings** → **Developer** → **Edit Config**
2. Add the same JSON configuration
3. Restart Claude Desktop

## Step 4: Start Using It

Restart your AI client, then try:

> "Show my connected social media accounts"

You should see a list of your connected platforms.

## Example: Your First Scheduled Post

> **You:** Schedule a post to LinkedIn saying "Excited to share our latest update!" for tomorrow at 10am

> **Claude:** I'll schedule that for you...
>
> Done! Post scheduled to LinkedIn for tomorrow at 10:00 AM EST.
> Post ID: pg_abc123

## What's Next?

- [Available Tools](./tools/overview.md) — all 16 MCP tools
- [Example Conversations](./examples.md) — common use cases
- [Troubleshooting](./troubleshooting.md) — common issues
