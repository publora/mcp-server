#!/usr/bin/env node

/**
 * Publora MCP server — stdio entry point.
 *
 * Runs the same tools as the HTTP server (src/index.js), but over the stdio
 * transport so the server can be launched locally by MCP clients (Claude
 * Desktop, Cursor, etc.) and by tooling that wraps stdio servers.
 *
 * The HTTP server in src/index.js is untouched; this file only reuses its
 * createApiClient + registerTools and connects a StdioServerTransport.
 *
 * API key is read from the PUBLORA_API_KEY env var. Listing tools
 * (introspection) works without a key; a key is only needed to call tools.
 */

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { createApiClient, registerTools } = require("./index.js");

async function main() {
  const apiKey = process.env.PUBLORA_API_KEY || "";

  const mcpServer = new McpServer({ name: "publora", version: "1.0.0" });
  const apiRequest = createApiClient(apiKey);
  registerTools(mcpServer, apiRequest);

  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  // Never write to stdout here — stdout is the JSON-RPC channel.
  console.error("Publora MCP server running on stdio");
}

main().catch((err) => {
  console.error("Failed to start Publora MCP stdio server:", err);
  process.exit(1);
});
