import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import bash from "shiki/langs/bash.mjs"
import dotenv from "shiki/langs/dotenv.mjs"
import http from "shiki/langs/http.mjs"
import json from "shiki/langs/json.mjs"
import powershell from "shiki/langs/powershell.mjs"
import typescript from "shiki/langs/typescript.mjs"
import githubDark from "shiki/themes/github-dark.mjs"
import githubLight from "shiki/themes/github-light.mjs"

const highlighter = createHighlighterCore({
  themes: [githubLight, githubDark],
  langs: [bash, powershell, json, dotenv, http, typescript],
  engine: createJavaScriptRegexEngine(),
})

export async function highlightCode(code: string, language = "text", theme?: string) {
  const instance = await highlighter
  const alias = language === "sh" || language === "shell" ? "bash" : language
  const lang = instance.getLoadedLanguages().includes(alias) ? alias : "text"
  if (theme && instance.getLoadedThemes().includes(theme)) return instance.codeToHtml(code, { lang, theme })
  return instance.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
}
