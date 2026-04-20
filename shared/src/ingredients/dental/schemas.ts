import { z } from 'zod'

import { tagItemSchema } from '../../core'

export const dentalIngredientFilterOptionsSchema = z.object({
  tags: z.object({
    concern: z.array(tagItemSchema),
    age_group: z.array(tagItemSchema),
    // Biochemical attribute: intrinsic property of the molecule.
    ingredient_attribute: z.array(tagItemSchema),
    // Perceived effect on teeth/gums (fraicheur, blancheur, …).
    dental_effect: z.array(tagItemSchema),
  }),
})

// coerce because query params always arrive as strings
export const dentalIngredientsSearchSchema = z.object({
  concern: z.string().optional(),
  age_group: z.string().optional(),
  ingredient_attribute: z.string().optional(),
  dental_effect: z.string().optional(),
  ingredient_type: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})

export type DentalIngredientFilterOptions = z.infer<typeof dentalIngredientFilterOptionsSchema>
export type DentalIngredientSearchFilters = z.infer<typeof dentalIngredientsSearchSchema>
