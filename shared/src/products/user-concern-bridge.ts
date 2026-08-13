import type { SkinConcern } from '../profile'
import { SKINCARE_PRODUCT_TAG_SLUGS } from './skincare/tag-slugs'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// User concern slugs (SKIN_CONCERNS) and product tag concern slugs evolved
// separately and don't share vocab. This table is the only place the drift
// is documented; every other layer goes through `resolveAvoidSlugs`. Some
// user concerns (rosacee/couperose/flushs) share one generic product tag on
// purpose, to avoid retagging without per-product clinical data.
export const USER_CONCERN_TO_PRODUCT_TAGS: Record<SkinConcern, readonly string[]> = {
  // identities: user slug = product slug
  'barriere-cutanee': [S.BARRIERE_CUTANEE],
  'anti-age': [S.ANTI_AGE],
  'cernes-poches': [S.CERNES_POCHES],
  deshydratation: [S.DESHYDRATATION],
  hyperpigmentation: [S.HYPERPIGMENTATION],
  'keratose-pilaire': [S.KERATOSE_PILAIRE],
  // 1:1 renames from user lay term to product clinical term
  'anti-acne': [S.ACNE_IMPERFECTIONS],
  'anti-taches': [S.HYPERPIGMENTATION],
  cicatrisation: [S.REPARATION],
  eclat: [S.ECLAT_TEINT],
  'teint-terne': [S.ECLAT_TEINT],
  eczema: [S.ECZEMA_ATOPIE],
  // N→1: 4 user nuances map to 1 generic product tag
  'anti-rougeurs': [S.ROUGEURS_VASCULAIRES],
  rosacee: [S.ROUGEURS_VASCULAIRES],
  couperose: [S.ROUGEURS_VASCULAIRES],
  flushs: [S.ROUGEURS_VASCULAIRES],
  // N→1 again: two user terms collapse onto pores-sebum
  'pores-dilates': [S.PORES_SEBUM],
  brillance: [S.PORES_SEBUM],
  // 1→N, but only for post-acne. The three below map to a single tag each, and
  // photo-vieillissement/repulpant are one more N→1, onto anti-age.
  'post-acne': [S.ACNE_IMPERFECTIONS, S.REPARATION],
  'photo-vieillissement': [S.ANTI_AGE],
  repulpant: [S.ANTI_AGE],
  'grain-peau': [S.PORES_SEBUM],
}

// Caller passes the raw portrait slugs (skin types + skin concerns mixed).
// Skin type slugs (peau-seche, etc.) match product tag slugs 1:1, so they fall
// through unchanged. Concerns are remapped. Result is deduped so SQL inArray stays tight.
export function resolveAvoidSlugs(rawSlugs: readonly string[]): string[] {
  const out = new Set<string>()
  for (const slug of rawSlugs) {
    const mapped = USER_CONCERN_TO_PRODUCT_TAGS[slug as SkinConcern]
    if (mapped) {
      for (const target of mapped) out.add(target)
    } else {
      out.add(slug)
    }
  }
  return Array.from(out)
}
