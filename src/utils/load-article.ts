import { notFound } from "@tanstack/react-router"
import { apiEndpoints } from "@/constants/api-endpoints"
import { apiArticles, articles } from "@/constants/docs"
import type { ApiArticleSlug, ArticleSlug, LoadedArticle } from "@/types/docs"
import { getArticleHeadings } from "@/utils/article-headings"
import { getExamplesMarkdown } from "@/utils/request-examples"

const content = import.meta.glob<string>("../content/self-hosting/*.md", { query: "?raw", import: "default" })

export async function loadArticle(slug: ArticleSlug): Promise<LoadedArticle> {
  const article = articles.find((entry) => entry.slug === slug)
  const load = content[`../content/self-hosting/${slug}.md`]
  if (!article || !load) throw notFound()
  const markdown = await load()
  return { article, markdown, headings: getArticleHeadings(markdown) }
}

const apiContent = import.meta.glob<string>("../content/api-reference/*.md", { query: "?raw", import: "default" })

export async function loadApiArticle(slug: ApiArticleSlug): Promise<LoadedArticle> {
  const article = apiArticles.find((entry) => entry.slug === slug)
  const load = apiContent[`../content/api-reference/${slug}.md`]
  if (!article || !load) throw notFound()
  const markdown = await load()
  const endpoint = apiEndpoints.find((entry) => entry.slug === slug)
  const copyMarkdown = endpoint ? markdown + getExamplesMarkdown(endpoint) : markdown
  return { article, markdown, headings: getArticleHeadings(markdown), endpoint, copyMarkdown }
}
