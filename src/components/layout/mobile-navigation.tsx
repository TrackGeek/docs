import { Menu } from "lucide-react"
import { useState } from "react"
import { DocsNavigation } from "@/components/layout/docs-navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function MobileNavigation() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open documentation menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>TrackGeek Docs</SheetTitle>
            <SheetDescription>Self-hosting guides and API Reference.</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <DocsNavigation onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
