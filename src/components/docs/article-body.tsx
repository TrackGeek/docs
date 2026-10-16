import { ArticleMarkdown } from "@/components/docs/article-markdown"
import { CredentialsExample } from "@/components/docs/credentials-example"
import { InstallationSteps } from "@/components/docs/installation-steps"
import { ProjectFileTree } from "@/components/docs/project-file-tree"
import type { Article } from "@/types/docs"

export function ArticleBody({ article, markdown }: { article: Article; markdown: string }) {
  const marker =
    article.slug === "installation"
      ? "## Follow the setup wizard"
      : article.slug === "project-structure"
        ? "## Main files"
        : article.slug === "api-keys"
          ? "## Optional sign-in and Discord"
          : undefined
  if (!marker) return <ArticleMarkdown markdown={markdown} />
  const position = markdown.indexOf(marker)

  return (
    <>
      <ArticleMarkdown markdown={markdown.slice(0, position)} />
      {article.slug === "installation" && <InstallationSteps />}
      {article.slug === "project-structure" && <ProjectFileTree />}
      {article.slug === "api-keys" && <CredentialsExample />}
      <div className="mt-9">
        <ArticleMarkdown markdown={markdown.slice(position)} />
      </div>
    </>
  )
}
