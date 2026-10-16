import { createRootRoute, Outlet, stripSearchParams } from "@tanstack/react-router"
import { SiteHeader } from "@/components/layout/site-header"
import { defaultSearch, docsSearchSchema } from "@/utils/docs-schemas"

export const Route = createRootRoute({
  validateSearch: docsSearchSchema,
  search: { middlewares: [stripSearchParams(defaultSearch)] },
  component: RootRoute,
})

function RootRoute() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <Outlet />
    </>
  )
}
