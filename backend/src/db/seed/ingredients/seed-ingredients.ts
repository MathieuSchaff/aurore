import type { INGREDIENT_SLUGS } from './ingredient-slugs'

export type IngredientSlug = (typeof INGREDIENT_SLUGS)[keyof typeof INGREDIENT_SLUGS]
export type IngredientInput = {
  name: string
  description: string
  slug: IngredientSlug
  content: string
  category: string
}
