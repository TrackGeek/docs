import { createFileRoute, notFound } from "@tanstack/react-router"
import { ArticleBody } from "@/components/docs/article-body"
import { ArticleFeedback } from "@/components/docs/article-feedback"
import { ArticleHeader } from "@/components/docs/article-header"
import { ArticlePagination } from "@/components/docs/article-pagination"
import { ArticleToc } from "@/components/docs/article-toc"
import { IntroductionLinks } from "@/components/docs/introduction-links"
import { DocsSidebar } from "@/components/layout/docs-sidebar"
import { articleSlugSchema } from "@/utils/docs-schemas"
import { loadArticle } from "@/utils/load-article"

export const Route = createFileRoute("/$slug")({
  params: {
    parse: ({ slug }) => {
      const result = articleSlugSchema.safeParse(slug)
      if (!result.success) throw notFound()
      return { slug: result.data }
    },
    stringify: ({ slug }) => ({ slug }),
  },
  loader: ({ params }) => loadArticle(params.slug),
  component: ArticleRoute,
})

function ArticleRoute() {
  const { article, markdown, headings } = Route.useLoaderData()

  return (
    <div className="mx-auto flex max-w-[1440px]">
      <DocsSidebar />
      <main id="main-content" className="min-w-0 flex-1 px-5 pt-8 pb-12 sm:px-9 lg:px-12 lg:pt-10" key={article.slug}>
        <div className="mx-auto max-w-[760px]">
          <ArticleHeader article={article} markdown={markdown} />
          {article.slug === "introduction" && <IntroductionLinks />}
          <ArticleBody article={article} markdown={markdown} />
          <ArticleFeedback slug={article.slug} />
          <ArticlePagination article={article} />
        </div>
      </main>
      <ArticleToc headings={headings} article={article} />
    </div>
  )
}
