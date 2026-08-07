import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { BARRIERE_EXCLUSION_RE, BARRIERE_POSITION_RE } from './barriere-cutanee'
import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `reparateur` (re-emits an algo-derm slug, ADR-0004).
// algo-derm fires `reparateur` on the same barrierSupport signal as `barriere-cutanee`
// (it marks them equivalent), so this reuses the barriere-cutanee positioning regex
// instead of a parallel copy that could drift. Both slugs fire on the same products
// by design; the consumer dedups downstream.
export function detectReparateurFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, BARRIERE_POSITION_RE, BARRIERE_EXCLUSION_RE)
    ? [S.REPARATEUR]
    : []
}
