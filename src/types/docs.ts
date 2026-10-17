import type { z } from "zod"
import type { ApiEndpoint } from "@/types/api-endpoint"
import type { apiArticleSlugSchema, articleSlugSchema, docsSearchSchema } from "@/utils/docs-schemas"

export type ArticleSlug = z.infer<typeof articleSlugSchema>
export type ApiArticleSlug = z.infer<typeof apiArticleSlugSchema>
export type DocsSearch = z.infer<typeof docsSearchSchema>
export type OperatingSystem = DocsSearch["os"]

export interface Article {
  slug: ArticleSlug | ApiArticleSlug
  section?: "api-reference"
  title: string
  description: string
  method?: "GET" | "POST"
  group:
    | "Getting started"
    | "Configuration"
    | "Credential guides"
    | "Manage your instance"
    | "Resources"
    | "API overview"
    | "OAuth2"
    | "Integrations"
    | "Media"
    | "Account & library"
    | "Progress"
  keywords: string[]
}

export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface LoadedArticle {
  article: Article
  markdown: string
  headings: ArticleHeading[]
  endpoint?: ApiEndpoint
  copyMarkdown?: string
}
