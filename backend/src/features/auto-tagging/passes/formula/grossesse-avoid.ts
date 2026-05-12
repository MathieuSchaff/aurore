import type { ProductKind } from '@habit-tracker/shared'
import { SKINCARE_PRODUCT_TAG_SLUGS } from '@habit-tracker/shared'

import { resolveIngredients } from '../../lib/ingredient-resolver'

const _S = SKINCARE_PRODUCT_TAG_SLUGS

import { SOLAIRE_KINDS } from './solaire'

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
export const RETINOID_PATTERNS = [
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
