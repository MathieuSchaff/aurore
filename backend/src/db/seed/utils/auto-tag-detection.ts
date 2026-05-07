// INCI-derived auto-tag detection for skincare products via algo-derm.
//
// Single source of truth for the per-tag policy used by:
//   - `runners/seed-core.ts` (initial seed)
//   - `runners/audit-auto-tags.ts` (dry-run report)
//   - `runners/backfill-auto-tags.ts` (TODO — post-snapshot rehydrate)
//
// `tagProduct` from algo-derm emits 36 candidate tags (cf docs/tags/AUTO-TAGS.md
// §3). We keep only the 19 that survived dry-run + spot-check calibration
// (snapshot 2026-05-07, N=1853 products with INCI). The 8 dropped tags either
// fire on > 50 % of corpus (`sans-savon`, `grossesse-compatible`, …) or
// conflate semantically distinct concepts (`matifiant` ≡ `peau-grasse` set
// but means visual finish, not chemistry — §7.6).

import type { ProductKind } from '@habit-tracker/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@habit-tracker/shared'

import { analyzeINCI, type ProductAssessment, splitINCI, tagProduct } from 'algo-derm'

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
  // Per-tag override of `COMPUTED_COVERAGE_FLOOR`. Use when a tag's emission
  // rule is too permissive at the global floor (`non-comedogene` fires on
  // any low-comedogenicity-risk INCI even when most ingredients are unknown).
  coverageMin?: number
}

// Calibration sources (see docs/tags/AUTO-TAGS.md):
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
  // 78 % corpus at 0.5, but only 20 hits at 1.0 (too restrictive). 0.85 targets
  // products where hydrating benefit is strongly evidenced — multi-HA, glycerin-heavy,
  // urea formulas — and filters out incidental glycerin in non-hydrating formulas.
  deshydratation: { auroreSlug: S.DESHYDRATATION, minConf: 0.85, allow: true },
  // Algo `peaux_atopiques` stays disabled — fires on 22 % corpus, 3 % agree.
  // Eczema-atopie is now emitted by `detectEczemaAtopie` (formula-detection.ts)
  // with chemistry-aware triggers: oat OR ≥ 2 ceramides + fragrance-free +
  // sulfate-free top 5, leave-on. Keeping this row at allow:false documents
  // the algo-derm path is intentionally bypassed.
  peaux_atopiques: { auroreSlug: S.ECZEMA_ATOPIE, minConf: 1.0, allow: false },

  // ── Skin effects ───────────────────────────────────────────────────
  apaisant: { auroreSlug: S.APAISANT, minConf: 0.5, allow: true },
  'sebo-regulateur': { auroreSlug: S.SEBO_REGULATEUR, minConf: 0.5, allow: true },
  'anti-oxydant': { auroreSlug: S.ANTI_OXYDANT, minConf: 0.5, allow: true },
  reparateur: { auroreSlug: S.REPARATEUR, minConf: 0.5, allow: true },
  // Strict subset of `sebo-regulateur` trigger (salicylic / azelaic / zinc pca
  // — same minus niacinamide). Any product that fires `purifiant` also fires
  // `sebo-regulateur`, so emitting both is duplication. Keeping the
  // concern (`pores-sebum`) + effect (`sebo-regulateur`) axis covers the
  // ground without bruit.
  purifiant: { auroreSlug: S.PURIFIANT, minConf: 1.0, allow: false },
  keratolytique: { auroreSlug: S.KERATOLYTIQUE, minConf: 0.5, allow: true },
  // §7.6 — identical product set to peau-grasse, but means visual finish
  matifiant: { auroreSlug: S.MATIFIANT, minConf: 1.0, allow: false },
  // Algo `repulpant` stays disabled — fires on 78 % corpus (any HA/glycerin
  // moisturizer). Repulpant is now emitted by `detectRepulpant`
  // (formula-detection.ts) with chemistry-aware triggers: HA top 3 + pure
  // glycerin top 5 + plumping peptide (Argireline / palmitoyl tripeptide-1).
  // Same allow:false-then-formula-pass pattern as eczema-atopie.
  repulpant: { auroreSlug: S.REPULPANT, minConf: 1.0, allow: false },

  // ── Skin types (peau-mixte excluded — too noisy on neutral hydrators) ─
  'peau-sensible': { auroreSlug: S.PEAU_SENSIBLE, minConf: 0.5, allow: true },
  'peau-grasse': { auroreSlug: S.PEAU_GRASSE, minConf: 0.85, allow: true },
  'peau-seche': { auroreSlug: S.PEAU_SECHE, minConf: 0.85, allow: true },

  // ── Product characteristic ─────────────────────────────────────────
  // `sans_parfum` is a binary absence tag: if parfum/fragrance/aroma absent from INCI
  // and coverage ≥ 0.7, we can confidently emit it. Enabled after dry-run showed high
  // precision on fragrance-free products.
  sans_parfum: { auroreSlug: S.SANS_PARFUM, minConf: 0.7, allow: true },
  // T1 — algo-derm absence family. Same gating as `sans_parfum` (binary absence,
  // confidence = min(coverage.ratio, 0.95) so minConf 0.7 ≡ ≥ 70 % INCI coverage).
  // Substring patterns live in algo-derm `ABSENCE_TAGS`; bumping minConf to 0.85
  // here would only lower recall on partially-identified formulas without changing
  // precision — keep aligned with `sans_parfum` until a dry-run says otherwise.
  sans_sulfates: { auroreSlug: S.SANS_SULFATES, minConf: 0.7, allow: true },
  sans_silicones: { auroreSlug: S.SANS_SILICONES, minConf: 0.7, allow: true },
  sans_huiles_essentielles: { auroreSlug: S.SANS_HUILES_ESSENTIELLES, minConf: 0.7, allow: true },
  sans_huiles_minerales: { auroreSlug: S.SANS_HUILES_MINERALES, minConf: 0.7, allow: true },
  sans_allergenes_parfumants: {
    auroreSlug: S.SANS_ALLERGENES_PARFUMANTS,
    minConf: 0.7,
    allow: true,
  },
  // `sans_savon` fires on > 80 % of corpus (most modern formulas) — not discriminating.
  sans_savon: { auroreSlug: S.SANS_SAVON, minConf: 1.0, allow: false },
  // Reactivated 2026-05-08 (T1.11): algo-derm `hypoallergenique` is gated by
  // `assessment.declarationOnlyRisk` (set when only EU Annex III trace allergens
  // are present). minConf 0.85 + coverageMin 0.7 keep emission tight on
  // formulas where the absence claim is well-supported.
  hypoallergenique: {
    auroreSlug: S.HYPOALLERGENIQUE,
    minConf: 0.85,
    allow: true,
    coverageMin: 0.7,
  },
  // T2 — algo-derm `non_irritant` fires on `irritation.risk < 0.35` which is
  // permissive on its own. minConf 0.85 + coverageMin 0.7 keep emission tight
  // on formulas where the irritation risk estimate is well-supported by INCI
  // coverage (mirrors the hypoallergenique gating).
  non_irritant: {
    auroreSlug: S.NON_IRRITANT,
    minConf: 0.85,
    allow: true,
    coverageMin: 0.7,
  },
  // `grossesse-compatible` checks retinoid/hydroquinone absence + pregnancy interactions.
  // minConf=0.75 requires ≥ 75 % INCI coverage so we only emit when the formula is
  // substantially identified.
  'grossesse-compatible': { auroreSlug: S.GROSSESSE_COMPATIBLE, minConf: 0.75, allow: true },

  // ── Comedogenicity (leave-on only — §7.6) ──────────────────────────
  comedogene: { auroreSlug: S.COMEDOGENE, minConf: 0.85, allow: true, excludeRinseOff: true },
  // Algo-derm fires `non-comedogene` on `comedogenicity.risk ≤ 0.25` which is
  // very permissive — emitted on > 60 % of corpus, low information value.
  // R3: minConf 0.90 + coverageMin 0.60 require the formula to be substantially
  // identified before claiming non-comedogenicity (a single recognized humectant
  // in 70 % unknown INCI shouldn't be enough).
  'non-comedogene': {
    auroreSlug: S.NON_COMEDOGENE,
    minConf: 0.9,
    allow: true,
    excludeRinseOff: true,
    coverageMin: 0.6,
  },
}

export interface DetectedAutoTag {
  slug: SkincareProductTagSlug
  relevance: 'secondary'
  confidence: number
  source: 'detected_absence' | 'computed_score'
}

// Below this `assessment.coverage.ratio`, the INCI is too poorly identified
// for `computed_score` mapped tags (acne-imperfections, anti-age, …) to be
// trusted — they fire on a single ingredient pattern even when 70 % of the
// formula is unrecognized fillers. Absence tags already gate via algo-derm
// `absenceConfidence = min(coverage, 0.95)`, so they are not affected.
const COMPUTED_COVERAGE_FLOOR = 0.3

export type DropReason =
  | 'not_present'
  | 'unmapped'
  | 'disallowed'
  | 'coverage_floor'
  | 'low_confidence'
  | 'rinse_off_excluded'
  | 'declaration_only_risk'

export interface DetectAutoTagsOptions {
  // Override `minConf` floor globally (debug). Per-tag minConf is raised
  // to this value if higher; never lowered.
  confOverride?: number
  // Surface tags with `allow: false` (debug — should never be true at seed).
  includeDropped?: boolean
  // Override the `computed_score` coverage floor. Use only for audits that
  // want to inspect low-coverage emissions.
  coverageMinOverride?: number
  // Pre-computed assessment from a hoisted `analyzeINCI` call. When the
  // caller already runs `analyzeINCI` for another purpose (audit regulatory
  // surfacing, interaction mapping), passing it here avoids the duplicate
  // call. Must match `(inci, kind)` — caller responsibility.
  assessment?: ProductAssessment
  // Pre-split ingredient list — same hoisting rationale as `assessment`.
  ingredients?: string[]
  // Audit hook: when provided, the function bumps `${reason}:${candidate.id}`
  // for every candidate dropped at gating. Caller owns the Map (audit
  // aggregates across products). No-op for prod runners — keeps the hot path
  // free of per-tag accounting unless an audit asks for it.
  dropCounts?: Map<string, number>
}

const bumpDrop = (
  map: Map<string, number> | undefined,
  reason: DropReason,
  tagId: string
): void => {
  if (!map) return
  const k = `${reason}:${tagId}`
  map.set(k, (map.get(k) ?? 0) + 1)
}

export function detectAutoTags(
  inci: string | null | undefined,
  kind: ProductKind,
  options: DetectAutoTagsOptions = {}
): DetectedAutoTag[] {
  if (!inci?.trim()) return []

  const ingredients = options.ingredients ?? splitINCI(inci)
  if (ingredients.length === 0) return []

  const assessment = options.assessment ?? analyzeINCI(inci, { context: mapKindToContext(kind) })
  const candidates = tagProduct(assessment, ingredients)
  const isRinseOff = RINSE_OFF_KINDS.has(kind)
  const coverageRatio = assessment.coverage.ratio

  // Debug override (`coverageMinOverride`) replaces both global and per-tag
  // floors so that audits can fully disable gating with `0`.
  const coverageFloorFor = (rule: TagRule): number =>
    options.coverageMinOverride ?? rule.coverageMin ?? COMPUTED_COVERAGE_FLOOR

  const drops = options.dropCounts
  const results: DetectedAutoTag[] = []
  for (const candidate of candidates) {
    if (!candidate.present) {
      bumpDrop(drops, 'not_present', candidate.id)
      continue
    }
    const rule = TAG_CONFIG[candidate.id]
    if (!rule) {
      bumpDrop(drops, 'unmapped', candidate.id)
      continue
    }
    if (!rule.allow && !options.includeDropped) {
      bumpDrop(drops, 'disallowed', candidate.id)
      continue
    }

    // Mapped/computed tags fire on pattern match alone — drop them when the
    // formula is mostly unrecognized so a single `niacinamide` in 70 % unknown
    // INCI doesn't tag the product as `acne-imperfections`.
    if (candidate.source === 'computed_score' && coverageRatio < coverageFloorFor(rule)) {
      bumpDrop(drops, 'coverage_floor', candidate.id)
      continue
    }

    const minConf =
      options.confOverride !== undefined
        ? Math.max(rule.minConf, options.confOverride)
        : rule.minConf
    if (candidate.confidence < minConf) {
      bumpDrop(drops, 'low_confidence', candidate.id)
      continue
    }

    if (rule.excludeRinseOff && isRinseOff) {
      bumpDrop(drops, 'rinse_off_excluded', candidate.id)
      continue
    }

    // Skip declaration-only allergenicity (EU Annex III trace allergens) —
    // we don't want a false-negative `hypoallergenique` because limonene
    // sits at < 0.001 %.
    if (rule.auroreSlug === S.HYPOALLERGENIQUE && assessment.declarationOnlyRisk) {
      bumpDrop(drops, 'declaration_only_risk', candidate.id)
      continue
    }

    results.push({
      slug: rule.auroreSlug,
      relevance: 'secondary',
      confidence: candidate.confidence,
      source: candidate.source,
    })
  }
  return results
}
