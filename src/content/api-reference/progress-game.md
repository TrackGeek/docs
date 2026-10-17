## POST /progress/game

Base URL: `https://api.trackgeek.net/integrations/v1`. Requires an [OAuth access token](/api-reference/oauth2) with `progress:write`. Send `Authorization: Bearer YOUR_ACCESS_TOKEN`.

Send a JSON body with `Content-Type: application/json`. Unknown fields are rejected. Never send `userId`; the access token determines the account.

This endpoint sets **absolute totals**, not increments. It preserves existing status; new entries start `Playing`. Reaching a total does not itself request a `Completed` status; use [set tracking status](/api-reference/progress-status) for that.

The hour count must be an integer from 0 to 2,147,483,647, with additional media validation. Fractional game hours are not accepted.

Supply `id` and at least one other field:

## Request body

| Body field | Required | Rules |
| --- | --- | --- |
| `id` | Yes | Internal game UUID. |
| `hoursPlayed` | At least one progress field | Absolute non-negative integer hours. |
| `platforms` | At least one progress field | Up to 50 platform slugs, each 1–100 characters, lowercase letters/digits with single hyphens between parts. Duplicates are removed and values sorted. |
| `completion` | At least one progress field | `mainStory`, `mainStoryPlusExtras`, `100%`, or `endless`. |

Use platform slugs associated with the game metadata when available. Sending `platforms` replaces that selection; an empty array clears it. Omitting a field preserves its value. `completion` describes playthrough completion, separately from tracking `status`.

## Response and retries

Status, book, manga, and game updates return `changed`, `previousStatus`, and the `/progress` result fields. A repeated unchanged update normally returns `changed: false`. Bulk episode completion is an explicit operation and may report `changed: true` again.

Repeated unchanged totals do not add progress or create another status-change activity. Writes for the same user/title are serialized. A concurrent update can return HTTP 409 with `progress_update_in_progress`; retry after a short delay. See [Errors & limits](/api-reference/errors) for limits and recovery.

Prefer reading back progress when a request's outcome is uncertain. Do not turn “add ten pages” into a blind increment: read the current total, calculate the requested absolute value, then send that value. Concurrent clients can still overwrite each other's totals, so serialize edits in your own client too.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
