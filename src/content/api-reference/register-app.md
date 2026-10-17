## Create your client ID

An OAuth application identifies your integration. Register it once, then let each user authorize it separately.

1. Sign in to the TrackGeek website.
2. Open **Settings → Connections → Developer applications**.
3. Enter a recognizable application name.
4. Enter each callback URL on its own line. This is a URL in **your application** that receives the authorization result.
5. Choose the maximum permissions your application may request.
6. Create the application and save its `client_id`.

Registration does not grant access to anyone's library. The user must still complete [OAuth2 authorization](/api-reference/oauth2).

## Choose a client type

| Application | Client type | Token endpoint authentication |
| --- | --- | --- |
| Browser app, desktop app, mobile app, or local AI client | Public | `none`; no client secret. |
| Web app or bot with a private backend | Confidential | The website creates a `client_secret_basic` client. |

Public applications cannot keep a shared secret private. Leave the backend/confidential option unchecked for these clients. Every client type must use **Authorization Code with PKCE S256**.

For a confidential application, copy the secret when TrackGeek displays it. Keep it on your backend, outside source control. It is not shown again. The client ID can appear in authorization URLs; the secret cannot.

## Register the right callback

| Environment | Example |
| --- | --- |
| Production website or backend | `https://your-app.example/oauth/callback` |
| Local development | `http://127.0.0.1:3000/oauth/callback` |
| Desktop/native application | Use the client's documented callback. Custom URI schemes can be registered through the registration API. |

Use HTTPS in production. The website form accepts HTTPS and local loopback HTTP URLs. The callback must match a registered URI; preserve its scheme, host, port, path, and trailing slash. Do not add a fragment. Register development and production callbacks explicitly.

Do not use TrackGeek's `/auth/oauth2/authorize` endpoint as your callback. That endpoint starts authorization; your callback receives the result.

## Select maximum permissions

| Scope | Select when your application needs to… |
| --- | --- |
| `profile:read` | Identify the connected profile by ID, name, username, and avatar. |
| `library:read` | Read the user's library, tracking progress, episode marks, and followed releases. |
| `progress:write` | Update tracking status, pages, chapters, game progress, or episodes. |
| `offline_access` | Keep access between sessions using rotating refresh tokens. |
| `openid` | Use OpenID Connect identity tokens. |
| `profile` | Request basic OpenID Connect identity claims. |

Registered scopes are a ceiling. Each authorization request asks for a subset, and the user approves that request. `progress:write` does not include `library:read`. `profile` and `profile:read` serve different purposes.

For a reading tracker, `library:read progress:write offline_access` is usually enough. A public search tool needs no user authorization at all.

## Dynamic registration for MCP clients

OAuth-capable MCP clients may register automatically when dynamic client registration is enabled. They discover the registration endpoint from authorization server metadata:

```http
POST /auth/oauth2/register HTTP/1.1
Host: api.trackgeek.net
Content-Type: application/json

{
  "client_name": "My TrackGeek Assistant",
  "redirect_uris": ["http://127.0.0.1:3000/oauth/callback"],
  "token_endpoint_auth_method": "none",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "scope": "profile:read library:read progress:write offline_access"
}
```

The JSON response includes a `client_id` and registered metadata. Keep the returned identity for future connections. Unauthenticated registration creates a **public client**, without a secret or user consent. Do not register a new client for every API request.

An instance can disable this feature with `OAUTH_ALLOW_DYNAMIC_REGISTRATION=false`. In that case, create a client through Settings and configure the MCP client with its ID and registered callback, if the MCP client supports manual registration.

## Manage an application

Use Settings → Connections to manage your own developer applications and your connected applications. These are separate lists:

- **Developer applications** are clients you own. Deleting one affects everyone who authorized that client.
- **Authorized applications** are clients you personally connected. Disconnecting one removes its access to your account.

The developer management endpoints use the developer's TrackGeek website session and enforce ownership:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/oauth2/create-client` | Create a client. |
| GET | `/auth/oauth2/get-clients` | List your clients. |
| GET | `/auth/oauth2/get-client` | Read one of your clients, using `client_id`. |
| POST | `/auth/oauth2/update-client` | Update a client you own. |
| POST | `/auth/oauth2/client/rotate-secret` | Rotate a confidential client's secret. |
| POST | `/auth/oauth2/delete-client` | Delete a client you own. |

Use the TrackGeek website to manage applications. These are session endpoints, not endpoints your integration can call using `progress:write` or another OAuth scope. Do not put website session cookies in an AI prompt or distribute them to end users.

For account access after registration, continue with [OAuth2 authorization](/api-reference/oauth2).
