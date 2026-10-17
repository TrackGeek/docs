## First identify the layer

OAuth endpoints, scoped REST endpoints, and MCP do not share one universal error envelope.

| Layer | What to inspect |
| --- | --- |
| OAuth authorization/callback | OAuth error query parameters, or the authorization error page. |
| OAuth token endpoint | HTTP status and JSON `error`, plus `error_description` when returned. |
| Scoped REST | HTTP status and JSON `error`; input failures can include `issues`. |
| MCP authentication | HTTP 401/403 and `WWW-Authenticate`. |
| MCP tool execution | JSON-RPC `result.isError` and `content`, even with HTTP 200. |
| MCP protocol | JSON-RPC `error` for invalid messages/methods, separately from tool results. |

Do not retry every error automatically. Authentication, validation, and rate limits need different recovery.

## HTTP status reference

| Status | Meaning | Next step |
| --- | --- | --- |
| 400 | Invalid input or OAuth/protocol request. | Check field names, types, form encoding, PKCE, and resource. |
| 401 | Missing, expired, invalid, revoked, or wrong-audience access token. | Refresh if possible; otherwise reconnect. |
| 403 | Missing scope, disallowed registration, or transport origin/host rejection. | Inspect the error/challenge; request consent or fix client configuration. |
| 404 | Requested media/resource is unavailable. | Resolve the correct work again. |
| 405 | Unsupported transport method. | Use POST for `/mcp`. |
| 409 | Another update is running for this user and title. | Retry briefly later; serialize edits per title. |
| 422 | Input is syntactically valid but incompatible with media/progress rules. | Correct the status, completion options, or progress value. |
| 429 | HTTP request quota exceeded. | Respect `Retry-After` when supplied, then back off. |
| 5xx | Server or upstream provider failure. | Retry transient failures with bounded backoff. |

## OAuth failures

Common OAuth error names include `access_denied`, `invalid_request`, `invalid_client`, `invalid_grant`, `invalid_scope`, and `unsupported_grant_type`. Read the returned description when available; do not depend on its exact wording.

- **User declined:** stop this attempt and offer reconnect only when requested.
- **Invalid client:** verify the client ID, public/confidential type, and registered token endpoint authentication method.
- **Invalid grant:** the code or refresh token may be expired, used already, bound to another resource/client, or paired with the wrong PKCE verifier. Start a fresh authorization when recovery is not possible.
- **Invalid scope:** request only supported scopes within the client's registered maximum.
- **Unsupported grant:** use authorization code or refresh token. TrackGeek does not provide a bot-wide `client_credentials` grant.
- **Callback mismatch:** use the registered redirect URI unchanged throughout authorization and exchange.

Codes are one-use and expire after five minutes. Keep each callback paired with its original state, verifier, issuer, and resource. Never attempt to fix a mismatch by skipping callback validation.

## Read authorization challenges

Protected REST/MCP operations return `WWW-Authenticate` metadata on access failures. For example, a missing library permission can return:

```http
HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer resource_metadata="https://api.trackgeek.net/.well-known/oauth-protected-resource/integrations/v1", error="insufficient_scope", scope="library:read"
Content-Type: application/json

{ "error": "insufficient_scope" }
```

MCP challenges point to MCP resource metadata; the server may advertise its equivalent root metadata URL `https://api.trackgeek.net/.well-known/oauth-protected-resource`. Follow the URL in the actual response.

For HTTP 401, check that the credential is an **access token**, its resource matches the endpoint, the client is active, and user consent still exists. An unexpired JWT can still be revoked. Logging out of your own client does not substitute for removing its saved grant and disconnecting it on TrackGeek.

## REST validation and progress errors

Unknown fields, malformed UUIDs, invalid enum values, and incorrect input types produce `invalid_input` with validation issues:

```json
{
  "error": "invalid_input",
  "issues": [
    {
      "path": ["pagesRead"],
      "message": "Validation details for this field"
    }
  ]
}
```

This illustrates selected fields; actual issues include validator-specific details. Show useful field messages in your UI instead of dumping raw credentials or request bodies into logs.

| Error code | Cause |
| --- | --- |
| `media_not_found` | The internal UUID does not identify media of that type. |
| `invalid_media_status` | The status does not belong to that media type, such as `Reading` for a movie. |
| `invalid_completion_options` | A completion date without `Completed`, or invalid `markAllEpisodes` usage. |
| `progress_update_in_progress` | Another integration update holds the title's write lock. |
| `rate_limit_exceeded` | The operation quota has been reached. |

Domain services can also return media-specific errors, including incompatible edition totals or episode numbers. Consult [REST endpoints](/api-reference/rest-api) and fetch metadata rather than guessing IDs or episode ranges.

## MCP tool errors

A failed tool execution can return HTTP 200. A selected-field illustration:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "isError": true,
    "content": [
      { "type": "text", "text": "{\"error\":\"progress_update_in_progress\"}" }
    ]
  }
}
```

Inspect `isError` before treating a call as successful. Parse text as JSON only when appropriate for the returned content. Input-schema errors may be reported by the SDK as tool errors with readable validation text; do not assume every MCP failure has the exact REST envelope.

Missing or invalid authorization is handled before the tool runs and returns HTTP 401/403 instead. MCP clients should process those HTTP challenges, not report them as a successful tracking update.

## Rate limits

| Quota | Window | Identity |
| --- | --- | --- |
| Reads | 120 operations per minute | User/application pair; anonymous catalogue reads use client IP. |
| Writes | 30 operations per minute | User/application pair. |

REST and MCP share these operation quotas for the same user/client identity. Existing global HTTP limits also apply, including to requests outside operation execution.

Scoped REST operation throttling returns HTTP 429 with `rate_limit_exceeded` and `Retry-After: 60`. MCP operation throttling is a tool error with `rate_limit_exceeded`; global HTTP throttling can still return HTTP 429 before tool execution. Do not rely only on the HTTP status to detect MCP operation limits.

Cache public metadata sensibly, debounce searches, paginate, and avoid polling personal progress continuously.

## Retry safely

1. For expired access tokens, refresh once using the current refresh token. Serialize refreshes for the same grant and save rotated credentials atomically.
2. For missing permissions or revoked consent, request a new authorization instead of retrying the same token.
3. For 409, wait briefly and retry the same absolute update. Keep retries bounded.
4. For rate limits, wait for the indicated window. Add backoff and jitter when several clients might retry together.
5. For timeouts or transient server failures, read progress back when possible before retrying a write.

Page/chapter/hour writes are absolute values. Retrying `pagesRead: 120` keeps the total at 120. It does not add another 120. An explicit `markAllEpisodes: true` is a bulk request; do not add it to retries of ordinary status changes.

## Connection checklist

If REST works but MCP does not, verify the token's resource. If public lookup works but personal tools fail, check OAuth scopes and consent. If a browser client is rejected while a desktop client works, check allowed Origin settings with the instance maintainer.

For a self-hosted instance, replace the production origin everywhere, including issuer, callbacks, metadata, and resource values. Deploy matching API/web versions and the OAuth migration before expecting authorization to work.
