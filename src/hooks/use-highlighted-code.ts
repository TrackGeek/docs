import { useEffect, useState } from "react"

export function useHighlightedCode(code: string, language: string, theme?: string) {
  const [result, setResult] = useState<{ code: string; language: string; theme?: string; html: string }>()

  useEffect(() => {
    let active = true
    import("@/utils/highlight-code")
      .then(({ highlightCode }) => highlightCode(code, language, theme))
      .then((html) => {
        if (active) setResult({ code, language, theme, html })
      })
      .catch(() => {
        if (active) setResult(undefined)
      })
    return () => {
      active = false
    }
  }, [code, language, theme])

  return result?.code === code && result.language === language && result.theme === theme ? result.html : undefined
}
