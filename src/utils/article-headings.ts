import type { ArticleHeading } from "@/types/docs"

export function createHeadingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function getArticleHeadings(markdown: string): ArticleHeading[] {
  let inCodeBlock = false
  return markdown.split("\n").flatMap((line) => {
    if (line.startsWith("```")) inCodeBlock = !inCodeBlock
    if (inCodeBlock) return []
    const match = /^(#{2,3}) (.+)$/.exec(line)
    if (!match) return []
    return [{ id: createHeadingId(match[2]), text: match[2], level: match[1].length as 2 | 3 }]
  })
}
