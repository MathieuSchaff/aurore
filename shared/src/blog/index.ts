import { z } from 'zod'

import { HTTP_STATUS, type HttpStatus, safeUrl } from '../core'

// Functional taxonomy for blog content (guides, monographies, benchmarks,
// routines, etc.). Inspired by VRAC content audit. DB schema TBD, pure TS for now.
export const BLOG_CATEGORIES = {
  // Skin care: rosacea, acne, keratosis, topical ingredients
  SKINCARE: 'skincare',
  // Hair: shampoos, leave-in, scalp care
  HAIRCARE: 'haircare',
  // Oral hygiene
  DENTAL: 'dental',
  // Food: superfoods, fruit and vegetables, nutritional profiles
  NUTRITION: 'nutrition',
  // Dietary supplements: monographs, vitamins, minerals, problematic forms
  SUPPLEMENTS: 'supplements',
  // Medicinal plants: phytotherapy, adaptogens, mushrooms
  PHYTOTHERAPIE: 'phytotherapie',
  // Routines and protocols: skincare cycling, layering, sequences
  ROUTINES: 'routines',
  // Deep technical articles: molecular mechanisms, pharmacology, deep dives
  SCIENCE: 'science',
  // Whole-body wellbeing: sleep, stress, longevity, gut-brain axis, mental health
  LIFESTYLE: 'lifestyle',
} as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[keyof typeof BLOG_CATEGORIES]

// For Zod enum validation (when DB lands)
export const BLOG_CATEGORY_VALUES = Object.values(BLOG_CATEGORIES) as [
  BlogCategory,
  ...BlogCategory[],
]

// Display labels (FR) for UI
export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  skincare: 'Soins peau',
  haircare: 'Cheveux',
  dental: 'Dents',
  nutrition: 'Nutrition',
  supplements: 'Compléments alimentaires',
  phytotherapie: 'Phytothérapie',
  routines: 'Routines & protocoles',
  science: 'Science approfondie',
  lifestyle: 'Bien-être global',
}

const uuid = z.uuid()

const slugSchema = z
  .string()
  .max(150)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })

export const createArticleSchema = z.object({
  title: z.string().min(1).max(300),
  slug: slugSchema.optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().max(200000),
  category: z.enum(BLOG_CATEGORY_VALUES),
  coverImageUrl: safeUrl.optional(),
  publishedAt: z.iso.datetime().nullable().optional(),
})

export const updateArticleSchema = z
  .object({
    title: z.string().min(1).max(300).optional(),
    slug: slugSchema.optional(),
    excerpt: z.string().max(500).nullable().optional(),
    content: z.string().max(200000).optional(),
    category: z.enum(BLOG_CATEGORY_VALUES).optional(),
    coverImageUrl: safeUrl.nullable().optional(),
    publishedAt: z.iso.datetime().nullable().optional(),
  })
  .strict()

export const articleResponseSchema = z.object({
  id: uuid,
  createdBy: uuid,
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable(),
  content: z.string(),
  category: z.enum(BLOG_CATEGORY_VALUES),
  coverImageUrl: z.string().nullable(),
  publishedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const articleListItemSchema = z.object({
  id: uuid,
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable(),
  category: z.enum(BLOG_CATEGORY_VALUES),
  coverImageUrl: z.string().nullable(),
  publishedAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime(),
})

export const articleCategoryCountsSchema = z.object(
  Object.fromEntries(
    BLOG_CATEGORY_VALUES.map((c) => [c, z.number().int().nonnegative()])
  ) as Record<BlogCategory, z.ZodNumber>
)

export const articleSearchSchema = z.object({
  category: z.enum(BLOG_CATEGORY_VALUES).optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  // false includes drafts (admin only), true keeps published articles only.
  // Not z.coerce.boolean(): query params arrive as strings and Boolean('false')
  // is true, which made the admin draft view unreachable.
  publishedOnly: z
    .union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')])
    .default(true),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type ArticleListItem = z.infer<typeof articleListItemSchema>
export type ArticleSearchFilters = z.infer<typeof articleSearchSchema>
export type ArticleCategoryCounts = z.infer<typeof articleCategoryCountsSchema>

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

export const articleErrorMapping = {
  article_not_found: HTTP_STATUS.NOT_FOUND,
  article_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  article_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  article_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  slug_already_exists: HTTP_STATUS.CONFLICT,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<ArticleErrorCode, HttpStatus>
