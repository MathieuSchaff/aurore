import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { refuterFor } from '../../lib/absence-refuters'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Name/description override for absence labels. Products with short/scraped INCI
// miss the algo-derm coverage >= 0.7 gate even when the brand explicitly claims
// the absence. Regulatory pressure makes "sans parfum"/"fragrance-free" reliable
// in product name/description; strict literal match keeps FP near zero.
//
// Scoped to SANS_PARFUM: other absences have <15 name-claim occurrences in the
// corpus. Extend here if the gap widens.

// An absence tag is displayed as a proven absence, so a marketing claim must never outrank the
// formula. What disproves each claim lives in ABSENCE_REFUTERS, and `refuterFor` throws on a
// tag that has none: a claim cannot be added without first stating what refutes it. Asymmetry
// is deliberate. Where the stored INCI is itself wrong (prose, crosstalk), the veto drops a
// true claim, and that is the safe direction: withholding a tag is invisible, asserting a false
// absence is a lie the user reads.
interface AbsenceClaim {
  readonly tag: SkincareProductTagSlug
  readonly claim: RegExp
}

const ABSENCE_CLAIMS: readonly AbsenceClaim[] = [
  {
    tag: S.SANS_PARFUM,
    claim: /sans[\s-]+parfum|fragrance[\s-]*free|parfum[\s-]*free/,
  },
]

const CLAIM_RULES = ABSENCE_CLAIMS.map(({ tag, claim }) => ({
  tag,
  claim,
  refutedBy: refuterFor(tag),
}))

export function detectAbsenceClaimsFromText(
  name: string | null | undefined,
  description: string | null | undefined,
  inci: string | null | undefined
): SkincareProductTagSlug[] {
  const blob = `${name ?? ''} ${description ?? ''}`.toLowerCase()
  if (!blob.trim()) return []
  const out: SkincareProductTagSlug[] = []
  for (const { tag, claim, refutedBy } of CLAIM_RULES) {
    if (claim.test(blob) && !refutedBy(inci)) out.push(tag)
  }
  return out
}
