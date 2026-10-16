import { Link } from "@tanstack/react-router"
import { GitFork, Search } from "lucide-react"
import { SearchDialog } from "@/components/docs/search-dialog"
import { Kbd } from "@/components/jalco/kbd"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { apiReferenceEnabled, repositoryUrl } from "@/constants/docs"
import { useDocsSearch } from "@/hooks/use-docs-search"

export function SiteHeader() {
  const search = useDocsSearch()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-360 items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
        <MobileNavigation />
        <Link
          to="/$slug"
          params={{ slug: "introduction" }}
          search={{}}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="TrackGeek documentation home"
        >
          <img src="/logo.png" alt="" className="size-8 rounded-md" width="32" height="32" />
          <span className="text-[18px] font-semibold tracking-tight">TrackGeek</span>
        </Link>
        <Separator orientation="vertical" className="hidden h-5! sm:block" />
        <Badge variant="secondary" className="hidden font-normal text-muted-foreground sm:inline-flex">
          Docs
        </Badge>
        <nav aria-label="Main navigation" className="ml-3 hidden h-full items-center gap-6 lg:flex">
          <Link
            to="/$slug"
            params={{ slug: "introduction" }}
            search={{}}
            className="relative flex h-full items-center text-sm font-medium after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
          >
            Self-hosting
          </Link>
          {apiReferenceEnabled && (
            <Link to="/api-reference" search={{}} className="text-sm text-muted-foreground hover:text-foreground">
              API Reference
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          <Button
            variant="outline"
            className="h-9 w-9 justify-center px-0 text-muted-foreground shadow-none sm:w-56 sm:justify-start sm:px-3 xl:w-64"
            onClick={() => search.setOpen(true)}
            aria-label="Search documentation"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden font-normal sm:inline">Search documentation…</span>
            <span className="ml-auto hidden items-center gap-0.5 sm:flex">
              <Kbd size="sm" variant="flat">
                Ctrl
              </Kbd>
              <Kbd size="sm" variant="flat">
                K
              </Kbd>
            </span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "ghost", size: "icon", className: "size-9" })}
                aria-label="TrackGeek docs on GitHub"
              >
                <GitFork className="size-4.5" aria-hidden="true" />
              </a>
            </TooltipTrigger>
            <TooltipContent>View on GitHub</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-5!" />
          <ThemeToggle />
        </div>
      </div>
      <SearchDialog {...search} />
    </header>
  )
}
