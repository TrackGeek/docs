## How authorization works

Your application sends the user to TrackGeek. TrackGeek handles sign-in and asks which permissions to grant. Your callback receives a short-lived code, which your application exchanges for an access token.

The user signs in on TrackGeek, including any configured social login, passkey, or two-factor step. Your integration never needs their password or website session cookie.

TrackGeek supports **Authorization Code with PKCE S256** and rotating refresh tokens. Password, implicit, device-code, and `client_credentials` grants are not enabled.

## Endpoint reference

| Purpose | Method and URL |
| --- | --- |
| Authorization server metadata | GET `https://api.trackgeek.net/.well-known/oauth-authorization-server/auth` |
| OpenID Connect metadata | GET `https://api.trackgeek.net/auth/.well-known/openid-configuration` |
| Start authorization | GET `https://api.trackgeek.net/auth/oauth2/authorize` |
| Exchange or refresh tokens | POST `https://api.trackgeek.net/auth/oauth2/token` |
| Dynamic public-client registration | POST `https://api.trackgeek.net/auth/oauth2/register` |
| Public signing keys | GET `https://api.trackgeek.net/auth/jwks` |
| REST protected resource metadata | GET `https://api.trackgeek.net/.well-known/oauth-protected-resource/integrations/v1` |
| MCP protected resource metadata | GET `https://api.trackgeek.net/.well-known/oauth-protected-resource/mcp` |

The issuer is exactly `https://api.trackgeek.net/auth`. Prefer discovery metadata when configuring an OAuth library. [OAuth security best practices](https://www.rfc-editor.org/rfc/rfc9700.html) explain the security model behind this flow.

## Permissions and token lifetimes

| Scope | What it grants |
| --- | --- |
| `profile:read` | Connected user's ID, name, username, and avatar. No email. |
| `library:read` | Library, progress, episode marks, and followed releases. |
| `progress:write` | Tracking updates for the connected user. |
| `offline_access` | A refresh token for access between sessions. Register the `refresh_token` grant too. |
| `openid` | OpenID Connect identity. An ID token is not an API access token. |
| `profile` | Basic OpenID Connect identity claims. Does not replace `profile:read`. |

Access tokens last **10 minutes**, authorization codes **5 minutes**, and refresh tokens **30 days**. Refresh rotation returns a replacement refresh token. Use the expiry values returned in the response rather than hardcoding a refresh schedule.

Request scopes explicitly, separated by spaces. If omitted, authorization defaults to the client's available read permissions. Additional access requires another authorization request and user consent, within the client's registered scope ceiling.

## Step 1: choose the resource

Use exactly one of these values, without a trailing slash:

| Calls your token will make | `resource` |
| --- | --- |
| REST requests | `https://api.trackgeek.net/integrations/v1` |
| MCP requests | `https://api.trackgeek.net/mcp` |

Send the same resource during authorization, code exchange, and refresh. It binds the grant to its intended audience. An ID token, browser session token, or token issued for the other resource will not work.

## Step 2: generate state and PKCE

Generate fresh random values for each authorization attempt. This TypeScript example runs with Bun:

```typescript
import { createHash, randomBytes } from "node:crypto"

const state = randomBytes(32).toString("base64url")
const verifier = randomBytes(32).toString("base64url")
const challenge = createHash("sha256").update(verifier).digest("base64url")

const authorization = new URL("https://api.trackgeek.net/auth/oauth2/authorize")
authorization.search = new URLSearchParams({
  response_type: "code",
  client_id: "YOUR_CLIENT_ID",
  redirect_uri: "https://your-app.example/oauth/callback",
  scope: "profile:read library:read progress:write offline_access",
  state,
  code_challenge: challenge,
  code_challenge_method: "S256",
  resource: "https://api.trackgeek.net/integrations/v1",
}).toString()

console.log(authorization.toString())
```

Keep `state`, `verifier`, the expected issuer, resource, and callback associated with this attempt in your client/session storage. Do not print the verifier or put it in the authorization URL. Open the generated URL in the user's browser. The example only constructs the URL; your application must implement attempt storage and callback handling.

## Step 3: handle the callback

After approval, TrackGeek redirects to your registered callback. A successful callback contains `code`, `state`, and issuer information. A denied request returns an OAuth error, such as `error=access_denied`, instead of a code.

Before exchanging anything:

1. Find the pending authorization attempt for that user/session.
2. Require the returned `state` to match the stored value.
3. Validate the returned `iss` against `https://api.trackgeek.net/auth` using your OAuth library.
4. Handle an OAuth error without exchanging a code.
5. Consume the pending attempt once. Never accept an unsolicited or replayed callback.

Use an OAuth library for callback validation where possible. Do not log callback URLs: they contain one-time credentials.

## Step 4: exchange the code

Send a form-encoded body, not JSON. For a public client:

```http
POST /auth/oauth2/token HTTP/1.1
Host: api.trackgeek.net
Content-Type: application/x-www-form-urlencoded
Accept: application/json

grant_type=authorization_code&client_id=YOUR_CLIENT_ID&redirect_uri=https%3A%2F%2Fyour-app.example%2Foauth%2Fcallback&code=CODE_FROM_CALLBACK&code_verifier=STORED_VERIFIER&resource=https%3A%2F%2Fapi.trackgeek.net%2Fintegrations%2Fv1
```

| Field | Value |
| --- | --- |
| `grant_type` | `authorization_code` |
| `client_id` | Your registered client ID. |
| `redirect_uri` | The exact callback used in the authorization request. |
| `code` | The one-time callback code. |
| `code_verifier` | The original verifier, not its hash. |
| `resource` | The same resource used in Step 2. |

A confidential client must additionally authenticate with its registered method. For a client created through Settings, add `Authorization: Basic BASE64_ENCODED_CLIENT_CREDENTIALS`. Have your OAuth library encode the client ID and secret correctly for HTTP Basic authentication. Keep that header on your backend; PKCE is still required.

An illustrative response, with credentials shortened:

```json
{
  "access_token": "ACCESS_TOKEN",
  "token_type": "Bearer",
  "expires_in": 600,
  "refresh_token": "REFRESH_TOKEN",
  "scope": "profile:read library:read progress:write offline_access"
}
```

`refresh_token` is conditional on offline access and the registered grant. An `id_token` may also be returned for OpenID Connect. Use **`access_token`** for integration calls.

## Step 5: call the API

```http
GET /integrations/v1/me HTTP/1.1
Host: api.trackgeek.net
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

This request needs `profile:read`. Send the token in the header on every protected request. Never place tokens in query strings. For MCP, use an MCP-resource token on `/mcp` instead.

## Step 6: refresh access

Before expiry, or after an expired-token response, send:

```http
POST /auth/oauth2/token HTTP/1.1
Host: api.trackgeek.net
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=YOUR_CLIENT_ID&refresh_token=CURRENT_REFRESH_TOKEN&resource=https%3A%2F%2Fapi.trackgeek.net%2Fintegrations%2Fv1
```

Confidential clients also send their registered client authentication. Save the new access token and **replace the old refresh token** after success. Serialize refreshes for the same grant so concurrent requests do not reuse an old refresh token. Refreshing cannot switch REST access into MCP access or add permissions.

If refresh fails because credentials expired, were reused, or were revoked, clear the local grant and ask the user to reconnect. Do not keep retrying invalid credentials.

## Disconnect and revoke access

Users disconnect an application under **Settings → Connections → Authorized applications**. TrackGeek removes consent and refresh credentials, then rejects the grant's old access tokens on subsequent requests. Reconnecting creates a new authorization; old tokens remain invalid.

The website uses these account-management endpoints:

| Method | URL | Authentication |
| --- | --- | --- |
| GET | `https://api.trackgeek.net/integrations/apps` | TrackGeek website session; returns `{ "apps": [...] }`. |
| DELETE | `https://api.trackgeek.net/integrations/apps/CLIENT_ID` | TrackGeek website session; disconnects only that user's grant, returns 204. |

Integration access tokens do not authorize these session endpoints. Users manage consent through Settings → Connections. Your integration should also remove its own saved credentials when a user disconnects locally.

See [Errors & limits](/api-reference/errors) for authorization failures and recovery.
