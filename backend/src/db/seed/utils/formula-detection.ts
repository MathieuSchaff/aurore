// INCI-based formula property detection for tags that algo-derm doesn't cover.
//
// Detectors:
//   detectOcclusifTags        — `occlusif` + `step-occlusif` from position-gated ingredient patterns
//   detectSemiOcclusif        — `semi-occlusif` from squalane / dimethicone /
//                               dimethiconol / isohexadecane top 5. Leave-on
//                               only. Mutex with `occlusif` (petrolatum-led
//                               formulas stay occlusif).
//   detectSolaireTags         — `filtres-chimiques` / `filtres-mineraux` (sunscreen products only)
//   detectPrebiotique         — `prebiotique` from prebiotic/probiotic-related INCI patterns
//   detectReparationCutanee   — `reparation-cutanee` from cicatrisation/anti-inflammation actifs
//                               (panthenol, allantoin, centella, bisabolol). Distinct from
//                               algo-derm `barriere-cutanee` which keys on lipid composition
//                               (ceramides + cholesterol).
//   detectEczemaAtopie        — `eczema-atopie` from oat (colloidal oatmeal anywhere)
//                               OR ceramide-relipidant pair (≥ 2 ceramides top 12 +
//                               0 fragrance + 0 sulfate top 5). Leave-on only.
//                               Replaces algo-derm `peaux_atopiques` (allow:false,
//                               22 % corpus / 3 % agree).
//   detectRepulpant           — `repulpant` from HA top 3 + pure glycerin top 5
//                               + plumping peptide (acetyl hexapeptide-8 OR
//                               palmitoyl tripeptide-1) anywhere. Leave-on
//                               only. Replaces algo-derm `repulpant`
//                               (allow:false, fired on 78 % corpus).
//   detectKeratosePilaire     — `keratose-pilaire` from leave-on body products with
//                               keratolytic dosing (urea top 8, or lactic acid + ammonium
//                               lactate combo top 10).
//   detectStepNettoyage1      — `step-nettoyage-1` (first step of double-cleanse) from
//                               oil/balm cleansers (oil/ester pos 1-3, no ionic surfactant
//                               in top 5).
//   detectCernesPoches        — `cernes-poches` from eye creams with caffeine or peptides
//                               in top 12 INCI.
//   detectGrossesseAvoid      — `grossesse-compatible` with relevance='avoid' for contraindicated
//                               ingredients (retinoids, hydroquinone, oxybenzone, leave-on BHA)
//   detectFiniMat             — `fini-mat` + `matifiant` from absorbent powders top 8
//                               (silica, kaolin, starch, perlite, talc). T1.1 + T1.10
//                               (matifiant decoupled from algo-derm computed_score that
//                               conflated it with peau-grasse).
//   detectTextureRiche        — `texture-riche` from ≥ 2 butters/waxes top 8.
//   detectEffetProtecteur     — `effet-protecteur` from lanolin top 8 OR ≥ 2
//                               butters/waxes top 8 (delegates to texture-riche).
//                               Leave-on only. Distinct from `occlusif`
//                               (petrolatum) and `barriere-cutanee` (ceramide
//                               lipid mimicry).
//   detectTextureLegere       — `texture-legere` from water/glycerin top 3 + 0 butter/wax/
//                               petrolatum top 8 + leave-on.
//   detectFiniGlowy           — `fini-glowy` from glycerin top 3 + HA top 5 + 0 absorbent
//                               powder top 8 + 0 butter/wax/petrolatum top 8.
//   detectNonGrasAbsorption   — `non-gras` + `absorption-rapide` from serum/eye-cream with
//                               silicones top 5 + 0 vegetable oil top 5.
//   detectPigmentsVerts       — `pigments-verts` from CI 77288 / chromium oxide/hydroxide green.
//   detectVegan               — `vegan` from absence of animal-derived INCI patterns
//                               (precision-first: ≥ 5 ingredients to claim).

import type { ProductKind, ProductTexture } from '@habit-tracker/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS, type SkincareProductTagSlug } from '@habit-tracker/shared'

import { resolveIngredients } from './ingredient-resolver'

const S = SKINCARE_PRODUCT_TAG_SLUGS

// ─── Occlusif ─────────────────────────────────────────────────────────────────
// True occlusives form a physical barrier; clinically relevant only when at
// meaningful concentration (top 8 INCI). Squalane / dimethicone are excluded:
// they are semi-occlusive emollients, not film-formers.

const OCCLUSIVE_PATTERNS = [
  'petrolatum',
  'vaseline',
  'paraffinum liquidum',
  'paraffin wax',
  'cera microcristallina',
  'microcrystalline wax',
  'lanolin',
  'lanolin alcohol',
  'lanolin oil',
  'wool wax',
  'beeswax',
  'cera alba',
  'carnauba wax',
  'candelilla wax',
  'shea butter', // butyrospermum parkii — semi-occlusive at high concentration
  'mango butter', // mangifera indica seed butter
]

const OCCLUSIVE_POSITION_CAP = 8

export function detectOcclusifTags(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const limit = Math.min(ingredients.length, OCCLUSIVE_POSITION_CAP)

  for (let i = 0; i < limit; i++) {
    if (OCCLUSIVE_PATTERNS.some((p) => ingredients[i].includes(p))) {
      return [S.OCCLUSIF, S.STEP_OCCLUSIF]
    }
  }
  return []
}

// ─── Semi-occlusif ────────────────────────────────────────────────────────────
// Emollient occlusion (TEWL reduction without forming an impermeable film).
// Distinct from `occlusif` (petrolatum/lanolin/waxes — true film-formers).
// Position cap is tighter (top 5) than occlusif (top 8): below pos 5 these
// emollients are present at trace level and don't drive sensoriel/barrier
// behavior. Mutex with `occlusif`: a petrolatum-led formula is functionally
// occlusif even if squalane sits at pos 4 — emitting both blurs the
// semantic split (R4 spec).
//
// Pattern coverage:
//   - `squalane`  — substring stops at the trailing 'ne' so `squalene`
//     (animal-derived sebum lipid, INCI distinct) does NOT match.
//   - `dimethicone` + `dimethiconol` — explicit list (substring `dimethicone`
//     does not match `dimethiconol`). Cyclic silicones (cyclomethicone,
//     cyclopentasiloxane) excluded — volatile, evaporate from skin.
//   - `isohexadecane` — branched hydrocarbon emollient.

const SEMI_OCCLUSIF_PATTERNS = ['squalane', 'dimethicone', 'dimethiconol', 'isohexadecane']
const SEMI_OCCLUSIF_POSITION_CAP = 5

const SEMI_OCCLUSIF_RINSE_OFF_KINDS = new Set<ProductKind>([
  'cleanser',
  'shampoo',
  'conditioner',
  'body-wash',
  'body-scrub',
  'mouthwash',
])

export function detectSemiOcclusif(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (SEMI_OCCLUSIF_RINSE_OFF_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  // Mutex with occlusif: if a true film-former is present in top 8, the
  // formula is occlusif — emitting semi-occlusif on top would dilute the
  // distinction.
  const occlusifLimit = Math.min(ingredients.length, OCCLUSIVE_POSITION_CAP)
  for (let i = 0; i < occlusifLimit; i++) {
    if (OCCLUSIVE_PATTERNS.some((p) => ingredients[i].includes(p))) return []
  }

  const limit = Math.min(ingredients.length, SEMI_OCCLUSIF_POSITION_CAP)
  for (let i = 0; i < limit; i++) {
    if (SEMI_OCCLUSIF_PATTERNS.some((p) => ingredients[i].includes(p))) {
      return [S.SEMI_OCCLUSIF]
    }
  }
  return []
}

// ─── Solaire filters ──────────────────────────────────────────────────────────
// Only emitted for sunscreen/solaire products. Chemical and mineral filters
// are mutually exclusive in the return (a product can have both — emit both).

const CHEMICAL_FILTER_PATTERNS = [
  'avobenzone',
  'butyl methoxydibenzoylmethane',
  'octocrylene',
  'homosalate',
  'octisalate',
  'ethylhexyl salicylate',
  'ethylhexyl methoxycinnamate',
  'octyl methoxycinnamate',
  'benzophenone',
  'oxybenzone',
  'sulisobenzone',
  'mexoryl sl',
  'mexoryl sx',
  'mexoryl xl',
  'tinosorb s',
  'tinosorb m',
  'bisoctrizole',
  'bemotrizinol',
  'iscotrizinol',
  'drometrizole',
  'ecamsule',
  'phenylbenzimidazole',
  'ensulizole',
]

const MINERAL_FILTER_PATTERNS = ['zinc oxide', 'titanium dioxide']

// `kind` values that are sunscreen products
const SOLAIRE_KINDS = new Set<ProductKind>(['sunscreen', 'after-sun', 'self-tanner'])

export function detectSolaireTags(
  inci: string | null | undefined,
  kind: ProductKind,
  category: string,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  // Only run on sunscreen products — zinc oxide / titanium dioxide appear in other
  // formulas (cica creams, dentifrices, makeup) where the filter tag would be wrong.
  if (!SOLAIRE_KINDS.has(kind) && category !== 'solaire') return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  const tags: SkincareProductTagSlug[] = []

  if (ingredients.some((ing) => CHEMICAL_FILTER_PATTERNS.some((p) => ing.includes(p)))) {
    tags.push(S.FILTRES_CHIMIQUES)
  }
  if (ingredients.some((ing) => MINERAL_FILTER_PATTERNS.some((p) => ing.includes(p)))) {
    tags.push(S.FILTRES_MINERAUX)
  }

  return tags
}

// ─── Prebiotique ──────────────────────────────────────────────────────────────
// Prebiotic / probiotic INCI patterns. Ferments are included (probiotics):
// they deliver live or lysed microbiome-active material.

const PREBIOTIC_PATTERNS = [
  'inulin',
  'fructooligosaccharide',
  'oligofructose',
  'lactulose',
  'lactose',
  'galactooligosaccharide',
  'xylooligosaccharide',
  'chicory root extract',
  'cichorium intybus root extract',
  // Ferments / probiotics
  'bifida ferment lysate',
  'bifida ferment',
  'lactobacillus ferment',
  'lactococcus ferment',
  'streptococcus ferment',
  'saccharomyces ferment',
  'lactobacillus',
  'bifidobacterium',
]

export function detectPrebiotique(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const found = ingredients.some((ing) => PREBIOTIC_PATTERNS.some((p) => ing.includes(p)))
  return found ? [S.PREBIOTIQUE] : []
}

// ─── Reparation-cutanee ───────────────────────────────────────────────────────
// Cicatrisation / anti-inflammation actifs. Distinct from `barriere-cutanee`
// (algo-derm — keys on ceramide + cholesterol lipid composition). Position
// cap 12: these actifs are typically dosed 0.1-2 % and stay early enough in
// INCI when functional; past that, they're texture polish / preservative
// boosters.

const REPARATION_CUTANEE_PATTERNS = [
  'panthenol', // provitamin B5 — covers d-panthenol, dl-panthenol
  'allantoin',
  'centella asiatica', // catches "centella asiatica extract", "leaf extract", etc.
  'asiaticoside', // centella-derived isolate
  'madecassoside',
  'bisabolol', // alpha-bisabolol
]

const REPARATION_POSITION_CAP = 12

export function detectReparationCutanee(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const limit = Math.min(ingredients.length, REPARATION_POSITION_CAP)

  for (let i = 0; i < limit; i++) {
    if (REPARATION_CUTANEE_PATTERNS.some((p) => ingredients[i].includes(p))) {
      return [S.REPARATION]
    }
  }
  return []
}

// ─── Eczema-atopie ────────────────────────────────────────────────────────────
// Atopic-friendly formula. Two triggers:
//   A) `avena sativa kernel` anywhere in INCI — colloidal oatmeal (kernel
//      flour / kernel extract / kernel oil) is the FDA-recognized OTC skin
//      protectant for eczema (avenanthramides + beta-glucans). `avena sativa
//      flower/leaf/stem juice` is excluded: different botanical part, not
//      OTC-recognized, common as a generic soothing actif in non-AD products.
//   B) ≥ 2 distinct ceramide variants in top 12 AND 0 fragrance keyword AND
//      0 ionic sulfate surfactant in top 5. Single ceramide is hydration
//      polish; pairs target stratum-corneum lipid replenishment (CeraVe,
//      Avène Tolerance, La Roche-Posay Lipikar). Fragrance is the most-cited
//      AD flare trigger — exclude any `parfum`/`fragrance`/`aroma` declaration.
//      Sulfates are barrier-disrupting on AD-prone skin.
//
// Leave-on only: rinse-off contact time too short for either pathway to matter
// (Lodén 2003 on cumulative surfactant exposure; oat OTC label requires
// "leave on the affected area" usage).
//
// Algo-derm `peaux_atopiques` mapping is kept `allow:false` (auto-tag-detection.ts)
// — it fires on 22 % corpus / 3 % agree, too permissive. This formula-pass
// detector replaces it with a chemistry-aware ruleset.

const ATOPIE_OAT_PATTERN = 'avena sativa kernel'

// Mirror actif-class CERAMIDES patterns (single source of truth would import
// ACTIF_CLASS_DEFS, but coupling is heavier than the duplication cost — these
// patterns are stable taxonomy). Keep aligned with actif-class-detection.ts.
const ATOPIE_CERAMIDE_PATTERNS = [
  'ceramide np',
  'ceramide ap',
  'ceramide ns',
  'ceramide ng',
  'ceramide as',
  'ceramide eop',
  'ceramide eos',
  'ceramide 1',
  'ceramide 2',
  'ceramide 3',
  'ceramide 6',
]

// Functional concentration: ceramides past pos 12 are dosage trace, not the
// CeraVe-style relipidant claim eczema-friendly formulas are built around.
const ATOPIE_CERAMIDE_POSITION_CAP = 12

// Substring match: the slash-form `PARFUM/FRAGRANCE` normalizes to a single
// `parfum fragrance` token (algo-derm parser collapses `/` to space), which
// would slip past an exact-match check. `aroma` substring carries minimal
// FP risk — no common INCI ingredient embeds it as a substring.
const ATOPIE_FRAGRANCE_PATTERNS = ['parfum', 'fragrance', 'aroma']

const ATOPIE_SULFATE_POSITION_CAP = 5

const ATOPIE_RINSE_OFF_KINDS = new Set<ProductKind>([
  'cleanser',
  'shampoo',
  'conditioner',
  'body-wash',
  'body-scrub',
  'mouthwash',
])

export function detectEczemaAtopie(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (ATOPIE_RINSE_OFF_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  // Trigger A: oatmeal anywhere → atopie-friendly regardless of other actifs
  if (ingredients.some((ing) => ing.includes(ATOPIE_OAT_PATTERN))) {
    return [S.ECZEMA_ATOPIE]
  }

  // Trigger B: ceramide relipidant pair + fragrance-free + no sulfate top 5
  const ceramideCap = Math.min(ingredients.length, ATOPIE_CERAMIDE_POSITION_CAP)
  let ceramideHits = 0
  for (let i = 0; i < ceramideCap; i++) {
    if (ATOPIE_CERAMIDE_PATTERNS.some((p) => ingredients[i].includes(p))) {
      ceramideHits++
      if (ceramideHits >= 2) break
    }
  }
  if (ceramideHits < 2) return []

  if (ingredients.some((ing) => ATOPIE_FRAGRANCE_PATTERNS.some((p) => ing.includes(p)))) {
    return []
  }

  const sulfateCap = Math.min(ingredients.length, ATOPIE_SULFATE_POSITION_CAP)
  for (let i = 0; i < sulfateCap; i++) {
    if (IONIC_SURFACTANT_PATTERNS.some((p) => ingredients[i].includes(p))) return []
  }

  return [S.ECZEMA_ATOPIE]
}

// ─── Repulpant ────────────────────────────────────────────────────────────────
// Plumping claim — hydrate-fill-smooth lines. Algo-derm `repulpant` was
// previously emitted at minConf 0.5 on 78 % of corpus (any HA/glycerin
// moisturizer) and disabled (auto-tag-detection.ts allow:false). This
// formula-pass detector restricts emission to formulas with all three
// signals co-present:
//
//   - Hyaluronate (any variant — substring `hyaluron`) in top 8 INCI.
//     Plumping peptide serums dose the peptide as headline actif (pos 3-6)
//     and HA as supporting humectant (pos 5-8). Top 8 is the functional
//     bound — past that, HA is texture polish trace.
//   - Pure glycerin (exact token, not `glyceryl stearate` or other esters)
//     in top 5. Confirms the humectant base behind HA.
//   - At least one canonical plumping peptide anywhere in INCI:
//     `acetyl hexapeptide-8` (Argireline — neuromodulator) or
//     `palmitoyl tripeptide-1` (signaling peptide for collagen). Both
//     are dosed mg-range, sit deep in INCI; presence ≥ 1 = formulary
//     intent (clinical INCI declarations require minimum 0.001 % dose).
//
// Leave-on only. Algo-derm `repulpant` stays `allow:false` — same
// cohabitation pattern as `peaux_atopiques` / eczema-atopie.

const REPULPANT_HA_PATTERN = 'hyaluron'
const REPULPANT_HA_POSITION_CAP = 8
const REPULPANT_GLYCERIN_TOKEN = 'glycerin'
const REPULPANT_GLYCERIN_POSITION_CAP = 5
const REPULPANT_PEPTIDE_PATTERNS = ['acetyl hexapeptide-8', 'palmitoyl tripeptide-1']

const REPULPANT_RINSE_OFF_KINDS = new Set<ProductKind>([
  'cleanser',
  'shampoo',
  'conditioner',
  'body-wash',
  'body-scrub',
  'mouthwash',
])

export function detectRepulpant(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (REPULPANT_RINSE_OFF_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  // HA top 3
  const haCap = Math.min(ingredients.length, REPULPANT_HA_POSITION_CAP)
  let haFound = false
  for (let i = 0; i < haCap; i++) {
    if (ingredients[i].includes(REPULPANT_HA_PATTERN)) {
      haFound = true
      break
    }
  }
  if (!haFound) return []

  // Pure glycerin top 5 (exact token: glyceryl-stearate / glyceryl-cocoate
  // are esters, not the humectant)
  const glyCap = Math.min(ingredients.length, REPULPANT_GLYCERIN_POSITION_CAP)
  let glycerinFound = false
  for (let i = 0; i < glyCap; i++) {
    if (ingredients[i] === REPULPANT_GLYCERIN_TOKEN) {
      glycerinFound = true
      break
    }
  }
  if (!glycerinFound) return []

  // At least one plumping peptide anywhere
  const peptideFound = ingredients.some((ing) =>
    REPULPANT_PEPTIDE_PATTERNS.some((p) => ing.includes(p))
  )
  if (!peptideFound) return []

  return [S.REPULPANT]
}

// ─── Keratose-pilaire ─────────────────────────────────────────────────────────
// KP-specific signal for body leave-on products. Two triggers:
//   A) Urea in top 8 INCI — at functional keratolytic concentration (≥ 10 %)
//      urea sits early. Tail urea is humectant trace (< 5 %) and won't help KP.
//   B) Lactic acid + ammonium lactate both in top 10 — the AmLactin / Lac-Hydrin
//      buffered-lactate format used clinically for KP. Either alone is just a
//      pH adjuster, but the combo signals the buffered formulation.
//
// Eligible kinds: body-lotion, body-oil. Exclude rinse-off (wash, scrub) —
// contact time too short for keratolysis. Exclude hand/foot cream — different
// concern domain (cracked skin, not the perifollicular bumps of KP).

const KP_ELIGIBLE_KINDS = new Set<ProductKind>(['body-lotion', 'body-oil'])
const KP_UREA_POSITION_CAP = 8
const KP_LACTATE_POSITION_CAP = 10

export function detectKeratosePilaire(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (!KP_ELIGIBLE_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  // Trigger A: urea at functional concentration (top 8)
  const ureaCap = Math.min(ingredients.length, KP_UREA_POSITION_CAP)
  for (let i = 0; i < ureaCap; i++) {
    if (ingredients[i].includes('urea')) return [S.KERATOSE_PILAIRE]
  }

  // Trigger B: lactic acid + ammonium lactate combo (top 10 each)
  const lactateCap = Math.min(ingredients.length, KP_LACTATE_POSITION_CAP)
  let hasLactic = false
  let hasAmmoniumLactate = false
  for (let i = 0; i < lactateCap; i++) {
    if (ingredients[i].includes('lactic acid')) hasLactic = true
    if (ingredients[i].includes('ammonium lactate')) hasAmmoniumLactate = true
    if (hasLactic && hasAmmoniumLactate) return [S.KERATOSE_PILAIRE]
  }

  return []
}

// ─── Step-nettoyage-1 ─────────────────────────────────────────────────────────
// First step of a double-cleanse: oil/balm cleanser. Used to dissolve sebum,
// makeup, and sunscreen before a water-based second cleanser. Distinguishing
// signal:
//   - oil or ester emollient in top 3 INCI (formula is oil-dominant)
//   - no high-charge ionic surfactant in top 5 (rules out foaming gels and
//     classic sulfate-based cleansers, which are step-nettoyage-2 territory)

const OIL_BALM_PATTERNS = [
  // Vegetable oils / butters
  'caprylic capric triglyceride',
  'olea europaea',
  'helianthus annuus',
  'simmondsia chinensis',
  'argania spinosa',
  'macadamia',
  'cocos nucifera',
  'butyrospermum parkii',
  'theobroma cacao',
  'persea gratissima',
  'prunus amygdalus',
  'oryza sativa',
  'camellia',
  // Mineral oils
  'mineral oil',
  'paraffinum liquidum',
  // Ester emollients
  'ethylhexyl palmitate',
  'isopropyl myristate',
  'isopropyl palmitate',
  'isohexadecane',
  'octyldodecanol',
  'cetearyl ethylhexanoate',
  'coco-caprylate',
  'cetiol',
  // Squalane
  'squalane',
  // PEG-based oil-cleanser surfactants (mild, oil-soluble)
  'peg-7 glyceryl cocoate',
  'peg-20 glyceryl triisostearate',
]

// Aligned with algo-derm `sulfate_surfactant` heuristic group rule
// `[lauryl, laureth, myreth, coco, cetearyl, coceth] × [sulfate]`. Each
// alkyl variant listed explicitly here so substring matcher catches
// `Sodium Coco-Sulfate`, `Disodium Coceth Sulfate`, etc. — without these,
// foam cleansers using SLES alternatives would slip through and FP-tag
// as `step-nettoyage-1` (oil cleanser). Sulfonate kept for olefin-type
// anionic surfactants.
const IONIC_SURFACTANT_PATTERNS = [
  'lauryl sulfate', // SLS, ammonium/magnesium lauryl sulfate
  'laureth sulfate', // SLES family
  'myreth sulfate',
  'coco sulfate',
  'coco-sulfate', // hyphenated INCI variant (Sodium Coco-Sulfate)
  'cetearyl sulfate',
  'coceth sulfate',
  'olefin sulfonate',
]

const STEP1_OIL_POSITION_CAP = 3
const STEP1_SURFACTANT_EXCLUSION_CAP = 5

export function detectStepNettoyage1(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (kind !== 'cleanser') return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  // Trigger A: oil/ester in top 3
  const oilCap = Math.min(ingredients.length, STEP1_OIL_POSITION_CAP)
  let oilFound = false
  for (let i = 0; i < oilCap; i++) {
    if (OIL_BALM_PATTERNS.some((p) => ingredients[i].includes(p))) {
      oilFound = true
      break
    }
  }
  if (!oilFound) return []

  // Trigger B: no ionic surfactant in top 5 (rules out foaming gel cleansers)
  const surfCap = Math.min(ingredients.length, STEP1_SURFACTANT_EXCLUSION_CAP)
  for (let i = 0; i < surfCap; i++) {
    if (IONIC_SURFACTANT_PATTERNS.some((p) => ingredients[i].includes(p))) return []
  }

  return [S.STEP_NETTOYAGE_1]
}

// ─── Cernes-poches ────────────────────────────────────────────────────────────
// Eye-area concern. Caffeine = vasoconstrictor (dark circles) + decongestant
// (puffiness). Peptides = microcirculation / firmness. Detection only on
// `eye-cream` kind to avoid tagging serums/moisturizers that incidentally
// contain peptides for non-periorbital reasons.

const CERNES_PATTERNS = [
  'caffeine',
  'peptide', // covers acetyl hexapeptide-N, palmitoyl tripeptide-N, etc.
  'matrixyl',
  'argireline',
]

const CERNES_POSITION_CAP = 12

export function detectCernesPoches(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (kind !== 'eye-cream') return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const cap = Math.min(ingredients.length, CERNES_POSITION_CAP)

  for (let i = 0; i < cap; i++) {
    if (CERNES_PATTERNS.some((p) => ingredients[i].includes(p))) {
      return [S.CERNES_POCHES]
    }
  }
  return []
}

// ─── Grossesse-compatible : avoid ────────────────────────────────────────────
// Returns the `grossesse-compatible` slug when the product contains ingredients
// that are contraindicated during pregnancy. Relevance='avoid' — caller must
// ensure this takes priority over any `secondary` (compatible) signal for the
// same product.
//
// Contraindication tiers:
//   TIER 1 (clear avoid): retinoids — topical vitamin-A derivatives, teratogenic
//     risk extrapolated from oral forms; universal consensus to avoid.
//   TIER 1: hydroquinone — much higher percutaneous absorption than most actifs.
//   TIER 1: formaldehyde donors — slow-release formaldehyde (IARC group 1
//     carcinogen, crosses placenta). Functional even at preservative trace
//     levels, so no position gating.
//   TIER 2 (avoid in leave-on / functional concentration): salicylic acid BHA —
//     low-dose rinse-off (cleanser, body wash) is generally accepted; leave-on
//     at functional concentration (top 10 INCI) flagged here.
//   TIER 2: oxybenzone (benzophenone-3) — most absorbed UV filter; leading
//     dermatology societies recommend preferring mineral alternatives.
//     Flag only for sunscreen products (oxybenzone appears in other formulas
//     as a photostabilizer at trace amounts).
//   TIER 2: homosalate — SCCS 2022 reduced max dermal exposure to 7.34 % then
//     2.2 % over endocrine-disruption uncertainty. Flag for sunscreen products
//     only (rare elsewhere).
//   TIER 2: risky essential oils at functional concentration (top 8 INCI) —
//     peppermint (menthol, CYP inhibition), clary sage (sclareol, estrogen-
//     like activity), rosemary verbenone chemotype (neurotoxic ketones).
//     Distinguished from non-EO botanical extracts by requiring `oil` in the
//     same INCI token as the genus name.

// Extended retinoid list — algo-derm `grossesse-compatible` check already
// excludes these from the `present=true` path, but we need them here to
// emit the explicit `avoid` signal. Stays in sync with
// `actif-class-detection.ts:RETINOIDS.patterns` — when adding a new retinoid
// derivative, update both lists (the actif-class cluster drives discovery,
// this list drives the safety avoid).
const RETINOID_PATTERNS = [
  'retinol',
  'retinal',
  'retinaldehyde',
  'retinyl palmitate',
  'retinyl acetate',
  'retinyl propionate',
  'retinyl linoleate',
  'retinyl retinoate',
  'hydroxypinacolone retinoate', // HPR / Granactive Retinoid
  'granactive retinoid',
  'sodium retinoyl hyaluronate', // retinyl ester on hyaluronate backbone
  'tretinoin',
  'isotretinoin',
  'adapalene',
  'tazarotene',
  'trifarotene',
]

// Oxybenzone is flagged only for sunscreen products — it also appears as a
// photostabilizer in non-SPF formulas at negligible concentrations.
const OXYBENZONE_PATTERNS = [
  'oxybenzone',
  'benzophenone-3',
  'benzophenone-4', // sulisobenzone, still in the benzophenone family
  'sulisobenzone',
]

const BHA_LEAVEON_PATTERNS = ['salicylic acid', 'betaine salicylate']

// Homosalate INCI synonyms — flagged only for sunscreen kinds. SCCS 2022 limit
// 2.2 % reflects endocrine-disruption uncertainty; pregnancy = avoid.
const HOMOSALATE_PATTERNS = ['homosalate', 'homomenthyl salicylate']

// Formaldehyde donors / releasers — preservatives that hydrolyze to release
// formaldehyde over time. Functional at trace amounts → no position gating.
const FORMALDEHYDE_DONOR_PATTERNS = [
  'dmdm hydantoin',
  'diazolidinyl urea',
  'imidazolidinyl urea',
  'quaternium-15',
  'bronopol',
  'sodium hydroxymethylglycinate',
  'methenamine',
  'benzylhemiformal',
  '5-bromo-5-nitro-13-dioxane', // bronidox; comma stripped by normalize
]

// Risky essential oils — flagged only when the INCI token contains both the
// genus name and "oil", to exclude botanical extracts (leaf extract, water,
// etc.) that share the latin name but lack the volatile-compound load.
// `rosmarinus officinalis` is also a polyphenol cluster pattern (leaf extract);
// the `oil` co-occurrence here ensures only the EO chemotype is flagged.
const RISKY_EO_GENERA = ['mentha piperita', 'salvia sclarea', 'rosmarinus officinalis']
const ESSENTIAL_OIL_TOKEN = 'oil'
const RISKY_EO_POSITION_CAP = 8

// Rinse-off kinds — salicylic acid in these formats has very short contact
// time and is generally considered acceptable by professional consensus.
const RINSEON_KINDS = new Set<string>([
  'cleanser',
  'body-wash',
  'mask', // rinse-off mask; patch is leave-on but contains very low actif surface
  'exfoliant', // typically rinsed off
])

const BHA_POSITION_CAP = 10 // must be in top 10 INCI to be at functional concentration

export function detectGrossesseAvoid(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): boolean {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return false

  // Tier 1: retinoids — any presence, any format
  if (ingredients.some((ing) => RETINOID_PATTERNS.some((p) => ing.includes(p)))) return true

  // Tier 1: hydroquinone
  if (ingredients.some((ing) => ing.includes('hydroquinone'))) return true

  // Tier 1: formaldehyde donors (no position gating — functional at trace)
  if (ingredients.some((ing) => FORMALDEHYDE_DONOR_PATTERNS.some((p) => ing.includes(p))))
    return true

  // Tier 2: sunscreen-only filters
  if (SOLAIRE_KINDS.has(kind)) {
    if (ingredients.some((ing) => OXYBENZONE_PATTERNS.some((p) => ing.includes(p)))) return true
    if (ingredients.some((ing) => HOMOSALATE_PATTERNS.some((p) => ing.includes(p)))) return true
  }

  // Tier 2: salicylic acid in leave-on formats, functional concentration only
  if (!RINSEON_KINDS.has(kind)) {
    const cap = Math.min(ingredients.length, BHA_POSITION_CAP)
    for (let i = 0; i < cap; i++) {
      if (BHA_LEAVEON_PATTERNS.some((p) => ingredients[i].includes(p))) return true
    }
  }

  // Tier 2: risky essential oils at functional concentration (top 8 INCI),
  // identified by genus + "oil" co-occurrence in the same token.
  const eoCap = Math.min(ingredients.length, RISKY_EO_POSITION_CAP)
  for (let i = 0; i < eoCap; i++) {
    const ing = ingredients[i]
    if (!ing.includes(ESSENTIAL_OIL_TOKEN)) continue
    if (RISKY_EO_GENERA.some((g) => ing.includes(g))) return true
  }

  return false
}

// ─── Fini-mat / matifiant ────────────────────────────────────────────────────
// Absorbent / mattifying powders. Functional only when in top 8 (past that
// they're texture polish without enough mass to absorb sebum). Emits both
// `fini-mat` (sensoriel) and `matifiant` (skin_effect): same trigger, two
// axes. `matifiant` was previously dropped from algo-derm TAG_CONFIG (its
// `computed_score` rule conflated the slug with `peau-grasse` set membership);
// here we tie it to actual absorbent ingredients, not skin-type inference.
//
// `talc` is included for legacy makeup/skincare hybrids; its safety status
// (asbestos-free) is a separate concern handled at the brand level.

const ABSORBENT_PATTERNS = [
  'silica',
  'kaolin',
  'perlite',
  'talc',
  'corn starch',
  'zea mays starch',
  'oryza sativa starch',
  'rice starch',
  'tapioca starch',
  'maranta arundinacea',
  'aluminum starch',
  'starch', // catch-all for the *starch suffix; comes last so specifics rank first
]

const ABSORBENT_POSITION_CAP = 8

export function detectFiniMat(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const cap = Math.min(ingredients.length, ABSORBENT_POSITION_CAP)

  for (let i = 0; i < cap; i++) {
    if (ABSORBENT_PATTERNS.some((p) => ingredients[i].includes(p))) {
      return [S.FINI_MAT, S.MATIFIANT]
    }
  }
  return []
}

// ─── Texture-riche ───────────────────────────────────────────────────────────
// ≥ 2 butters / waxes in top 8 — signals a heavy, balm-ish texture. One butter
// alone is usually a texture polish; two means the formula is butter-driven.

const BUTTER_WAX_PATTERNS = [
  'butyrospermum parkii', // shea butter
  'shea butter',
  'mangifera indica', // mango butter
  'mango butter',
  'theobroma cacao', // cocoa butter
  'cocoa butter',
  'cera alba', // beeswax
  'beeswax',
  'cera carnauba',
  'carnauba wax',
  'copernicia cerifera',
  'candelilla wax',
  'euphorbia cerifera', // candelilla wax by INCI botanical name
  'cera microcristallina',
  'microcrystalline wax',
  'cocoa seed butter',
]

const TEXTURE_RICHE_POSITION_CAP = 8

export function detectTextureRiche(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const cap = Math.min(ingredients.length, TEXTURE_RICHE_POSITION_CAP)

  // Each pattern can only count once (avoid 'butyrospermum parkii' + 'shea butter'
  // double-counting on a single ingredient that contains both substrings).
  const matchedPatterns = new Set<string>()
  for (let i = 0; i < cap; i++) {
    for (const p of BUTTER_WAX_PATTERNS) {
      if (matchedPatterns.has(p)) continue
      if (ingredients[i].includes(p)) {
        matchedPatterns.add(p)
        break
      }
    }
  }

  // Synonym dedup: if both 'butyrospermum parkii' and 'shea butter' matched (same
  // ingredient), still only one butter. Group by canonical name.
  const canonicalGroups: Array<readonly string[]> = [
    ['butyrospermum parkii', 'shea butter'],
    ['mangifera indica', 'mango butter'],
    ['theobroma cacao', 'cocoa butter', 'cocoa seed butter'],
    ['cera alba', 'beeswax'],
    ['cera carnauba', 'carnauba wax', 'copernicia cerifera'],
    ['candelilla wax', 'euphorbia cerifera'],
    ['cera microcristallina', 'microcrystalline wax'],
  ]
  let groupHits = 0
  for (const group of canonicalGroups) {
    if (group.some((p) => matchedPatterns.has(p))) groupHits++
  }
  // Standalone patterns not in any group
  const grouped = new Set(canonicalGroups.flat())
  for (const p of matchedPatterns) {
    if (!grouped.has(p)) groupHits++
  }

  return groupHits >= 2 ? [S.TEXTURE_RICHE] : []
}

// ─── Effet-protecteur ────────────────────────────────────────────────────────
// Skin_effect for film-forming protective formulas. Distinct from `occlusif`
// (petrolatum/vaseline-driven barrier) and from `barriere-cutanee` concern
// (lipid-mimicry: ceramides + cholesterol). Two triggers:
//
//   A) Lanolin (any variant — lanolin / lanolin alcohol / hydrogenated lanolin)
//      in top 8. Lanolin alone is a strong protective film-former (Lansinoh /
//      Aquaphor nipple-balm chemistry, cradle cap, cracked-skin care). Distinct
//      enough that single-token presence justifies the slug.
//
//   B) ≥ 2 distinct butter/wax groups in top 8. Reuses `detectTextureRiche`
//      (same shea/cocoa/cera-alba/carnauba/candelilla/microcristallina set with
//      synonym dedup). Heavy butter formulas form a protective layer on top
//      of texture richness — slugs co-fire deliberately.
//
// Leave-on only: rinse-off contact time too short for either pathway to claim
// a sustained protective film.

const EFFET_PROTECTEUR_LANOLIN_PATTERN = 'lanolin'
const EFFET_PROTECTEUR_LANOLIN_POSITION_CAP = 8

const EFFET_PROTECTEUR_RINSE_OFF_KINDS = new Set<ProductKind>([
  'cleanser',
  'shampoo',
  'conditioner',
  'body-wash',
  'body-scrub',
  'mouthwash',
])

export function detectEffetProtecteur(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (EFFET_PROTECTEUR_RINSE_OFF_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  // Trigger A: lanolin top 8
  const lanolinCap = Math.min(ingredients.length, EFFET_PROTECTEUR_LANOLIN_POSITION_CAP)
  for (let i = 0; i < lanolinCap; i++) {
    if (ingredients[i].includes(EFFET_PROTECTEUR_LANOLIN_PATTERN)) {
      return [S.EFFET_PROTECTEUR]
    }
  }

  // Trigger B: ≥ 2 butter/wax groups (delegate to texture-riche's calibrated
  // dedup logic — same chemistry, both tags emit when the trigger fires).
  // Forward hoisted ingredients so texture-riche reuses the same array.
  if (detectTextureRiche(inci, ingredients).length > 0) return [S.EFFET_PROTECTEUR]

  return []
}

// ─── Texture-legere ──────────────────────────────────────────────────────────
// Light, watery feel. Signals: water or glycerin in top 3, no butter/wax/
// petrolatum in top 8, leave-on (rinse-off cleansers/washes are not "lightweight"
// in the leave-on sensoriel sense — they're rinsed, sensoriel doesn't apply).

const WATER_TOKENS = ['aqua', 'water', 'eau']
const HEAVY_EXCLUSION_PATTERNS = [
  ...BUTTER_WAX_PATTERNS,
  'petrolatum',
  'lanolin',
  'paraffinum liquidum',
  'paraffin wax',
]

const TEXTURE_LEGERE_RINSE_OFF = new Set<ProductKind>([
  'balm', // balms are inherently rich — never light
  'cleanser',
  'body-wash',
  'body-scrub',
  'mask',
])

export function detectTextureLegere(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (TEXTURE_LEGERE_RINSE_OFF.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length < 3) return []

  // Trigger A: water or glycerin in top 3
  const top3 = ingredients.slice(0, 3)
  const hasLightBase =
    top3.some((ing) => WATER_TOKENS.some((t) => ing.includes(t))) ||
    top3.some((ing) => ing.includes('glycerin'))
  if (!hasLightBase) return []

  // Exclusion: any heavy butter/wax/petrolatum in top 8
  const cap = Math.min(ingredients.length, 8)
  for (let i = 0; i < cap; i++) {
    if (HEAVY_EXCLUSION_PATTERNS.some((p) => ingredients[i].includes(p))) return []
  }

  return [S.TEXTURE_LEGERE]
}

// ─── Fini-glowy ──────────────────────────────────────────────────────────────
// Dewy / luminous finish. Signals: glycerin in top 3 (humectant moisture pull),
// hyaluronic acid in top 5 (plumping water reservoir), absence of mattifying
// powders in top 8 (would kill the sheen), and absence of butter/wax/petrolatum
// in top 8 (heavy formulas don't read as dewy — they read as rich balm, which
// is mutually exclusive sensoriel with glowy). Stricter than texture-legere — a
// product can be light without being glowy (gel-creams with silicones).

// Stays in sync with `actif-class-detection.ts:HYALURONIC_ACID.patterns`.
// `hydrolyzed sodium hyaluronate` is covered by the `sodium hyaluronate`
// substring match but listed explicitly for grep visibility.
const HA_PATTERNS = [
  'hyaluronic acid',
  'sodium hyaluronate',
  'hydrolyzed hyaluronic acid',
  'sodium acetylated hyaluronate',
  'hydrolyzed sodium hyaluronate',
  'hydroxypropyltrimonium hyaluronate',
  'potassium hyaluronate',
  'sodium hyaluronate crosspolymer',
]

export function detectFiniGlowy(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length < 3) return []

  // Glycerin in top 3
  const top3 = ingredients.slice(0, 3)
  if (!top3.some((ing) => ing.includes('glycerin'))) return []

  // HA in top 5
  const top5 = ingredients.slice(0, Math.min(ingredients.length, 5))
  if (!top5.some((ing) => HA_PATTERNS.some((p) => ing.includes(p)))) return []

  // No absorbent powder in top 8 (would mattify the finish), no heavy
  // butter/wax/petrolatum top 8 (mutex with texture-riche / occlusif).
  const top8 = ingredients.slice(0, Math.min(ingredients.length, 8))
  for (const ing of top8) {
    if (ABSORBENT_PATTERNS.some((p) => ing.includes(p))) return []
    if (HEAVY_EXCLUSION_PATTERNS.some((p) => ing.includes(p))) return []
  }

  return [S.FINI_GLOWY]
}

// ─── Non-gras + absorption-rapide ────────────────────────────────────────────
// Light leave-on formats (serum, eye-cream) where a silicone in top 5 carries
// the texture and zero vegetable oil sits in top 5. Emitted as a pair —
// `non-gras` (sensation) and `absorption-rapide` (sensation) describe the
// same formula property from two axes.

const NON_GRAS_KINDS = new Set<ProductKind>(['serum', 'eye-cream'])

// Aligned with algo-derm `silicone` heuristic (data/rules/heuristic_rules.json).
// Excluded patterns:
//   - 'amodimethicone' — haircare conditioner, not a skincare texture carrier;
//   - 'siloxane' / 'silanol' — too broad, would over-tag obscure end-group variants.
// When the orchestrator hoists `assessment.heuristicFlags`, replace this list
// with `flags.has('silicone')` (audit §C.1, B.4).
const SILICONE_LIGHT_PATTERNS = [
  'dimethicone',
  'dimethiconol',
  'cyclopentasiloxane',
  'cyclomethicone',
  'cyclohexasiloxane',
  'isohexadecane',
  'phenyl trimethicone',
  'trimethylsiloxysilicate',
]

const VEGETABLE_OIL_PATTERNS = [
  'olea europaea',
  'helianthus annuus',
  'simmondsia chinensis',
  'argania spinosa',
  'macadamia',
  'cocos nucifera',
  'persea gratissima',
  'prunus amygdalus',
  'oryza sativa bran oil',
  'camellia',
  'rosa canina',
  'rosa rubiginosa',
  'vitis vinifera seed oil',
  'mineral oil',
  'paraffinum liquidum',
]

export function detectNonGrasAbsorption(
  inci: string | null | undefined,
  kind: ProductKind,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (!NON_GRAS_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  const top5 = ingredients.slice(0, Math.min(ingredients.length, 5))

  // Required: a silicone in top 5
  const hasLightSilicone = top5.some((ing) => SILICONE_LIGHT_PATTERNS.some((p) => ing.includes(p)))
  if (!hasLightSilicone) return []

  // Excluded: vegetable / mineral oil in top 5
  for (const ing of top5) {
    if (VEGETABLE_OIL_PATTERNS.some((p) => ing.includes(p))) return []
  }

  return [S.NON_GRAS, S.ABSORPTION_RAPIDE]
}

// ─── Pigments-verts ──────────────────────────────────────────────────────────
// Color-correcting greens used to neutralize redness. Detected by INCI color-
// index codes or chromium oxide / hydroxide green substrings.
//
// `normalize` lowercases and strips punctuation, so 'CI 77288' becomes
// 'ci 77288' (space preserved). We also accept the no-space variant.

const PIGMENT_VERT_PATTERNS = [
  'ci 77288',
  'ci77288',
  'ci 77289',
  'ci77289',
  'chromium oxide green',
  'chromium hydroxide green',
]

export function detectPigmentsVerts(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []
  for (const ing of ingredients) {
    if (PIGMENT_VERT_PATTERNS.some((p) => ing.includes(p))) {
      return [S.PIGMENTS_VERTS]
    }
  }
  return []
}

// ─── Vegan ───────────────────────────────────────────────────────────────────
// Precision-first absence tag: emit `vegan` only when *no* known animal-derived
// INCI pattern is present and the INCI has enough ingredients to make the
// claim credible (≥ 5).
//
// Patterns intentionally generous on false negatives — better skip emitting
// vegan than to emit it on a product containing snail mucin. Brand-level
// vegan certifications (Vegan Society, PETA Beauty Without Bunnies) belong
// to a separate non-INCI source (T4 roadmap) and override this heuristic.
//
// Lactose / yogurt-derived ingredients are flagged: lactose is dairy. Note
// that this disagrees with `prebiotique` detection (lactose is also a
// prebiotic) — both tags are valid simultaneously and orthogonal.

const ANIMAL_PATTERNS = [
  // Beeswax / honey / propolis
  'lanolin',
  'cera alba',
  'beeswax',
  'mel ', // honey INCI; trailing space avoids 'melatonin'/'mel-' false positives
  'mel,', // edge: end-of-list separator
  'honey',
  'propolis',
  'royal jelly',
  // Insect / mollusk
  'snail',
  'helix aspersa',
  'cochlea',
  'carmine',
  'ci 75470',
  'ci75470',
  'cochineal',
  'shellac',
  // Mother-of-pearl / mollusk shell — `pearl ` covers `pearl powder`, `pearl extract`,
  // `pearl protein`, `hydrolyzed pearl`. Trailing space avoids matching ingredients
  // like `pearled barley` (none in cosmetics) and excludes the bare word `pearl` as
  // a marketing term (only INCI tokens with `pearl ` prefix the actual ingredient).
  'pearl ',
  // Silk / sericin (silkworm cocoons)
  'silk',
  'sericin',
  // Animal proteins / enzymes
  'collagen',
  'elastin',
  'keratin',
  'lactoferrin',
  'lactoperoxidase', // milk enzyme — distinct from `lactose` / `casein` already covered
  // Dairy
  'milk',
  'lait',
  'lactose',
  'casein',
  'whey',
  'yogurt',
  // Other animal
  'placenta',
  'placental',
  'caviar',
  'tallow',
  'guanine',
  // Animal-derived squalene (vs plant-derived squalane — different INCI; squalane is fine)
  'squalene', // shark liver oil — distinct from 'squalane' (the plant-derived saturated form)
]

const VEGAN_MIN_INGREDIENTS = 5

export function detectVegan(
  inci: string | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length < VEGAN_MIN_INGREDIENTS) return []

  // Append a trailing space so 'mel ' substring works on tokens that aren't
  // followed by other characters in the source string.
  for (const ing of ingredients) {
    const padded = `${ing} `
    for (const p of ANIMAL_PATTERNS) {
      if (padded.includes(p)) return []
    }
  }

  return [S.VEGAN]
}

// ─── Texture from `products.texture` field (S5 — direct mapping) ─────────────
// Pure pass-through. When the admin populated the `texture` column, emit the
// matching TEXTURE_* slug. Orthogonal to `kind` — a `cleanser` can be `gel`
// or `mousse` or `huile`; only the field knows. Authoritative over any INCI
// fallback (admin-curated wins).

const TEXTURE_FIELD_TO_SLUG: Record<ProductTexture, SkincareProductTagSlug> = {
  gel: S.TEXTURE_GEL,
  creme: S.TEXTURE_CREME,
  mousse: S.TEXTURE_MOUSSE,
  stick: S.TEXTURE_STICK,
  huile: S.TEXTURE_HUILE,
  lait: S.TEXTURE_LAIT,
  eau: S.TEXTURE_EAU,
  baume: S.TEXTURE_BAUME,
  patch: S.TEXTURE_PATCH,
}

export function detectTextureFromField(
  texture: ProductTexture | null | undefined
): SkincareProductTagSlug[] {
  if (!texture) return []
  const slug = TEXTURE_FIELD_TO_SLUG[texture]
  return slug ? [slug] : []
}

// ─── Texture-gel INCI fallback (S5) ──────────────────────────────────────────
// Heuristic for products without an admin-curated `texture` field: an aqueous
// gel-former in top 5 + 0 oily/heavy/silicone-base markers. Precision-focused
// — easier to miss a gel than to mislabel a cream as gel. Skipped when the
// field is set (any value) — admin curation is the source of truth.
//
// `mousse` and `stick` have no INCI fallback: foaming surfactants don't
// distinguish a foam-pump mousse from a liquid cleanser, and stick chemistry
// (wax-heavy) overlaps with `baume` without a reliable INCI marker.

const GEL_FORMER_PATTERNS = [
  'carbomer',
  'xanthan',
  'sodium polyacrylate',
  'hydroxyethylcellulose',
  'hydroxyethyl cellulose',
  'sclerotium gum',
  // Pemulen — also positions as gel-cream stabiliser, but in top 5 the gel
  // texture dominates (used at 0.2-0.5 % only when its rheology is the point).
  'acrylates/c10-30 alkyl acrylate crosspolymer',
  'ammonium acryloyldimethyltaurate',
]

// Skip rinse-off and inherently non-gel kinds. A "gel cleanser" is marketing
// for the package, not the leave-on sensation we tag — the texture is rinsed
// before any sensoriel signal lands. Balm and oil contradict gel by chemistry.
const TEXTURE_GEL_INCI_SKIP_KINDS = new Set<ProductKind>([
  'cleanser',
  'body-wash',
  'body-scrub',
  'balm',
  'oil',
  'body-oil',
  'hair-oil',
  'patch',
])

const TEXTURE_GEL_POSITION_CAP = 5

export function detectTextureGelInci(
  inci: string | null | undefined,
  kind: ProductKind,
  texture: ProductTexture | null | undefined,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (texture) return []
  if (TEXTURE_GEL_INCI_SKIP_KINDS.has(kind)) return []
  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length === 0) return []

  const top5 = ingredients.slice(0, Math.min(ingredients.length, TEXTURE_GEL_POSITION_CAP))
  const hasGelFormer = top5.some((ing) => GEL_FORMER_PATTERNS.some((p) => ing.includes(p)))
  if (!hasGelFormer) return []

  // Aqueous-only: any vegetable / mineral oil in top 5 disqualifies.
  for (const ing of top5) {
    if (VEGETABLE_OIL_PATTERNS.some((p) => ing.includes(p))) return []
  }

  // No rich emulsion: butter/wax in top 8 disqualifies.
  const cap8 = Math.min(ingredients.length, 8)
  for (let i = 0; i < cap8; i++) {
    if (BUTTER_WAX_PATTERNS.some((p) => ingredients[i].includes(p))) return []
  }

  // No silicone-led "gel-cream" hybrid (covered by `non-gras`/`semi-occlusif`).
  for (const ing of top5) {
    if (SILICONE_LIGHT_PATTERNS.some((p) => ing.includes(p))) return []
  }

  return [S.TEXTURE_GEL]
}

// ─── Peau-normale (heuristic, used by orchestrator post-pass) ────────────────
// Inverse heuristic: a product can be tagged `peau-normale` when no other
// skin_type fired AND the kind is a neutral routine staple AND no aggressive
// actif sits in the INCI. Fills the "tout-types muet" default that algo-derm
// can't surface (it has no positive `peau-normale` signal).
//
// Orchestrator passes the set of skin_type slugs already proposed for the
// product; we abstain if any of them are present.

const PEAU_NORMALE_KINDS = new Set<ProductKind>([
  'moisturizer',
  'cleanser',
  'toner',
  'eye-cream',
  'mist',
  'essence',
])

const STRONG_ACTIF_PATTERNS = [
  ...RETINOID_PATTERNS,
  'hydroquinone',
  'glycolic acid',
  'lactic acid',
  'mandelic acid',
  'salicylic acid',
  'azelaic acid',
  'benzoyl peroxide',
  'tranexamic acid',
  'kojic acid',
  'ascorbic acid', // L-ascorbic, the irritating form
]

const OTHER_SKIN_TYPE_SLUGS = new Set<string>([
  S.PEAU_GRASSE,
  S.PEAU_SECHE,
  S.PEAU_MIXTE,
  S.PEAU_SENSIBLE,
])

export function detectPeauNormale(
  inci: string | null | undefined,
  kind: ProductKind,
  alreadyProposedSkinTypes: Iterable<string>,
  hoistedIngredients?: readonly string[]
): SkincareProductTagSlug[] {
  if (!PEAU_NORMALE_KINDS.has(kind)) return []

  // Abstain if any non-neutral skin_type was already proposed.
  for (const slug of alreadyProposedSkinTypes) {
    if (OTHER_SKIN_TYPE_SLUGS.has(slug)) return []
  }

  const ingredients = resolveIngredients(inci, hoistedIngredients)
  if (ingredients.length < VEGAN_MIN_INGREDIENTS) return []

  for (const ing of ingredients) {
    if (STRONG_ACTIF_PATTERNS.some((p) => ing.includes(p))) return []
  }

  return [S.PEAU_NORMALE]
}
