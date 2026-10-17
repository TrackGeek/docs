## POST /progress/episode

Base URL: `https://api.trackgeek.net/integrations/v1`. Requires an [OAuth access token](/api-reference/oauth2) with `progress:write`. Send `Authorization: Bearer YOUR_ACCESS_TOKEN`.

Send a JSON body with `Content-Type: application/json`. Unknown fields are rejected. Never send `userId`; the access token determines the account.

## Request body

| Body field | Required | Rules |
| --- | --- | --- |
| `type` | Yes | `anime` or `tv`. |
| `id` | Yes | Internal anime or TV UUID. |
| `season` | TV only | Integer 0–1,000. Omit entirely for anime. Season 0 can identify TV specials. |
| `episode` | Yes | Integer 1–100,000; must identify an actual episode. Anime uses absolute episode numbering. |
| `status` | Yes | `NotWatched`, `Watching`, `Completed`, `Paused`, `Dropped`, or `Planning`. |

Only that episode's mark is requested; this operation does not bulk-complete a series. The result contains `changed`, `type`, `id`, `episode`, `status`, and `season` for TV.

## Response

HTTP 200 returns the episode mark. `changed` is false when the requested status already matches. TV marks include `season`; anime marks omit it.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
