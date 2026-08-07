import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `peau-seche` (re-emits an algo-derm slug, ADR-0004).
// Same story as peau-grasse: algo-derm's benefit-axis confidence fires this
// skin-type tag far too often with no gold set to tune against, so gate on the explicit dry-skin
// phrase in the NAME only. The `\b` anchor keeps verb forms (sécher/dessécher/assécher)
// out; the dryness/hydration function stays covered by deshydratation.
export const PEAU_SECHE_POSITION_RE = /peaux? s[eè]ches?\b|dry skin|for dry/i

export function detectPeauSecheFromName(
  name: string | null | undefined,
  _description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, undefined, PEAU_SECHE_POSITION_RE) ? [S.PEAU_SECHE] : []
}
