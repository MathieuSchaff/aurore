import type { ArticleSearchFilters } from '@habit-tracker/shared'

import { and, asc, eq, ilike, isNotNull, type SQL, sql } from 'drizzle-orm'

import type { DB } from '../../db'
import { articles } from '../../db/schema/blog/articles'
import { BlogError } from './blog-error'

export async function listArticles(
  db: DB,
  filters: ArticleSearchFilters,
  isAdmin = false
) {
  const page = filters.page ?? 1
  const limit = Math.min(filters.limit ?? 20, 50)
  const offset = (page - 1) * limit

  const conditions: SQL[] = []

  // Non-admins always see published articles only
  const publishedOnly = isAdmin ? (filters.publishedOnly ?? true) : true
  if (publishedOnly) {
    conditions.push(isNotNull(articles.publishedAt))
  }

  if (filters.category) {
    conditions.push(eq(articles.category, filters.category))
  }

  if (filters.q) {
    conditions.push(ilike(articles.title, `%${filters.q}%`))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        category: articles.category,
        coverImageUrl: articles.coverImageUrl,
        publishedAt: articles.publishedAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(where)
      .orderBy(asc(articles.publishedAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: sql<number>`cast(count(*) as integer)` }).from(articles).where(where),
  ])

  return { items, total }
}

export async function getArticleBySlug(db: DB, slug: string) {
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1)
  if (!article) throw new BlogError('article_not_found')
  return article
}
