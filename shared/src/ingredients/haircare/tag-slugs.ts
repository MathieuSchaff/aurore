export const HAIRCARE_INGREDIENT_TAG_SLUGS = {} as const

export type HaircareIngredientTagSlug =
  (typeof HAIRCARE_INGREDIENT_TAG_SLUGS)[keyof typeof HAIRCARE_INGREDIENT_TAG_SLUGS]
