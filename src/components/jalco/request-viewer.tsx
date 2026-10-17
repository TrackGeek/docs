import { ArrowUp, Clock, FileText, Globe } from "lucide-react"
import type * as React from "react"
import { CodeBlock } from "@/components/jalco/code-block"
import { RequestHeaders } from "@/components/jalco/request-headers"
import { RequestTiming } from "@/components/jalco/request-timing"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { NetworkRequest } from "@/types/api-endpoint"
import { cn } from "@/utils/cn"
import { formatDuration } from "@/utils/format-duration"
import { getRequestCode } from "@/utils/request-examples"

interface RequestViewerProps extends Omit<React.ComponentProps<"div">, "children"> {
  request: NetworkRequest
  defaultTab?: "request" | "headers" | "response" | "timing"
}
function statusColor(status: number): string {
  if (status >= 200 && status < 300) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
  if (status >= 300 && status < 400) return "bg-sky-500/15 text-sky-600 dark:text-sky-400"
  if (status >= 400 && status < 500) return "bg-amber-500/15 text-amber-600 dark:text-amber-400"
  if (status >= 500) return "bg-rose-500/15 text-rose-600 dark:text-rose-400"
  return "bg-muted text-muted-foreground"
}

function methodColor(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return "text-emerald-600 dark:text-emerald-400"
    case "POST":
      return "text-sky-600 dark:text-sky-400"
    case "PUT":
    case "PATCH":
      return "text-amber-600 dark:text-amber-400"
    case "DELETE":
      return "text-rose-600 dark:text-rose-400"
    default:
      return "text-muted-foreground"
  }
}

export function RequestViewer({ request, defaultTab = "response", className, ...props }: RequestViewerProps) {
  const requestHeaders = request.requestHeaders ?? []
  const responseHeaders = request.responseHeaders ?? []
  const hasTiming = Boolean(request.timing?.length)
  const requestCode = getRequestCode(request)

  return (
    <div
      data-slot="request-viewer"
      className={cn("min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-border/40 px-4 py-3">
        <span className={cn("font-mono text-sm font-bold uppercase", methodColor(request.method))}>
          {request.method}
        </span>
        <span className="min-w-0 flex-1 break-all font-mono text-xs text-muted-foreground">{request.url}</span>
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-xs font-semibold",
            statusColor(request.status),
          )}
        >
          {request.status}
          {request.statusText && ` ${request.statusText}`}
        </span>
        {request.duration !== undefined && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" aria-hidden="true" />
            {formatDuration(request.duration)}
          </span>
        )}
      </div>
      <Tabs defaultValue={defaultTab === "timing" && !hasTiming ? "response" : defaultTab} className="gap-0">
        <div className="overflow-x-auto border-b border-border/40 bg-muted/20 px-1">
          <TabsList variant="line" aria-label="Request details">
            <TabsTrigger value="request">
              <ArrowUp aria-hidden="true" />
              Request
            </TabsTrigger>
            <TabsTrigger value="headers">
              <FileText aria-hidden="true" />
              Headers
            </TabsTrigger>
            <TabsTrigger value="response">
              <Globe aria-hidden="true" />
              Response
            </TabsTrigger>
            {hasTiming && (
              <TabsTrigger value="timing">
                <Clock aria-hidden="true" />
                Timing
              </TabsTrigger>
            )}
          </TabsList>
        </div>
        <TabsContent value="request" className="min-w-0 p-4">
          <CodeBlock code={requestCode} language="http" title="HTTP request" className="shadow-none" />
        </TabsContent>
        <TabsContent value="headers" className="space-y-5 p-4">
          {requestHeaders.length > 0 && <RequestHeaders direction="request" headers={requestHeaders} />}
          {responseHeaders.length > 0 && <RequestHeaders direction="response" headers={responseHeaders} />}
          {requestHeaders.length === 0 && responseHeaders.length === 0 && (
            <p className="text-sm text-muted-foreground">No headers available.</p>
          )}
        </TabsContent>
        <TabsContent value="response" className="min-w-0 p-4">
          {request.responseBody ? (
            <CodeBlock
              code={request.responseBody}
              language={request.contentType?.includes("json") ? "json" : "text"}
              title="Expected response"
              className="shadow-none"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No response body available.</p>
          )}
        </TabsContent>
        {hasTiming && (
          <TabsContent value="timing">
            <RequestTiming request={request} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
