## GET /progress

Base URL: `https://api.trackgeek.net/integrations/v1`. Requires an [OAuth access token](/api-reference/oauth2) with `library:read`. Send `Authorization: Bearer YOUR_ACCESS_TOKEN`.

## Query parameters

| Query | Required | Rules |
| --- | --- | --- |
| `type` | Yes | `anime`, `manga`, `tv`, `movie`, `game`, or `book`. |
| `id` | Yes | Internal media UUID. |
| `episodePage` | No | Integer 1–1,000; default 1. |

## Response

The response contains `progress`, which is the normalized library row or `null` when no entry exists. For anime and TV, it also contains `episodes`, `episodePage`, and `hasMoreEpisodes`. Episode marks return at most 100 entries per page, ordered by episode, and by season first for TV. Increment `episodePage` until `hasMoreEpisodes` is false. An episode mark contains `episode` and `status`, plus `season` for TV.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
