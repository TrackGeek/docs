import { DocsNavigation } from "@/components/layout/docs-navigation"

export function DocsSidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 overflow-y-auto border-r px-4 py-7 lg:block lg:px-5">
      <DocsNavigation />
    </aside>
  )
}
