import { notFound } from "@tanstack/react-router"
import { articles } from "@/constants/docs"
import type { ArticleSlug, LoadedArticle } from "@/types/docs"
import { getArticleHeadings } from "@/utils/article-headings"

const content = import.meta.glob<string>("../content/self-hosting/*.md", { query: "?raw", import: "default" })

export async function loadArticle(slug: ArticleSlug): Promise<LoadedArticle> {
  const article = articles.find((entry) => entry.slug === slug)
  const load = content[`../content/self-hosting/${slug}.md`]
  if (!article || !load) throw notFound()
  const markdown = await load()
  return { article, markdown, headings: getArticleHeadings(markdown) }
}
