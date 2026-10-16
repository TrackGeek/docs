import { Code2 } from "lucide-react"
import { ApiRefTable } from "@/components/jalco/api-ref-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export function ApiReferenceIntro() {
  return (
    <div className="space-y-6">
      <Badge variant="secondary">Coming later</Badge>
      <h1 className="text-4xl font-semibold tracking-tight">API Reference</h1>
      <p className="text-lg leading-8 text-muted-foreground">
        A future home for building new interfaces and integrations with TrackGeek.
      </p>
      <Alert>
        <Code2 aria-hidden="true" />
        <AlertTitle>Reference not published yet</AlertTitle>
        <AlertDescription>
          Endpoint documentation will appear here once the API contract is ready. No endpoint or authentication details
          are documented yet.
        </AlertDescription>
      </Alert>
      <ApiRefTable title="Published endpoints" props={[]} />
      <a
        href="https://github.com/TrackGeek/api"
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium text-accent-foreground underline underline-offset-4"
      >
        Explore the API source on GitHub
      </a>
    </div>
  )
}
