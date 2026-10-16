import { useEffect, useState } from "react"
import type { ArticleHeading } from "@/types/docs"

export function useActiveHeading(headings: ArticleHeading[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "")

  useEffect(() => {
    function update() {
      let current = headings[0]?.id ?? ""
      for (const heading of headings) {
        const element = document.getElementById(heading.id)
        if (element && element.getBoundingClientRect().top <= 150) current = heading.id
      }
      setActiveId(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [headings])

  return activeId
}
