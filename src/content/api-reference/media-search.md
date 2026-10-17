## GET /media/search

Base URL: `https://api.trackgeek.net/integrations/v1`. This catalogue endpoint is public and needs no authentication.

## Query parameters

| Query | Required | Rules |
| --- | --- | --- |
| `type` | Yes | `anime`, `manga`, `tv`, `movie`, `game`, or `book`. |
| `query` | Yes | Title text; trimmed length 1–200 characters. URL-encode it. |
| `page` | No | Integer 1–100; default 1. |

## Response

The response is a page containing `items`. Each item exposes an `externalId` and available metadata such as `title`, `synopsis`, `releaseDate`, `releaseYear`, and `imageUrl`. Metadata fields may be missing or null. Search synopses are limited to 240 characters. Pagination follows the media provider; do not assume every media type has the same page size or pagination fields.

Check the title and release information before choosing a result. Remakes, editions, and similarly named titles can be different entries.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
