// INCI-derived auto-tag detection for skincare products via algo-derm.
//
// Single source of truth for the per-tag policy used by:
//   - `runners/seed-core.ts` (initial seed)
//   - `runners/audit-auto-tags.ts` (dry-run report)
//   - `runners/backfill-auto-tags.ts` (TODO — post-snapshot rehydrate)
//
// `tagProduct` from algo-derm emits 36 candidate tags. We keep only the 19
// that survived dry-run + spot-check calibration (snapshot 2026-05-07,
// N=1853 products with INCI). The dropped ones either fire on > 50 % of the
// corpus (`sans-savon`, `grossesse-compatible`, …) or conflate semantically
// distinct concepts (`matifiant` ≡ `peau-grasse` set but means visual finish,
// not chemistry).

import type { ProductKind } from '@habit-tracker/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@habit-tracker/shared'

import {
  analyzeINCI,
  type ProductAssessment,
  splitINCI,
  TAG_DEFS_VERSION,
  tagProduct,
} from 'algo-derm'

import { mapKindToContext, RINSE_OFF_KINDS } from '../../dermo-score/profile-mapping'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Algo-derm `TAG_DEFS_VERSION` this calibration was validated against. Bump
// when re-running the audit against a new algo-derm tarball confirms the
// per-tag floors still hold.
//
// Mismatch handling: the assertion below runs at module load (cheap, single
// integer compare) and fails fast in dev/test before any tag is written.
// Production seed/backfill runners pick it up the same way — better a loud
// crash on `just init` than silent calibration drift.
//
//   v2 (2026-05-13) — MAPPED_TAGS check signature gained NormalizedIngredients
//                      (ordered + position helpers). Position caps added to
//                      `comedogene` (top 8), `anti-age` / `pores-sebum` /
//                      `sebo-regulateur` / `acne-imperfections` / etc. (top 12).
//   v3 (2026-05-13) — `peaux_sensibles` excludes formaldehyde_donor +
//                      isothiazolinone (parity with peaux_atopiques).
//                      COMEDOGEN_PATTERNS enriched 4 → 12 (Fulton ≥ 3 list).
//   v4 (2026-05-13) — `peau-mixte` tightened to seborrheicRegulation AND
//                      hydrating both ≥ 0.4 (was 0.25). No-op for Aurore
//                      (peau-mixte already absent from TAG_CONFIG → `unmapped`),
//                      but the version pin must match.
//   v5 (2026-05-13) — Per-axis AXIS_BENEFIT_THRESHOLDS (B3). Uniform 0.35
//                      replaced by per-axis P85 over Aurore corpus (n=3601):
//                      soothing 0.20 / hydrating 0.47 / barrierSupport 0.25 /
//                      antioxidant 0.19 / brightening 0.21 /
//                      seborrheicRegulation 0.20. Eclat-teint-uniforme 0.30
//                      override dropped (relation hyperpigmentation ⊃ eclat
//                      now via active-list branch). Audit hit-rate drift on
//                      `apaisant` / `anti-oxydant` / `barriere-cutanee` /
//                      `eclat-teint-uniforme` expected — re-calibrate
//                      TAG_HIT_RATE_BUDGET after audit.
//   v6 (2026-05-13) — Position-weighted confidence (B2). `anti-age` /
//                      `purifiant` / `keratolytique` / `repulpant` confidence
//                      now `min(coverage, 0.9) × positionConfidence(pos, cap)`.
//                      Runtime impact on Aurore is narrow: only `anti-age`
//                      reaches gating (confidenceFloor 0.5) — `purifiant` is
//                      `allow:false`, `keratolytique` is unmapped, `repulpant`
//                      is re-emitted via passes/formula/. Anti-age hit rate
//                      may dip on products with retinol/vit-C at INCI pos > 5
//                      (~half confidence); re-baseline budgets if drift.
//   v7 (2026-05-14) — `vegan` + `grossesse_risque` added (pregnancy and vegan
//                      detection migrated from Aurore formula passes to algo-derm).
//                      `grossesse-compatible` enriched with formaldehyde_donor
//                      exclusion. `ProductAssessment.context` exposed; sunscreen
//                      added to `formulaType` enum. Re-run `just audit-auto-tags`
//                      and re-baseline TAG_HIT_RATE_BUDGET if hit rates drift.
const CALIBRATED_FOR_TAG_DEFS_VERSION = 7

if (TAG_DEFS_VERSION !== CALIBRATED_FOR_TAG_DEFS_VERSION) {
  throw new Error(
    `algo-derm TAG_DEFS_VERSION=${TAG_DEFS_VERSION} but Aurore is calibrated for ` +
      `${CALIBRATED_FOR_TAG_DEFS_VERSION}. Re-run \`just audit-auto-tags\` and ` +
      `bump CALIBRATED_FOR_TAG_DEFS_VERSION in passes/auto-tag-detection.ts.`
  )
}

// Per-tag gating policy. Two independent floors:
//
// - `coverageFloor`: minimum `assessment.coverage.ratio` required.
//   For `source='detected_absence'`, this is the only gate that matters
//   (algo-derm sets `confidence = min(coverage, 0.95)`, so coverage IS the
//   confidence signal). For `source='computed_score'`, this stacks on top
//   of `confidenceFloor` and overrides the global `COMPUTED_COVERAGE_FLOOR`
//   (0.3) when set.
// - `confidenceFloor`: minimum `candidate.confidence` (axis confidence emitted
//   by algo-derm). Only relevant for `source='computed_score'` — absence tags
//   have confidence ≡ coverage by construction.
//
// This split replaces the legacy single `minConf` field whose semantics
// silently depended on `candidate.source`: for absence it meant "coverage
// floor" (since confidence ≡ coverage), for computed it meant "real
// confidence floor". Same field, two meanings — confusing in calibration.
export type TagRule = {
  auroreSlug: SkincareProductTagSlug
  allow: boolean
  // Relevance emitted when the tag fires. Defaults to 'secondary'.
  // Set to 'avoid' for safety signals (e.g. `grossesse_risque`) so the
  // avoid > secondary dedup rule in the orchestrator applies automatically.
  relevance?: 'secondary' | 'avoid'
  // Algo-derm `tagProduct` ignores `context.leaveOn` on the comedogenicity axis
  // (rule = risk threshold + keyword match). 29 % of `comedogene` hits fire on
  // rinse-off products in the dry-run — filter at the wrapper level.
  excludeRinseOff?: boolean
  coverageFloor?: number
  confidenceFloor?: number
  // Late-stage predicate: when true, the candidate is dropped after all floor
  // checks pass. Use for assessment-derived disqualifiers that don't fit the
  // numeric gates (e.g. `declarationOnlyRisk` for `hypoallergenique` — Annex III
  // trace allergens declared per regulation but at sub-effect levels).
  // Predicate-based instead of hard-coded slug checks so a slug rename doesn't
  // silently break the gate.
  skipIf?: (a: ProductAssessment) => boolean
}

// Calibration buckets:
//   🟢 allow @ 0.50, agree ≥ 36 %
//   🟠/🔴 allow:false (structurally noisy)
//   spot-check overrides — allow @ 0.85 + excludeRinseOff for comedogenicity;
//   matifiant dropped despite small set size (semantic mismatch).
export const TAG_CONFIG: Readonly<Record<string, TagRule>> = {
  // Three algo-derm mapped tags are intentionally re-emitted from
  // `passes/formula/` instead of here:
  //   - `peaux_atopiques`  → `detectEczemaAtopie`  (eczema-atopie.ts)
  //   - `repulpant`        → `detectRepulpant`     (repulpant.ts)
  //   - `matifiant`        → `detectFiniMat`       (fini-mat.ts)
  // Their algo-derm rules fire on too broad a corpus (22-78 %); the formula
  // detectors gate on chemistry-aware co-presence patterns. Algo-derm
  // candidates for these slugs hit `unmapped` here and are dropped — see
  // git log of passes/formula/ for the calibration history.
  // ── Concerns (computed_score) ──────────────────────────────────────
  'acne-imperfections': { auroreSlug: S.ACNE_IMPERFECTIONS, confidenceFloor: 0.5, allow: true },
  'rougeurs-vasculaires': { auroreSlug: S.ROUGEURS_VASCULAIRES, confidenceFloor: 0.5, allow: true },
  'barriere-cutanee': { auroreSlug: S.BARRIERE_CUTANEE, confidenceFloor: 0.5, allow: true },
  hyperpigmentation: { auroreSlug: S.HYPERPIGMENTATION, confidenceFloor: 0.5, allow: true },
  'eclat-teint-uniforme': { auroreSlug: S.ECLAT_TEINT, confidenceFloor: 0.5, allow: true },
  'anti-age': { auroreSlug: S.ANTI_AGE, confidenceFloor: 0.5, allow: true },
  'pores-sebum': { auroreSlug: S.PORES_SEBUM, confidenceFloor: 0.5, allow: true },
  protection: { auroreSlug: S.PROTECTION, confidenceFloor: 0.5, allow: true },
  // 78 % corpus at 0.5, but only 20 hits at 1.0 (too restrictive). 0.85 targets
  // products where hydrating benefit is strongly evidenced — multi-HA, glycerin-heavy,
  // urea formulas — and filters out incidental glycerin in non-hydrating formulas.
  deshydratation: { auroreSlug: S.DESHYDRATATION, confidenceFloor: 0.85, allow: true },

  // ── Skin effects ───────────────────────────────────────────────────
  apaisant: { auroreSlug: S.APAISANT, confidenceFloor: 0.5, allow: true },
  'sebo-regulateur': { auroreSlug: S.SEBO_REGULATEUR, confidenceFloor: 0.5, allow: true },
  'anti-oxydant': { auroreSlug: S.ANTI_OXYDANT, confidenceFloor: 0.5, allow: true },
  reparateur: { auroreSlug: S.REPARATEUR, confidenceFloor: 0.5, allow: true },
  // Strict subset of `sebo-regulateur` trigger (salicylic / azelaic / zinc pca
  // — same minus niacinamide). Any product that fires `purifiant` also fires
  // `sebo-regulateur`, so emitting both is duplication. Keeping the
  // concern (`pores-sebum`) + effect (`sebo-regulateur`) axis covers the
  // ground without bruit.
  purifiant: { auroreSlug: S.PURIFIANT, confidenceFloor: 1.0, allow: false },

  // ── Skin types (peau-mixte excluded — too noisy on neutral hydrators) ─
  'peau-sensible': { auroreSlug: S.PEAU_SENSIBLE, confidenceFloor: 0.5, allow: true },
  'peau-grasse': { auroreSlug: S.PEAU_GRASSE, confidenceFloor: 0.85, allow: true },
  'peau-seche': { auroreSlug: S.PEAU_SECHE, confidenceFloor: 0.85, allow: true },

  // ── Product characteristic (detected_absence — coverageFloor only) ─
  // For absence tags, algo-derm sets confidence = min(coverage.ratio, 0.95).
  // We gate on coverageFloor directly; confidenceFloor is meaningless here.
  sans_parfum: { auroreSlug: S.SANS_PARFUM, coverageFloor: 0.7, allow: true },
  sans_sulfates: { auroreSlug: S.SANS_SULFATES, coverageFloor: 0.7, allow: true },
  sans_silicones: { auroreSlug: S.SANS_SILICONES, coverageFloor: 0.7, allow: true },
  sans_huiles_essentielles: {
    auroreSlug: S.SANS_HUILES_ESSENTIELLES,
    coverageFloor: 0.7,
    allow: true,
  },
  sans_huiles_minerales: {
    auroreSlug: S.SANS_HUILES_MINERALES,
    coverageFloor: 0.7,
    allow: true,
  },
  sans_allergenes_parfumants: {
    auroreSlug: S.SANS_ALLERGENES_PARFUMANTS,
    coverageFloor: 0.7,
    allow: true,
  },
  // `sans_savon` fires on > 80 % of corpus (most modern formulas) — not discriminating.
  sans_savon: { auroreSlug: S.SANS_SAVON, coverageFloor: 1.0, allow: false },

  // ── Computed_score with stacked floors ────────────────────────────
  // Algo-derm fires `hypoallergenique` on `allergenicity.risk < 0.30 && no
  // fragrance/EO/allergen flags`. Reactivated 2026-05-08 (T1.11).
  // confidenceFloor 0.85 + coverageFloor 0.7 require the allergenicity axis
  // to be confidently estimated (≥ 85 % axis confidence) and the formula
  // substantially identified (≥ 70 % INCI coverage) before emitting.
  hypoallergenique: {
    auroreSlug: S.HYPOALLERGENIQUE,
    confidenceFloor: 0.85,
    coverageFloor: 0.7,
    allow: true,
    // Defensive belt-and-suspenders. `declarationOnlyRisk` triggers when
    // allergenicity.risk ≥ 0.33 driven by a single trace-position Annex III
    // allergen — that range is already excluded by the < 0.30 fire threshold
    // upstream, so this skipIf is unreachable today. Kept as forward-protection
    // if algo-derm's hypoallergenique threshold loosens past 0.33.
    skipIf: (a) => a.declarationOnlyRisk,
  },
  // Algo-derm fires `non_irritant` on `irritation.risk < 0.35`. confidenceFloor
  // 0.85 + coverageFloor 0.7 mirror the hypoallergenique gate: require the
  // irritation axis to be confidently estimated and the formula substantially
  // identified before claiming low irritation potential. No `skipIf` —
  // `declarationOnlyRisk` is allergenicity-axis specific (Annex III traces) and
  // doesn't transfer to the irritation axis; algo-derm has no equivalent
  // declaration-only flag for irritation.
  non_irritant: {
    auroreSlug: S.NON_IRRITANT,
    confidenceFloor: 0.85,
    coverageFloor: 0.7,
    allow: true,
  },
  // `grossesse-compatible` checks retinoid/hydroquinone absence + pregnancy
  // interactions. confidenceFloor 0.75 — algo-derm sets confidence as
  // `min(coverage, 0.85)` for this mapped tag, so this effectively requires
  // ≥ 75 % INCI coverage.
  'grossesse-compatible': {
    auroreSlug: S.GROSSESSE_COMPATIBLE,
    confidenceFloor: 0.75,
    allow: true,
  },

  // ── Vegan (absence-based from INCI, migrated from passes/formula/vegan.ts) ─
  // Fires when no animal-derived INCI pattern detected + formula ≥ 5 ingredients.
  // Brand-level certifications (brand-cert-detection pass 5b) are a separate,
  // higher-authority source and may fire independently.
  vegan: { auroreSlug: S.VEGAN, coverageFloor: 0.5, allow: true },

  // ── Pregnancy contraindication (migrated from passes/formula/grossesse-avoid.ts)
  // `grossesse_risque` is the explicit avoid signal: fires when algo-derm detects
  // a known contraindication (retinoids, hydroquinone, formaldehyde donors,
  // BHA leave-on, oxybenzone/homosalate in sunscreens, risky EOs).
  // relevance='avoid' so the orchestrator's avoid > secondary dedup applies.
  // coverageFloor: 0 — safety signal must fire even on low-coverage INCI;
  // missing a pregnancy contraindication is worse than a false positive.
  grossesse_risque: {
    auroreSlug: S.GROSSESSE_COMPATIBLE,
    relevance: 'avoid',
    coverageFloor: 0,
    allow: true,
  },

  // ── Comedogenicity (leave-on only — §7.6) ──────────────────────────
  comedogene: {
    auroreSlug: S.COMEDOGENE,
    confidenceFloor: 0.85,
    allow: true,
    excludeRinseOff: true,
  },
  // Algo-derm fires `non-comedogene` on `comedogenicity.risk ≤ 0.25` which is
  // very permissive — emitted on > 60 % of corpus, low information value.
  // R3: confidenceFloor 0.90 + coverageFloor 0.60 require the formula to be
  // substantially identified before claiming non-comedogenicity (a single
  // recognized humectant in 70 % unknown INCI shouldn't be enough).
  'non-comedogene': {
    auroreSlug: S.NON_COMEDOGENE,
    confidenceFloor: 0.9,
    coverageFloor: 0.6,
    allow: true,
    excludeRinseOff: true,
  },
}

export interface DetectedAutoTag {
  slug: SkincareProductTagSlug
  relevance: 'secondary' | 'avoid'
  confidence: number
  source: 'detected_absence' | 'computed_score'
}

// Default `coverageFloor` for `computed_score` candidates when no per-tag
// floor is set. Below this `assessment.coverage.ratio`, the INCI is too
// poorly identified for `computed_score` mapped tags to be trusted — they
// fire on a single ingredient pattern even when 70 % of the formula is
// unrecognized fillers. Absence tags default to 0 (no implicit floor) —
// each per-tag entry sets its own `coverageFloor` explicitly.
const COMPUTED_COVERAGE_FLOOR = 0.3

export type DropReason =
  | 'not_present'
  | 'unmapped'
  | 'disallowed'
  | 'coverage_floor'
  | 'low_confidence'
  | 'rinse_off_excluded'
  | 'skip_if'

export interface DetectAutoTagsOptions {
  // Raise the per-tag `confidenceFloor` globally (debug). Per-tag floors are
  // raised to this value if higher; never lowered. Only affects
  // `computed_score` candidates — `detected_absence` tags have no
  // `confidenceFloor` (their confidence ≡ coverage, gate via
  // `coverageMinOverride` instead).
  confOverride?: number
  // Surface tags with `allow: false` (debug — should never be true at seed).
  includeDropped?: boolean
  // Raise the per-tag `coverageFloor` globally (debug). Symmetric with
  // `confOverride`: never lowers an existing floor, only tightens. To inspect
  // emissions below the calibrated floors (full audit), set `disableFloors`.
  coverageMinOverride?: number
  // Audit hatch: bypass both `coverageFloor` and `confidenceFloor` gates
  // entirely (per-tag and global). `confOverride` / `coverageMinOverride` are
  // also ignored when this is set. Other gates (`allow`, `excludeRinseOff`,
  // `skipIf`, candidate.present, unmapped) still apply.
  disableFloors?: boolean
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

    // Coverage gating. Default = per-tag `coverageFloor` if set, else
    // `COMPUTED_COVERAGE_FLOOR` for computed candidates, else 0 for absence
    // candidates (those set their own floors explicitly via TAG_CONFIG).
    // `coverageMinOverride` raises this baseline (symmetric with confOverride);
    // never lowers. `disableFloors` skips the check entirely.
    if (!options.disableFloors) {
      const baseFloor =
        rule.coverageFloor ?? (candidate.source === 'computed_score' ? COMPUTED_COVERAGE_FLOOR : 0)
      const effectiveFloor = Math.max(baseFloor, options.coverageMinOverride ?? 0)
      if (coverageRatio < effectiveFloor) {
        bumpDrop(drops, 'coverage_floor', candidate.id)
        continue
      }
    }

    // Confidence gating — only meaningful for computed_score. Absence tags
    // have confidence ≡ coverage by construction (algo-derm sets it to
    // `min(coverage, 0.95)`), so a confidenceFloor on them would duplicate
    // the coverageFloor check above.
    if (candidate.source === 'computed_score' && !options.disableFloors) {
      const baseFloor = rule.confidenceFloor ?? 0
      const effectiveFloor = Math.max(baseFloor, options.confOverride ?? 0)
      if (candidate.confidence < effectiveFloor) {
        bumpDrop(drops, 'low_confidence', candidate.id)
        continue
      }
    }

    if (rule.excludeRinseOff && isRinseOff) {
      bumpDrop(drops, 'rinse_off_excluded', candidate.id)
      continue
    }

    if (rule.skipIf?.(assessment)) {
      bumpDrop(drops, 'skip_if', candidate.id)
      continue
    }

    results.push({
      slug: rule.auroreSlug,
      relevance: rule.relevance ?? 'secondary',
      confidence: candidate.confidence,
      source: candidate.source,
    })
  }
  return results
}
