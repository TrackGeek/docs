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

export const docsSearchSchema = z.object({
  q: z.string().max(200).catch("").default(""),
  os: z.enum(["linux", "macos", "windows"]).catch("linux").default("linux"),
})

export const defaultSearch = docsSearchSchema.parse({})
