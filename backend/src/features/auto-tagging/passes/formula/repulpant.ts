import type { ProductKind } from '@aurore/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { resolveIngredients } from '../../lib/ingredient-resolver'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Plumping claim: hydrate-fill-smooth lines. Replaces algo-derm `repulpant` mapping
// (fired on 78% of corpus: any HA/glycerin moisturizer); that algo-derm candidate has
// no TAG_CONFIG entry and is dropped as `unmapped`. Emission needs all three signals
// below present together.

// Any hyaluronate variant (substring `hyaluron`) in top 8 INCI. Plumping peptide serums
// dose the peptide as headline actif (pos 3-6) and HA as supporting humectant (pos 5-8);
// past pos 8, HA is texture polish trace.
const REPULPANT_HA_PATTERN = 'hyaluron'
const REPULPANT_HA_POSITION_CAP = 8
// Pure glycerin (exact token, not `glyceryl stearate` or other esters) in top 5,
// confirming the humectant base behind HA.
const REPULPANT_GLYCERIN_TOKEN = 'glycerin'
const REPULPANT_GLYCERIN_POSITION_CAP = 5
// At least one canonical plumping peptide anywhere in INCI: `acetyl hexapeptide-8`
// (Argireline, neuromodulator) or `palmitoyl tripeptide-1` (collagen signaling). Both
// are dosed mg-range and sit deep in INCI; presence alone signals formulary intent
// (clinical INCI declarations require a minimum 0.001% dose).
const REPULPANT_PEPTIDE_PATTERNS = ['acetyl hexapeptide-8', 'palmitoyl tripeptide-1']

// Leave-on only.
const REPULPANT_RINSE_OFF_KINDS = new Set<ProductKind>([
  'cleanser',
  'shampoo',
  'conditioner',
  'body-wash',
  'body-scrub',
  'mouthwash',
])

export function detectRepulpant(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (REPULPANT_RINSE_OFF_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  const haCap = Math.min(ingredients.length, REPULPANT_HA_POSITION_CAP)
  let haFound = false
  for (let i = 0; i < haCap; i++) {
    if (ingredients[i].includes(REPULPANT_HA_PATTERN)) {
      haFound = true
      break
    }
  }
  if (!haFound) return []

  const glyCap = Math.min(ingredients.length, REPULPANT_GLYCERIN_POSITION_CAP)
  let hasGlycerin = false
  for (let i = 0; i < glyCap; i++) {
    if (ingredients[i] === REPULPANT_GLYCERIN_TOKEN) {
      hasGlycerin = true
      break
    }
  }
  if (!hasGlycerin) return []

  const hasPeptide = ingredients.some((ing) =>
    REPULPANT_PEPTIDE_PATTERNS.some((p) => ing.includes(p))
  )
  if (!hasPeptide) return []

  return [S.REPULPANT]
}
