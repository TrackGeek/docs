## Build with TrackGeek

Use TrackGeek's integration API to search games, movies, TV series, anime, manga, and books, then read or update the connected person's tracking progress.

The production API origin is **`https://api.trackgeek.net`**. All examples in this reference use that origin. Replace example client IDs, callback URLs, UUIDs, and tokens with your own values.

| If you are building… | Start here |
| --- | --- |
| A Discord bot, player integration, mobile app, or alternative interface | [Register an application](/api-reference/register-app), connect each user with [OAuth2](/api-reference/oauth2), then call the [REST endpoints](/api-reference/rest-api). |
| A connection between an AI assistant and TrackGeek | Add `https://api.trackgeek.net/mcp` to an HTTP MCP client. Follow [Connect an AI client](/api-reference/mcp). |
| A public media lookup | Call the public catalogue endpoints. No account, client ID, or access token is needed. |

## URLs to remember

| Purpose | URL |
| --- | --- |
| REST base and OAuth resource | `https://api.trackgeek.net/integrations/v1` |
| MCP endpoint and OAuth resource | `https://api.trackgeek.net/mcp` |
| OAuth issuer | `https://api.trackgeek.net/auth` |
| Authorization server discovery | `https://api.trackgeek.net/.well-known/oauth-authorization-server/auth` |

A **resource** identifies which service a token may access. REST and MCP are separate resources. A token issued for REST cannot be used for MCP; authorize separately if your application needs both.

## Your first public request

Send this request using an HTTP client such as Bruno or Postman:

```http
GET /integrations/v1/media/search?type=game&query=Hades&page=1 HTTP/1.1
Host: api.trackgeek.net
Accept: application/json
```

The JSON response contains an `items` array. Each item contains a `type`, an `externalId`, and available metadata such as `title`. Search results do not contain the TrackGeek UUID needed to track progress.

Next, send the selected result's `externalId` to `/integrations/v1/media/details`. That response includes an internal `id`. See [Search and resolve media](/api-reference/rest-api#search-and-resolve-media).

## Your first account operation

1. Register your application and its exact callback URL.
2. Ask the user to connect their TrackGeek account through OAuth2.
3. Request `progress:write` to update progress, and `library:read` if you also need to read it.
4. Resolve the correct media UUID using search and details.
5. Send a progress request with the access token in the `Authorization` header.

For example, after obtaining a REST access token:

```http
POST /integrations/v1/progress/book HTTP/1.1
Host: api.trackgeek.net
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "id": "019ce334-c8ac-7883-949d-948f53218272",
  "pagesRead": 120,
  "totalPages": 412
}
```

This sets the page count to **120**. It does not add 120 pages. Page, chapter, and hour updates use absolute totals, making ordinary retries safe. Existing tracking status is preserved; a new book entry starts as `Reading`.

## Which authentication should I use?

Your integration uses **OAuth access tokens**, obtained after the user signs in on TrackGeek and approves permissions. Your application does not collect their password or copy their browser session.

One authorization connects one TrackGeek account. Calls always act on that account; sending `userId` is not supported. A bot serving ten people needs ten user authorizations, not one bot-wide account token.

## Available operations

This reference covers the scoped integration API and MCP tools. You can search media, inspect metadata and episodes, read your profile/library/progress/releases, and update tracking status, pages, chapters, hours, platforms, or individual episodes.

Reviews, lists, favorites, social posting, billing, administrative actions, account settings, bulk imports, and destructive tracking resets are outside this integration contract. Other website endpoints do not automatically accept OAuth tokens.

Continue with [Register an application](/api-reference/register-app) or [Connect an AI client](/api-reference/mcp).
