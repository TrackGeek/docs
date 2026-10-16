import { Link } from "@tanstack/react-router"
import { BookOpen, ChevronRight } from "lucide-react"
import { articleGroups, articles } from "@/constants/docs"

export function DocsNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation" className="flex min-h-full flex-col">
      <div className="mb-7 flex items-center gap-2.5 rounded-lg border bg-card px-3 py-3 text-sm font-medium">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <BookOpen className="size-4" aria-hidden="true" />
        </span>
        Self-hosting
        <ChevronRight className="ml-auto size-3.5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-6">
        {articleGroups.map((group) => (
          <div key={group}>
            <p className="mb-2 px-3 text-xs font-semibold text-foreground">{group}</p>
            <ul className="space-y-0.5">
              {articles
                .filter((article) => article.group === group)
                .map((article) => (
                  <li key={article.slug}>
                    <Link
                      to="/$slug"
                      params={{ slug: article.slug }}
                      search={(previous) => ({ ...previous, q: "" })}
                      onClick={onNavigate}
                      className="block rounded-md px-3 py-2 text-[13px] transition-colors"
                      activeProps={{
                        className: "bg-accent font-medium text-accent-foreground",
                        "aria-current": "page",
                      }}
                      inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
                    >
                      {article.title}
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
