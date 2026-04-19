import { z } from 'zod'

import { tagItemSchema } from '../../core'

export const supplementIngredientFilterOptionsSchema = z.object({
  tags: z.object({
    goal: z.array(tagItemSchema),
    moment: z.array(tagItemSchema),
    restriction: z.array(tagItemSchema),
    // Biochemical attribute: intrinsic property of the molecule.
    ingredient_attribute: z.array(tagItemSchema),
  }),
})

// coerce because query params always arrive as strings
export const supplementIngredientsSearchSchema = z.object({
  goal: z.string().optional(),
  moment: z.string().optional(),
  restriction: z.string().optional(),
  ingredient_attribute: z.string().optional(),
  ingredient_type: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})

export type SupplementIngredientFilterOptions = z.infer<
  typeof supplementIngredientFilterOptionsSchema
>
export type SupplementIngredientSearchFilters = z.infer<typeof supplementIngredientsSearchSchema>
