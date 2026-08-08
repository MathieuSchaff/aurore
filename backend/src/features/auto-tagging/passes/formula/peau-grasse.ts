import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `peau-grasse` (re-emits an algo-derm slug, ADR-0004).
// algo-derm's benefit-axis confidence fires this skin-type tag too broadly: it and its
// opposite peau-seche both hit about half the catalogue, and there is no gold set for
// skin-type tags to tune against. Gate on the explicit marketed-for phrase in the NAME
// only. The oily-skin function stays covered by pores-sebum / sebo-regulateur.
export const PEAU_GRASSE_POSITION_RE = /peaux? grasses?\b|oily skin|for oily|mixtes? (a|à) grasse/i

export function detectPeauGrasseFromName(
  name: string | null | undefined,
  _description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, undefined, PEAU_GRASSE_POSITION_RE) ? [S.PEAU_GRASSE] : []
}
