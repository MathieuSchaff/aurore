import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `keratose-pilaire` (ADR-0004: report positioning, not actant
// presence). Not an INCI detector: urea is shared by xerosis/callus/psoriasis lotions
// not positioned for KP. Gate keys on products naming KP (clinical FR/EN term, or lay
// "chicken skin"/"peau de poulet"/"body bumps"). No kind gate: named on body and face alike.
export const KERATOSE_PILAIRE_POSITION_RE =
  /k[ée]ratose\s+(?:pilaire|folliculaire)|keratosis\s+pilaris|follicular\s+keratosis|peau\s+de\s+poulet|chicken\s+skin|\bbody\s+bumps?\b|\bbumpy\s+skin\b/i

export function detectKeratosePilaireFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, KERATOSE_PILAIRE_POSITION_RE)
    ? [S.KERATOSE_PILAIRE]
    : []
}
