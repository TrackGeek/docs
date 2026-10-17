## GET /media/details

Base URL: `https://api.trackgeek.net/integrations/v1`. This catalogue endpoint is public and needs no authentication.

## Query parameters

| Query | Required | Rules |
| --- | --- | --- |
| `type` | Yes | `anime`, `manga`, `tv`, `movie`, `game`, or `book`. |
| `externalId` | Yes | Positive integer from search, up to 2,147,483,647. |

## Response

This returns a single normalized media object, including TrackGeek's internal UUID `id`. It also resolves/persists the catalogue entry so tracking operations can address it.

Details may additionally include synopsis, release information, images, genres, platforms, page/chapter/episode counts, and a TrackGeek score when available. Detail synopses are limited to 4,000 characters.

| Media type | `externalId` provider |
| --- | --- |
| `anime` | MyAnimeList |
| `manga` | AniList |
| `tv`, `movie` | TMDB |
| `game` | IGDB |
| `book` | Hardcover |

Only use the UUID `id` from details or a library item's `media.id` for progress. A library row's own `id` identifies the tracking row, not the media.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
