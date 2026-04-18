import { z } from 'zod'

import { HTTP_STATUS, type HttpStatus } from '../core'

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

export const relevanceValues = ['primary', 'secondary', 'avoid'] as const

export const relevanceEnum = z.enum(relevanceValues)

export const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50).optional(),
  slug: z.string().max(100).optional(),
})

export const updateTagSchema = createTagSchema.partial()

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
export type UpdateTagInput = z.infer<typeof updateTagSchema>
export type ReplaceIngredientTagsInput = z.infer<typeof replaceIngredientTagsSchema>
export type ReplaceProductTagsInput = z.infer<typeof replaceProductTagsSchema>

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
