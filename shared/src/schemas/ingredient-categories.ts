// ─── Ingredient Categories ────────────────────────────────

export const INGREDIENT_CATEGORIES = {
  ACTIF: 'actif',
  HUMECTANT: 'humectant',
  EMOLLIENT: 'emollient',
  FILTRE_UV: 'filtre-uv',
  TENSIOACTIF: 'tensioactif',
  EXCIPIENT: 'excipient',
} as const

export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[keyof typeof INGREDIENT_CATEGORIES]

// For Zod enum validation
export const INGREDIENT_CATEGORY_VALUES = Object.values(INGREDIENT_CATEGORIES) as [
  IngredientCategory,
  ...IngredientCategory[],
]
