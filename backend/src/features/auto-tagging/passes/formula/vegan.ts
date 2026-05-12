import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@habit-tracker/shared'

import { resolveIngredients } from '../../lib/ingredient-resolver'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// ─── Vegan ───────────────────────────────────────────────────────────────────
// Precision-first absence tag: emit `vegan` only when *no* known animal-derived
// INCI pattern is present and the INCI has enough ingredients to make the
// claim credible (≥ 5).
//
// Patterns intentionally generous on false negatives — better skip emitting
// vegan than to emit it on a product containing snail mucin. Brand-level
// vegan certifications (Vegan Society, PETA Beauty Without Bunnies) belong
// to a separate non-INCI source (T4 roadmap) and override this heuristic.
//
// Lactose / yogurt-derived ingredients are flagged: lactose is dairy. Note
// that this disagrees with `prebiotique` detection (lactose is also a
// prebiotic) — both tags are valid simultaneously and orthogonal.

const ANIMAL_PATTERNS = [
  // Beeswax / honey / propolis
  'lanolin',
  'cera alba',
  'beeswax',
  'mel ', // honey INCI; trailing space avoids 'melatonin'/'mel-' false positives
  'mel,', // edge: end-of-list separator
  'honey',
  'propolis',
  'royal jelly',
  // Insect / mollusk
  'snail',
  'helix aspersa',
  'cochlea',
  'carmine',
  'ci 75470',
  'ci75470',
  'cochineal',
  'shellac',
  // Mother-of-pearl / mollusk shell — `pearl ` covers `pearl powder`, `pearl extract`,
  // `pearl protein`, `hydrolyzed pearl`. Trailing space avoids matching ingredients
  // like `pearled barley` (none in cosmetics) and excludes the bare word `pearl` as
  // a marketing term (only INCI tokens with `pearl ` prefix the actual ingredient).
  'pearl ',
  // Silk / sericin (silkworm cocoons)
  'silk',
  'sericin',
  // Animal proteins / enzymes
  'collagen',
  'elastin',
  'keratin',
  'lactoferrin',
  'lactoperoxidase', // milk enzyme — distinct from `lactose` / `casein` already covered
  // Dairy
  'milk',
  'lait',
  'lactose',
  'casein',
  'whey',
  'yogurt',
  // Other animal
  'placenta',
  'placental',
  'caviar',
  'tallow',
  'guanine',
  // Animal-derived squalene (vs plant-derived squalane — different INCI; squalane is fine)
  'squalene', // shark liver oil — distinct from 'squalane' (the plant-derived saturated form)
]

export const VEGAN_MIN_INGREDIENTS = 5

export function detectVegan(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length < VEGAN_MIN_INGREDIENTS) return []

  // Append a trailing space so 'mel ' substring works on tokens that aren't
  // followed by other characters in the source string.
  for (const ing of ingredients) {
    const padded = `${ing} `
    for (const p of ANIMAL_PATTERNS) {
      if (padded.includes(p)) return []
    }
  }

  return [S.VEGAN]
}
