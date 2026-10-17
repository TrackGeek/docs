import { createFileRoute } from "@tanstack/react-router"
import { ArticleFeedback } from "@/components/docs/article-feedback"
import { ArticleHeader } from "@/components/docs/article-header"
import { ArticleMarkdown } from "@/components/docs/article-markdown"
import { ArticlePagination } from "@/components/docs/article-pagination"
import { ArticleToc } from "@/components/docs/article-toc"
import { DocsSidebar } from "@/components/layout/docs-sidebar"
import { loadApiArticle } from "@/utils/load-article"

export const Route = createFileRoute("/api-reference")({
  loader: () => loadApiArticle("overview"),
  component: ApiArticleRoute,
})

function ApiArticleRoute() {
  const { article, markdown, headings } = Route.useLoaderData()

  return (
    <div className="mx-auto flex max-w-360">
      <DocsSidebar />
      <main id="main-content" className="min-w-0 flex-1 px-5 pt-8 pb-12 sm:px-9 lg:px-12 lg:pt-10" key={article.slug}>
        <div className="mx-auto max-w-190">
          <ArticleHeader article={article} markdown={markdown} />
          <ArticleMarkdown markdown={markdown} />
          <ArticleFeedback slug={`api-reference/${article.slug}`} />
          <ArticlePagination article={article} />
        </div>
      </main>
      <ArticleToc headings={headings} article={article} />
    </div>
  )
}
