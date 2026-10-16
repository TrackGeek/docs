import { Link } from "@tanstack/react-router"
import { ArrowRight, Settings2, Terminal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function IntroductionLinks() {
  return (
    <div className="mb-10 grid gap-3 sm:grid-cols-2">
      <Link
        to="/$slug"
        params={{ slug: "installation" }}
        search={(previous) => ({ ...previous, q: "" })}
        className="group rounded-xl"
      >
        <Card className="h-full gap-3 py-5 shadow-none transition-colors group-hover:border-primary/50 group-hover:bg-accent/30">
          <CardHeader className="gap-3 px-5">
            <Terminal className="size-5 text-accent-foreground" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold">Set up your instance</CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <CardDescription className="text-[13px] leading-6">
              From your terminal to your own TrackGeek. We'll walk you through it.
            </CardDescription>
            <span className="mt-4 flex items-center gap-2 text-xs font-medium text-accent-foreground">
              Installation guide <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </CardContent>
        </Card>
      </Link>
      <Link
        to="/$slug"
        params={{ slug: "commands" }}
        search={(previous) => ({ ...previous, q: "" })}
        className="group rounded-xl"
      >
        <Card className="h-full gap-3 py-5 shadow-none transition-colors group-hover:border-primary/50 group-hover:bg-accent/30">
          <CardHeader className="gap-3 px-5">
            <Settings2 className="size-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold">Already up and running?</CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <CardDescription className="text-[13px] leading-6">
              Start, stop, and look after your instance with a few simple commands.
            </CardDescription>
            <span className="mt-4 flex items-center gap-2 text-xs font-medium">
              Everyday commands <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
