import type { ApiEndpoint, NetworkRequest } from "@/types/api-endpoint"

export const restBaseUrl = "https://api.trackgeek.net/integrations/v1"

const mediaId = "019ce334-c8ac-7883-949d-948f53218272"
const trackingId = "019ce334-c8ac-7883-949d-948f53218273"
const movie = { type: "movie", id: mediaId, externalId: 329865, title: "Arrival" }
const book = { type: "book", id: mediaId, externalId: 12345, title: "Example book" }
const manga = { type: "manga", id: mediaId, externalId: 30002, title: "Berserk" }
const game = { type: "game", id: mediaId, externalId: 1942, title: "The Witcher 3: Wild Hunt" }
const tv = { type: "tv", id: mediaId, externalId: 1399, title: "Game of Thrones" }

function example(
  method: ApiEndpoint["method"],
  path: string,
  response: unknown,
  scope?: ApiEndpoint["scope"],
  body?: unknown,
): NetworkRequest {
  return {
    method,
    url: `${restBaseUrl}${path}`,
    status: 200,
    statusText: "OK",
    requestHeaders: [
      { name: "Accept", value: "application/json" },
      ...(scope ? [{ name: "Authorization", value: "Bearer YOUR_ACCESS_TOKEN" }] : []),
      ...(body ? [{ name: "Content-Type", value: "application/json" }] : []),
    ],
    responseHeaders: [{ name: "Content-Type", value: "application/json" }],
    requestBody: body ? JSON.stringify(body, null, 2) : undefined,
    responseBody: JSON.stringify(response, null, 2),
    contentType: "application/json",
  }
}

const readScope = "library:read"
const writeScope = "progress:write"

export const apiEndpoints: readonly ApiEndpoint[] = [
  {
    slug: "media-search",
    title: "Search media",
    description: "Find a title in the public catalogue and get its provider ID.",
    group: "Media",
    method: "GET",
    path: "/media/search",
    keywords: ["search", "catalogue", "externalId", "query", "GET /media/search"],
    examples: [
      example("GET", "/media/search?type=movie&query=Arrival&page=1", {
        total: 1,
        pages: 1,
        inPage: 1,
        itemsInPage: 1,
        items: [{ type: "movie", externalId: 329865, title: "Arrival", releaseDate: "2016-11-10T00:00:00.000Z" }],
      }),
    ],
  },
  {
    slug: "media-details",
    title: "Get media details",
    description: "Resolve a provider ID to a TrackGeek media UUID and normalized metadata.",
    group: "Media",
    method: "GET",
    path: "/media/details",
    keywords: ["details", "metadata", "externalId", "uuid", "GET /media/details"],
    examples: [example("GET", "/media/details?type=movie&externalId=329865", movie)],
  },
  {
    slug: "media-episodes",
    title: "List episodes and seasons",
    description: "Read public anime episode metadata or TV seasons and episodes.",
    group: "Media",
    method: "GET",
    path: "/media/episodes",
    keywords: ["episodes", "seasons", "anime", "tv", "GET /media/episodes"],
    examples: [
      example("GET", "/media/episodes?type=tv&externalId=1399", [
        { id: 3624, name: "Season 1", seasonNumber: 1, numberOfEpisodes: 10, airDate: "2011-04-17T00:00:00.000Z" },
      ]),
      example("GET", "/media/episodes?type=tv&externalId=1399&season=1", [
        { name: "Winter Is Coming", seasonNumber: 1, episodeNumber: 1, airDate: "2011-04-17T00:00:00.000Z" },
      ]),
    ],
  },
  {
    slug: "me",
    title: "Get your profile",
    description: "Read the connected account's public profile without exposing private account details.",
    group: "Account & library",
    method: "GET",
    path: "/me",
    scope: "profile:read",
    keywords: ["profile", "account", "username", "profile:read", "GET /me"],
    examples: [
      example(
        "GET",
        "/me",
        { id: trackingId, name: "Alex", username: "alex", profile: { avatarUrl: null } },
        "profile:read",
      ),
    ],
  },
  {
    slug: "library",
    title: "List your library",
    description: "Browse the connected user's tracked media, filtered by type and status.",
    group: "Account & library",
    method: "GET",
    path: "/library",
    scope: readScope,
    keywords: ["library", "pagination", "status", "library:read", "GET /library"],
    examples: [
      example(
        "GET",
        "/library?type=book&status=Reading&page=1&limit=20",
        {
          total: 1,
          pages: 1,
          inPage: 1,
          itemsInPage: 1,
          itemsPerPage: 20,
          items: [{ id: trackingId, media: book, status: "Reading", pagesRead: 120, totalPages: 412 }],
        },
        readScope,
      ),
    ],
  },
  {
    slug: "progress",
    title: "Get media progress",
    description: "Read a title's tracking entry and paginated personal episode marks.",
    group: "Account & library",
    method: "GET",
    path: "/progress",
    scope: readScope,
    keywords: ["progress", "episodePage", "hasMoreEpisodes", "library:read", "GET /progress"],
    examples: [
      example(
        "GET",
        `/progress?type=tv&id=${mediaId}&episodePage=1`,
        {
          progress: { id: trackingId, media: tv, status: "Watching" },
          episodes: [{ season: 1, episode: 1, status: "Completed" }],
          episodePage: 1,
          hasMoreEpisodes: false,
        },
        readScope,
      ),
      example("GET", `/progress?type=book&id=${mediaId}`, { progress: null }, readScope),
    ],
  },
  {
    slug: "catchup",
    title: "Get your release feed",
    description: "See recent releases for media followed by the connected user.",
    group: "Account & library",
    method: "GET",
    path: "/catchup",
    scope: readScope,
    keywords: ["catchup", "releases", "feed", "days", "library:read", "GET /catchup"],
    examples: [
      example(
        "GET",
        "/catchup?days=7&page=1&limit=20",
        {
          total: 0,
          pages: 0,
          inPage: 1,
          itemsInPage: 0,
          itemsPerPage: 20,
          items: [],
        },
        readScope,
      ),
    ],
  },
  {
    slug: "progress-status",
    title: "Set tracking status",
    description: "Change tracking status, set dates, or explicitly complete all series episodes.",
    group: "Progress",
    method: "POST",
    path: "/progress/status",
    scope: writeScope,
    keywords: ["status", "completed", "markAllEpisodes", "dates", "progress:write", "POST /progress/status"],
    examples: [
      example(
        "POST",
        "/progress/status",
        {
          changed: true,
          previousStatus: null,
          progress: { id: trackingId, media: movie, status: "Completed", completedAt: "2026-10-17T18:30:00.000Z" },
        },
        writeScope,
        { type: "movie", id: mediaId, status: "Completed" },
      ),
    ],
  },
  {
    slug: "progress-book",
    title: "Set book progress",
    description: "Set the absolute page count and optional total for a book edition.",
    group: "Progress",
    method: "POST",
    path: "/progress/book",
    scope: writeScope,
    keywords: ["book", "pages", "pagesRead", "totalPages", "progress:write", "POST /progress/book"],
    examples: [
      example(
        "POST",
        "/progress/book",
        {
          changed: true,
          previousStatus: null,
          progress: { id: trackingId, media: book, status: "Reading", pagesRead: 120, totalPages: 412 },
        },
        writeScope,
        { id: mediaId, pagesRead: 120, totalPages: 412 },
      ),
    ],
  },
  {
    slug: "progress-manga",
    title: "Set manga progress",
    description: "Set the absolute number of chapters read for a manga.",
    group: "Progress",
    method: "POST",
    path: "/progress/manga",
    scope: writeScope,
    keywords: ["manga", "chapters", "chaptersRead", "progress:write", "POST /progress/manga"],
    examples: [
      example(
        "POST",
        "/progress/manga",
        {
          changed: true,
          previousStatus: null,
          progress: { id: trackingId, media: manga, status: "Reading", chaptersRead: 42 },
        },
        writeScope,
        { id: mediaId, chaptersRead: 42 },
      ),
    ],
  },
  {
    slug: "progress-game",
    title: "Set game progress",
    description: "Set absolute playtime, selected platform slugs, and playthrough completion.",
    group: "Progress",
    method: "POST",
    path: "/progress/game",
    scope: writeScope,
    keywords: ["game", "hoursPlayed", "platforms", "completion", "progress:write", "POST /progress/game"],
    examples: [
      example(
        "POST",
        "/progress/game",
        {
          changed: true,
          previousStatus: null,
          progress: {
            id: trackingId,
            media: game,
            status: "Playing",
            hoursPlayed: 35,
            platforms: ["pc"],
            completion: "mainStory",
          },
        },
        writeScope,
        { id: mediaId, hoursPlayed: 35, platforms: ["pc"], completion: "mainStory" },
      ),
    ],
  },
  {
    slug: "progress-episode",
    title: "Set episode status",
    description: "Update one anime or TV episode without completing the entire series.",
    group: "Progress",
    method: "POST",
    path: "/progress/episode",
    scope: writeScope,
    keywords: ["episode", "season", "status", "progress:write", "POST /progress/episode"],
    examples: [
      example(
        "POST",
        "/progress/episode",
        {
          changed: true,
          type: "tv",
          id: mediaId,
          season: 1,
          episode: 3,
          status: "Completed",
        },
        writeScope,
        { type: "tv", id: mediaId, season: 1, episode: 3, status: "Completed" },
      ),
    ],
  },
]
