import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `anti-age` (re-emits an algo-derm slug, ADR-0004).
// algo-derm fires on anti-age actives everywhere regardless of positioning, so this keys
// on marketing vocabulary instead: retinoid family, bakuchiol (retinol alternative), and
// anti-âge/anti-rides/wrinkle claims. `\baging\b` avoids matching "packaging".
export const ANTI_AGE_POSITION_RE =
  /anti.?[âa]ge|anti.?ride|r[eé]tin(o|al)|bakuchiol|wrinkle|\baging\b|ridule/i

export function detectAntiAgeFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, ANTI_AGE_POSITION_RE) ? [S.ANTI_AGE] : []
}
