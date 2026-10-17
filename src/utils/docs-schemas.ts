import { z } from "zod"

export const articleSlugSchema = z.enum([
  "introduction",
  "requirements",
  "installation",
  "configuration",
  "api-keys",
  "network-access",
  "sign-in-credentials",
  "discord-bot",
  "media-credentials",
  "email-credentials",
  "stripe-credentials",
  "commands",
  "updates",
  "automatic-startup",
  "backups",
  "troubleshooting",
  "project-structure",
])

export const apiArticleSlugSchema = z.enum([
  "overview",
  "register-app",
  "oauth2",
  "rest-api",
  "media-search",
  "media-details",
  "media-episodes",
  "me",
  "library",
  "progress",
  "catchup",
  "progress-status",
  "progress-book",
  "progress-manga",
  "progress-game",
  "progress-episode",
  "mcp",
  "mcp-tools",
  "errors",
])

export const docsSearchSchema = z.object({
  q: z.string().max(200).catch("").default(""),
  os: z.enum(["linux", "macos", "windows"]).catch("linux").default("linux"),
})

export const defaultSearch = docsSearchSchema.parse({})
