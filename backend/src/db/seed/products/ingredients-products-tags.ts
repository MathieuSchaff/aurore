import { unifiedIngredientsMap } from './unified'

export const ALL_PRODUCT_INGREDIENTS_MAP = {
  ...unifiedIngredientsMap,
}

/**
 * Version aplatie pour le seeding de la base de données
 */
export const allIngredientProductTags = Object.entries(ALL_PRODUCT_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.concentrationValue ?? ing.value ?? null,
      concentrationUnit: ing.concentrationUnit ?? ing.unit ?? null,
      notes: ing.notes ?? null,
    }))
)
