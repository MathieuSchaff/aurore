import type { z } from 'zod'

import type { BlogCategory } from './categories'
import type {
  articleListItemSchema,
  articleResponseSchema,
  articleSearchSchema,
  createArticleSchema,
  updateArticleSchema,
} from './schemas'

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type ArticleResponse = z.infer<typeof articleResponseSchema>
export type ArticleListItem = z.infer<typeof articleListItemSchema>
export type ArticleSearchFilters = z.infer<typeof articleSearchSchema>

export type Article = {
  id: string
  createdBy: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: BlogCategory
  coverImageUrl: string | null
  publishedAt: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
}

export type ArticleErrorCode =
  | 'article_not_found'
  | 'article_creation_failed'
  | 'article_update_failed'
  | 'article_delete_failed'
  | 'slug_already_exists'
  | 'unauthorized_access'
  | 'database_error'
