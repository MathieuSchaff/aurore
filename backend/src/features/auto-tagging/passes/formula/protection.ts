import type { ProductKind } from '@aurore/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Recall recovery for the `protection` concern (re-emits an algo-derm slug, ADR-0004).
// The algo-derm pass keys on antioxidant INCI and tagged only ~25/399 sunscreens; it both
// tags antioxidant serums wrongly and misses real UV protection. Kinds used after exposure
// (after-sun, self-tanner) stay absent without a stated SPF: they are not `sunscreen`
// (worksheet rule E).

// SPF/FPS/IP index + "indice (de) protection", tolerating common separators.
// Matches: `SPF 50`, `SPF-50`, `spf.30`, `IP50`, `FPS30`, `indice de protection`.
const SPF_CLAIM_RE = /\b(spf|fps|ip)[\s:.-]*\d|\bindice\s+(?:de\s+)?protection\b/i

export function detectProtection(
  kind: ProductKind,
  name: string | null | undefined,
  description: string | null | undefined
): SkincareProductTagSlug[] {
  // A sunscreen protects from UV by definition.
  if (kind === 'sunscreen') return [S.PROTECTION]
  // Any stated index protects physically, so tinted/day creams/makeup with SPF count
  // (worksheet rule D).
  if (SPF_CLAIM_RE.test(name ?? '') || SPF_CLAIM_RE.test(description ?? '')) return [S.PROTECTION]
  return []
}
