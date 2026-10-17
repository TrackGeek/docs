import { createFileRoute, notFound } from "@tanstack/react-router"
import { EndpointExamples } from "@/components/api-reference/endpoint-examples"
import { ArticleFeedback } from "@/components/docs/article-feedback"
import { ArticleHeader } from "@/components/docs/article-header"
import { ArticleMarkdown } from "@/components/docs/article-markdown"
import { ArticlePagination } from "@/components/docs/article-pagination"
import { ArticleToc } from "@/components/docs/article-toc"
import { DocsSidebar } from "@/components/layout/docs-sidebar"
import { apiArticleSlugSchema } from "@/utils/docs-schemas"
import { loadApiArticle } from "@/utils/load-article"

export const Route = createFileRoute("/api-reference_/$slug")({
  params: {
    parse: ({ slug }) => {
      const result = apiArticleSlugSchema.safeParse(slug)
      if (!result.success || result.data === "overview") throw notFound()
      return { slug: result.data }
    },
    stringify: ({ slug }) => ({ slug }),
  },
  loader: ({ params }) => loadApiArticle(params.slug),
  component: ApiArticleRoute,
})

function ApiArticleRoute() {
  const { article, markdown, headings, endpoint, copyMarkdown } = Route.useLoaderData()

  return (
    <div className="mx-auto flex max-w-360">
      <DocsSidebar />
      <main id="main-content" className="min-w-0 flex-1 px-5 pt-8 pb-12 sm:px-9 lg:px-12 lg:pt-10" key={article.slug}>
        <div className="mx-auto max-w-190">
          <ArticleHeader article={article} markdown={copyMarkdown ?? markdown} />
          <ArticleMarkdown markdown={markdown} />
          {endpoint && <EndpointExamples endpoint={endpoint} />}
          <ArticleFeedback slug={`api-reference/${article.slug}`} />
          <ArticlePagination article={article} />
        </div>
      </main>
      <ArticleToc headings={headings} article={article} />
    </div>
  )
}
