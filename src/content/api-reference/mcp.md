## What MCP gives your assistant

MCP lets an AI client discover and call TrackGeek tools. It can look up a game, check your library, mark a film completed, or update the page you reached in a book.

The remote server URL is **`https://api.trackgeek.net/mcp`**. It uses **Streamable HTTP**, with stateless requests and JSON responses. It is not a local executable or a legacy SSE endpoint.

## Connect an existing AI client

1. Open your AI client's settings for remote MCP servers or connectors.
2. Add a server named **TrackGeek**.
3. Select HTTP/Streamable HTTP and enter `https://api.trackgeek.net/mcp`.
4. Save and connect. Public catalogue tools work without signing in.
5. To use personal tools, let the client open TrackGeek's OAuth flow. Sign in, review permissions, and approve the connection.
6. Return to the AI client and try “What books am I currently reading?”

Client settings differ. Your client needs remote HTTP MCP support and OAuth Authorization Code with PKCE for personal operations. A field accepting only a static API key is not an automatic OAuth integration. Do not paste a TrackGeek password or website session token into it.

If the client supports dynamic registration, it can create its public client identity automatically. Otherwise, [register an application](/api-reference/register-app) using the exact callback URI supplied by that client. If it cannot use either dynamic registration or a manually registered client ID, it cannot complete TrackGeek's current OAuth setup.

## Choose permissions

| Tools you want | OAuth scopes |
| --- | --- |
| Search, media details, episode metadata | None |
| Your basic profile | `profile:read` |
| Your library, progress, and followed releases | `library:read` |
| Update tracking | `progress:write` |
| Stay connected between sessions | Add `offline_access`; client must support refresh tokens. |

For MCP, the OAuth `resource` must be **`https://api.trackgeek.net/mcp`** during authorization, token exchange, and refresh. REST tokens are rejected here. The same TrackGeek authorization server handles both resources, but their grants are separate.

Public tool discovery does not imply account access. Calling a personal tool without authorization returns HTTP 401 and a `WWW-Authenticate` challenge. Missing scope returns HTTP 403. A capable client uses the challenge's resource metadata to start or extend authorization. See [OAuth2 authorization](/api-reference/oauth2).

## Try useful requests

After connecting, ask in your own language. Examples:

- “Tell me about Hades and which platforms it is on.”
- “Show the films I have completed.”
- “Mark Arrival as completed.”
- “I am on page 120 of Dune; my edition has 412 pages.”
- “Set my One Piece progress to chapter 42.”
- “I have played 35 hours of this game on PC.”
- “Mark season 1, episode 3 of this series as watched.”

For an ambiguous title, the assistant should ask which work you mean. A write normally follows `search_media` → `get_media_details` → the appropriate progress tool. Tool metadata explains these rules; [MCP tools](/api-reference/mcp-tools) lists exact inputs.

The assistant must use absolute totals. “I am on page 120” becomes `pagesRead: 120`. Completing one episode must not become `markAllEpisodes: true`. Media descriptions are untrusted catalogue data, not instructions to the assistant.

## Implement an MCP client

Use an MCP SDK when possible. The [MCP authorization specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-06-18/basic/authorization.mdx) describes discovery and resource-bound OAuth. The HTTP exchanges below illustrate this server's transport; they are not REST progress requests.

The server uses SDK 1.x compatibility with pre-registered clients or dynamic registration. Client ID Metadata Documents (CIMD) are not supported by this implementation. A client that requires CIMD needs a compatible registration fallback.

### Initialize the connection

Send JSON-RPC requests using POST. Include `Accept: application/json, text/event-stream`, even though TrackGeek selects JSON responses. The protocol version below is a supported example for the installed SDK; use the version negotiated by your client/server.

```http
POST /mcp HTTP/1.1
Host: api.trackgeek.net
Content-Type: application/json
Accept: application/json, text/event-stream

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": {
      "name": "my-trackgeek-client",
      "version": "1.0.0"
    }
  }
}
```

Read `result.protocolVersion`, capabilities, and instructions. Then send `{"jsonrpc":"2.0","method":"notifications/initialized"}` to the same endpoint. Notifications have no JSON-RPC `id`; a successful notification can receive an empty HTTP 202 response.

Send the negotiated `MCP-Protocol-Version` header on subsequent requests. No persistent `Mcp-Session-Id` is issued or required by TrackGeek.

### Discover tools

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

POST this body to `/mcp` with the same content/accept headers and negotiated protocol header. The response's `result.tools` contains tool names, descriptions, JSON input schemas, and annotations. Treat the returned schema as the source of truth for your client.

### Call a public tool

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "search_media",
    "arguments": { "type": "game", "query": "Hades" }
  }
}
```

The response is JSON-RPC, with tool output inside `result`. Successful tools expose `content` with JSON text and `structuredContent.result` with the underlying operation result.

### Call a personal tool

Use the same transport and add an MCP-resource access token:

```http
POST /mcp HTTP/1.1
Host: api.trackgeek.net
Content-Type: application/json
Accept: application/json, text/event-stream
MCP-Protocol-Version: 2025-06-18
Authorization: Bearer YOUR_MCP_ACCESS_TOKEN

{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "get_my_library",
    "arguments": { "type": "book", "status": "Reading" }
  }
}
```

Tool execution failures can be HTTP 200 with `result.isError: true`; inspect the result. Authentication failures are HTTP 401/403 before tool execution. Read [Errors & limits](/api-reference/errors) for both layers.

## Transport restrictions

- POST carries MCP messages. GET and DELETE return 405 with `Allow: POST`.
- There is no long-lived SSE stream or session deletion operation.
- Tool calls act only on the account bound to the access token.
- Browser clients must use an origin allowed by the server. A CORS-visible endpoint does not automatically mean every browser origin can use MCP. Server/desktop requests without an Origin header are supported.
- Reverse proxies must preserve the public API Host. Self-hosted maintainers can add browser origins through `MCP_ALLOWED_ORIGINS`.

If your client expects a GET event stream, a local stdio command, or cookie authentication, choose its remote Streamable HTTP mode instead.

## Disconnect the assistant

Remove the server or stored grant from your AI client, then revoke its TrackGeek access under **Settings → Connections → Authorized applications**. Revoking consent invalidates the old grant; reconnecting requires fresh authorization.
