import type { Article } from "@/types/docs"

export function getArticleLocation(article: Article) {
  if (article.section === "api-reference") {
    return article.slug === "overview"
      ? { to: "/api-reference" as const }
      : { to: "/api-reference/$slug" as const, params: { slug: article.slug } }
  }
  return { to: "/$slug" as const, params: { slug: article.slug } }
}
