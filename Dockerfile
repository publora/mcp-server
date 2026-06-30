# Dockerfile for publora/mcp-server — lets Glama build, start, and introspect the server.
# Node HTTP MCP server (express + StreamableHTTPServerTransport). Starts without secrets;
# the API key is supplied per-request via the Authorization header, so introspection works at boot.

FROM node:20-alpine
WORKDIR /app

# Install production dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# App source
COPY . .

# Defaults (overridable): PORT=3100, PUBLORA_API_URL=https://api.publora.com
ENV PORT=3100
EXPOSE 3100

CMD ["node", "src/index.js"]
