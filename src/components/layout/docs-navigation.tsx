import { Link, useLocation } from "@tanstack/react-router"
import { BookOpen, ChevronRight } from "lucide-react"
import { HttpMethodBadge } from "@/components/api-reference/http-method-badge"
import { apiArticleGroups, apiArticles, apiReferenceEnabled, articleGroups, articles } from "@/constants/docs"
import type { Article } from "@/types/docs"
import { getArticleLocation } from "@/utils/article-location"

export function DocsNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const api = useLocation({ select: (location) => location.pathname.startsWith("/api-reference") })
  const entries: readonly Article[] = api ? apiArticles : articles
  const groups = api ? apiArticleGroups : articleGroups

  return (
    <nav aria-label="Documentation" className="flex min-h-full flex-col">
      {apiReferenceEnabled && (
        <Link
          {...getArticleLocation(api ? articles[0] : apiArticles[0])}
          search={(previous) => ({ ...previous, q: "" })}
          onClick={onNavigate}
          className="mb-4 px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          {api ? "← Self-hosting guides" : "API Reference →"}
        </Link>
      )}
      <div className="mb-7 flex items-center gap-2.5 rounded-lg border bg-card px-3 py-3 text-sm font-medium">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <BookOpen className="size-4" aria-hidden="true" />
        </span>
        {api ? "API Reference" : "Self-hosting"}
        <ChevronRight className="ml-auto size-3.5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <p className="mb-2 px-3 text-xs font-semibold text-foreground">{group}</p>
            <ul className="space-y-0.5">
              {entries
                .filter((article) => article.group === group)
                .map((article) => (
                  <li key={article.slug}>
                    <Link
                      {...getArticleLocation(article)}
                      search={(previous) => ({ ...previous, q: "" })}
                      activeOptions={{ exact: true }}
                      onClick={onNavigate}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-colors"
                      activeProps={{
                        className: "bg-accent font-medium text-accent-foreground",
                        "aria-current": "page",
                      }}
                      inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                    >
                      {article.method && <HttpMethodBadge method={article.method} />}
                      <span>{article.title}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
