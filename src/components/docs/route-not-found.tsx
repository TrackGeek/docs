import { Link } from "@tanstack/react-router"
import { FileQuestion } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function RouteNotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-24 text-center">
      <FileQuestion className="mx-auto mb-5 size-10 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-medium text-muted-foreground">404 · Page not found</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">A little off the beaten track.</h1>
      <p className="mt-4 text-muted-foreground">
        This page does not exist or is not available yet. Head back to the docs to find what you need.
      </p>
      <Link to="/$slug" params={{ slug: "introduction" }} search={{}} className={buttonVariants({ className: "mt-7" })}>
        Back to documentation
      </Link>
    </main>
  )
}
