import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `anti-oxydant` (re-emits an algo-derm slug, ADR-0004).
// algo-derm fires on antioxidant actives present in nearly every emulsion regardless of
// positioning, so the claim must live in the name: explicit anti-oxydant/antioxidant word
// plus unambiguous heroes (ferulic, resveratrol, idebenone, CoQ10, ergothioneine, polyphenols).
// Not keyed on vitamin C (belongs to anti-age/eclat) or vitamin E (ubiquitous stabilizer).
export const ANTI_OXYDANT_POSITION_RE =
  /anti[-\s]?oxyd|antioxid|f[eé]rulique|ferulic|resv[eé]ratrol|id[eé]b[eé]none|ubiquinone|coenzyme\s?q.?10|\bq10\b|ergothion[eé]ine|polyph[eé]nol/i

export function detectAntiOxydantFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, ANTI_OXYDANT_POSITION_RE) ? [S.ANTI_OXYDANT] : []
}
