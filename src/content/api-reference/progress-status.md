## POST /progress/status

Base URL: `https://api.trackgeek.net/integrations/v1`. Requires an [OAuth access token](/api-reference/oauth2) with `progress:write`. Send `Authorization: Bearer YOUR_ACCESS_TOKEN`.

Send a JSON body with `Content-Type: application/json`. Unknown fields are rejected. Never send `userId`; the access token determines the account.

## Request body

| Body field | Required | Rules |
| --- | --- | --- |
| `type` | Yes | `anime`, `manga`, `tv`, `movie`, `game`, or `book`. |
| `id` | Yes | Internal media UUID. |
| `status` | Yes | Compatible status from the table below. |
| `startedAt` | No | ISO 8601 timestamp with timezone, such as `2026-10-17T18:30:00Z`. |
| `completedAt` | No | ISO 8601 timestamp with timezone; only with `status: "Completed"`. |
| `markAllEpisodes` | No | Boolean; default false. True only for anime/TV with `status: "Completed"`. |

| Media type | Allowed statuses |
| --- | --- |
| `movie`, `tv`, `anime` | `NotWatched`, `Watching`, `Rewatching`, `Planning`, `Completed`, `Paused`, `Dropped` |
| `game` | `NotPlayed`, `Playing`, `Replaying`, `Planning`, `Completed`, `Paused`, `Dropped` |
| `book`, `manga` | `NotRead`, `Reading`, `Rereading`, `Planning`, `Completed`, `Paused`, `Dropped` |

First completion records the current time if no completion date exists. Existing dates and repeat counts are preserved unless a supported field explicitly changes them. Setting a series to `Completed` does **not** mark every episode unless you explicitly send `markAllEpisodes: true`.

## Response and retries

Status, book, manga, and game updates return `changed`, `previousStatus`, and the `/progress` result fields. A repeated unchanged update normally returns `changed: false`. Bulk episode completion is an explicit operation and may report `changed: true` again.

Repeated unchanged totals do not add progress or create another status-change activity. Writes for the same user/title are serialized. A concurrent update can return HTTP 409 with `progress_update_in_progress`; retry after a short delay. See [Errors & limits](/api-reference/errors) for limits and recovery.

Prefer reading back progress when a request's outcome is uncertain. Do not turn “add ten pages” into a blind increment: read the current total, calculate the requested absolute value, then send that value. Concurrent clients can still overwrite each other's totals, so serialize edits in your own client too.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
