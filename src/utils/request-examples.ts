import type { ApiEndpoint, NetworkRequest } from "@/types/api-endpoint"

export function getRequestCode(request: NetworkRequest): string {
  const url = new URL(request.url)
  return [
    `${request.method} ${url.pathname}${url.search} HTTP/1.1`,
    `Host: ${url.host}`,
    ...(request.requestHeaders ?? []).map(({ name, value }) => `${name}: ${value}`),
    ...(request.requestBody ? ["", request.requestBody] : []),
  ].join("\n")
}

export function getExamplesMarkdown(endpoint: ApiEndpoint): string {
  return endpoint.examples
    .map(
      (request) =>
        `\n\n\`\`\`http\n${getRequestCode(request)}\n\`\`\`\n\nHTTP ${request.status} ${request.statusText ?? ""}\n\n\`\`\`json\n${request.responseBody}\n\`\`\``,
    )
    .join("\n")
}
