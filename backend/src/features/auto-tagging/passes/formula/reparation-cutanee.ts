import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `reparation-cutanee` (repair concern for lesions and after a procedure).
// Was an INCI top-12 detector on ubiquitous soothing actives (panthenol ~24%, allantoin
// ~17%, centella) and fired too broadly. A concern reports marketed positioning, not
// actant presence (ADR-0004).

// The gold set forks near-identical products on the *lead* claim: barrier-repair goes to
// barriere-cutanee, cica/soothing lead goes to apaisant, cell-renewal goes to anti-age,
// so a bare repair/réparateur/snail token floods FP (P=0.125).

// Gate keys only on lesion-repair lead: the named FR pharmacy cica lines (Cicalfate/
// Cicaplast/Cicabiafine/Cicaderma), the `cicatris` root, and skin-damage words
// (gerçures/crevasses/escarres). 1 FN: a snail repair cream with no lesion word stays
// uncaught. Bare repair/snail/"peaux abîmées" stay out on purpose: each brings back
// the fork FP the gold set excludes.
export const REPARATION_POSITION_RE =
  /cicatris|cicalfate|cicaplast|cicabiafine|cicaderma|\bgerç|\bgerc|crevass|escarre/i

// Distinct domains where the lesion-repair tokens above are incidental, not the lead:
// dry-feet xérose ("pieds secs", a Cicabiafine SKU that isn't about repair) and after-sun ("cicatris"
// incidental). `lèvres` is NOT excluded: cutting it would kill the atrix hand-repair TP,
// leaving 1 residual FP (incidental "gerçures" in a lip-SPF stick) uncut on purpose.
export const REPARATION_EXCLUSION_RE = /pieds\s+secs|apr[èe]s[- ]?soleil|after[- ]?sun/i

export function detectReparationCutaneeFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, REPARATION_POSITION_RE, REPARATION_EXCLUSION_RE)
    ? [S.REPARATION]
    : []
}
