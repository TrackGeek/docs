## GET /me

Base URL: `https://api.trackgeek.net/integrations/v1`. Requires an [OAuth access token](/api-reference/oauth2) with `profile:read`. Send `Authorization: Bearer YOUR_ACCESS_TOKEN`.

No query parameters. The profile response contains `id`, `name`, `username`, and `profile.avatarUrl`. Nullable profile values may be null. It excludes email, password, and account settings.

## Response

Returns only the connected user's public profile fields. The example below uses illustrative account data.

See [REST request basics](/api-reference/rest-api) and [Errors & limits](/api-reference/errors) for shared rules and recovery.

## Request and response

The examples below are static illustrations, not live requests. Responses show selected fields unless stated otherwise. Replace illustrative UUIDs with actual media IDs from [media details](/api-reference/media-details).
