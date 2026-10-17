import { allArticles } from "@/constants/docs"

export function searchArticles(query: string) {
  const terms = query
    .toLowerCase()
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
  if (!terms.length) return [...allArticles]
  return allArticles
    .flatMap((article) => {
      const title = article.title.toLowerCase()
      const text = [title, article.description, article.group, ...article.keywords]
        .join(" ")
        .toLowerCase()
        .replace(/[_-]+/g, " ")
      if (!terms.every((term) => text.includes(term))) return []
      const score = terms.reduce((total, term) => total + (title.includes(term) ? 3 : 1), 0)
      return [{ ...article, score }]
    })
    .sort((a, b) => b.score - a.score)
}
