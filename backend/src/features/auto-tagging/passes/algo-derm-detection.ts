// INCI-derived auto-tag detection for skincare products via algo-derm.
// Single source of truth for the per-tag policy, consumed by `algoDermPass` (orchestrator
// pass 1) and the pass-1 audits (`runners/audit/stats.ts`, `runners/audit/gold-set.ts`).
// `tagProduct` emits candidate tags; `TAG_CONFIG` below decides which are kept, drop
// reason documented next to each tag.

import type { ProductKind } from '@aurore/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@aurore/shared'

import {
  analyzeINCI,
  type ProductAssessment,
  splitINCI,
  TAG_DEFS_VERSION,
  tagProduct,
} from 'algo-derm'

import { mapKindToContext, RINSE_OFF_KINDS } from '../../../lib/algo-derm-product-context'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// Calibration version guard. Fails fast at module load to prevent silent drift
// when a new algo-derm tarball changes tag semantics. Bump after running
// `just audit-auto-tags` and confirming per-tag floors still hold.
const CALIBRATED_FOR_TAG_DEFS_VERSION = 24

if (TAG_DEFS_VERSION !== CALIBRATED_FOR_TAG_DEFS_VERSION) {
  throw new Error(
    `algo-derm TAG_DEFS_VERSION=${TAG_DEFS_VERSION} but Aurore is calibrated for ` +
      `${CALIBRATED_FOR_TAG_DEFS_VERSION}. Re-run \`just audit-auto-tags\` and ` +
      `bump CALIBRATED_FOR_TAG_DEFS_VERSION in passes/algo-derm-detection.ts.`
  )
}

// Per-tag gating policy: two independent floors (coverageFloor, confidenceFloor below).
// Replaces the legacy `minConf` field, whose meaning silently changed per source.
export type TagRule = {
  // Absent only for allow:false entries with no Aurore counterpart (e.g. `keratolytique`).
  auroreSlug?: SkincareProductTagSlug
  allow: boolean
  // Defaults to 'secondary'. Set to 'avoid' for safety signals so the
  // avoid > secondary dedup rule in the orchestrator applies automatically.
  relevance?: 'secondary' | 'avoid'
  // algo-derm ignores context.leaveOn on the comedogenicity axis; 29 % of
  // comedogene hits fire on rinse-off in the dry-run; filter here instead.
  excludeRinseOff?: boolean
  // Inverse of excludeRinseOff: keep only on rinse-off kinds. For claims that
  // only discriminate where the excluded class is used (sans-sulfates: washing
  // sulfates occur in wash products, so the absence is not informative on leave-on).
  rinseOffOnly?: boolean
  // Minimum `assessment.coverage.ratio`. For absence tags it's the only gate
  // (confidence = min(coverage, 0.95)); for computed tags it stacks on top of
  // confidenceFloor and overrides the global COMPUTED_COVERAGE_FLOOR when set.
  coverageFloor?: number
  // Minimum `candidate.confidence`, meaningful only for computed_score.
  confidenceFloor?: number
  // Predicate applied after the floors, for assessment-derived disqualifiers that
  // don't fit numeric gates (e.g. declarationOnlyRisk: Annex III trace allergens
  // declared per regulation but below effect levels). Predicate-based so a
  // slug rename doesn't silently break the gate.
  skipIf?: (a: ProductAssessment) => boolean
  // algo-derm candidate ids (detected_absence) that must themselves fire for
  // this tag to survive. Expresses "the claim is void when X is in the formula",
  // which a single axis score cannot: risk is concentration-weighted, so a
  // disqualifying ingredient low in a long INCI dilutes below every floor.
  requiresAbsence?: readonly string[]
}

const FRAGRANCE_FUNCTIONS = new Set(['FRAGRANCE', 'PERFUMING'])

// True when the formula carries an EU-prohibited ingredient whose declared function is
// perfuming. Reads the regulatory findings rather than a molecule list so a future ban
// lands without an Aurore-side edit.
function hasProhibitedFragrance(a: ProductAssessment): boolean {
  const subjects = new Set(
    a.regulatoryFindings
      .filter((f) => f.region === 'EU' && f.status === 'prohibited')
      .flatMap((f) => f.subjectIngredients)
  )
  if (subjects.size === 0) return false
  return a.matchedEvidence.some(
    (m) =>
      subjects.has(m.inci) &&
      (m.evidence.identity?.functions ?? []).some((fn) => FRAGRANCE_FUNCTIONS.has(fn))
  )
}

// Calibration buckets: allow @ 0.50 (agree >= 36 %); allow:false for
// structurally noisy tags; allow @ 0.85 + excludeRinseOff for comedogenicity;
// matifiant dropped despite small set size (semantic mismatch).
export const TAG_CONFIG: Readonly<Record<string, TagRule>> = {
  // peaux_atopiques / repulpant / matifiant are intentionally unmapped: algo-derm fires them on
  // 22-78 % of corpus; formula detectors in passes/formula/ gate on the chemistry-aware presence
  // of several markers together instead. Unmapped candidates are dropped by design, not drift
  // (ADR-0004 draws the map-vs-re-emit boundary).

  // Concerns (computed_score)
  // algo-derm fires on sebum/exfoliating actives regardless of positioning.
  // Re-emitted by the formula name pass, which requires acne/blemish wording.
  'acne-imperfections': { auroreSlug: S.ACNE_IMPERFECTIONS, confidenceFloor: 0.5, allow: false },
  // Redness needs name/claim positioning; ubiquitous soothing actives are too broad.
  'rougeurs-vasculaires': {
    auroreSlug: S.ROUGEURS_VASCULAIRES,
    confidenceFloor: 0.5,
    allow: false,
  },
  // Barrier concern needs explicit réparateur/barrier positioning.
  'barriere-cutanee': { auroreSlug: S.BARRIERE_CUTANEE, confidenceFloor: 0.5, allow: false },
  // These concern tags need name/claim positioning, not just active presence.
  hyperpigmentation: { auroreSlug: S.HYPERPIGMENTATION, confidenceFloor: 0.5, allow: false },
  'eclat-teint-uniforme': { auroreSlug: S.ECLAT_TEINT, confidenceFloor: 0.5, allow: false },
  // Anti-age needs explicit positioning; retinoids/peptides/vitamin C alone are too broad.
  'anti-age': { auroreSlug: S.ANTI_AGE, confidenceFloor: 0.5, allow: false },
  'pores-sebum': { auroreSlug: S.PORES_SEBUM, confidenceFloor: 0.5, allow: false },
  deshydratation: { auroreSlug: S.DESHYDRATATION, confidenceFloor: 0.85, allow: false },

  // Skin effects
  // Soothing actives are too common; the formula pass requires soothing positioning.
  apaisant: { auroreSlug: S.APAISANT, confidenceFloor: 0.5, allow: false },
  // Sebum-control actives (Triethyl Citrate, Silica, niacinamide) fire regardless of
  // positioning, so this stuck to sunscreens/oils/anti-aging. Re-emitted by the formula
  // name pass (formula:sebo-regulateur-name), which requires sebum/mattifying wording,
  // same doctrine as pores-sebum / apaisant / the other effect tags.
  'sebo-regulateur': { auroreSlug: S.SEBO_REGULATEUR, confidenceFloor: 0.5, allow: false },
  // Antioxidant actives are common stabilizers; user-facing antioxidant claims
  // come from explicit positioning or unambiguous hero ingredients.
  'anti-oxydant': { auroreSlug: S.ANTI_OXYDANT, confidenceFloor: 0.5, allow: false },
  // Strict subset of sebo-regulateur trigger (same minus niacinamide): any
  // purifiant product also fires sebo-regulateur. pores-sebum + sebo-regulateur
  // axes cover the ground without redundancy.
  purifiant: { auroreSlug: S.PURIFIANT, confidenceFloor: 1.0, allow: false },
  // Since TAG_DEFS 24 this reads the `exfoliation` benefit axis, and retinoids no
  // longer carry it (ADR-0018 upstream). Already surfaced by actif-class
  // (AHA / BHA / PHA / urea / enzymes). No Aurore slug: stays dropped.
  keratolytique: { allow: false },

  // peau-mixte excluded: too noisy on neutral hydrators.
  // peaux_sensibles: strict computed variant, excludes sulfate/formaldehyde_donor/
  // isothiazolinone (the mapped peau-sensible tolerates them; axis gate only).
  'peaux-sensibles': { auroreSlug: S.PEAU_SENSIBLE, confidenceFloor: 0.5, allow: true },
  // Skin-type tags need explicit marketed-for wording; benefit-axis confidence
  // makes opposite audiences fire too broadly.
  'peau-grasse': { auroreSlug: S.PEAU_GRASSE, confidenceFloor: 0.85, allow: false },
  'peau-seche': { auroreSlug: S.PEAU_SECHE, confidenceFloor: 0.85, allow: false },

  // Absence tags (detected_absence): algo-derm sets confidence = min(coverage, 0.95).
  // Gate on coverageFloor only; confidenceFloor is redundant for absence tags.
  'sans-parfum': { auroreSlug: S.SANS_PARFUM, coverageFloor: 0.7, allow: true },
  // Rinse-off only: "sans-sulfates" guards against harsh washing sulfates (SLS/SLES),
  // which only occur in products you lather. On leave-on kinds the absence is trivially
  // true (lip-care, patches, serums never carry them). Filter noise that isn't informative.
  'sans-sulfates': {
    auroreSlug: S.SANS_SULFATES,
    coverageFloor: 0.7,
    allow: true,
    rinseOffOnly: true,
  },
  'sans-silicones': { auroreSlug: S.SANS_SILICONES, coverageFloor: 0.7, allow: true },
  'sans-huiles-essentielles': {
    auroreSlug: S.SANS_HUILES_ESSENTIELLES,
    coverageFloor: 0.7,
    allow: true,
  },
  'sans-huiles-minerales': {
    auroreSlug: S.SANS_HUILES_MINERALES,
    coverageFloor: 0.7,
    allow: true,
  },
  'sans-allergenes-parfumants': {
    auroreSlug: S.SANS_ALLERGENES_PARFUMANTS,
    coverageFloor: 0.7,
    allow: true,
    // algo-derm's fragrance_allergen heuristic mirrors the Annex III labelling list
    // (Reg. 2023/1545), which drops a molecule once it is banned outright: Butylphenyl
    // Methylpropional left Annex III for Annex II in 2022, so the tag fired on a formula
    // that carries it. A prohibited perfuming ingredient voids the claim it contradicts.
    skipIf: hasProhibitedFragrance,
  },
  // Denatured alcohol is a chronic drying irritant; its absence matters for
  // sensitive/atopic skin unlike sans-savon.
  'sans-alcool-denature': {
    auroreSlug: S.SANS_ALCOOL_DENATURE,
    coverageFloor: 0.7,
    allow: true,
  },
  // Fires on > 80 % of corpus, not discriminating.
  'sans-savon': { auroreSlug: S.SANS_SAVON, coverageFloor: 1.0, allow: false },

  // Fires on allergenicity.risk < 0.30 + no fragrance/EO/allergen flags.
  // Floors require strong axis confidence and substantial INCI coverage before
  // claiming low allergenicity.
  hypoallergenique: {
    auroreSlug: S.HYPOALLERGENIQUE,
    confidenceFloor: 0.85,
    coverageFloor: 0.7,
    allow: true,
    // Currently unreachable: declarationOnlyRisk requires risk >= 0.33, which
    // algo-derm's < 0.30 fire threshold already excludes. Kept as a guard if
    // the upstream threshold ever loosens past 0.33.
    skipIf: (a) => a.declarationOnlyRisk,
  },
  // Fires on irritation.risk < 0.35, mirrors hypoallergenique floors. No skipIf:
  // declarationOnlyRisk is allergenicity-specific, no irritation-axis equivalent.

  // requiresAbsence: algo-derm weights Parfum irritation by rank, so fragrance late in
  // a long INCI scores near zero (a formula with `Parfum, Limonene, Linalool` at the tail
  // fired at confidence 0.95). Aurore never claims non-irritant on a perfumed formula,
  // regardless of axis score.
  'non-irritant': {
    auroreSlug: S.NON_IRRITANT,
    confidenceFloor: 0.85,
    coverageFloor: 0.7,
    allow: true,
    requiresAbsence: ['sans-parfum', 'sans-allergenes-parfumants', 'sans-huiles-essentielles'],
  },
  // Checks retinoid/hydroquinone absence + pregnancy interactions. algo-derm
  // sets confidence = min(coverage, 0.85), so confidenceFloor 0.75 requires
  // >= 75 % INCI coverage in practice.
  'grossesse-compatible': {
    auroreSlug: S.GROSSESSE_COMPATIBLE,
    confidenceFloor: 0.75,
    allow: true,
  },

  // INCI absence is not a vegan signal: glycerin/squalane/stearic acid are
  // plant- or animal-derived with identical INCI names; heuristic fired on
  // 81-90 % of corpus. Brand-cert pass is the sole authoritative source for
  // the vegan slug.
  vegan: { auroreSlug: S.VEGAN, coverageFloor: 0.5, allow: false },

  // Explicit avoid signal: fires on retinoids, hydroquinone, formaldehyde donors,
  // BHA leave-on, oxybenzone/homosalate, risky EOs. Migrated from formula pass.
  // coverageFloor: 0; missing a contraindication is worse than a false positive.
  'grossesse-risque': {
    auroreSlug: S.GROSSESSE_COMPATIBLE,
    relevance: 'avoid',
    coverageFloor: 0,
    allow: true,
  },

  comedogene: {
    auroreSlug: S.COMEDOGENE,
    confidenceFloor: 0.85,
    allow: true,
    excludeRinseOff: true,
  },
  // Fires on comedogenicity.risk <= 0.25: emitted on > 60 % of corpus at 0.5.
  // Require substantial INCI coverage before claiming the product is not comedogenic.
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

// Default coverage floor for computed_score candidates. Below 0.3, a single
// ingredient match in a mostly-unrecognized formula can trigger the tag.
// Absence tags default to 0; each sets its own coverageFloor explicitly.
const COMPUTED_COVERAGE_FLOOR = 0.3

export type DropReason =
  | 'not_present'
  | 'unmapped'
  | 'disallowed'
  | 'coverage_floor'
  | 'low_confidence'
  | 'rinse_off_excluded'
  | 'leave_on_excluded'
  | 'skip_if'
  | 'requires_absence'

export interface DetectAutoTagsOptions {
  // Raises per-tag confidenceFloor globally (debug). Never lowers. Only affects
  // computed_score; absence tags use coverageMinOverride instead.
  confOverride?: number
  // Debug: surface allow:false tags. Never true at seed.
  includeDropped?: boolean
  // Raises per-tag coverageFloor globally (debug). Never lowers.
  coverageMinOverride?: number
  // Bypass both floor gates entirely. allow, excludeRinseOff, skipIf,
  // candidate.present, and unmapped checks still apply.
  disableFloors?: boolean
  // Precomputed assessment from a hoisted analyzeINCI call. Must match
  // (inci, kind): caller responsibility.
  assessment?: ProductAssessment
  // Ingredient list already split; same hoisting rationale as assessment.
  ingredients?: readonly string[]
  // Audit hook: bumps ${reason}:${candidate.id} for every dropped candidate.
  // Caller owns the Map. No-op in prod runners.
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
  // Cast: tagProduct's parameter type is mutable but it does not mutate.
  const candidates = tagProduct(assessment, ingredients as string[])
  const isRinseOff = RINSE_OFF_KINDS.has(kind)
  const coverageRatio = assessment.coverage.ratio
  // Cross-candidate gate (requiresAbsence). An absence candidate that is not
  // `present` means either "found in the formula" or "could not tell"; both
  // must void a claim of absence.
  const presentIds = new Set(candidates.filter((c) => c.present).map((c) => c.id))

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

    if (!options.disableFloors) {
      const baseFloor =
        rule.coverageFloor ?? (candidate.source === 'computed_score' ? COMPUTED_COVERAGE_FLOOR : 0)
      const effectiveFloor = Math.max(baseFloor, options.coverageMinOverride ?? 0)
      if (coverageRatio < effectiveFloor) {
        bumpDrop(drops, 'coverage_floor', candidate.id)
        continue
      }
    }

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

    if (rule.rinseOffOnly && !isRinseOff) {
      bumpDrop(drops, 'leave_on_excluded', candidate.id)
      continue
    }

    if (rule.skipIf?.(assessment)) {
      bumpDrop(drops, 'skip_if', candidate.id)
      continue
    }

    if (rule.requiresAbsence?.some((id) => !presentIds.has(id))) {
      bumpDrop(drops, 'requires_absence', candidate.id)
      continue
    }

    if (!rule.auroreSlug) continue
    results.push({
      slug: rule.auroreSlug,
      relevance: rule.relevance ?? 'secondary',
      confidence: candidate.confidence,
      source: candidate.source,
    })
  }
  return results
}
