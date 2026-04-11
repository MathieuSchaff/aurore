import { z } from 'zod'
import { type HttpStatus, HTTP_STATUS } from '../core'

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

export const relevanceEnum = z.enum(['primary', 'secondary', 'avoid'])

export const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50).optional(),
  slug: z.string().max(100).optional(),
})

export const tagResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  category: z.string().nullable(),
  createdAt: z.date(),
})

export const ingredientTagResponseSchema = z.object({
  id: z.uuid(),
  ingredientId: z.uuid(),
  tagId: z.uuid(),
  relevance: relevanceEnum,
  createdAt: z.date(),
})

export const addIngredientTagSchema = z.object({
  tagId: z.uuid(),
  relevance: relevanceEnum.optional().default('secondary'),
})

export const replaceIngredientTagsSchema = z.object({
  tags: z.array(
    z.object({
      tagId: z.uuid(),
      relevance: relevanceEnum.optional().default('secondary'),
    })
  ),
})

export const addProductTagSchema = z.object({
  tagId: z.uuid(),
  relevance: relevanceEnum.optional().default('secondary'),
})

export const replaceProductTagsSchema = z.object({
  tags: z.array(
    z.object({
      tagId: z.uuid(),
      relevance: relevanceEnum.optional().default('secondary'),
    })
  ),
})

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof createTagSchema>
export type Relevance = z.infer<typeof relevanceEnum>
export type IngredientTagResponse = z.infer<typeof ingredientTagResponseSchema>
export type AddIngredientTagInput = z.infer<typeof addIngredientTagSchema>
export type ReplaceIngredientTagsInput = z.infer<typeof replaceIngredientTagsSchema>
export type AddProductTagInput = z.infer<typeof addProductTagSchema>
export type ReplaceProductTagsInput = z.infer<typeof replaceProductTagsSchema>

export type IngredientTagDef = {
  id: string
  slug: string
  label: string
  tagType: string
  createdAt: string | Date
}

export type ProductTagDef = {
  id: string
  slug: string
  label: string
  tagType: string
  createdAt: string | Date
}

export type TagIngredient = {
  ingredientTagId: string
  ingredientId: string
  relevance: 'primary' | 'secondary' | 'avoid'
}

export type TagProduct = {
  productTagId: string
  productId: string
  relevance: 'primary' | 'secondary' | 'avoid'
}

// Keep legacy aliases to avoid breaking imports elsewhere until
// downstream callers are updated.
export type Tag = IngredientTagDef | ProductTagDef
export type ProductTag = TagProduct
export type IngredientTag = TagIngredient

export type TagErrorCode =
  | 'tag_not_found'
  | 'tag_already_exists'
  | 'tag_creation_failed'
  | 'database_error'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const tagErrorMapping = {
  tag_not_found: HTTP_STATUS.NOT_FOUND,
  tag_already_exists: HTTP_STATUS.CONFLICT,
  tag_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<TagErrorCode, HttpStatus>
