import { Skeleton } from "@/components/ui/skeleton"

export function RoutePending() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading documentation"
      className="mx-auto max-w-3xl space-y-7 px-6 py-16"
    >
      <span className="sr-only" role="status">
        Loading documentation…
      </span>
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-5 w-4/5" />
    </main>
  )
}
