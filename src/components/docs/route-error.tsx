import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function RouteError() {
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-20">
      <Alert variant="destructive">
        <AlertCircle aria-hidden="true" />
        <AlertTitle>This page could not load</AlertTitle>
        <AlertDescription>
          Check your connection, then reload this page to try again. The current URL will be preserved.
        </AlertDescription>
      </Alert>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </main>
  )
}
