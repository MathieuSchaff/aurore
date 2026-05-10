// Kind-based product tag detection for skincare, solaire, and bodycare products.
//
// Derives TYPE_*, ZONE_*, STEP_*, MOMENT_*, and TEXTURE_* tags purely from the
// `kind` field — no INCI needed. Used by `runners/backfill-auto-tags.ts` and
// `runners/seed-core.ts` (TODO: wire into seed-core).

import type { ProductKind } from '@habit-tracker/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@habit-tracker/shared'

const S = SKINCARE_PRODUCT_TAG_SLUGS

const KIND_TO_TAGS: Partial<Record<ProductKind, SkincareProductTagSlug[]>> = {
  // ── Face skincare ────────────────────────────────────────────────────
  serum: [S.TYPE_SERUM, S.STEP_TRAITEMENT, S.ZONE_VISAGE],
  moisturizer: [S.TYPE_HYDRATANT, S.STEP_HYDRATATION, S.ZONE_VISAGE],
  cleanser: [S.TYPE_NETTOYANT, S.STEP_NETTOYAGE_2, S.ZONE_VISAGE],
  toner: [S.TYPE_TONER, S.STEP_PREPARATION, S.ZONE_VISAGE, S.TEXTURE_EAU],
  exfoliant: [S.TYPE_EXFOLIATION, S.STEP_TRAITEMENT, S.ZONE_VISAGE],
  'eye-cream': [S.TYPE_TRAITEMENT, S.ZONE_YEUX],
  mask: [S.TYPE_MASQUE, S.MOMENT_HEBDOMADAIRE, S.ZONE_VISAGE],
  mist: [S.TYPE_MIST, S.STEP_PREPARATION, S.ZONE_VISAGE, S.TEXTURE_EAU],
  essence: [S.TYPE_TONER, S.STEP_PREPARATION, S.ZONE_VISAGE],
  'spot-treatment': [S.TYPE_TRAITEMENT, S.MOMENT_USAGE_LOCALISE, S.ZONE_VISAGE],
  'lip-care': [S.TYPE_TRAITEMENT, S.ZONE_LEVRES],
  // texture-riche removed: kind=balm alone is not enough — silicone/glycerin
  // balms (e.g. cica balms) have a cream-like feel. Defer to detectTextureRiche
  // (≥ 2 butter/wax top 8 INCI signal) so true heavy balms still tag.
  balm: [S.TYPE_HYDRATANT, S.TEXTURE_BAUME],
  oil: [S.TYPE_SERUM, S.TEXTURE_HUILE, S.STEP_HYDRATATION, S.ZONE_VISAGE],
  primer: [S.TYPE_PRIMER, S.MOMENT_MATIN, S.ZONE_VISAGE],
  patch: [S.TYPE_MASQUE, S.TEXTURE_PATCH],
  // ── Solaire ──────────────────────────────────────────────────────────
  sunscreen: [S.TYPE_SOLAIRE, S.STEP_PROTECTION_SOLAIRE, S.MOMENT_MATIN, S.ZONE_VISAGE],
  'after-sun': [S.TYPE_HYDRATANT, S.ZONE_CORPS],
  'self-tanner': [S.TYPE_SOLAIRE, S.ZONE_CORPS],
  // ── Bodycare ─────────────────────────────────────────────────────────
  'body-lotion': [S.TYPE_HYDRATANT, S.TEXTURE_LAIT, S.ZONE_CORPS],
  'body-oil': [S.TYPE_HYDRATANT, S.TEXTURE_HUILE, S.ZONE_CORPS],
  'body-scrub': [S.TYPE_EXFOLIATION, S.STEP_TRAITEMENT, S.ZONE_CORPS],
  'body-wash': [S.TYPE_NETTOYANT, S.ZONE_CORPS],
  deodorant: [S.TYPE_DEODORANT],
  'hand-cream': [S.TYPE_HYDRATANT, S.TEXTURE_CREME, S.ZONE_MAINS],
  'foot-cream': [S.TYPE_HYDRATANT, S.ZONE_PIEDS],
}

export function detectKindTags(kind: ProductKind): SkincareProductTagSlug[] {
  return KIND_TO_TAGS[kind] ?? []
}
