import type { FieldChange } from './common'

export type Ingredient = {
  id: string
  createdBy: string
  name: string
  slug: string
  description: string
  content: string
  category: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

export type IngredientEdit = {
  id: string
  ingredientId: string
  editedBy: string
  changes: Record<string, { old: string | null; new: string | null }>
  summary: string | null
  createdAt: string | Date
}
export type EditableIngredientKeys = Exclude<
  keyof Ingredient,
  'id' | 'createdBy' | 'createdAt' | 'slug' | 'updatedAt'
>

export type IngredientChanges = {
  [K in EditableIngredientKeys]?: FieldChange<Ingredient[K]>
}
export type IngredientErrorCode =
  | 'ingredient_not_found'
  | 'ingredient_creation_failed'
  | 'ingredient_update_failed'
  | 'ingredient_delete_failed'
  | 'ingredient_already_exists'
  | 'unauthorized_access'
  | 'database_error'
