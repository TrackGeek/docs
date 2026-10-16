import { createFileRoute, notFound } from "@tanstack/react-router"
import { ApiReferenceIntro } from "@/components/api-reference/api-reference-intro"
import { apiReferenceEnabled } from "@/constants/docs"

export const Route = createFileRoute("/api-reference")({
  beforeLoad: () => {
    if (!apiReferenceEnabled) throw notFound()
  },
  component: ApiReferenceRoute,
})

function ApiReferenceRoute() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-16">
      <ApiReferenceIntro />
    </main>
  )
}
