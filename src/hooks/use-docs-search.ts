import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useEffect, useState } from "react"
import { searchArticles } from "@/utils/search-articles"

export function useDocsSearch() {
  const search = useSearch({ from: "__root__" })
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)
  const open = opened || search.q.length > 0

  const setQuery = useCallback(
    (q: string) => {
      void navigate({ to: ".", search: (previous) => ({ ...previous, q }), replace: true, resetScroll: false })
    },
    [navigate],
  )

  const setOpen = useCallback(
    (value: boolean) => {
      setOpened(value)
      if (!value && search.q) setQuery("")
    },
    [search.q, setQuery],
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, setOpen])

  return { open, setOpen, query: search.q, setQuery, results: searchArticles(search.q) }
}
