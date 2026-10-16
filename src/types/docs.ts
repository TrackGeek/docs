import type { z } from "zod"
import type { articleSlugSchema, docsSearchSchema } from "@/utils/docs-schemas"

export type ArticleSlug = z.infer<typeof articleSlugSchema>
export type DocsSearch = z.infer<typeof docsSearchSchema>
export type OperatingSystem = DocsSearch["os"]

export interface Article {
  slug: ArticleSlug
  title: string
  description: string
  group: "Getting started" | "Configuration" | "Credential guides" | "Manage your instance" | "Resources"
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
}
