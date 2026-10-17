import { ArrowDown, ArrowUp } from "lucide-react"
import type { HeaderEntry } from "@/types/api-endpoint"

interface RequestHeadersProps {
  direction: "request" | "response"
  headers: readonly HeaderEntry[]
}

export function RequestHeaders({ direction, headers }: RequestHeadersProps) {
  const Icon = direction === "request" ? ArrowUp : ArrowDown

  return (
    <div className="flex flex-col gap-2">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {direction === "request" ? "Request headers" : "Response headers"}
      </h3>
      <dl className="divide-y divide-border/40 overflow-hidden rounded-lg border border-border/60">
        {headers.map((header, index) => (
          <div
            key={`${header.name}-${index}`}
            className="grid gap-1 px-3 py-2 sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="break-all font-mono text-xs font-medium text-foreground">{header.name}</dt>
            <dd className="min-w-0 break-all font-mono text-xs text-muted-foreground">{header.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
