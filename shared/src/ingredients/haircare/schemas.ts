import { z } from 'zod'

import { tagItemSchema } from '../../core'

export const haircareIngredientFilterOptionsSchema = z.object({
  tags: z.object({
    concern: z.array(tagItemSchema),
    hair_type: z.array(tagItemSchema),
    // Biochemical attribute: intrinsic property of the molecule.
    ingredient_attribute: z.array(tagItemSchema),
    // Perceived effect on hair (brillance, volume, douceur, …).
    hair_effect: z.array(tagItemSchema),
  }),
})

// coerce because query params always arrive as strings
export const haircareIngredientsSearchSchema = z.object({
  concern: z.string().optional(),
  hair_type: z.string().optional(),
  ingredient_attribute: z.string().optional(),
  hair_effect: z.string().optional(),
  ingredient_type: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})

export type HaircareIngredientFilterOptions = z.infer<typeof haircareIngredientFilterOptionsSchema>
export type HaircareIngredientSearchFilters = z.infer<typeof haircareIngredientsSearchSchema>
