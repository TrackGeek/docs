## Request basics

The REST base URL is **`https://api.trackgeek.net/integrations/v1`**. Paths below are relative to this base. Public catalogue requests need no authentication. Personal requests require an [OAuth access token](/api-reference/oauth2) issued for this exact REST resource.

Send query parameters for GET requests and JSON bodies for progress POST requests. JSON field names, media types, and status values are case-sensitive. Unknown input fields are rejected. Never send `userId`: the token determines the account.

Successful requests return JSON with HTTP 200. Progress updates can create a tracking entry when none exists. Each operation has its own page with parameters and a request/response viewer.

## Search and resolve media

Use three steps: **search → details → read or update progress**. Search returns provider `externalId` values. Details resolves a title and returns its internal media UUID. Use that UUID for personal progress.

| Method | Endpoint | Permission |
| --- | --- | --- |
| GET | [`/media/search`](/api-reference/media-search) | Public |
| GET | [`/media/details`](/api-reference/media-details) | Public |
| GET | [`/media/episodes`](/api-reference/media-episodes) | Public |

## Read personal data

| Method | Endpoint | Permission |
| --- | --- | --- |
| GET | [`/me`](/api-reference/me) | `profile:read` |
| GET | [`/library`](/api-reference/library) | `library:read` |
| GET | [`/progress`](/api-reference/progress) | `library:read` |
| GET | [`/catchup`](/api-reference/catchup) | `library:read` |

## Update progress

| Method | Endpoint | Permission |
| --- | --- | --- |
| POST | [`/progress/status`](/api-reference/progress-status) | `progress:write` |
| POST | [`/progress/book`](/api-reference/progress-book) | `progress:write` |
| POST | [`/progress/manga`](/api-reference/progress-manga) | `progress:write` |
| POST | [`/progress/game`](/api-reference/progress-game) | `progress:write` |
| POST | [`/progress/episode`](/api-reference/progress-episode) | `progress:write` |

## Understand write responses and retries

Status, book, manga, and game updates return `changed`, `previousStatus`, and the `/progress` result fields. A repeated unchanged update normally returns `changed: false`. Bulk episode completion is an explicit operation and may report `changed: true` again.

Repeated unchanged totals do not add progress or create another status-change activity. Writes for the same user/title are serialized. A concurrent update can return HTTP 409 with `progress_update_in_progress`; retry after a short delay. See [Errors & limits](/api-reference/errors) for limits and recovery.

Prefer reading back progress when a request's outcome is uncertain. Do not turn “add ten pages” into a blind increment: read the current total, calculate the requested absolute value, then send that value. Concurrent clients can still overwrite each other's totals, so serialize edits in your own client too.
