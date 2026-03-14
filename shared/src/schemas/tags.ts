import { z } from 'zod'

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

export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof createTagSchema>
export type Relevance = z.infer<typeof relevanceEnum>
export type IngredientTagResponse = z.infer<typeof ingredientTagResponseSchema>
export type AddIngredientTagInput = z.infer<typeof addIngredientTagSchema>
export type ReplaceIngredientTagsInput = z.infer<typeof replaceIngredientTagsSchema>
export type AddProductTagInput = z.infer<typeof addProductTagSchema>
export type ReplaceProductTagsInput = z.infer<typeof replaceProductTagsSchema>
