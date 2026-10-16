import { createRouter } from "@tanstack/react-router"
import { RouteError } from "@/components/docs/route-error"
import { RouteNotFound } from "@/components/docs/route-not-found"
import { RoutePending } from "@/components/docs/route-pending"
import { routeTree } from "./routeTree.gen"

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 30_000,
  defaultPendingMs: 150,
  defaultPendingMinMs: 250,
  defaultPendingComponent: RoutePending,
  defaultErrorComponent: RouteError,
  defaultNotFoundComponent: RouteNotFound,
  scrollRestoration: true,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
