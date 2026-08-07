import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `acne-imperfections` (re-emits an algo-derm slug, ADR-0004).
// algo-derm keys on sebum/exfoliating actives (salicylic acid, zinc, niacinamide)
// regardless of positioning; the gate requires the acne/blemish lexical field in the
// name/claim. Pore/sebum FN (purifiant, désobstrue les pores) have no acne positioning
// and stay covered by the separate pores-sebum gate, not lost.
export const ACNE_POSITION_RE = /acn[eé]|\bimperfections?\b|blemish|\bboutons?\b|com[eé]don/i

// Brightening / vitamin-C products use "blemish" for pigment spots (not acne), and
// "acné fongique" appears as a safety qualifier, not a target. Both tokens verified
// recall-safe (0 gold-positive hits).
export const ACNE_EXCLUSION_RE = /fongi|[eé]clair/i

export function detectAcneImperfectionsFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, ACNE_POSITION_RE, ACNE_EXCLUSION_RE)
    ? [S.ACNE_IMPERFECTIONS]
    : []
}
