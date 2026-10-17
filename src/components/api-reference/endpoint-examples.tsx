import { RequestViewer } from "@/components/jalco/request-viewer"
import type { ApiEndpoint } from "@/types/api-endpoint"

export function EndpointExamples({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <section className="mt-5 space-y-6" aria-label="Endpoint examples">
      {endpoint.examples.map((request) => (
        <RequestViewer key={request.url} request={request} />
      ))}
    </section>
  )
}
