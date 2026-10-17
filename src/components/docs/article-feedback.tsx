import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { repositoryUrl } from "@/constants/docs"

export function ArticleFeedback({ slug }: { slug: string }) {
  const [helpful, setHelpful] = useState(() => {
    try {
      return localStorage.getItem(`trackgeek-docs-helpful-${slug}`) === "true"
    } catch {
      return false
    }
  })

  return (
    <div className="mt-12 flex flex-wrap items-center gap-2 border-t pt-6">
      <p className="mr-2 text-xs text-muted-foreground" role="status">
        {helpful ? "Thanks! Your preference is saved on this device." : "Was this page helpful?"}
      </p>
      <Button
        variant={helpful ? "secondary" : "outline"}
        size="sm"
        className="h-7 gap-1.5 text-xs shadow-none"
        aria-pressed={helpful}
        onClick={() => {
          const next = !helpful
          setHelpful(next)
          try {
            localStorage.setItem(`trackgeek-docs-helpful-${slug}`, String(next))
          } catch {
            return
          }
        }}
      >
        <ThumbsUp className="size-3" aria-hidden="true" />
        Yes
      </Button>
      <a
        href={`${repositoryUrl}/issues/new?title=${encodeURIComponent(`Docs feedback: ${slug}`)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors hover:bg-muted"
      >
        <ThumbsDown className="size-3" aria-hidden="true" />
        Suggest a change
      </a>
    </div>
  )
}
