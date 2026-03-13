import { z } from 'zod'

import { fieldChangeSchema } from './common'

const uuid = z.uuid()

// ─── Schemas ──────────────────────────────────────────────

export const createIngredientSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  slug: z.string().max(100).optional(),
  content: z.string().max(50000).optional(),
  category: z.string().min(1).max(100).optional(),
})

export const updateIngredientSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: z.string().max(100).optional(),
    description: z.string().max(2000).optional(),
    content: z.string().max(50000).optional(),
    category: z.string().min(1).max(100).nullable().optional(),
  })
  .strict()

export const ingredientResponseSchema = z.object({
  id: uuid,
  createdBy: uuid,
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  content: z.string(),
  category: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const ingredientSearchResultSchema = z.object({
  id: uuid,
  name: z.string(),
  slug: z.string(),
  category: z.string().nullable(),
})

export const ingredientEditResponseSchema = z.object({
  id: uuid,
  ingredientId: uuid,
  editedBy: uuid,
  changes: z.record(
    z.string(),
    z.object({
      old: z.string().nullable(),
      new: z.string().nullable(),
    })
  ),
  summary: z.string().nullable(),
  createdAt: z.date(),
})

export const ingredientChangesSchema = z
  .object({
    name: fieldChangeSchema(z.string()),
    description: fieldChangeSchema(z.string()),
    content: fieldChangeSchema(z.string()),
    category: fieldChangeSchema(z.string()),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field change is required',
  })

export const ingredientsSearchSchema = z.object({
  category: z.string().optional(),
  concern: z.string().optional(),
  skinType: z.string().optional(),
  attribute: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})
// ─── Types ────────────────────────────────────────────────

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>
export type IngredientResponse = z.infer<typeof ingredientResponseSchema>
export type IngredientSearchResult = z.infer<typeof ingredientSearchResultSchema>
export type IngredientEditResponse = z.infer<typeof ingredientEditResponseSchema>
export type IngredientChanges = z.infer<typeof ingredientChangesSchema>
export type IngredientSearchFilters = z.infer<typeof ingredientsSearchSchema>
