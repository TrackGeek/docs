import { describe, expect, test } from "bun:test"
import { apiEndpoints, restBaseUrl } from "@/constants/api-endpoints"
import { apiArticles } from "@/constants/docs"
import { getExamplesMarkdown, getRequestCode } from "@/utils/request-examples"

const operations = [
  "GET /media/search",
  "GET /media/details",
  "GET /media/episodes",
  "GET /me",
  "GET /library",
  "GET /progress",
  "GET /catchup",
  "POST /progress/status",
  "POST /progress/book",
  "POST /progress/manga",
  "POST /progress/game",
  "POST /progress/episode",
]

describe("REST endpoint documentation", () => {
  test("every REST operation has a dedicated, discoverable page", () => {
    expect(apiEndpoints.map(({ method, path }) => `${method} ${path}`)).toEqual(operations)
    expect(new Set(apiEndpoints.map(({ slug }) => slug)).size).toBe(operations.length)
    for (const endpoint of apiEndpoints) {
      const article = apiArticles.find(({ slug }) => slug === endpoint.slug)
      expect(article?.method).toBe(endpoint.method)
      expect(article?.keywords).toContain(endpoint.path)
      expect(endpoint.examples.length).toBeGreaterThan(0)
    }
  })

  test("examples use the correct resource, authorization, JSON body, and response", () => {
    for (const endpoint of apiEndpoints) {
      for (const request of endpoint.examples) {
        const url = new URL(request.url)
        expect(`${url.origin}${url.pathname}`).toBe(`${restBaseUrl}${endpoint.path}`)
        expect(request.method).toBe(endpoint.method)
        expect(request.status).toBe(200)
        const authorization = request.requestHeaders?.find(({ name }) => name === "Authorization")
        expect(authorization?.value).toBe(endpoint.scope ? "Bearer YOUR_ACCESS_TOKEN" : undefined)
        expect(() => JSON.parse(request.responseBody ?? "")).not.toThrow()
        if (endpoint.method === "POST") {
          const body = JSON.parse(request.requestBody ?? "")
          expect(body.id).toMatch(/^[0-9a-f-]{36}$/)
          expect(body).not.toHaveProperty("userId")
          expect(request.requestHeaders).toContainEqual({ name: "Content-Type", value: "application/json" })
          expect(getRequestCode(request)).toContain(`\n\n${request.requestBody}`)
          expect(JSON.parse(request.responseBody ?? "")).toHaveProperty("changed")
        } else {
          expect(request.requestBody).toBeUndefined()
        }
        expect(getRequestCode(request)).toStartWith(`${endpoint.method} /integrations/v1${endpoint.path}`)
        expect(getExamplesMarkdown(endpoint)).toContain(request.responseBody ?? "")
      }
    }
  })
})
