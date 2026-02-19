#!/usr/bin/env node

const express = require("express");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StreamableHTTPServerTransport } = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const { z } = require("zod");

const PUBLORA_API_URL = process.env.PUBLORA_API_URL || "https://api.publora.com";
const PORT = process.env.PORT || 3100;

// Per-request API helper that uses the session's API key
function createApiClient(apiKey) {
  return async function apiRequest(method, path, body = null) {
    const url = `${PUBLORA_API_URL}/api/v1${path}`;
    const headers = {
      "x-publora-key": apiKey,
      "Content-Type": "application/json",
    };

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  };
}

function registerTools(server, apiRequest) {
  server.tool(
    "list_connections",
    "List all connected social media accounts (Twitter, LinkedIn, TikTok, etc.)",
    {},
    async () => {
      const data = await apiRequest("GET", "/platform-connections");
      return {
        content: [{ type: "text", text: JSON.stringify(data.connections, null, 2) }],
      };
    }
  );

  server.tool(
    "create_post",
    "Create and schedule a post to one or more social media platforms",
    {
      content: z.string().describe("Post text content"),
      platforms: z.array(z.string()).describe(
        "Array of platform identifiers, e.g. ['twitter-123456', 'linkedin-789']. Use list_connections to get valid IDs."
      ),
      scheduledTime: z.string().describe("ISO 8601 datetime for publishing, e.g. '2025-03-01T12:00:00Z'"),
    },
    async ({ content, platforms, scheduledTime }) => {
      const data = await apiRequest("POST", "/create-post", {
        content,
        platforms,
        scheduledTime,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_post",
    "Get details of a scheduled post group and its platform-specific posts",
    {
      postGroupId: z.string().describe("Post group ID"),
    },
    async ({ postGroupId }) => {
      const data = await apiRequest("GET", `/get-post/${postGroupId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_post",
    "Update a post's status (draft/scheduled) or scheduled time",
    {
      postGroupId: z.string().describe("Post group ID"),
      status: z.enum(["draft", "scheduled"]).optional().describe("New status: 'draft' or 'scheduled'"),
      scheduledTime: z.string().optional().describe("New scheduled time in ISO 8601 format"),
    },
    async ({ postGroupId, status, scheduledTime }) => {
      const body = {};
      if (status) body.status = status;
      if (scheduledTime) body.scheduledTime = scheduledTime;
      const data = await apiRequest("PUT", `/update-post/${postGroupId}`, body);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_post",
    "Delete a scheduled post group and all its platform-specific posts",
    {
      postGroupId: z.string().describe("Post group ID"),
    },
    async ({ postGroupId }) => {
      const data = await apiRequest("DELETE", `/delete-post/${postGroupId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_upload_url",
    "Get a presigned S3 URL to upload media (image/video) for a post",
    {
      postGroupId: z.string().describe("Post group ID to attach media to"),
      fileName: z.string().describe("File name, e.g. 'photo.jpg'"),
      contentType: z.string().describe("MIME type, e.g. 'image/jpeg' or 'video/mp4'"),
      type: z.enum(["image", "video"]).describe("Media type: 'image' or 'video'"),
    },
    async ({ postGroupId, fileName, contentType, type }) => {
      const data = await apiRequest("POST", "/get-upload-url", {
        postGroupId,
        fileName,
        contentType,
        type,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_workspace_users",
    "List all managed users in the workspace",
    {},
    async () => {
      const data = await apiRequest("GET", "/workspace/users");
      return {
        content: [{ type: "text", text: JSON.stringify(data.users, null, 2) }],
      };
    }
  );

  server.tool(
    "create_workspace_user",
    "Create a new managed user in the workspace",
    {
      username: z.string().describe("Email address for the new user"),
      displayName: z.string().optional().describe("Display name (defaults to email)"),
    },
    async ({ username, displayName }) => {
      const body = { username };
      if (displayName) body.displayName = displayName;
      const data = await apiRequest("POST", "/workspace/users", body);
      return {
        content: [{ type: "text", text: JSON.stringify(data.user, null, 2) }],
      };
    }
  );

  server.tool(
    "linkedin_post_stats",
    "Get engagement statistics for a specific LinkedIn post",
    {
      postedId: z.string().describe("LinkedIn post URN, e.g. 'urn:li:share:123456'"),
      platformId: z.string().describe("Platform connection ID, e.g. 'linkedin-XxxYyy'"),
      queryTypes: z.array(z.string()).optional().describe("Metrics to fetch, e.g. ['IMPRESSION', 'REACTION', 'COMMENT', 'SHARE']"),
    },
    async ({ postedId, platformId, queryTypes }) => {
      const body = { postedId, platformId };
      if (queryTypes) body.queryTypes = queryTypes;
      const data = await apiRequest("POST", "/linkedin-post-statistics", body);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "linkedin_account_stats",
    "Get aggregated engagement statistics for a LinkedIn account",
    {
      platformId: z.string().describe("Platform connection ID, e.g. 'linkedin-XxxYyy'"),
      queryTypes: z.array(z.string()).optional().describe("Metrics: ['IMPRESSION', 'REACTION', 'COMMENT', 'SHARE']"),
      aggregation: z.enum(["DAILY", "TOTAL"]).optional().describe("Aggregation type (default: TOTAL)"),
    },
    async ({ platformId, queryTypes, aggregation }) => {
      const body = { platformId };
      if (queryTypes) body.queryTypes = queryTypes;
      if (aggregation) body.aggregation = aggregation;
      const data = await apiRequest("POST", "/linkedin-account-statistics", body);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // 11. List posts with filtering and pagination
  server.tool(
    "list_posts",
    "List scheduled/published posts with filtering by status, platform, date range",
    {
      status: z.enum(["draft", "scheduled", "published", "failed", "partially_published"]).optional().describe("Filter by post status"),
      platform: z.string().optional().describe("Filter by platform name, e.g. 'linkedin', 'twitter'"),
      fromDate: z.string().optional().describe("Start date filter (ISO 8601)"),
      toDate: z.string().optional().describe("End date filter (ISO 8601)"),
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 20, max: 100)"),
      sortBy: z.enum(["createdAt", "updatedAt", "scheduledTime"]).optional().describe("Sort field (default: createdAt)"),
      sortOrder: z.enum(["asc", "desc"]).optional().describe("Sort direction (default: desc)"),
    },
    async ({ status, platform, fromDate, toDate, page, limit, sortBy, sortOrder }) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (platform) params.set("platform", platform);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      const qs = params.toString();
      const data = await apiRequest("GET", `/list-posts${qs ? `?${qs}` : ""}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // 12. LinkedIn followers statistics
  server.tool(
    "linkedin_followers",
    "Get LinkedIn followers count or daily growth over a date range",
    {
      platformId: z.string().describe("Platform connection ID, e.g. 'linkedin-XxxYyy'"),
      period: z.enum(["lifetime", "daily"]).optional().describe("'lifetime' for total count, 'daily' for growth over dateRange"),
      dateRange: z.object({
        start: z.object({ year: z.number(), month: z.number(), day: z.number() }),
        end: z.object({ year: z.number(), month: z.number(), day: z.number() }),
      }).optional().describe("Required for 'daily' period"),
    },
    async ({ platformId, period, dateRange }) => {
      const body = { platformId };
      if (period) body.period = period;
      if (dateRange) body.dateRange = dateRange;
      const data = await apiRequest("POST", "/linkedin-followers", body);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // 13. LinkedIn profile summary
  server.tool(
    "linkedin_profile_summary",
    "Get combined LinkedIn profile overview: followers + post statistics",
    {
      platformId: z.string().describe("Platform connection ID, e.g. 'linkedin-XxxYyy'"),
      dateRange: z.object({
        start: z.object({ year: z.number(), month: z.number(), day: z.number() }),
        end: z.object({ year: z.number(), month: z.number(), day: z.number() }),
      }).optional().describe("Optional date range for stats"),
    },
    async ({ platformId, dateRange }) => {
      const body = { platformId };
      if (dateRange) body.dateRange = dateRange;
      const data = await apiRequest("POST", "/linkedin-profile-summary", body);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // 14. LinkedIn create reaction
  server.tool(
    "linkedin_create_reaction",
    "React to a LinkedIn post (like, praise, etc.)",
    {
      postedId: z.string().describe("LinkedIn post URN, e.g. 'urn:li:share:123456'"),
      platformId: z.string().describe("Platform connection ID"),
      reactionType: z.enum(["LIKE", "PRAISE", "EMPATHY", "INTEREST", "APPRECIATION", "ENTERTAINMENT"]).describe("Reaction type"),
    },
    async ({ postedId, platformId, reactionType }) => {
      const data = await apiRequest("POST", "/linkedin-reactions", { postedId, reactionType, platformId });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // 15. LinkedIn delete reaction
  server.tool(
    "linkedin_delete_reaction",
    "Remove your reaction from a LinkedIn post",
    {
      postedId: z.string().describe("LinkedIn post URN"),
      platformId: z.string().describe("Platform connection ID"),
    },
    async ({ postedId, platformId }) => {
      const data = await apiRequest("DELETE", "/linkedin-reactions", { postedId, platformId });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // 16. Detach workspace user
  server.tool(
    "workspace_detach_user",
    "Remove a managed user from workspace",
    {
      userId: z.string().describe("User ID to detach"),
    },
    async ({ userId }) => {
      const data = await apiRequest("DELETE", `/workspace/users/${userId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}

// Extract API key from request headers
function getApiKey(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return req.headers["x-publora-key"] || null;
}

const app = express();
app.use(express.json());

// Session store: sessionId -> { transport, server }
const sessions = new Map();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "publora-mcp" });
});

// MCP endpoint - handles POST (messages), GET (SSE stream), DELETE (close)
app.all("/", async (req, res) => {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    return res.status(401).json({ error: "API key required. Use Authorization: Bearer <key> or x-publora-key header." });
  }

  // For new sessions (POST without session ID), create server + transport
  if (req.method === "POST" && !req.headers["mcp-session-id"]) {
    const mcpServer = new McpServer({
      name: "publora",
      version: "1.0.0",
    });

    const apiRequest = createApiClient(apiKey);
    registerTools(mcpServer, apiRequest);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => require("crypto").randomUUID(),
    });

    await mcpServer.connect(transport);

    const result = transport.handleRequest(req, res, req.body);

    // sessionId is set after handleRequest processes the init request
    if (transport.sessionId) {
      sessions.set(transport.sessionId, { transport, server: mcpServer });
    }

    transport.onclose = () => {
      if (transport.sessionId) sessions.delete(transport.sessionId);
    };

    return result;
  }

  // Existing session
  const sessionId = req.headers["mcp-session-id"];
  if (sessionId && sessions.has(sessionId)) {
    return sessions.get(sessionId).transport.handleRequest(req, res, req.body);
  }

  return res.status(400).json({ error: "Invalid or missing session. Send a POST without mcp-session-id to start." });
});

// Export for testing
module.exports = { app, createApiClient, registerTools, getApiKey };

// Start server only when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Publora MCP server running on port ${PORT}`);
    console.log(`Backend API: ${PUBLORA_API_URL}`);
    console.log(`MCP endpoint: http://localhost:${PORT}/`);
  });
}
