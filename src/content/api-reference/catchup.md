## GET /catchup

Base URL: `https://api.trackgeek.net/integrations/v1`. Requires an [OAuth access token](/api-reference/oauth2) with `library:read`. Send `Authorization: Bearer YOUR_ACCESS_TOKEN`.

## Query parameters

| Query | Required | Rules |
| --- | --- | --- |
| `days` | No | Integer 1–30; default 7. |
| `page` | No | Integer 1–1,000; default 1. |
| `limit` | No | Integer 1–25; default 20. |

## Response

Returns the existing paginated release feed for media followed by the connected user. It is not a global catalogue of all releases.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

The response example shows a valid empty feed: no followed releases match the requested window.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
