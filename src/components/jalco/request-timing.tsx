import type { NetworkRequest } from "@/types/api-endpoint"
import { cn } from "@/utils/cn"
import { formatDuration } from "@/utils/format-duration"

const defaultTimingColors = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-indigo-500",
]

export function RequestTiming({ request }: { request: NetworkRequest }) {
  if (!request.timing || request.timing.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No timing data available.</p>
  }

  const maxDuration = Math.max(...request.timing.map((t) => t.duration))
  const totalDuration = request.duration ?? request.timing.reduce((sum, t) => sum + t.duration, 0)

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Duration</span>
        <span className="font-mono text-sm font-semibold text-foreground">{formatDuration(totalDuration)}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {request.timing.map((entry, i) => {
          const percentage = maxDuration > 0 ? (entry.duration / maxDuration) * 100 : 0
          const barColor = entry.colorClass ?? defaultTimingColors[i % defaultTimingColors.length]

          return (
            <div key={`${entry.label}-${i}`} className="flex items-center gap-3">
              <span className="w-[120px] shrink-0 truncate text-xs text-muted-foreground">{entry.label}</span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-muted/50">
                <div
                  className={cn("h-full rounded-md transition-all", barColor)}
                  style={{
                    width: `${Math.max(percentage, 2)}%`,
                    opacity: percentage === 0 ? 0.3 : 1,
                  }}
                />
              </div>
              <span className="w-[64px] shrink-0 text-right font-mono text-xs text-muted-foreground">
                {formatDuration(entry.duration)}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-3 border-t border-border/40 pt-3">
        {request.timing.map((entry, i) => {
          const barColor = entry.colorClass ?? defaultTimingColors[i % defaultTimingColors.length]
          return (
            <div key={`legend-${entry.label}-${i}`} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", barColor)} />
              <span className="text-[10px] text-muted-foreground">{entry.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
