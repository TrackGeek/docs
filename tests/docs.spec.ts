import { expect, test } from "@playwright/test"

test("home redirects, documentation links work, API Reference is published", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/")
  await expect(page).toHaveURL(/\/introduction$/)
  expect(new URL(page.url()).pathname).toBe("/introduction")
  await expect(page.getByRole("heading", { name: "Introduction", exact: true })).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "API Reference", exact: true }),
  ).toBeVisible()

  const navigation = page.getByRole("navigation", { name: "Documentation", exact: true })
  for (const title of [
    "Before you begin",
    "Installation",
    "Configuration",
    "API keys & integrations",
    "Network & public access",
    "Sign-in providers",
    "Discord bot",
    "Media & image services",
    "Email with Resend",
    "Payments with Stripe",
    "Everyday commands",
    "Updating TrackGeek",
    "Automatic startup",
    "Backups & your data",
    "Troubleshooting",
    "Project structure",
  ]) {
    await navigation.getByRole("link", { name: title, exact: true }).click()
    await expect(page.getByRole("heading", { name: title, exact: true, level: 1 })).toBeVisible()
    expect(new URL(page.url()).pathname.startsWith("/docs/")).toBe(false)
  }
  expect(errors).toEqual([])
})

test("installation OS state survives links, reloads, and browser back", async ({ page }) => {
  await page.goto("/installation?os=windows")
  await expect(page.getByRole("tab", { name: "Windows", exact: true })).toHaveAttribute("aria-selected", "true")
  await expect(page.locator("[role=tabpanel]").getByText(/Invoke-WebRequest/)).toBeVisible()
  await page.getByRole("tab", { name: "macOS", exact: true }).click()
  await expect(page).toHaveURL(/os=macos/)
  await page.reload()
  await expect(page.getByRole("tab", { name: "macOS", exact: true })).toHaveAttribute("aria-selected", "true")
  await page.goBack()
  await expect(page.getByRole("tab", { name: "Windows", exact: true })).toHaveAttribute("aria-selected", "true")
  await page.getByRole("tab", { name: "Linux", exact: true }).click()
  await expect(page).toHaveURL(/\/installation$/)
})

test("search reads URL state, finds service keywords, navigates, and closes accessibly", async ({ page }) => {
  await page.goto("/introduction?q=RESEND")
  const dialog = page.getByRole("dialog", { name: "Search documentation", exact: true })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole("combobox")).toHaveValue("RESEND")
  await expect(page.getByRole("option").filter({ hasText: "API keys & integrations" })).toBeVisible()
  await page.getByRole("combobox").fill("no-such-guide")
  await expect(page).toHaveURL(/q=no-such-guide/)
  await expect(page.getByText("No guides found.", { exact: false })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
  await expect(page).toHaveURL(/\/introduction$/)
  await page.keyboard.press("Control+k")
  await page.getByRole("combobox").fill("autostartup")
  await page.getByRole("option").filter({ hasText: "Automatic startup" }).click()
  await expect(page.getByRole("heading", { name: "Automatic startup", exact: true, level: 1 })).toBeVisible()
  await expect(page).toHaveURL(/\/automatic-startup$/)
})

test("invalid search values fall back and unavailable paths render not-found", async ({ page }) => {
  await page.goto("/installation?os=unknown&q=123")
  await expect(page.getByRole("tab", { name: "Linux", exact: true })).toHaveAttribute("aria-selected", "true")
  for (const path of [
    "/no-such-article",
    "/api-reference/no-such-article",
    "/api-reference/overview",
    "/no-such-route",
  ]) {
    await page.goto(path)
    await expect(page.getByRole("heading", { name: "A little off the beaten track.", exact: true })).toBeVisible()
  }
})

test("code copy, article anchors, and theme controls work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/commands")
  await page.getByRole("button", { name: "Copy code", exact: true }).first().click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("tg start")
  await expect(page.locator(".code-block .shiki").first()).toBeVisible()
  await page
    .getByRole("navigation", { name: "On this page", exact: true })
    .getByRole("link", { name: "Check status and logs", exact: true })
    .click()
  await expect(page).toHaveURL(/#check-status-and-logs$/)
  const initial = await page.locator("html").getAttribute("class")
  await page.getByRole("button", { name: "Toggle color theme", exact: true }).click()
  await expect(page.locator("html")).not.toHaveAttribute("class", initial ?? "")
})

test("mobile menu navigates and content stays within viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/introduction")
  await page.getByRole("button", { name: "Open documentation menu", exact: true }).click()
  await page.getByRole("dialog").getByRole("link", { name: "Installation", exact: true }).click()
  await expect(page.getByRole("dialog")).not.toBeVisible()
  await expect(page.getByRole("heading", { name: "Installation", exact: true, level: 1 })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole("tab", { name: "Windows", exact: true }).click()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test("route loader shows a pending boundary during delayed article loading", async ({ page }) => {
  await page.route("**/backups-*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    await route.continue()
  })
  await page.goto("/backups", { waitUntil: "domcontentloaded" })
  await expect(page.getByRole("main", { name: "Loading documentation", exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Backups & your data", exact: true, level: 1 })).toBeVisible()
})

test("route loader failures display an error boundary with retry", async ({ page }) => {
  await page.route("**/commands-*.js", (route) => route.abort())
  await page.goto("/commands")
  await expect(page.getByText("This page could not load", { exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "Try again", exact: true })).toBeVisible()
  await page.unroute("**/commands-*.js")
  await page.getByRole("button", { name: "Try again", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Everyday commands", exact: true, level: 1 })).toBeVisible()
})

test("intent preloading fetches a linked article before navigation", async ({ page }) => {
  await page.goto("/introduction")
  await expect(page.getByRole("heading", { name: "Introduction", exact: true })).toBeVisible()
  const request = page.waitForRequest((req) => /\/updates-[^/]+\.js/.test(req.url()))
  await page
    .getByRole("navigation", { name: "Documentation", exact: true })
    .getByRole("link", { name: "Updating TrackGeek", exact: true })
    .hover()
  await request
  await expect(page).toHaveURL(/\/introduction$/)
})

test("documentation source, edit, and feedback links target the docs repository", async ({ page }) => {
  await page.goto("/introduction")
  await expect(page.getByRole("link", { name: "TrackGeek docs on GitHub", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/TrackGeek/docs",
  )
  await expect(page.getByRole("link", { name: "Edit this page", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/TrackGeek/docs/edit/main/src/content/self-hosting/introduction.md",
  )
  await expect(page.getByRole("link", { name: "Report an issue", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/TrackGeek/docs/issues",
  )
  await expect(page.getByRole("link", { name: "Suggest a change", exact: true })).toHaveAttribute(
    "href",
    /^https:\/\/github.com\/TrackGeek\/docs\/issues\/new\?/,
  )
})

test("credential links navigate to a provider section and variable search opens the right guide", async ({ page }) => {
  await page.goto("/api-keys")
  await page.getByRole("main").getByRole("link", { name: "TMDB guide", exact: true }).click()
  await expect(page).toHaveURL(/\/media-credentials#tmdb$/)
  await expect(page.getByRole("heading", { name: "TMDB", exact: true, level: 2 })).toBeVisible()
  await page.getByRole("button", { name: "Search documentation", exact: true }).click()
  await page.getByRole("combobox").fill("GOOGLE_CLIENT_SECRET")
  await page.getByRole("option").filter({ hasText: "Sign-in providers" }).click()
  await expect(page).toHaveURL(/\/sign-in-credentials$/)
  await expect(page.getByRole("heading", { name: "Google", exact: true, level: 2 })).toBeVisible()
  await expect(page.getByRole("link", { name: "Google's web application setup", exact: true })).toHaveAttribute(
    "href",
    /^https:\/\/developers.google.com\//,
  )
})

test("API reference navigation, search, anchors, and edit links resolve", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/api-reference")
  await expect(page.getByRole("heading", { name: "API Reference", level: 1, exact: true })).toBeVisible()
  const navigation = page.getByRole("navigation", { name: "Documentation", exact: true })
  for (const [slug, title] of [
    ["register-app", "Register an application"],
    ["oauth2", "OAuth2 authorization"],
    ["rest-api", "REST endpoints"],
    ["mcp", "Connect an AI client"],
    ["mcp-tools", "MCP tools"],
    ["errors", "Errors & limits"],
  ]) {
    await navigation.getByRole("link", { name: title, exact: true }).click()
    await expect(page.getByRole("heading", { name: title, level: 1, exact: true })).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`/api-reference/${slug}$`))
    await expect(page.getByRole("link", { name: "Edit this page", exact: true })).toHaveAttribute(
      "href",
      `https://github.com/TrackGeek/docs/edit/main/src/content/api-reference/${slug}.md`,
    )
  }
  await page.getByRole("main").getByRole("link", { name: "REST endpoints", exact: true }).click()
  await page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "Search and resolve media", exact: true })
    .click()
  await expect(page).toHaveURL(/rest-api#search-and-resolve-media$/)
  await page.reload()
  await expect(page.getByRole("heading", { name: "REST endpoints", level: 1, exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Search documentation", exact: true }).click()
  await page.getByRole("combobox").fill("set_book_progress")
  await page.getByRole("option").filter({ hasText: "MCP tools" }).click()
  await expect(page).toHaveURL(/api-reference\/mcp-tools$/)
  expect(errors).toEqual([])
})

test("mobile API reference is reachable, readable, and has working internal links", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/introduction")
  await page.getByRole("button", { name: "Open documentation menu", exact: true }).click()
  await page.getByRole("dialog").getByRole("link", { name: "API Reference →", exact: true }).click()
  await expect(page.getByRole("heading", { name: "API Reference", level: 1, exact: true })).toBeVisible()
  for (const [slug, title] of [
    ["oauth2", "OAuth2 authorization"],
    ["rest-api", "REST endpoints"],
    ["mcp", "Connect an AI client"],
    ["mcp-tools", "MCP tools"],
  ]) {
    await page.getByRole("button", { name: "Open documentation menu", exact: true }).click()
    await page.getByRole("dialog").getByRole("link", { name: title, exact: true }).click()
    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page).toHaveURL(new RegExp(`/api-reference/${slug}$`))
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  await page.getByRole("main").getByRole("link", { name: "Errors & limits", exact: true }).click()
  await expect(page).toHaveURL(/api-reference\/errors$/)
})

test("every REST endpoint opens from navigation with its request and expected response", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/api-reference/rest-api")
  const navigation = page.getByRole("navigation", { name: "Documentation", exact: true })
  for (const [slug, title, method, path] of [
    ["media-search", "Search media", "GET", "/media/search"],
    ["media-details", "Get media details", "GET", "/media/details"],
    ["media-episodes", "List episodes and seasons", "GET", "/media/episodes"],
    ["me", "Get your profile", "GET", "/me"],
    ["library", "List your library", "GET", "/library"],
    ["progress", "Get media progress", "GET", "/progress"],
    ["catchup", "Get your release feed", "GET", "/catchup"],
    ["progress-status", "Set tracking status", "POST", "/progress/status"],
    ["progress-book", "Set book progress", "POST", "/progress/book"],
    ["progress-manga", "Set manga progress", "POST", "/progress/manga"],
    ["progress-game", "Set game progress", "POST", "/progress/game"],
    ["progress-episode", "Set episode status", "POST", "/progress/episode"],
  ]) {
    await navigation.getByRole("link", { name: `${method} ${title}`, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/api-reference/${slug}$`))
    await expect(page.getByRole("heading", { name: title, level: 1, exact: true })).toBeVisible()
    const viewer = page.locator('[data-slot="request-viewer"]').first()
    await expect(viewer.getByRole("tab", { name: "Response", exact: true })).toHaveAttribute("aria-selected", "true")
    await expect(viewer.getByRole("tabpanel")).toContainText("Expected response")
    await viewer.getByRole("tab", { name: "Request", exact: true }).click()
    await expect(viewer.getByRole("tabpanel")).toContainText(`${method} /integrations/v1${path}`)
    await viewer.getByRole("tab", { name: "Headers", exact: true }).click()
    await expect(viewer.getByRole("tabpanel")).toContainText("application/json")
  }
  expect(errors).toEqual([])
})

test("endpoint examples support copy, keyboard tabs, search, and direct reloads", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/api-reference/progress-book")
  const viewer = page.locator('[data-slot="request-viewer"]')
  const requestTab = viewer.getByRole("tab", { name: "Request", exact: true })
  await requestTab.click()
  await viewer.getByRole("button", { name: "Copy code", exact: true }).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('"pagesRead": 120')
  await requestTab.focus()
  await page.keyboard.press("ArrowRight")
  await expect(viewer.getByRole("tab", { name: "Headers", exact: true })).toBeFocused()
  await expect(viewer.getByRole("tabpanel")).toContainText("Bearer YOUR_ACCESS_TOKEN")
  await page.keyboard.press("End")
  await expect(viewer.getByRole("tab", { name: "Response", exact: true })).toBeFocused()
  await expect(viewer.getByRole("tabpanel")).toContainText('"previousStatus": null')
  await page.getByRole("button", { name: "Copy page to clipboard", exact: true }).click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("POST /integrations/v1/progress/book")
  await page.reload()
  await expect(page.getByRole("heading", { name: "Set book progress", level: 1, exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Search documentation", exact: true }).click()
  await page.getByRole("combobox").fill("/progress/episode")
  await page.getByRole("option").filter({ hasText: "Set episode status" }).click()
  await expect(page).toHaveURL(/api-reference\/progress-episode$/)
})

test("endpoint request viewers fit mobile and navigate through the menu", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/api-reference/media-episodes")
  const viewers = page.locator('[data-slot="request-viewer"]')
  await expect(viewers).toHaveCount(2)
  for (const viewer of await viewers.all()) {
    for (const name of ["Request", "Headers", "Response"]) {
      await viewer.getByRole("tab", { name, exact: true }).click()
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    }
  }
  await page.getByRole("button", { name: "Open documentation menu", exact: true }).click()
  await page.getByRole("dialog").getByRole("link", { name: "POST Set game progress", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Set game progress", level: 1, exact: true })).toBeVisible()
  await page.getByRole("tab", { name: "Headers", exact: true }).click()
  await expect(page.getByRole("tabpanel")).toContainText("Authorization")
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
