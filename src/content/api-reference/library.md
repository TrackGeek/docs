## GET /library

Base URL: `https://api.trackgeek.net/integrations/v1`. Requires an [OAuth access token](/api-reference/oauth2) with `library:read`. Send `Authorization: Bearer YOUR_ACCESS_TOKEN`.

## Query parameters

| Query | Required | Rules |
| --- | --- | --- |
| `type` | Yes | `anime`, `manga`, `tv`, `movie`, `game`, or `book`. |
| `status` | No | Exact tracking status, such as `Reading` or `Completed`. |
| `page` | No | Integer 1–1,000; default 1. |
| `limit` | No | Integer 1–25; default 20. |

## Response

The paginated response contains `items`. Each row includes its tracking-row `id`, a normalized `media` object, `status`, dates, and relevant progress fields. Depending on type, these can include `pagesRead`, `totalPages`, `chaptersRead`, `hoursPlayed`, `platforms`, `completion`, repeat counts, and `episodeProgress`. Fields irrelevant to that media type can be omitted.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
