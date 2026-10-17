import type { ApiArticleSlug } from "@/types/docs"

export interface HeaderEntry {
  name: string
  value: string
}

export interface TimingEntry {
  label: string
  duration: number
  colorClass?: string
}

export interface NetworkRequest {
  method: string
  url: string
  status: number
  statusText?: string
  requestHeaders?: HeaderEntry[]
  responseHeaders?: HeaderEntry[]
  requestBody?: string
  responseBody?: string
  contentType?: string
  timing?: TimingEntry[]
  duration?: number
}

export interface ApiEndpoint {
  slug: ApiArticleSlug
  title: string
  description: string
  group: "Media" | "Account & library" | "Progress"
  method: "GET" | "POST"
  path: string
  scope?: "profile:read" | "library:read" | "progress:write"
  keywords: string[]
  examples: NetworkRequest[]
}
