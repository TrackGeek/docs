import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { articles } from "@/constants/docs"
import type { ArticleSlug } from "@/types/docs"

export function ArticlePagination({ slug }: { slug: ArticleSlug }) {
  const index = articles.findIndex((article) => article.slug === slug)
  const previous = articles[index - 1]
  const next = articles[index + 1]

  return (
    <nav aria-label="Article navigation" className="mt-6 grid grid-cols-2 gap-3">
      {previous ? (
        <Link
          to="/$slug"
          params={{ slug: previous.slug }}
          search={(current) => ({ ...current, q: "" })}
          className="group rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-muted/40"
        >
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Previous
          </span>
          <span className="mt-2 block text-sm font-medium">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to="/$slug"
          params={{ slug: next.slug }}
          search={(current) => ({ ...current, q: "" })}
          className="group rounded-lg border p-4 text-right transition-colors hover:border-primary/50 hover:bg-muted/40"
        >
          <span className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            Next
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
          <span className="mt-2 block text-sm font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
