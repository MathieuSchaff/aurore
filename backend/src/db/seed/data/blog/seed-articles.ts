import type { BlogCategory } from '@habit-tracker/shared'

export type ArticleInput = {
  title: string
  slug: string
  excerpt?: string
  content: string
  category: BlogCategory
  coverImageUrl?: string
  publishedAt?: Date | null // null/undefined = brouillon
}
