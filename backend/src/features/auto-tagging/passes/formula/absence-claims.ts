import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { refuterFor } from '../../lib/absence-refuters'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Name/description override for absence labels: short/scraped INCI can miss the algo-derm
// coverage >= 0.7 gate even when the brand explicitly claims the absence. Regulatory pressure
// makes "sans parfum"/"fragrance-free" reliable in the name/description, so a strict literal
// match keeps false positives near zero. Scoped to SANS_PARFUM: other absences have
// <15 name-claim occurrences in the corpus, extend here if the gap widens.

// An absence tag reads as a proven absence, so a marketing claim must never outrank the
// formula. What disproves each claim lives in ABSENCE_REFUTERS; `refuterFor` throws on a
// tag with none, a claim cannot be added without stating what refutes it. When the stored
// INCI itself is wrong, the veto drops a true claim on purpose: withholding a tag is
// invisible, asserting a false absence is a lie the user reads.
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
