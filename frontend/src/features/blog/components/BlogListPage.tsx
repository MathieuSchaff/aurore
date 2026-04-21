import {
  BLOG_CATEGORY_LABELS,
  BLOG_CATEGORY_VALUES,
  type BlogCategory,
} from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import type React from 'react'

import { Card } from '@/component/Card/Card'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { ListPagination } from '@/component/DataDisplay/Pagination/ListPagination'
import { EmptyState } from '@/component/Feedback/ui/EmptyState/EmptyState'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { articleQueries } from '@/lib/queries/articles'
import { BlogListSkeleton } from './skeletons/BlogSkeletons'

import '@/component/Input/ChipGroup/ChipGroup.css'
import '@/component/Layout/PageLayout/ListPage.css'
import './BlogListPage.css'

const PAGE_SIZE = 20

type BlogListPageProps = {
  category?: BlogCategory
  page: number
  onPageChange: (page: number) => void
}

export function BlogListPage({ category, page, onPageChange }: BlogListPageProps) {
  const { data, isLoading, isPlaceholderData } = useQuery({
    ...articleQueries.list({ category, page, limit: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const title = category ? BLOG_CATEGORY_LABELS[category] : 'Blog'
  const meta = isLoading ? undefined : `${total} article${total > 1 ? 's' : ''}`

  return (
    <div className="list-page blog-list-page">
      <PageHeader title={title} meta={meta} isLoading={isPlaceholderData} />

      <nav className="blog-category-nav chip-group" aria-label="Catégories">
        <Link
          to="/blog"
          className={`chip chip--md${category === undefined ? ' chip--active' : ''}`}
          aria-current={category === undefined ? 'page' : undefined}
        >
          Tous
        </Link>
        {BLOG_CATEGORY_VALUES.map((c) => (
          <Link
            key={c}
            to="/blog/$category"
            params={{ category: c }}
            className={`chip chip--md${category === c ? ' chip--active' : ''}`}
            aria-current={category === c ? 'page' : undefined}
          >
            {BLOG_CATEGORY_LABELS[c]}
          </Link>
        ))}
      </nav>

      <main className={`list-main${isPlaceholderData ? ' list-main--syncing' : ''}`}>
        {isLoading && !isPlaceholderData ? (
          <BlogListSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={24} />}
            title="Aucun article"
            subtitle={
              category ? 'Pas encore de contenu dans cette catégorie.' : 'Pas encore d’articles.'
            }
          />
        ) : (
          <>
            <div className="list-grid">
              {items.map((article) => (
                <Card
                  key={article.id}
                  as={Link as React.ElementType}
                  to="/blog/$category/$slug"
                  params={{ category: article.category, slug: article.slug }}
                  accent="var(--color-primary)"
                >
                  {article.coverImageUrl && (
                    <Card.Media className="blog-list__cover">
                      <img src={article.coverImageUrl} alt="" loading="lazy" />
                    </Card.Media>
                  )}
                  <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    {article.excerpt && <Card.Description>{article.excerpt}</Card.Description>}
                  </Card.Body>
                  <Card.Footer>
                    <Badge variant="chip">{BLOG_CATEGORY_LABELS[article.category]}</Badge>
                  </Card.Footer>
                </Card>
              ))}
            </div>

            <ListPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </main>
    </div>
  )
}
