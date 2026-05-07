import {
  BLOG_CATEGORY_LABELS,
  BLOG_CATEGORY_VALUES,
  type BlogCategory,
} from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, BookOpen, Search } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/component/Button/Button'
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

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

type BlogListPageProps = {
  category?: BlogCategory
  page: number
  q?: string
  onPageChange: (page: number) => void
  onSearchChange: (q: string) => void
}

export function BlogListPage({
  category,
  page,
  q,
  onPageChange,
  onSearchChange,
}: BlogListPageProps) {
  const [inputValue, setInputValue] = useState(q ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync input when URL param changes externally (browser back/forward)
  useEffect(() => {
    setInputValue(q ?? '')
  }, [q])

  const handleInput = (value: string) => {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearchChange(value)
    }, 400)
  }

  const { data, isLoading, isError, isPlaceholderData, refetch } = useQuery({
    ...articleQueries.list({ category, page, q, limit: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const pageTitle = category ? BLOG_CATEGORY_LABELS[category] : 'Blog'
  const meta = isLoading ? undefined : `${total} article${total > 1 ? 's' : ''}`
  const searchPlaceholder = category
    ? `Rechercher dans ${BLOG_CATEGORY_LABELS[category]}…`
    : 'Rechercher un article…'

  const firstItem = items[0]
  const heroId = firstItem?.coverImageUrl ? firstItem.id : null

  return (
    <div className="list-page blog-list-page">
      <PageHeader title={pageTitle} meta={meta} isLoading={isPlaceholderData} />

      <div className="blog-list-page__controls">
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

        <div className="blog-search-wrap">
          <Search size={15} className="blog-search__icon" aria-hidden />
          <input
            type="search"
            className="blog-search__input"
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
            aria-label="Rechercher"
          />
        </div>
      </div>

      <main className={`list-main${isPlaceholderData ? ' list-main--syncing' : ''}`}>
        {isError && !isPlaceholderData ? (
          <EmptyState
            icon={<AlertTriangle size={24} />}
            title="Chargement impossible"
            subtitle="On n'a pas pu récupérer les articles. Réessaie dans un instant."
          >
            <Button onClick={() => refetch()}>Réessayer</Button>
          </EmptyState>
        ) : isLoading && !isPlaceholderData ? (
          <BlogListSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={24} />}
            title="Aucun article"
            subtitle={
              q
                ? `Pas de résultat pour « ${q} ».`
                : category
                  ? 'Pas encore de contenu dans cette catégorie.'
                  : "Pas encore d'articles."
            }
          />
        ) : (
          <>
            <div className="list-grid blog-list-grid">
              {items.map((article) => (
                <Card
                  key={article.id}
                  as={Link as React.ElementType}
                  to="/blog/$category/$slug"
                  params={{ category: article.category, slug: article.slug }}
                  accent="var(--color-primary)"
                  className={article.id === heroId ? 'blog-card--hero' : undefined}
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
                    {article.publishedAt && (
                      <time
                        className="blog-card__date"
                        dateTime={new Date(article.publishedAt).toISOString()}
                      >
                        {dateFormatter.format(new Date(article.publishedAt))}
                      </time>
                    )}
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
