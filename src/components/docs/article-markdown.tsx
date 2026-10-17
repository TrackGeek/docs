import { Link } from "@tanstack/react-router"
import { Terminal } from "lucide-react"
import { Children, isValidElement, type ReactNode } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "@/components/jalco/code-block"
import { createHeadingId } from "@/utils/article-headings"
import { apiArticleSlugSchema, articleSlugSchema } from "@/utils/docs-schemas"

function plainText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child)
      if (isValidElement<{ children?: ReactNode }>(child)) return plainText(child.props.children)
      return ""
    })
    .join("")
}

export function ArticleMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="text-[15px] leading-7 text-foreground/85 [&>p]:my-4 [&>h2:first-child]:mt-0">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2
              id={createHeadingId(plainText(children))}
              className="mt-10 mb-4 text-xl font-semibold tracking-tight text-foreground"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={createHeadingId(plainText(children))} className="mt-7 mb-3 text-base font-semibold text-foreground">
              {children}
            </h3>
          ),
          a: ({ children, href }) => {
            const internal = href?.match(/^\/([^?#]+)(?:#(.*))?$/)
            const api =
              internal?.[1] === "api-reference"
                ? "overview"
                : internal?.[1]?.startsWith("api-reference/")
                  ? internal[1].slice(14)
                  : undefined
            const apiParsed = apiArticleSlugSchema.safeParse(api)
            if (apiParsed.success)
              return (
                <Link
                  to={apiParsed.data === "overview" ? "/api-reference" : "/api-reference/$slug"}
                  params={{ slug: apiParsed.data }}
                  hash={internal?.[2]}
                  search={(previous) => ({ ...previous, q: "" })}
                  className="font-medium text-accent-foreground underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
                >
                  {children}
                </Link>
              )
            const parsed = articleSlugSchema.safeParse(internal?.[1])
            if (parsed.success)
              return (
                <Link
                  to="/$slug"
                  params={{ slug: parsed.data }}
                  hash={internal?.[2]}
                  search={(previous) => ({ ...previous, q: "" })}
                  className="font-medium text-accent-foreground underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
                >
                  {children}
                </Link>
              )
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent-foreground underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
              >
                {children}
              </a>
            )
          },
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 pl-5 marker:text-muted-foreground">{children}</ul>
          ),
          ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-5">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          code: ({ children }) => (
            <code className="rounded border bg-muted/60 px-1.5 py-0.5 font-mono text-[12px] break-words text-foreground">
              {children}
            </code>
          ),
          pre: ({ children }) => {
            const child = Children.toArray(children)[0]
            if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) return <pre>{children}</pre>
            const language = /language-(\S+)/.exec(child.props.className ?? "")?.[1] ?? "text"
            return (
              <CodeBlock
                code={plainText(child.props.children).replace(/\n$/, "")}
                language={language}
                title={
                  language === "json"
                    ? "JSON"
                    : language === "http"
                      ? "HTTP"
                      : language === "typescript"
                        ? "TypeScript"
                        : language === "powershell"
                          ? "PowerShell"
                          : language === "dotenv"
                            ? ".env"
                            : language === "text"
                              ? "Reference"
                              : "Terminal"
                }
                icon={<Terminal className="size-3.5 text-muted-foreground" aria-hidden="true" />}
                className="my-5 shadow-none"
              />
            )
          },
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-[13px] leading-6">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/60 text-xs text-foreground">{children}</thead>,
          th: ({ children }) => <th className="border-b px-4 py-3 font-medium whitespace-nowrap">{children}</th>,
          tr: ({ children }) => <tr className="border-b last:border-0">{children}</tr>,
          td: ({ children }) => <td className="px-4 py-3 align-top [&_code]:break-normal">{children}</td>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 rounded-r-lg border-l-2 border-primary bg-accent/40 px-5 py-2 text-sm text-foreground [&>p]:my-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  )
}
