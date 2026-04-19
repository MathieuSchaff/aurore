import { z } from 'zod'

import { tagItemSchema } from '../../core'

export const skincareIngredientFilterOptionsSchema = z.object({
  tags: z.object({
    skin_type: z.array(tagItemSchema),
    concern: z.array(tagItemSchema),
    // Functional role: intrinsic property of the molecule.
    ingredient_attribute: z.array(tagItemSchema),
    // Effect on skin — scope='both' slugs only (occlusif, matifiant,
    // repulpant, protection-cutanee).
    skin_effect: z.array(tagItemSchema),
    // Comedogenicity — comedogene/non-comedogene pair.
    shared_label: z.array(tagItemSchema),
  }),
})

// coerce because query params always arrive as strings
export const skincareIngredientsSearchSchema = z.object({
  concern: z.string().optional(),
  skin_type: z.string().optional(),
  ingredient_attribute: z.string().optional(),
  skin_effect: z.string().optional(),
  shared_label: z.string().optional(),
  ingredient_type: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})

export type SkincareIngredientFilterOptions = z.infer<typeof skincareIngredientFilterOptionsSchema>
export type SkincareIngredientSearchFilters = z.infer<typeof skincareIngredientsSearchSchema>
