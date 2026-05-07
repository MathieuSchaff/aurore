import { z } from 'zod'

import { BLOG_CATEGORY_VALUES } from './categories'

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
  coverImageUrl: z.url().optional(),
  publishedAt: z.iso.datetime().nullable().optional(),
})

export const updateArticleSchema = z
  .object({
    title: z.string().min(1).max(300).optional(),
    slug: slugSchema.optional(),
    excerpt: z.string().max(500).nullable().optional(),
    content: z.string().max(200000).optional(),
    category: z.enum(BLOG_CATEGORY_VALUES).optional(),
    coverImageUrl: z.url().nullable().optional(),
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

export const articleSearchSchema = z.object({
  category: z.enum(BLOG_CATEGORY_VALUES).optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  // null = brouillons inclus, true = uniquement publiés
  publishedOnly: z.coerce.boolean().default(true),
})
