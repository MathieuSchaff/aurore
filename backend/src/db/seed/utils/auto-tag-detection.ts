// INCI-derived auto-tag detection for skincare products via algo-derm.
//
// Single source of truth for the per-tag policy used by:
//   - `runners/seed-core.ts` (initial seed)
//   - `runners/audit-auto-tags.ts` (dry-run report)
//   - `runners/backfill-auto-tags.ts` (TODO — post-snapshot rehydrate)
//
// `tagProduct` from algo-derm emits 36 candidate tags (cf docs2/tags/AUTO-TAGS.md
// §3). We keep only the 19 that survived dry-run + spot-check calibration
// (snapshot 2026-05-07, N=1853 products with INCI). The 8 dropped tags either
// fire on > 50 % of corpus (`sans-savon`, `grossesse-compatible`, …) or
// conflate semantically distinct concepts (`matifiant` ≡ `peau-grasse` set
// but means visual finish, not chemistry — §7.6).

import type { ProductKind } from '@habit-tracker/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@habit-tracker/shared'

import { analyzeINCI, splitINCI, tagProduct } from 'algo-derm'

import { mapKindToContext, RINSE_OFF_KINDS } from '../../../features/dermo-score/profile-mapping'

const S = SKINCARE_PRODUCT_TAG_SLUGS

export type TagRule = {
  auroreSlug: SkincareProductTagSlug
  minConf: number
  allow: boolean
  // Algo-derm `tagProduct` ignores `context.leaveOn` on the comedogenicity axis
  // (rule = risk threshold + keyword match). 29 % of `comedogene` hits fire on
  // rinse-off products in the dry-run — filter at the wrapper level.
  excludeRinseOff?: boolean
}

// Calibration sources (see docs2/tags/AUTO-TAGS.md):
//   §7.2 — bucket 🟢 (allow @ 0.50, agree ≥ 36 %)
//   §7.4 — bucket 🟠/🔴 (allow:false, structurally noisy)
//   §7.6 — spot-check (allow @ 0.85 + excludeRinseOff for comedogenicity;
//                       matifiant dropped despite small set size — semantic mismatch)
export const TAG_CONFIG: Readonly<Record<string, TagRule>> = {
  // ── Concerns ───────────────────────────────────────────────────────
  'acne-imperfections': { auroreSlug: S.ACNE_IMPERFECTIONS, minConf: 0.5, allow: true },
  'rougeurs-vasculaires': { auroreSlug: S.ROUGEURS_VASCULAIRES, minConf: 0.5, allow: true },
  'barriere-cutanee': { auroreSlug: S.BARRIERE_CUTANEE, minConf: 0.5, allow: true },
  hyperpigmentation: { auroreSlug: S.HYPERPIGMENTATION, minConf: 0.5, allow: true },
  'eclat-teint-uniforme': { auroreSlug: S.ECLAT_TEINT, minConf: 0.5, allow: true },
  'anti-age': { auroreSlug: S.ANTI_AGE, minConf: 0.5, allow: true },
  'pores-sebum': { auroreSlug: S.PORES_SEBUM, minConf: 0.5, allow: true },
  protection: { auroreSlug: S.PROTECTION, minConf: 0.5, allow: true },
  // 78 % corpus tagged at 0.5 — bucket 🟠
  deshydratation: { auroreSlug: S.DESHYDRATATION, minConf: 1.0, allow: false },
  // Algo `peaux_atopiques` mapped to Aurore `eczema-atopie` — 22 % corpus, 3 % agree
  peaux_atopiques: { auroreSlug: S.ECZEMA_ATOPIE, minConf: 1.0, allow: false },

  // ── Skin effects ───────────────────────────────────────────────────
  apaisant: { auroreSlug: S.APAISANT, minConf: 0.5, allow: true },
  'sebo-regulateur': { auroreSlug: S.SEBO_REGULATEUR, minConf: 0.5, allow: true },
  'anti-oxydant': { auroreSlug: S.ANTI_OXYDANT, minConf: 0.5, allow: true },
  reparateur: { auroreSlug: S.REPARATEUR, minConf: 0.5, allow: true },
  purifiant: { auroreSlug: S.PURIFIANT, minConf: 0.5, allow: true },
  keratolytique: { auroreSlug: S.KERATOLYTIQUE, minConf: 0.5, allow: true },
  // §7.6 — identical product set to peau-grasse, but means visual finish
  matifiant: { auroreSlug: S.MATIFIANT, minConf: 1.0, allow: false },
  // 78 % corpus — fires on any HA/glycerin moisturizer
  repulpant: { auroreSlug: S.REPULPANT, minConf: 1.0, allow: false },

  // ── Skin types (peau-mixte excluded — too noisy on neutral hydrators) ─
  'peau-sensible': { auroreSlug: S.PEAU_SENSIBLE, minConf: 0.5, allow: true },
  'peau-grasse': { auroreSlug: S.PEAU_GRASSE, minConf: 0.85, allow: true },
  'peau-seche': { auroreSlug: S.PEAU_SECHE, minConf: 0.85, allow: true },

  // ── Product characteristic — all bucket 🔴 (absence-of-X has no gradient) ─
  sans_parfum: { auroreSlug: S.SANS_PARFUM, minConf: 1.0, allow: false },
  sans_savon: { auroreSlug: S.SANS_SAVON, minConf: 1.0, allow: false },
  hypoallergenique: { auroreSlug: S.HYPOALLERGENIQUE, minConf: 1.0, allow: false },
  'grossesse-compatible': { auroreSlug: S.GROSSESSE_COMPATIBLE, minConf: 1.0, allow: false },

  // ── Comedogenicity (leave-on only — §7.6) ──────────────────────────
  comedogene: { auroreSlug: S.COMEDOGENE, minConf: 0.85, allow: true, excludeRinseOff: true },
  'non-comedogene': {
    auroreSlug: S.NON_COMEDOGENE,
    minConf: 0.85,
    allow: true,
    excludeRinseOff: true,
  },
}

export interface DetectedAutoTag {
  slug: SkincareProductTagSlug
  relevance: 'secondary'
  confidence: number
  source: 'detected_absence' | 'computed_score'
}

export interface DetectAutoTagsOptions {
  // Override `minConf` floor globally (debug). Per-tag minConf is raised
  // to this value if higher; never lowered.
  confOverride?: number
  // Surface tags with `allow: false` (debug — should never be true at seed).
  includeDropped?: boolean
}

export function detectAutoTags(
  inci: string | null | undefined,
  kind: ProductKind,
  options: DetectAutoTagsOptions = {}
): DetectedAutoTag[] {
  if (!inci?.trim()) return []

  const ingredients = splitINCI(inci)
  if (ingredients.length === 0) return []

  const assessment = analyzeINCI(inci, { context: mapKindToContext(kind) })
  const candidates = tagProduct(assessment, ingredients)
  const isRinseOff = RINSE_OFF_KINDS.has(kind)

  const results: DetectedAutoTag[] = []
  for (const candidate of candidates) {
    if (!candidate.present) continue
    const rule = TAG_CONFIG[candidate.id]
    if (!rule) continue
    if (!rule.allow && !options.includeDropped) continue

    const minConf =
      options.confOverride !== undefined
        ? Math.max(rule.minConf, options.confOverride)
        : rule.minConf
    if (candidate.confidence < minConf) continue

    if (rule.excludeRinseOff && isRinseOff) continue

    // Skip declaration-only allergenicity (EU Annex III trace allergens) —
    // we don't want a false-negative `hypoallergenique` because limonene
    // sits at < 0.001 %.
    if (rule.auroreSlug === S.HYPOALLERGENIQUE && assessment.declarationOnlyRisk) continue

    results.push({
      slug: rule.auroreSlug,
      relevance: 'secondary',
      confidence: candidate.confidence,
      source: candidate.source,
    })
  }
  return results
}
