import { cn } from "@/utils/cn"

export function HttpMethodBadge({ method }: { method: "GET" | "POST" }) {
  return (
    <span
      className={cn(
        "inline-flex w-10 shrink-0 justify-center rounded px-1 py-0.5 font-mono text-[10px] font-semibold",
        method === "GET"
          ? "bg-accent text-accent-foreground"
          : "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      )}
    >
      {method}
    </span>
  )
}
