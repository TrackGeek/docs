import { useNavigate } from "@tanstack/react-router"
import { ArrowUpRight, FileText, Search } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { articleGroups } from "@/constants/docs"
import type { Article } from "@/types/docs"

interface SearchDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  query: string
  setQuery: (query: string) => void
  results: readonly Article[]
}

export function SearchDialog({ open, setOpen, query, setQuery, results }: SearchDialogProps) {
  const navigate = useNavigate()

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search documentation"
      description="Find installation guides, configuration help, and management commands."
      shouldFilter={false}
    >
      <CommandInput placeholder="Search the documentation…" value={query} onValueChange={setQuery} maxLength={200} />
      <CommandList>
        <CommandEmpty>
          <Search className="mx-auto mb-3 size-5 text-muted-foreground" aria-hidden="true" />
          No guides found. Try “Docker”, “keys”, or “backup”.
        </CommandEmpty>
        {articleGroups.map((group) => {
          const matches = results.filter((article) => article.group === group)
          if (!matches.length) return null
          return (
            <CommandGroup key={group} heading={group}>
              {matches.map((article) => (
                <CommandItem
                  key={article.slug}
                  value={article.slug}
                  onSelect={() => {
                    setOpen(false)
                    void navigate({
                      to: "/$slug",
                      params: { slug: article.slug },
                      search: (previous) => ({ ...previous, q: "" }),
                    })
                  }}
                  className="gap-3 py-3"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block">{article.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{article.description}</span>
                  </span>
                  <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
      </CommandList>
      <CommandSeparator />
      <div className="flex justify-between px-4 py-3 text-xs text-muted-foreground">
        <span>↑ ↓ to navigate · Enter to open</span>
        <span>Esc to close</span>
      </div>
    </CommandDialog>
  )
}
