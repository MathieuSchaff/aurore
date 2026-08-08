import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { resolveIngredients } from '../../lib/ingredient-resolver'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Absorbent / mattifying powders. Replaces the algo-derm `matifiant` mapping, whose
// `computed_score` rule conflated the slug with `peau-grasse` set membership (identical
// products, different semantics); that algo-derm candidate is now dropped as `unmapped`.

const ABSORBENT_PATTERNS = [
  'silica',
  'kaolin',
  'perlite',
  'talc', // legacy makeup/skincare hybrids; asbestos-free safety status is a brand-level concern
  'corn starch',
  'zea mays starch',
  'oryza sativa starch',
  'rice starch',
  'tapioca starch',
  'maranta arundinacea',
  'aluminum starch',
  'starch', // catch-all for the *starch suffix; comes last so specifics rank first
]

// Functional only in top 8: past that, powders are texture polish without enough
// mass to absorb sebum.
const ABSORBENT_POSITION_CAP = 8

export function detectFiniMat(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const cap = Math.min(ingredients.length, ABSORBENT_POSITION_CAP)

  for (let i = 0; i < cap; i++) {
    if (ABSORBENT_PATTERNS.some((p) => ingredients[i].includes(p))) {
      // Same trigger, two axes: fini-mat is sensoriel, matifiant is skin_effect.
      return [S.FINI_MAT, S.MATIFIANT]
    }
  }
  return []
}
