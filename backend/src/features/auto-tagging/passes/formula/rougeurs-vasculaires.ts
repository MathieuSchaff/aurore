import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `rougeurs-vasculaires` (re-emits an algo-derm slug, ADR-0004).
// algo-derm keys on ubiquitous soothing actives, firing on foot creams, toners, deodorant.
// The redness *positioning* lives in name/description, which algo-derm never sees: this
// pass emits only when the product names a redness condition in its lead window (name or
// first description sentence) and is not color-correcting makeup.

// The lead restriction kills the dominant FP class: cica/soothing products whose
// description lists redness as one incidental benefit (gold-set P=0.550 without it).
// Verbose leads opening on "apaise irritations et rougeurs" stay accepted as lead.
export const REDNESS_POSITION_RE = /rougeur|rosac|couperos|\bflush|redness/i

// Color-correcting / camouflage makeup (green primers, CC creams, tone-up) neutralizes
// redness optically rather than treating it. `teinté`/`correcteur` are deliberately
// absent: those words also name real tinted care products that treat redness, not camouflage.
// `estompe` is absent too: "les rougeurs s'estompent" describes a treatment outcome,
// not camouflage.
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
