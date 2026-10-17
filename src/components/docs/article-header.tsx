import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { useEffect } from "react"
import { AiCopyButton } from "@/components/jalco/ai-copy-button"
import { Badge } from "@/components/ui/badge"
import { apiArticles, articles } from "@/constants/docs"
import type { Article } from "@/types/docs"
import { getArticleLocation } from "@/utils/article-location"

export function ArticleHeader({ article, markdown }: { article: Article; markdown: string }) {
  useEffect(() => {
    document.title = `${article.title} · TrackGeek Docs`
  }, [article.title])

  return (
    <div className="mb-8">
      <div className="mb-9 flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          {...getArticleLocation(article.section ? apiArticles[0] : articles[0])}
          search={(previous) => ({ ...previous, q: "" })}
          className="hover:text-foreground"
        >
          {article.section ? "API Reference" : "Self-hosting"}
        </Link>
        <ChevronRight className="size-3" aria-hidden="true" />
        <span>{article.group}</span>
      </div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Badge variant="secondary" className="gap-1.5 bg-accent font-medium text-accent-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {article.section ? "API Reference" : "Self-hosting guide"}
        </Badge>
        <AiCopyButton
          value={`# ${article.title}\n\n${article.description}\n\n${markdown}`}
          label="Copy page"
          variant="outline"
          size="sm"
          targets={["chatgpt", "claude"]}
        />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{article.title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{article.description}</p>
    </div>
  )
}
