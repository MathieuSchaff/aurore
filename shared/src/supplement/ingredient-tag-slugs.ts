export const SUPPLEMENT_INGREDIENT_TAG_SLUGS = {} as const

export type SupplementIngredientTagSlug =
  (typeof SUPPLEMENT_INGREDIENT_TAG_SLUGS)[keyof typeof SUPPLEMENT_INGREDIENT_TAG_SLUGS]
