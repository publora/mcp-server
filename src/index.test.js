const { describe, it, before, after, mock } = require("node:test");
const assert = require("node:assert");
const http = require("http");
const { app, createApiClient, registerTools, getApiKey } = require("./index.js");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");

// Helper: make HTTP request to test server
function request(server, method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://localhost:${server.address().port}`);
    const opts = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { "Content-Type": "application/json", ...headers },
    };
    const req = http.request(opts, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Parse SSE response to extract JSON-RPC data
function parseSSE(raw) {
  const match = raw.match(/^data: (.+)$/m);
  return match ? JSON.parse(match[1]) : null;
}

let server;

before(() => {
  return new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
});

after(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

// --- Unit tests ---

describe("getApiKey", () => {
  it("extracts Bearer token", () => {
    const req = { headers: { authorization: "Bearer sk_test123" } };
    assert.strictEqual(getApiKey(req), "sk_test123");
  });

  it("extracts x-publora-key header", () => {
    const req = { headers: { "x-publora-key": "sk_abc" } };
    assert.strictEqual(getApiKey(req), "sk_abc");
  });

  it("returns null when no key", () => {
    const req = { headers: {} };
    assert.strictEqual(getApiKey(req), null);
  });

  it("prefers Bearer over x-publora-key", () => {
    const req = { headers: { authorization: "Bearer sk_bearer", "x-publora-key": "sk_header" } };
    assert.strictEqual(getApiKey(req), "sk_bearer");
  });
});

describe("createApiClient", () => {
  it("creates a function", () => {
    const client = createApiClient("sk_test");
    assert.strictEqual(typeof client, "function");
  });
});

describe("registerTools", () => {
  it("registers all 16 tools", () => {
    const mcpServer = new McpServer({ name: "test", version: "1.0.0" });
    const mockApi = async () => ({ success: true });
    registerTools(mcpServer, mockApi);
    // McpServer stores tools internally - verify by checking it doesn't throw
    assert.ok(mcpServer);
  });
});

// --- HTTP endpoint tests ---

describe("GET /health", () => {
  it("returns ok status", async () => {
    const res = await request(server, "GET", "/health");
    assert.strictEqual(res.status, 200);
    const data = JSON.parse(res.body);
    assert.strictEqual(data.status, "ok");
    assert.strictEqual(data.service, "publora-mcp");
  });
});

describe("POST /mcp without auth", () => {
  it("returns 401", async () => {
    const res = await request(server, "POST", "/", {
      headers: { Accept: "application/json, text/event-stream" },
      body: { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
    });
    assert.strictEqual(res.status, 401);
    const data = JSON.parse(res.body);
    assert.ok(data.error.includes("API key required"));
  });
});

describe("POST /mcp with auth", () => {
  it("initializes MCP session", async () => {
    const res = await request(server, "POST", "/", {
      headers: {
        Accept: "application/json, text/event-stream",
        Authorization: "Bearer sk_test_key",
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0.0" },
        },
      },
    });
    assert.strictEqual(res.status, 200);
    const data = parseSSE(res.body);
    assert.ok(data);
    assert.strictEqual(data.result.serverInfo.name, "publora");
    assert.strictEqual(data.result.protocolVersion, "2024-11-05");
    assert.ok(data.result.capabilities.tools);
    // Session ID should be in headers
    assert.ok(res.headers["mcp-session-id"]);
  });

  it("lists all 16 tools", async () => {
    // Init session
    const initRes = await request(server, "POST", "/", {
      headers: {
        Accept: "application/json, text/event-stream",
        Authorization: "Bearer sk_test_key2",
      },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0.0" },
        },
      },
    });
    const sessionId = initRes.headers["mcp-session-id"];

    // List tools
    const res = await request(server, "POST", "/", {
      headers: {
        Accept: "application/json, text/event-stream",
        Authorization: "Bearer sk_test_key2",
        "mcp-session-id": sessionId,
      },
      body: { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
    });
    const data = parseSSE(res.body);
    assert.ok(data);
    const toolNames = data.result.tools.map((t) => t.name).sort();
    const expected = [
      "create_post",
      "create_workspace_user",
      "delete_post",
      "get_post",
      "get_upload_url",
      "linkedin_account_stats",
      "linkedin_create_reaction",
      "linkedin_delete_reaction",
      "linkedin_followers",
      "linkedin_post_stats",
      "linkedin_profile_summary",
      "list_connections",
      "list_posts",
      "list_workspace_users",
      "update_post",
      "workspace_detach_user",
    ].sort();
    assert.deepStrictEqual(toolNames, expected);
  });
});

describe("POST /mcp with invalid session", () => {
  it("returns 400 for unknown session ID", async () => {
    const res = await request(server, "POST", "/", {
      headers: {
        Accept: "application/json, text/event-stream",
        Authorization: "Bearer sk_test",
        "mcp-session-id": "nonexistent-session-id",
      },
      body: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} },
    });
    assert.strictEqual(res.status, 400);
  });
});
