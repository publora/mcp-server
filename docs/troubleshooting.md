# Troubleshooting

Common issues and solutions for Publora MCP Server.

## Connection Issues

### "API key required" Error

**Cause:** Missing or malformed Authorization header.

**Solution:**

1. Check your config has the correct format:
   ```json
   {
     "headers": {
       "Authorization": "Bearer sk_YOUR_API_KEY"
     }
   }
   ```

2. Ensure no extra spaces around the key

3. Verify your key starts with `sk_`

4. Regenerate your key at [publora.com](https://publora.com) → Settings → API

### Tools Not Showing in AI Client

**Cause:** MCP server not loaded properly.

**Solutions:**

1. **Restart your AI client** — MCP servers load on startup

2. **Check config file location:**
   - Claude Code: `~/.claude.json` or `.mcp.json`
   - Cursor: `~/.cursor/mcp.json` or `.cursor/mcp.json`
   - Claude Desktop: Settings → Developer → Edit Config

3. **Validate JSON syntax** — use [jsonlint.com](https://jsonlint.com)

4. **Verify config structure:**
   ```json
   {
     "mcpServers": {
       "publora": {
         "type": "http",
         "url": "https://mcp.publora.com",
         "headers": {
           "Authorization": "Bearer sk_..."
         }
       }
     }
   }
   ```

5. **Check with Claude Code:** Run `/mcp` to see connected servers

### "Connection refused" or Network Error

**Cause:** Cannot reach mcp.publora.com.

**Solutions:**

1. Check your internet connection

2. Verify the server is running:
   ```bash
   curl https://mcp.publora.com/health
   ```
   Should return: `{"status":"ok","service":"publora-mcp"}`

3. Check for firewall/proxy blocking the connection

---

## Authentication Issues

### "Invalid API key"

**Solutions:**

1. Check for typos — keys start with `sk_`
2. Ensure no quotes around the key in the header value
3. Regenerate key at [publora.com](https://publora.com) → Settings → API
4. Verify you're using the correct account

### "Unauthorized" When Calling Tools

**Cause:** API key doesn't have access to the requested resource.

**Solutions:**

1. Verify you're connected to the right Publora account
2. Check that your subscription includes API access
3. Ensure you're not trying to access another workspace's data

---

## Tool Errors

### "Platform not found"

**Cause:** Using an invalid platform ID.

**Solution:**

1. First call `list_connections` to get valid platform IDs
2. Platform IDs look like: `twitter-123456`, `linkedin-abc123`
3. Don't use generic names like "twitter" — use the full ID

### "Invalid scheduled time"

**Cause:** Datetime format is wrong.

**Solution:**

Use ISO 8601 format: `2026-03-01T14:00:00Z`

Examples:
- Correct: `2026-03-01T14:00:00Z`
- Correct: `2026-03-01T09:00:00-05:00` (with timezone)
- Wrong: `March 1, 2026`
- Wrong: `03/01/2026 2pm`

### "Post content too long"

**Cause:** Content exceeds platform limits.

**Platform limits:**
- Twitter/X: 280 characters
- LinkedIn: 3,000 characters
- Instagram: 2,200 characters
- Threads: 500 characters
- Bluesky: 300 characters
- Mastodon: 500 characters
- Telegram: 4,096 characters

---

## Session Issues

### "Invalid or missing session"

**Cause:** MCP session expired or not initialized.

**Solution:** This usually resolves automatically. The server creates a new session on the next request. If persistent:

1. Restart your AI client
2. Check your API key is still valid
3. Verify server is responding: `curl https://mcp.publora.com/health`

---

## Configuration Examples

### Claude Code (correct)

```json
{
  "mcpServers": {
    "publora": {
      "type": "http",
      "url": "https://mcp.publora.com",
      "headers": {
        "Authorization": "Bearer sk_abc123def456..."
      }
    }
  }
}
```

### Common Mistakes

**Wrong - missing "type":**
```json
{
  "mcpServers": {
    "publora": {
      "url": "https://mcp.publora.com"
    }
  }
}
```

**Wrong - "url" instead of "http" type:**
```json
{
  "mcpServers": {
    "publora": {
      "type": "url",
      "url": "https://mcp.publora.com"
    }
  }
}
```

**Wrong - missing Bearer prefix:**
```json
{
  "headers": {
    "Authorization": "sk_abc123..."
  }
}
```

---

## Getting Help

If you're still stuck:

1. **Email:** serge@publora.com
2. **Twitter/X:** [@publaborainc](https://x.com/publorainc)
3. **Documentation:** [docs.publora.com](https://docs.publora.com)

When reporting issues, include:
- Your AI client (Claude Code, Cursor, etc.)
- Config file (redact your API key)
- Error message
- Steps to reproduce
