import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import { matchesNamePositioning } from './name-positioning'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Positioning gate for `pores-sebum` (re-emits an algo-derm slug, ADR-0004).
// algo-derm fires on sebum-control actives (niacinamide, salicylic acid, zinc) regardless
// of positioning, so a brightening or hydrating product containing one gets tagged too.
// Gate requires the pore/sebum lexical field in name/claim. Unlike rougeurs, no exclusion
// regex here: candidate tokens also match real pores-sebum products, so excluding them would cost recall.
export const PORES_SEBUM_POSITION_RE =
  /\bpor[eo]s?\b|s[eé]b(um|[uo]m|orr)|matif|brillan[ct]|\bblackhead|\bpoints?\s+noirs?\b|oil[\s-]control|\bpeau[sx]?\s+grasse\b|grain\s+de\s+peau|\bargile\b|\bcom[eé]don|mixtes?\s+[aà]\s+grasse|nettoyant\b.{0,30}r[eé]gulat|r[eé]gulat\w*.{0,30}nettoyant/i

export function detectPoresSebumFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, PORES_SEBUM_POSITION_RE) ? [S.PORES_SEBUM] : []
}

// `sebo-regulateur` (skin_effect) is the effect twin of `pores-sebum` (concern): same
// sebum lexical field, so it shares PORES_SEBUM_POSITION_RE. algo-derm fired it with no
// positioning gate at all, so it stuck to any product with a sebum-control active
// (sunscreens, oils, `anti-age` creams). Gate it here like every sibling tag.
export function detectSeboRegulateurFromName(
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  return matchesNamePositioning(name, description, PORES_SEBUM_POSITION_RE)
    ? [S.SEBO_REGULATEUR]
    : []
}
