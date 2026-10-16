import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          aria-label="Toggle color theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-[18px] dark:hidden" aria-hidden="true" />
          <Moon className="hidden size-[18px] dark:block" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle color theme</TooltipContent>
    </Tooltip>
  )
}
