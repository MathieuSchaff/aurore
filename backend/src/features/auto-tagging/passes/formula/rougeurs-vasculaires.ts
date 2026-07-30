import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `rougeurs-vasculaires` (re-emits an algo-derm slug, ADR-0004).
// algo-derm keys on ubiquitous soothing actives (allantoin/panthenol in the top, or
// any soothing + low-irritation product), so it fires the vascular-redness concern
// on foot creams, toners, deodorant. The redness
// *positioning* lives in the product name/description, which algo-derm never sees.
// This pass emits only when the product names a redness condition in its lead
// window (name or first description sentence) and is not color-correcting makeup.
// The lead restriction kills the dominant FP class: cica/soothing products whose
// description lists redness as one incidental benefit (gold-set P=0.550 without
// it). Verbose leads that open on "apaise irritations et rougeurs" remain the
// accepted incidental-vs-lead boundary.
export const REDNESS_POSITION_RE = /rougeur|rosac|couperos|\bflush|redness/i

// Color-correcting / camouflage makeup (green primers, CC creams, tone-up) neutralizes
// redness optically rather than targeting the concern. Tokens are recall-safe: each
// appears in 0 gold-positive products. Deliberately absent: `teinté`/`correcteur`
// (real tinted anti-redness care: Sensifine AR, Roséliane, Rosaliac AR) and `estompe`
// ("les rougeurs s'estompent" = redness fades, a treatment outcome, as in Clinique
// Redness Solutions). A green primer still matches via `primer`/`vert`.
export const CAMOUFLAGE_RE =
  /color.?correct|correcteur de couleur|camoufl|primer|\bvert\b|tone.?up|\bcc\b/i

export function detectRougeursVasculairesFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, REDNESS_POSITION_RE, CAMOUFLAGE_RE, {
    leadWindowOnly: true,
  })
    ? [S.ROUGEURS_VASCULAIRES]
    : []
}
