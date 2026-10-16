import { expect, test } from "@playwright/test"

test("home redirects, documentation links work, API Reference stays hidden", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/")
  await expect(page).toHaveURL(/\/introduction$/)
  expect(new URL(page.url()).pathname).toBe("/introduction")
  await expect(page.getByRole("heading", { name: "Introduction", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "API Reference", exact: true })).toHaveCount(0)

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
  for (const path of ["/no-such-article", "/api-reference", "/no-such-route"]) {
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
