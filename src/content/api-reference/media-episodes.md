## GET /media/episodes

Base URL: `https://api.trackgeek.net/integrations/v1`. This catalogue endpoint is public and needs no authentication.

## Query parameters

| Query | Required | Rules |
| --- | --- | --- |
| `type` | Yes | `anime` or `tv`. |
| `externalId` | Yes | Positive MyAnimeList or TMDB integer, respectively. |
| `season` | No | TV season integer 0–1,000. Omit for a TV season list; include for that season's episodes. |
| `page` | No | Integer 1–1,000; default 1. Used for anime episode pagination. |

For anime, omit `season`. TV requests may omit `season` for the season list, or include it for episode metadata.

## Response

Responses follow the existing catalogue episode/season services and differ between anime and TV. These are episode metadata, not the connected user's marks. Use `/progress` for personal marks. Look up actual episode numbers before writing them.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
