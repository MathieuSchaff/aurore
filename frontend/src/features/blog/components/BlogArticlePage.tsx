import { BLOG_CATEGORY_LABELS } from '@habit-tracker/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { RichText } from '@/component/Typography/RichText/RichText'
import { formatInstant } from '@/lib/dates'
import { normalizeLatexMarkdown } from '@/lib/markdown'
import { articleQueries } from '@/lib/queries/articles'
import './BlogArticlePage.css'

type BlogArticlePageProps = {
  slug: string
}

export function BlogArticlePage({ slug }: BlogArticlePageProps) {
  const { data: article } = useSuspenseQuery(articleQueries.bySlug(slug))

  const dateLabel = formatInstant(article.publishedAt, 'long')

  return (
    <article className="blog-article">
      <Link
        to="/blog/$category"
        params={{ category: article.category }}
        className="blog-article__back"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        {BLOG_CATEGORY_LABELS[article.category]}
      </Link>

      <PageHeader
        title={article.title}
        meta={
          <div className="blog-article__meta">
            <Badge variant="chip">{BLOG_CATEGORY_LABELS[article.category]}</Badge>
            {article.publishedAt && dateLabel && (
              <time dateTime={article.publishedAt}>{dateLabel}</time>
            )}
          </div>
        }
      />

      {article.coverImageUrl && (
        <img src={article.coverImageUrl} alt="" className="blog-article__cover" loading="lazy" />
      )}

      {article.excerpt && <p className="blog-article__excerpt">{article.excerpt}</p>}

      <RichText>
        <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {normalizeLatexMarkdown(article.content)}
        </Markdown>
      </RichText>
    </article>
  )
}
