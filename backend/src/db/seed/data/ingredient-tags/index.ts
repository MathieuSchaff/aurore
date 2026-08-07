// Every slug carries a `scope` in TAG_TAXONOMY (`ingredient` | `product` | `both`).
// The `shared-schemas-vs-tags` test checks that every slug used here has a scope
// compatible with a molecule, so this file has no hand-maintained blacklist.

// Forbidden here (scope = 'product'): product_type, routine_step, skin_zone,
// most product_label, "finished product" skin_effect (texture-riche, texture-legere).
// Allowed (scope = 'both'): ingredient_attribute, skin_effect, product_label
// (FILTRES_*), shared_label (COMEDOGENE/NON_COMEDOGENE), concern, skin_type.

import { dentalTagMap } from '../ingredients/dental/ingredient-tags'
import { haircareTagMap } from '../ingredients/haircare/ingredient-tags'
import { skincareTagMap } from '../ingredients/skincare/ingredient-tags'
import { supplementTagMap } from '../ingredients/supplements/ingredient-tags'

export interface IngredientAssociation {
  /** Primary tags: the active's major proven benefits */
  primary: string[]
  // Comedogenicity (`comedogene` / `non-comedogene`) is a molecular fact, so it
  // goes here, never in avoid. The clinical contraindication is expressed
  // separately as `avoid: [peau-grasse, anti-acne]` on the ingredient.
  /** Secondary tags: supporting benefits or specific targets */
  secondary: string[]
  // Only skin_type or concern slugs, never an attribute/label/product_type.
  // Exception tolerated by the test: `grossesse-compatible` (scope=product)
  // means "contraindicated during pregnancy".
  /** Exclusion tags: skin types or conditions where the active is not advised */
  avoid: string[]
}

export type IngredientTagMap = Record<string, IngredientAssociation>

export const ingredientTagMap: IngredientTagMap = {
  ...dentalTagMap,
  ...haircareTagMap,
  ...skincareTagMap,
  ...supplementTagMap,
}
