import { z } from 'zod'

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
