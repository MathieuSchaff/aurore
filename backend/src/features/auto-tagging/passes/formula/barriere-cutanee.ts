import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `barriere-cutanee` (re-emits an algo-derm slug, ADR-0004).
// algo-derm fires on ubiquitous barrier actives regardless of context, so this keys on
// name/claim: réparateur/réparatrice (French dermo product-category term) or explicit
// barrier/barrière combinations. Distinct from reparation-cutanee (wound/post-procedure).
// Exported: `reparateur` re-emits off this same regex to avoid a drifting copy.
export const BARRIERE_POSITION_RE =
  /r[eé]par[ae]teur|r[eé]par[ae]trice|barri[eè]re.{1,15}(isolante|soin|cr[eè]me)|cr[eè]me.{1,15}barri[eè]re|skin barrier|moisture barrier|barrier cream|barrier soothing|barrier repair|barrier.{1,10}serum|barrier.{1,10}essence|\brepair\b/i

// Acne lines (effaclar, dermopure), keratolytic body care and `anti-age` "repair"
// (cell-turnover, not barrier) reuse "réparateur"/"repair". Each token verified
// recall-safe (0 gold-positive hits).
export const BARRIERE_EXCLUSION_RE =
  /effaclar|k[eé]ratolytique|anti[- ]?rid|anti[- ]?[aâ]ge|antiaging|dermopure/i

export function detectBarriereCutaneeFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, BARRIERE_POSITION_RE, BARRIERE_EXCLUSION_RE)
    ? [S.BARRIERE_CUTANEE]
    : []
}
