import { Link } from "@tanstack/react-router"
import { ArrowUpRight, GitFork, Pencil } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { repositoryUrl } from "@/constants/docs"
import { useActiveHeading } from "@/hooks/use-active-heading"
import type { ArticleHeading, ArticleSlug } from "@/types/docs"
import { cn } from "@/utils/cn"

export function ArticleToc({ headings, slug }: { headings: ArticleHeading[]; slug: ArticleSlug }) {
  const activeId = useActiveHeading(headings)

  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-56 shrink-0 overflow-y-auto pt-12 pr-8 pl-3 xl:block">
      <nav aria-label="On this page">
        <p className="mb-4 text-xs font-semibold">On this page</p>
        <ul className="space-y-1 border-l">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                to="/$slug"
                params={{ slug }}
                hash={heading.id}
                search
                resetScroll={false}
                className={cn(
                  "-ml-px block border-l border-transparent py-1.5 pl-3 text-xs leading-5 text-muted-foreground transition-colors hover:text-foreground",
                  heading.level === 3 && "pl-6",
                  activeId === heading.id && "border-primary font-medium text-accent-foreground",
                )}
                aria-current={activeId === heading.id ? "location" : undefined}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Separator className="my-6" />
      <div className="space-y-3 text-xs text-muted-foreground">
        <a
          href={`${repositoryUrl}/edit/main/src/content/self-hosting/${slug}.md`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-foreground"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit this page <ArrowUpRight className="ml-auto size-3" aria-hidden="true" />
        </a>
        <a
          href={`${repositoryUrl}/issues`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-foreground"
        >
          <GitFork className="size-3.5" aria-hidden="true" />
          Report an issue <ArrowUpRight className="ml-auto size-3" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-8 rounded-lg border bg-muted/30 p-4">
        <p className="text-xs font-medium">Your data. Your instance.</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          A home for everything you love, running on your own hardware.
        </p>
        <Link
          to="/$slug"
          params={{ slug: "installation" }}
          search={(previous) => ({ ...previous, q: "" })}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-foreground"
        >
          Get started <ArrowUpRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}
