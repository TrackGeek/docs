import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { articles } from "@/constants/docs"
import { installCommands } from "@/constants/installation"
import { getArticleHeadings } from "@/utils/article-headings"
import { articleSlugSchema, docsSearchSchema } from "@/utils/docs-schemas"
import { searchArticles } from "@/utils/search-articles"

describe("documentation route contracts", () => {
  test("URL state falls back safely when search values are invalid", () => {
    expect(docsSearchSchema.parse({})).toEqual({ q: "", os: "linux" })
    expect(docsSearchSchema.parse({ q: { invalid: true }, os: "plan9" })).toEqual({ q: "", os: "linux" })
    expect(docsSearchSchema.parse({ q: "Docker", os: "windows" })).toEqual({ q: "Docker", os: "windows" })
    expect(docsSearchSchema.parse({ q: "x".repeat(201) }).q).toBe("")
  })

  test("only published article slugs are accepted", () => {
    for (const article of articles) expect(articleSlugSchema.parse(article.slug)).toBe(article.slug)
    expect(articleSlugSchema.safeParse("made-up-page").success).toBe(false)
    expect(articleSlugSchema.options).toHaveLength(articles.length)
  })

  test("every article exists, every internal link resolves, heading anchors are unique", () => {
    for (const article of articles) {
      const markdown = readFileSync(new URL(`../content/self-hosting/${article.slug}.md`, import.meta.url), "utf8")
      expect(markdown.length).toBeGreaterThan(300)
      const headings = getArticleHeadings(markdown)
      expect(headings.length).toBeGreaterThan(0)
      expect(new Set(headings.map((heading) => heading.id)).size).toBe(headings.length)
      for (const link of markdown.matchAll(/\]\(\/([^\s)#]+)(?:#([^)]*))?\)/g)) {
        expect(articleSlugSchema.safeParse(link[1]).success).toBe(true)
        if (link[2]) {
          const target = readFileSync(new URL(`../content/self-hosting/${link[1]}.md`, import.meta.url), "utf8")
          expect(getArticleHeadings(target).map((heading) => heading.id)).toContain(link[2])
        }
      }
    }
  })

  test("heading extraction excludes shell comments inside code blocks", () => {
    expect(getArticleHeadings("## First section\n```sh\n## Not a heading\n```\n### API & keys")).toEqual([
      { id: "first-section", text: "First section", level: 2 },
      { id: "api-keys", text: "API & keys", level: 3 },
    ])
  })

  test("search finds service credentials and commands without matching unrelated guides", () => {
    expect(searchArticles("RESEND").map((article) => article.slug)).toContain("api-keys")
    expect(searchArticles("autostartup")[0].slug).toBe("automatic-startup")
    expect(searchArticles("  docker  ").length).toBeGreaterThan(0)
    expect(searchArticles("nonexistent-value")).toEqual([])
    expect(searchArticles("  ")).toHaveLength(articles.length)
  })

  test("install commands stay aligned with the supplied README", () => {
    expect(installCommands.linux).toBe(installCommands.macos)
    expect(installCommands.linux).toContain("selfhost/main/install.sh")
    expect(installCommands.windows).toContain("selfhost/main/install.ps1")
    expect(installCommands.windows).not.toContain("bash")
  })

  test("every requested credential has a setup guide and can be found by its variable name", () => {
    const providers = [
      "GOOGLE",
      "DISCORD",
      "GITHUB",
      "TWITCH",
      "KICK",
      "TWITTER",
      "SLACK",
      "MICROSOFT",
      "NOTION",
      "SPOTIFY",
    ]
    const guides = {
      "sign-in-credentials": providers.flatMap((provider) => [`${provider}_CLIENT_ID`, `${provider}_CLIENT_SECRET`]),
      "discord-bot": ["DISCORD_BOT_TOKEN"],
      "media-credentials": [
        "IMGBB_API_KEY",
        "HARDCOVER_API_KEY",
        "TMDB_API_KEY",
        "IGDB_CLIENT_ID",
        "IGDB_CLIENT_SECRET",
      ],
      "email-credentials": ["RESEND_API_KEY", "RESEND_FROM"],
      "stripe-credentials": ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    }
    for (const [slug, variables] of Object.entries(guides)) {
      const articleSlug = articleSlugSchema.parse(slug)
      const markdown = readFileSync(new URL(`../content/self-hosting/${slug}.md`, import.meta.url), "utf8")
      for (const variable of variables) {
        expect(markdown).toContain(`\`${variable}\``)
        expect(searchArticles(variable).map((article) => article.slug)).toContain(articleSlug)
      }
    }
  })
})
