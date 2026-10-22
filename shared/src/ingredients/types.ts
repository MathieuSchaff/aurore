import type { z } from 'zod'

import type {
  createIngredientSchema,
  ingredientChangesSchema,
  updateIngredientRouteSchema,
  updateIngredientSchema,
} from './schemas'

// z.infer<> aliases for all ingredient schemas
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>
// IngredientChanges = the Zod-validated change payload (used for API + DB column type)
export type IngredientChanges = z.infer<typeof ingredientChangesSchema>
export type UpdateIngredientRouteInput = z.infer<typeof updateIngredientRouteSchema>

// Entity types
export type Ingredient = {
  id: string
  createdBy: string
  name: string
  slug: string
  description: string
  content: string
  type: string
  category: string | null
  createdAt: string | Date
  updatedAt: string | Date
}
