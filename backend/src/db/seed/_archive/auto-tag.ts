#!/usr/bin/env bun
/**
 * DEPRECATED — historical bootstrap script (2026-04). Generated the initial
 * seed tag mappings for ~1k products via name regexes + INCI substring tables.
 * Outputs were committed into `data/products/*` and the script has not been
 * re-invoked since. Superseded by:
 *   - `runners/seed-core.ts` — fresh init with algo-derm + actif-class + avoid
 *   - `runners/backfill-auto-tags.ts` — post-snapshot rehydrate, all 6 passes
 *
 * Kept under `_archive/` for reference only. Do not re-run: its INCI mapping
 * is stale and its precedence rules diverge from the calibrated pipeline.
 */

throw new Error(
  'scripts/_archive/auto-tag.ts is deprecated. Use runners/seed-core.ts (fresh init) ' +
    'or runners/backfill-auto-tags.ts (rehydrate).'
)

/* eslint-disable */
// Original implementation preserved below for archeology.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  DENTAL_PRODUCT_TAG_SLUGS,
  HAIRCARE_PRODUCT_TAG_SLUGS,
  SKINCARE_PRODUCT_TAG_SLUGS,
} from '@habit-tracker/shared'

const WRITE = process.argv.includes('--write')
const CANDIDATES = process.argv.includes('--candidates')
const SEED_ROOT = join(import.meta.dir, '..')

// ─── Per-domain product tag whitelist (slugs allowed on a product) ────────────
// Sourced from the shared taxonomy so a typo or ingredient-only slug never lands on a
// product. Empty domain set ⇒ no auto-tagging emitted (haircare/supplement product tag
// slug files are still empty in shared as of writing).

const PRODUCT_TAG_WHITELIST: Record<'skincare' | 'haircare' | 'dental', Set<string>> = {
  skincare: new Set<string>(Object.values(SKINCARE_PRODUCT_TAG_SLUGS)),
  haircare: new Set<string>(Object.values(HAIRCARE_PRODUCT_TAG_SLUGS)),
  dental: new Set<string>(Object.values(DENTAL_PRODUCT_TAG_SLUGS)),
}

// ─── Slug → TAG_SLUGS key (for code generation) ───────────────────────────────

const SLUG_TO_KEY: Record<string, string> = {
  // Skincare concerns
  'anti-rougeurs': 'ANTI_ROUGEURS',
  rosacee: 'ROSACEE',
  couperose: 'COUPEROSE',
  'barriere-cutanee': 'BARRIERE_CUTANEE',
  'anti-taches': 'ANTI_TACHES',
  'anti-acne': 'ANTI_ACNE',
  'anti-age': 'ANTI_AGE',
  hyperpigmentation: 'HYPERPIGMENTATION',
  deshydratation: 'DESHYDRATATION',
  'pores-dilates': 'PORES_DILATES',
  'cernes-poches': 'CERNES_POCHES',
  brillance: 'BRILLANCE',
  eclat: 'ECLAT',
  'post-acne': 'POST_ACNE',
  cicatrisation: 'CICATRISATION',
  microbiome: 'MICROBIOME',
  eczema: 'ECZEMA',
  'grain-peau': 'GRAIN_PEAU',
  'keratose-pilaire': 'KERATOSE_PILAIRE',
  // Skin types
  'peau-seche': 'PEAU_SECHE',
  'peau-mixte': 'PEAU_MIXTE',
  'peau-grasse': 'PEAU_GRASSE',
  'peau-sensible': 'PEAU_SENSIBLE',
  'peau-normale': 'PEAU_NORMALE',
  'barriere-cutanee-alteree': 'BARRIERE_CUTANEE_ALTEREE',
  // Zones
  'zone-visage': 'ZONE_VISAGE',
  'zone-corps': 'ZONE_CORPS',
  'zone-yeux': 'ZONE_YEUX',
  'zone-levres': 'ZONE_LEVRES',
  'zone-mains': 'ZONE_MAINS',
  'zone-pieds': 'ZONE_PIEDS',
  // Product types V2 (shared — lives in SKINCARE_PRODUCT_TAG_SLUGS)
  'type-nettoyant': 'TYPE_NETTOYANT',
  'type-toner': 'TYPE_TONER',
  'type-mist': 'TYPE_MIST',
  'type-serum': 'TYPE_SERUM',
  'type-hydratant': 'TYPE_HYDRATANT',
  'type-masque': 'TYPE_MASQUE',
  'type-exfoliation': 'TYPE_EXFOLIATION',
  'type-solaire': 'TYPE_SOLAIRE',
  'type-traitement': 'TYPE_TRAITEMENT',
  'type-primer': 'TYPE_PRIMER',
  'type-deodorant': 'TYPE_DEODORANT',
  'type-outil': 'TYPE_OUTIL',
  // Textures
  'texture-gel': 'TEXTURE_GEL',
  'texture-creme': 'TEXTURE_CREME',
  'texture-baume': 'TEXTURE_BAUME',
  'texture-huile': 'TEXTURE_HUILE',
  'texture-lait': 'TEXTURE_LAIT',
  'texture-mousse': 'TEXTURE_MOUSSE',
  'texture-eau': 'TEXTURE_EAU',
  'texture-patch': 'TEXTURE_PATCH',
  'texture-stick': 'TEXTURE_STICK',
  // Dental product types
  dentifrice: 'DENTIFRICE',
  'bain-de-bouche': 'BAIN_DE_BOUCHE',
  'kit-blanchiment': 'KIT_BLANCHIMENT',
  'fil-dentaire': 'FIL_DENTAIRE',
  // Routine steps V2
  'step-nettoyage-1': 'STEP_NETTOYAGE_1',
  'step-nettoyage-2': 'STEP_NETTOYAGE_2',
  'step-preparation': 'STEP_PREPARATION',
  'step-traitement': 'STEP_TRAITEMENT',
  'step-hydratation': 'STEP_HYDRATATION',
  'step-occlusif': 'STEP_OCCLUSIF',
  'step-protection-solaire': 'STEP_PROTECTION_SOLAIRE',
  // Routine moments
  'moment-matin': 'MOMENT_MATIN',
  'moment-soir': 'MOMENT_SOIR',
  'moment-hebdomadaire': 'MOMENT_HEBDOMADAIRE',
  'moment-usage-localise': 'MOMENT_USAGE_LOCALISE',
  'moment-crise': 'MOMENT_CRISE',
  // Skin effects / ingredient attributes (in SKINCARE_INGREDIENT_TAG_SLUGS)
  occlusif: 'OCCLUSIF',
  repulpant: 'REPULPANT',
  matifiant: 'MATIFIANT',
  'texture-riche': 'TEXTURE_RICHE',
  'texture-legere': 'TEXTURE_LEGERE',
  'anti-oxydant': 'ANTI_OXYDANT',
  apaisant: 'APAISANT',
  'sebo-regulateur': 'SEBO_REGULATEUR',
  reparateur: 'REPARATEUR',
  purifiant: 'PURIFIANT',
  prebiotique: 'PREBIOTIQUE',
  keratolytique: 'KERATOLYTIQUE',
  humectant: 'HUMECTANT',
  emollient: 'EMOLLIENT',
  // Labels
  'sans-parfum': 'SANS_PARFUM',
  'non-comedogene': 'NON_COMEDOGENE',
  'filtres-mineraux': 'FILTRES_MINERAUX',
  'filtres-chimiques': 'FILTRES_CHIMIQUES',
}

// ─── Skincare primary-eligible concern tags ───────────────────────────────────

const SKINCARE_PRIMARY = new Set([
  'anti-rougeurs',
  'rosacee',
  'couperose',
  'barriere-cutanee',
  'anti-taches',
  'anti-acne',
  'anti-age',
  'hyperpigmentation',
  'deshydratation',
  'pores-dilates',
  'cernes-poches',
  'eclat',
  'post-acne',
  'cicatrisation',
  'microbiome',
  'eczema',
  'grain-peau',
  'keratose-pilaire',
  'apaisant',
  'repulpant',
  'anti-oxydant',
  'brillance',
])

// Specificity weight: high = prefer over generic apaisant
const SPECIFICITY: Record<string, number> = {
  'anti-acne': 3,
  'anti-age': 3,
  'anti-taches': 3,
  hyperpigmentation: 3,
  eczema: 3,
  microbiome: 3,
  'anti-rougeurs': 3,
  rosacee: 3,
  couperose: 3,
  'post-acne': 3,
  cicatrisation: 3,
  'pores-dilates': 3,
  'keratose-pilaire': 3,
  'cernes-poches': 3,
  'grain-peau': 3,
  eclat: 2,
  apaisant: 2,
  repulpant: 2,
  'barriere-cutanee': 2,
  'anti-oxydant': 1,
  deshydratation: 1,
}

// ─── INCI ingredient → skincare tags ─────────────────────────────────────────

const INCI_TO_SKINCARE: Record<string, string[]> = {
  // Rétinoids / anti-âge
  retinol: ['anti-age', 'step-traitement'],
  'retinyl palmitate': ['anti-age'],
  retinal: ['anti-age', 'step-traitement'],
  bakuchiol: ['anti-age'],
  adenosine: ['anti-age'],
  // Exfoliants / anti-acné
  'azelaic acid': ['anti-acne', 'anti-rougeurs', 'step-traitement', 'sebo-regulateur'],
  'salicylic acid': ['anti-acne', 'step-traitement', 'sebo-regulateur', 'keratolytique'],
  'glycolic acid': ['step-traitement', 'eclat', 'keratolytique'],
  'lactic acid': ['step-traitement', 'step-hydratation', 'keratolytique'],
  'mandelic acid': ['step-traitement', 'anti-acne'],
  gluconolactone: ['step-traitement', 'peau-sensible'],
  'lactobionic acid': ['step-traitement', 'peau-sensible'],
  'benzoyl peroxide': ['anti-acne', 'step-traitement', 'moment-usage-localise'],
  'capryloyl salicylic acid': ['anti-acne', 'step-traitement', 'keratolytique'],
  // Vitamines / antioxydants
  'ascorbic acid': ['eclat', 'anti-oxydant', 'anti-age'],
  'sodium ascorbyl phosphate': ['eclat', 'anti-acne'],
  'magnesium ascorbyl phosphate': ['eclat', 'anti-oxydant'],
  'tetrahexyldecyl ascorbate': ['eclat', 'anti-age'],
  tocopherol: ['anti-oxydant', 'reparateur'],
  'tocopheryl acetate': ['anti-oxydant'],
  'ferulic acid': ['anti-oxydant', 'anti-age'],
  resveratrol: ['anti-oxydant', 'anti-age'],
  ubiquinone: ['anti-age', 'anti-oxydant'],
  // Peptides
  palmitoyl: ['anti-age'],
  'copper tripeptide': ['anti-age', 'reparateur'],
  'acetyl hexapeptide': ['anti-age'],
  matrixyl: ['anti-age'],
  // Hydratation / barrière / microbiome
  // `humectant`/`emollient` are ingredient-only attributes — on a product, the closest
  // routine-step tag is `step-hydratation`.
  'hyaluronic acid': ['step-hydratation', 'repulpant'],
  'sodium hyaluronate': ['step-hydratation'],
  'hydrolyzed hyaluronic acid': ['step-hydratation'],
  glycerin: ['step-hydratation'],
  panthenol: ['apaisant', 'barriere-cutanee', 'reparateur'],
  niacinamide: ['barriere-cutanee', 'eclat', 'sebo-regulateur', 'pores-dilates'],
  ceramide: ['barriere-cutanee', 'step-hydratation'],
  'ceramide np': ['barriere-cutanee'],
  'ceramide ap': ['barriere-cutanee'],
  'ceramide eop': ['barriere-cutanee'],
  phytosphingosine: ['barriere-cutanee'],
  cholesterol: ['barriere-cutanee', 'step-hydratation'],
  squalane: ['step-hydratation', 'barriere-cutanee', 'texture-legere'],
  urea: ['step-hydratation', 'keratolytique'],
  'bifida ferment': ['microbiome', 'reparateur'],
  lactobacillus: ['microbiome'],
  // Apaisement / cicatrisation / anti-rougeurs
  'centella asiatica': ['apaisant', 'cicatrisation'],
  madecassoside: ['apaisant', 'cicatrisation'],
  asiaticoside: ['apaisant'],
  allantoin: ['apaisant'],
  'aloe barbadensis': ['apaisant', 'step-hydratation'],
  bisabolol: ['apaisant'],
  'colloidal oatmeal': ['apaisant', 'eczema'],
  'avena sativa': ['apaisant', 'peau-sensible'],
  licorice: ['apaisant', 'eclat', 'anti-taches'],
  'dipotassium glycyrrhizate': ['apaisant', 'anti-rougeurs'],
  'tranexamic acid': ['anti-taches', 'hyperpigmentation', 'step-traitement'],
  // Filtres solaires
  // ZnO/TiO2 also serve as soothing pigments / colorants in non-SPF formulas (cica creams,
  // dentifrices, makeup), so we don't auto-tag them as sunscreen — NAME_PATTERNS catches
  // SPF/solaire claims explicitly. Organic UV filters below are SPF-only and stay tagged.
  'zinc oxide': ['apaisant'],
  avobenzone: ['step-protection-solaire', 'filtres-chimiques'],
  octocrylene: ['step-protection-solaire', 'filtres-chimiques'],
  'ethylhexyl methoxycinnamate': ['step-protection-solaire', 'filtres-chimiques'],
  homosalate: ['step-protection-solaire', 'filtres-chimiques'],
  'ethylhexyl salicylate': ['step-protection-solaire', 'filtres-chimiques'],
  tinosorb: ['step-protection-solaire', 'filtres-chimiques'],
  mexoryl: ['step-protection-solaire', 'filtres-chimiques'],
  // Dépigmentants
  kojic: ['anti-taches', 'hyperpigmentation'],
  arbutin: ['anti-taches', 'hyperpigmentation', 'eclat'],
  'alpha-arbutin': ['anti-taches', 'hyperpigmentation', 'eclat'],
}

// ─── Aggressive INCI → avoid tags ────────────────────────────────────────────

const INCI_TO_AVOID: Record<string, string[]> = {
  retinol: ['peau-sensible', 'barriere-cutanee-alteree'],
  retinal: ['peau-sensible', 'barriere-cutanee-alteree'],
  'salicylic acid': ['peau-sensible', 'peau-seche'],
  'capryloyl salicylic acid': ['peau-sensible'],
  'glycolic acid': ['peau-sensible'],
  'benzoyl peroxide': ['peau-sensible', 'peau-seche', 'barriere-cutanee-alteree'],
}

// ─── kind → skincare secondary tags ──────────────────────────────────────────

const KIND_SKINCARE_SEC: Record<string, string[]> = {
  cleanser: ['type-nettoyant', 'step-nettoyage-2', 'zone-visage'],
  moisturizer: ['type-hydratant', 'texture-creme', 'step-hydratation', 'zone-visage'],
  serum: ['type-serum', 'step-traitement', 'zone-visage'],
  toner: ['type-toner', 'texture-eau', 'step-preparation', 'zone-visage'],
  essence: ['type-toner', 'step-preparation', 'zone-visage'],
  'eye-cream': ['type-traitement', 'zone-yeux'],
  sunscreen: [
    'type-solaire',
    'texture-creme',
    'step-protection-solaire',
    'moment-matin',
    'zone-visage',
  ],
  exfoliant: ['type-exfoliation', 'step-traitement', 'zone-visage'],
  mask: ['type-masque', 'moment-hebdomadaire', 'zone-visage'],
  oil: ['type-serum', 'texture-huile', 'step-hydratation', 'zone-visage'],
  balm: ['type-hydratant', 'texture-baume'],
  mist: ['type-mist', 'texture-eau', 'step-preparation', 'zone-visage'],
  'body-lotion': ['type-hydratant', 'texture-lait', 'zone-corps'],
  'body-cream': ['type-hydratant', 'texture-creme', 'zone-corps'],
  'body-wash': ['type-nettoyant', 'zone-corps'],
  'body-oil': ['type-hydratant', 'texture-huile', 'zone-corps'],
  'body-scrub': ['type-exfoliation', 'step-traitement', 'zone-corps'],
  'hand-cream': ['type-hydratant', 'texture-creme', 'zone-mains'],
  'lip-care': ['type-traitement', 'zone-levres'],
  'foot-cream': ['type-hydratant', 'zone-pieds'],
  primer: ['type-primer', 'moment-matin', 'zone-visage'],
  'spot-treatment': ['type-traitement', 'moment-usage-localise', 'zone-visage'],
  'self-tanner': ['type-solaire', 'zone-corps'],
  deodorant: ['type-deodorant'],
  patch: ['type-masque', 'texture-patch'],
}

// ─── kind → haircare primary (mirrors existing curated pattern) ───────────────
// styling intentionally omitted: too many subtypes (creme/gel/cire/spray/mousse
// coiffante) — let the seed author pick manually.

const KIND_HAIRCARE_PRIMARY: Record<string, string> = {
  shampoo: 'shampooing',
  conditioner: 'apres-shampooing',
  'hair-mask': 'masque-capillaire',
  'hair-oil': 'huile-capillaire',
  'hair-serum': 'serum-capillaire',
}

// Haircare slugs live under HAIRCARE_PRODUCT_TAG_SLUGS, not TAG_SLUGS.
// slugToCode() emits the right namespace depending on which map matches.
const HAIRCARE_SLUG_TO_KEY: Record<string, string> = {
  shampooing: 'SHAMPOOING',
  'apres-shampooing': 'APRES_SHAMPOOING',
  'masque-capillaire': 'MASQUE_CAPILLAIRE',
  'serum-capillaire': 'SERUM_CAPILLAIRE',
  'huile-capillaire': 'HUILE_CAPILLAIRE',
}

// ─── kind → dental primary ────────────────────────────────────────────────────

const KIND_DENTAL_PRIMARY: Record<string, string> = {
  toothpaste: 'dentifrice',
  mouthwash: 'bain-de-bouche',
  'teeth-whitening': 'kit-blanchiment',
  floss: 'fil-dentaire',
}

// ─── Name (FR claims) → skincare tags ─────────────────────────────────────────
// French cosmetic claims are regulated, so explicit tokens in the name are
// high-precision signals. Substring match on lowercased name. Negations
// ("sans X") are not handled — false positives are caught by review.

const NAME_PATTERNS: Array<[RegExp, Partial<TagResult>]> = [
  [/anti[\s-]?imperfection/i, { primary: ['anti-acne'] }],
  [/anti[\s-]?(rides?|age|âge)/i, { primary: ['anti-age'] }],
  [/anti[\s-]?rougeur/i, { primary: ['anti-rougeurs'] }],
  [
    /anti[\s-]?tache|d[eé]pigmentant|d[eé]pigment\b/i,
    { primary: ['anti-taches', 'hyperpigmentation'] },
  ],
  [
    /anti[\s-]?d[eé]mangeaison|atopi|exomega|anti[\s-]?grattage/i,
    { primary: ['eczema'], secondary: ['peau-seche', 'apaisant'] },
  ],
  [/anti[\s-]?cerne/i, { primary: ['cernes-poches'] }],
  [/apaisant|calmant/i, { primary: ['apaisant'] }],
  [/hydratant|moisturiz/i, { primary: ['deshydratation'], secondary: ['step-hydratation'] }],
  [/matifiant|s[eé]bo[\s-]?r[eé]gul/i, { primary: ['sebo-regulateur'] }],
  [/[eé]clat|radiance|illuminat/i, { primary: ['eclat'] }],
  [/repulpant|plumping/i, { primary: ['repulpant'] }],
  [/cicatris|r[eé]parat/i, { primary: ['cicatrisation'], secondary: ['reparateur'] }],
  [/exfoliant|gommage|peeling/i, { secondary: ['type-exfoliation', 'step-traitement'] }],
  [
    /\bspf\s?\d|solaire|sun[\s-]?screen/i,
    { secondary: ['type-solaire', 'step-protection-solaire', 'moment-matin'] },
  ],
  [/pores? (dilat|resserr)/i, { primary: ['pores-dilates'] }],
  [/grain (de|inégal|inegal)/i, { primary: ['grain-peau'] }],
  [/micro[\s-]?biome/i, { primary: ['microbiome'] }],
  [/k[eé]ratose|pilaire/i, { primary: ['keratose-pilaire'] }],
  [/peaux? sensibles?/i, { secondary: ['peau-sensible'] }],
  [/peaux? r[eé]actives?/i, { secondary: ['peau-sensible'] }],
  [/peaux? atopiques?/i, { secondary: ['peau-seche'] }],
  [/peaux? s[eé]ches?/i, { secondary: ['peau-seche'] }],
  [/peaux? grasses?/i, { secondary: ['peau-grasse'] }],
  [/peaux? mixtes?/i, { secondary: ['peau-mixte'] }],
  [/peaux? matures?/i, { primary: ['anti-age'] }],
]

const PRIMARY_CAP = 4

// AHA/BHA in low position (< top 6) are pH adjusters / preservatives, not active
// exfoliants. Skip step-traitement/keratolytique tags from these mappings when the INCI
// position exceeds the threshold.
const POSITION_GUARDED_KEYS = new Set([
  'lactic acid',
  'glycolic acid',
  'mandelic acid',
  'salicylic acid',
  'capryloyl salicylic acid',
  'gluconolactone',
  'lactobionic acid',
])
const POSITION_GUARD_THRESHOLD = 6
const POSITION_GUARDED_TAGS = new Set(['step-traitement', 'keratolytique'])

// Atopie / eczema-targeting products carry oat extract + urea + niacinamide which the
// INCI mapping otherwise reads as anti-acné/séborrégulateur/pores. When the name signals
// atopie, drop those incompatible primaries.
const ATOPIE_NAME_RE = /\b(?:atopi[eé]?|exomega|anti[\s-]?grattage|peaux?\s+atopiques?)\b/i
const ATOPIE_INCOMPATIBLE = new Set([
  'sebo-regulateur',
  'pores-dilates',
  'eclat',
  'matifiant',
  'anti-acne',
])

function computeTagsFromName(name: string): TagResult {
  const primary = new Set<string>()
  const secondary = new Set<string>()
  const avoid = new Set<string>()
  for (const [pattern, tags] of NAME_PATTERNS) {
    if (!pattern.test(name)) continue
    tags.primary?.forEach((t) => {
      primary.add(t)
    })
    tags.secondary?.forEach((t) => {
      secondary.add(t)
    })
    tags.avoid?.forEach((t) => {
      avoid.add(t)
    })
  }
  return { primary: [...primary], secondary: [...secondary], avoid: [...avoid] }
}

function mergeResults(a: TagResult, b: TagResult): TagResult {
  const primary = [...new Set([...a.primary, ...b.primary])].slice(0, PRIMARY_CAP)
  const secondary = [...new Set([...a.secondary, ...b.secondary])].filter(
    (t) => !primary.includes(t)
  )
  const avoid = [...new Set([...a.avoid, ...b.avoid])]
  return { primary, secondary, avoid }
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function extractField(block: string, field: string): string {
  const m = new RegExp(`${field}:\\s*(['"\`])`).exec(block)
  if (!m) return ''

  const quote = m[1]
  let out = ''
  let escaped = false
  for (let i = m.index + m[0].length; i < block.length; i++) {
    const ch = block[i]
    if (escaped) {
      if (ch === 'n') out += '\n'
      else if (ch === 'r') out += '\r'
      else if (ch === 't') out += '\t'
      else out += ch
      escaped = false
      continue
    }
    if (ch === '\\') {
      escaped = true
      continue
    }
    if (ch === quote) return out
    out += ch
  }
  return ''
}

const HAIRCARE_KINDS = new Set([
  'shampoo',
  'conditioner',
  'hair-mask',
  'hair-oil',
  'hair-serum',
  'styling',
])
const DENTAL_KINDS = new Set(['toothpaste', 'mouthwash', 'teeth-whitening', 'floss'])

function getDomain(filePath: string, kind: string): 'skincare' | 'haircare' | 'dental' {
  if (filePath.includes('/haircare/')) return 'haircare'
  if (filePath.includes('/dental/')) return 'dental'
  if (HAIRCARE_KINDS.has(kind)) return 'haircare'
  if (DENTAL_KINDS.has(kind)) return 'dental'
  return 'skincare'
}

// ─── Tag computation ──────────────────────────────────────────────────────────

interface TagResult {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

function computeSkincareTagsFromInci(inci: string, kind: string): TagResult {
  const ingredients = inci.toLowerCase().split(/\s*[,;]\s*/)
  const tagScores = new Map<string, number>()
  const secondary = new Set<string>()
  const avoid = new Set<string>()

  let position = 0
  for (const ingredient of ingredients) {
    const trimmed = ingredient.trim()
    if (!trimmed) continue
    position++

    for (const [key, tags] of Object.entries(INCI_TO_SKINCARE)) {
      if (trimmed === key || trimmed.includes(key)) {
        const guarded = POSITION_GUARDED_KEYS.has(key) && position > POSITION_GUARD_THRESHOLD
        for (const tag of tags) {
          if (guarded && POSITION_GUARDED_TAGS.has(tag)) continue
          if (SKINCARE_PRIMARY.has(tag)) {
            const spec = SPECIFICITY[tag] ?? 1
            tagScores.set(tag, (tagScores.get(tag) ?? 0) + spec)
          } else {
            secondary.add(tag)
          }
        }
      }
    }

    for (const [key, avoidTags] of Object.entries(INCI_TO_AVOID)) {
      if (trimmed === key || trimmed.includes(key)) {
        for (const t of avoidTags) avoid.add(t)
      }
    }
  }

  const primary = [...tagScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)

  // Add kind-based secondary, skip anything already in primary
  for (const t of KIND_SKINCARE_SEC[kind] ?? []) {
    if (!primary.includes(t)) secondary.add(t)
  }

  return {
    primary,
    secondary: [...secondary].filter((t) => !primary.includes(t)),
    avoid: [...avoid],
  }
}

function applyDomainWhitelist(
  result: TagResult,
  domain: 'skincare' | 'haircare' | 'dental'
): TagResult {
  const allowed = PRODUCT_TAG_WHITELIST[domain]
  if (!allowed || allowed.size === 0) return { primary: [], secondary: [], avoid: [] }
  return {
    primary: result.primary.filter((t) => allowed.has(t)),
    secondary: result.secondary.filter((t) => allowed.has(t)),
    avoid: result.avoid.filter((t) => allowed.has(t)),
  }
}

function computeTags(
  inci: string,
  name: string,
  kind: string,
  domain: 'skincare' | 'haircare' | 'dental'
): TagResult {
  if (domain === 'haircare') {
    const p = KIND_HAIRCARE_PRIMARY[kind]
    return applyDomainWhitelist({ primary: p ? [p] : [], secondary: [], avoid: [] }, domain)
  }

  if (domain === 'dental') {
    const p = KIND_DENTAL_PRIMARY[kind]
    return applyDomainWhitelist({ primary: p ? [p] : [], secondary: [], avoid: [] }, domain)
  }

  const inciResult = inci.trim()
    ? computeSkincareTagsFromInci(inci, kind)
    : { primary: [], secondary: KIND_SKINCARE_SEC[kind] ?? [], avoid: [] }

  let merged = name.trim() ? mergeResults(inciResult, computeTagsFromName(name)) : inciResult

  if (ATOPIE_NAME_RE.test(name)) {
    merged = {
      primary: merged.primary.filter((t) => !ATOPIE_INCOMPATIBLE.has(t)),
      secondary: merged.secondary.filter((t) => !ATOPIE_INCOMPATIBLE.has(t)),
      avoid: merged.avoid,
    }
  }

  return applyDomainWhitelist(merged, domain)
}

// ─── Code generation ──────────────────────────────────────────────────────────

function slugToCode(slug: string): string {
  // Candidates have no TAG_SLUGS import (path differs pre/post promotion to data/products).
  // tags.primary is typed `string[]`, so literals compile. Reviewer can migrate to
  // TAG_SLUGS during review for auto-complete + typo detection.
  if (CANDIDATES) return `'${slug}'`
  const haircareKey = HAIRCARE_SLUG_TO_KEY[slug]
  if (haircareKey) return `HAIRCARE_PRODUCT_TAG_SLUGS.${haircareKey}`
  const key = SLUG_TO_KEY[slug]
  return key ? `TAG_SLUGS.${key}` : `/* unknown: '${slug}' */`
}

function renderArray(slugs: string[]): string {
  if (slugs.length === 0) return '[]'
  const items = slugs.map(slugToCode)
  const inline = `[${items.join(', ')}]`
  if (items.length <= 3 && inline.length <= 80) return inline
  return `[\n        ${items.join(',\n        ')},\n      ]`
}

const EMPTY_TAGS_STR = 'tags: { primary: [], secondary: [], avoid: [] }'

// Multi-line shape emitted by migrate-output.ts / migrate-pharmashop.ts for candidates.
// Matched literally (no whitespace tolerance) — both scripts emit this exact string.
const CANDIDATE_EMPTY_TAGS_STR =
  'tags: {\n      primary: [], // TODO — slugs from data/tags/ only\n      secondary: [], // TODO\n      avoid: [], // TODO\n    }'

function renderTags(result: TagResult): string {
  const empty = !result.primary.length && !result.secondary.length && !result.avoid.length
  if (empty) return CANDIDATES ? CANDIDATE_EMPTY_TAGS_STR : EMPTY_TAGS_STR
  const note = CANDIDATES ? ' // auto-suggested, verify' : ''
  return [
    'tags: {',
    `      primary: ${renderArray(result.primary)},${note}`,
    `      secondary: ${renderArray(result.secondary)},${note}`,
    `      avoid: ${renderArray(result.avoid)},${note}`,
    '    }',
  ].join('\n')
}

// ─── File processing ──────────────────────────────────────────────────────────

interface Change {
  slug: string
  index: number
  length: number
  replacement: string
}

function processFile(filePath: string): { changed: number; noMatch: number } {
  const content = readFileSync(filePath, 'utf-8')
  const changes: Change[] = []
  let noMatch = 0

  const matchStr = CANDIDATES ? CANDIDATE_EMPTY_TAGS_STR : EMPTY_TAGS_STR

  let searchFrom = 0
  while (true) {
    const idx = content.indexOf(matchStr, searchFrom)
    if (idx === -1) break
    searchFrom = idx + matchStr.length

    const before = content.slice(0, idx)
    const lastSlugIdx = before.lastIndexOf('\n    slug:')
    const context = lastSlugIdx >= 0 ? before.slice(lastSlugIdx) : before.slice(-2000)

    const slug = extractField(context, 'slug')
    const name = extractField(context, 'name')
    const kind = extractField(context, 'kind')
    const inci = extractField(context, 'inci')
    const domain = getDomain(filePath, kind)

    const result = computeTags(inci, name, kind, domain)
    const replacement = renderTags(result)

    if (replacement === matchStr) {
      noMatch++
      continue
    }

    changes.push({ slug, index: idx, length: matchStr.length, replacement })
  }

  if (changes.length > 0) {
    if (WRITE) {
      // Apply from end to start to keep indices valid
      let newContent = content
      for (const c of [...changes].reverse()) {
        newContent =
          newContent.slice(0, c.index) + c.replacement + newContent.slice(c.index + c.length)
      }
      writeFileSync(filePath, newContent)
    } else {
      const rel = filePath.replace(`${SEED_ROOT}/`, '')
      console.log(`\n📄 ${rel} (+${changes.length})`)
      for (const c of changes.slice(0, 2)) {
        console.log(`  [${c.slug || '?'}]`)
        console.log(`    ${c.replacement.replaceAll('\n', '\n    ')}`)
      }
      if (changes.length > 2) console.log(`  … +${changes.length - 2} more`)
    }
  }

  return { changed: changes.length, noMatch }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const glob = new Bun.Glob(
  CANDIDATES ? 'output/candidates/**/*.seed.ts' : 'data/products/**/*.seed.ts'
)
let totalChanged = 0
let totalNoMatch = 0
const byDomain: Record<string, number> = { skincare: 0, haircare: 0, dental: 0 }

for (const file of glob.scanSync(SEED_ROOT)) {
  const fullPath = join(SEED_ROOT, file)
  const { changed, noMatch } = processFile(fullPath)
  totalChanged += changed
  totalNoMatch += noMatch
  // File-level domain heuristic for stats (per-product domain is more accurate but not tracked here)
  const fileDomain = fullPath.includes('/haircare/')
    ? 'haircare'
    : fullPath.includes('/dental/')
      ? 'dental'
      : 'skincare'
  byDomain[fileDomain] = (byDomain[fileDomain] ?? 0) + changed
}

console.log('\n─── Summary ───────────────────────────────────────────')
console.log(`Mode        : ${WRITE ? 'WRITE' : 'DRY RUN'}`)
console.log(`Tagged      : ${totalChanged} products`)
console.log(`  skincare  : ${byDomain.skincare}`)
console.log(`  haircare  : ${byDomain.haircare}`)
console.log(`  dental    : ${byDomain.dental}`)
console.log(`No match    : ${totalNoMatch} (INCI absent or no mapping — left empty)`)
if (!WRITE) console.log('\nRun with --write to apply.')
