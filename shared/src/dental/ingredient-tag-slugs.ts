export const DENTAL_INGREDIENT_TAG_SLUGS = {} as const

export type DentalIngredientTagSlug =
  (typeof DENTAL_INGREDIENT_TAG_SLUGS)[keyof typeof DENTAL_INGREDIENT_TAG_SLUGS]
