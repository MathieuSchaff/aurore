#!/usr/bin/env bun
/**
 * Auto-tagger for products with empty primary/secondary/avoid arrays.
 *
 * Skincare: INCI → concern tags (primary) + kind-based product type (secondary).
 * Haircare: kind → product type tag (primary only, mirrors existing curated pattern).
 * Dental:   kind → product type tag (primary only, same pattern).
 *
 * Safety: skips any product where at least one array is already non-empty.
 *
 * Usage:
 *   bun run backend/src/db/seed/scripts/auto-tag.ts           # dry run
 *   bun run backend/src/db/seed/scripts/auto-tag.ts --write   # apply
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const WRITE = process.argv.includes('--write')
const SEED_ROOT = join(import.meta.dir, '..')

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
  'peau-reactive': 'PEAU_REACTIVE',
  'peau-sensible': 'PEAU_SENSIBLE',
  'peau-normale': 'PEAU_NORMALE',
  'peau-atopique': 'PEAU_ATOPIQUE',
  'peau-rugueuse': 'PEAU_RUGUEUSE',
  'barriere-cutanee-alteree': 'BARRIERE_CUTANEE_ALTEREE',
  // Zones
  'zone-visage': 'ZONE_VISAGE',
  'zone-corps': 'ZONE_CORPS',
  'zone-yeux': 'ZONE_YEUX',
  'zone-levres': 'ZONE_LEVRES',
  'zone-mains': 'ZONE_MAINS',
  // Product types (shared — lives in SKINCARE_PRODUCT_TAG_SLUGS)
  'baume-demaquillant': 'BAUME_DEMAQUILLANT',
  'huile-nettoyante': 'HUILE_NETTOYANTE',
  'gel-nettoyant': 'GEL_NETTOYANT',
  'mousse-nettoyante': 'MOUSSE_NETTOYANTE',
  'lait-nettoyant': 'LAIT_NETTOYANT',
  'eau-micellaire': 'EAU_MICELLAIRE',
  tonique: 'TONIQUE',
  essence: 'ESSENCE',
  lotion: 'LOTION',
  brume: 'BRUME',
  primer: 'PRIMER',
  serum: 'SERUM',
  ampoule: 'AMPOULE',
  'huile-visage': 'HUILE_VISAGE',
  'spot-treatment': 'SPOT_TREATMENT',
  'creme-hydratante': 'CREME_HYDRATANTE',
  'gel-creme': 'GEL_CREME',
  'creme-de-nuit': 'CREME_DE_NUIT',
  baume: 'BAUME',
  'sleeping-mask': 'SLEEPING_MASK',
  'contour-yeux': 'CONTOUR_YEUX',
  'soin-levres': 'SOIN_LEVRES',
  'exfoliant-chimique': 'EXFOLIANT_CHIMIQUE',
  'exfoliant-physique': 'EXFOLIANT_PHYSIQUE',
  'masque-argile': 'MASQUE_ARGILE',
  'masque-tissu': 'MASQUE_TISSU',
  'masque-hydratant': 'MASQUE_HYDRATANT',
  'creme-solaire': 'CREME_SOLAIRE',
  'auto-bronzant': 'AUTO_BRONZANT',
  'lait-corps': 'LAIT_CORPS',
  'creme-corps': 'CREME_CORPS',
  'creme-mains': 'CREME_MAINS',
  'huile-corps': 'HUILE_CORPS',
  'gommage-corps': 'GOMMAGE_CORPS',
  'nettoyant-corps': 'NETTOYANT_CORPS',
  deodorant: 'DEODORANT',
  'creme-pieds': 'CREME_PIEDS',
  shampoing: 'SHAMPOING',
  'apres-shampoing': 'APRES_SHAMPOING',
  'masque-cheveux': 'MASQUE_CHEVEUX',
  'serum-cheveux': 'SERUM_CHEVEUX',
  'huile-cheveux': 'HUILE_CHEVEUX',
  'produit-coiffant': 'PRODUIT_COIFFANT',
  dentifrice: 'DENTIFRICE',
  'bain-de-bouche': 'BAIN_DE_BOUCHE',
  'blanchiment-dentaire': 'BLANCHIMENT_DENTAIRE',
  'fil-dentaire': 'FIL_DENTAIRE',
  patch: 'PATCH',
  // Routine steps
  matin: 'MATIN',
  soir: 'SOIR',
  nettoyant: 'NETTOYANT',
  'double-nettoyage-1': 'DOUBLE_NETTOYAGE_1',
  'double-nettoyage-2': 'DOUBLE_NETTOYAGE_2',
  preparation: 'PREPARATION',
  traitement: 'TRAITEMENT',
  hydratation: 'HYDRATATION',
  emollience: 'EMOLLIENCE',
  'protection-solaire': 'PROTECTION_SOLAIRE',
  'soin-yeux': 'SOIN_YEUX',
  'soin-localise': 'SOIN_LOCALISE',
  exfoliation: 'EXFOLIATION',
  'masque-hebdo': 'MASQUE_HEBDO',
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
  'exfoliation',
  'protection-solaire',
  'hydratation',
  'apaisant',
  'repulpant',
  'anti-oxydant',
  'brillance',
])

// Specificity weight: high = prefer over generic hydratation/apaisant
const SPECIFICITY: Record<string, number> = {
  'anti-acne': 3,
  'anti-age': 3,
  'anti-taches': 3,
  hyperpigmentation: 3,
  'protection-solaire': 3,
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
  exfoliation: 2,
  eclat: 2,
  apaisant: 2,
  repulpant: 2,
  'barriere-cutanee': 2,
  'anti-oxydant': 1,
  hydratation: 1,
  deshydratation: 1,
}

// ─── INCI ingredient → skincare tags ─────────────────────────────────────────
// Mirrors INGREDIENT_TAG_MAP from otherdata/tag-associations.ts

const INCI_TO_SKINCARE: Record<string, string[]> = {
  // Rétinoids / anti-âge
  retinol: ['anti-age', 'traitement'],
  'retinyl palmitate': ['anti-age'],
  retinal: ['anti-age', 'traitement'],
  bakuchiol: ['anti-age'],
  adenosine: ['anti-age'],
  // Exfoliants / anti-acné
  'azelaic acid': ['anti-acne', 'anti-rougeurs', 'traitement', 'sebo-regulateur'],
  'salicylic acid': ['anti-acne', 'exfoliation', 'sebo-regulateur', 'keratolytique'],
  'glycolic acid': ['exfoliation', 'eclat', 'keratolytique'],
  'lactic acid': ['exfoliation', 'humectant', 'keratolytique'],
  'mandelic acid': ['exfoliation', 'anti-acne'],
  gluconolactone: ['exfoliation', 'peau-sensible'],
  'lactobionic acid': ['exfoliation', 'peau-sensible'],
  'benzoyl peroxide': ['anti-acne', 'soin-localise'],
  'capryloyl salicylic acid': ['anti-acne', 'exfoliation', 'keratolytique'],
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
  'hyaluronic acid': ['humectant', 'repulpant'],
  'sodium hyaluronate': ['humectant'],
  'hydrolyzed hyaluronic acid': ['humectant'],
  glycerin: ['humectant'],
  panthenol: ['apaisant', 'barriere-cutanee', 'reparateur'],
  niacinamide: ['barriere-cutanee', 'eclat', 'sebo-regulateur', 'pores-dilates'],
  ceramide: ['barriere-cutanee', 'emollient'],
  'ceramide np': ['barriere-cutanee'],
  'ceramide ap': ['barriere-cutanee'],
  'ceramide eop': ['barriere-cutanee'],
  phytosphingosine: ['barriere-cutanee'],
  cholesterol: ['barriere-cutanee', 'emollient'],
  squalane: ['emollience', 'barriere-cutanee', 'texture-legere'],
  urea: ['humectant', 'keratolytique'],
  'bifida ferment': ['microbiome', 'reparateur'],
  lactobacillus: ['microbiome'],
  // Apaisement / cicatrisation / anti-rougeurs
  'centella asiatica': ['apaisant', 'cicatrisation'],
  madecassoside: ['apaisant', 'cicatrisation'],
  asiaticoside: ['apaisant'],
  allantoin: ['apaisant'],
  'aloe barbadensis': ['apaisant', 'hydratation'],
  bisabolol: ['apaisant'],
  'colloidal oatmeal': ['apaisant', 'eczema'],
  'avena sativa': ['apaisant', 'peau-sensible'],
  licorice: ['apaisant', 'eclat', 'anti-taches'],
  'dipotassium glycyrrhizate': ['apaisant', 'anti-rougeurs'],
  'tranexamic acid': ['anti-taches', 'hyperpigmentation', 'traitement'],
  // Filtres solaires
  'zinc oxide': ['protection-solaire', 'filtres-mineraux', 'apaisant'],
  'titanium dioxide': ['protection-solaire', 'filtres-mineraux'],
  avobenzone: ['protection-solaire', 'filtres-chimiques'],
  octocrylene: ['protection-solaire', 'filtres-chimiques'],
  'ethylhexyl methoxycinnamate': ['protection-solaire', 'filtres-chimiques'],
  homosalate: ['protection-solaire', 'filtres-chimiques'],
  'ethylhexyl salicylate': ['protection-solaire', 'filtres-chimiques'],
  tinosorb: ['protection-solaire', 'filtres-chimiques'],
  mexoryl: ['protection-solaire', 'filtres-chimiques'],
  // Dépigmentants
  kojic: ['anti-taches', 'hyperpigmentation'],
  arbutin: ['anti-taches', 'hyperpigmentation', 'eclat'],
  'alpha-arbutin': ['anti-taches', 'hyperpigmentation', 'eclat'],
}

// ─── Aggressive INCI → avoid tags ────────────────────────────────────────────

const INCI_TO_AVOID: Record<string, string[]> = {
  retinol: ['peau-sensible', 'peau-reactive', 'barriere-cutanee-alteree'],
  retinal: ['peau-sensible', 'peau-reactive', 'barriere-cutanee-alteree'],
  'salicylic acid': ['peau-sensible', 'peau-reactive', 'peau-atopique'],
  'capryloyl salicylic acid': ['peau-sensible', 'peau-reactive'],
  'glycolic acid': ['peau-sensible', 'peau-reactive'],
  'benzoyl peroxide': [
    'peau-sensible',
    'peau-reactive',
    'peau-atopique',
    'barriere-cutanee-alteree',
  ],
}

// ─── kind → skincare secondary tags ──────────────────────────────────────────

const KIND_SKINCARE_SEC: Record<string, string[]> = {
  cleanser: ['nettoyant', 'double-nettoyage-2', 'zone-visage'],
  moisturizer: ['creme-hydratante', 'zone-visage'],
  serum: ['serum', 'traitement', 'zone-visage'],
  toner: ['tonique', 'preparation', 'zone-visage'],
  essence: ['essence', 'preparation', 'zone-visage'],
  'eye-cream': ['contour-yeux', 'zone-yeux', 'soin-yeux'],
  sunscreen: ['creme-solaire', 'protection-solaire', 'matin', 'zone-visage'],
  exfoliant: ['exfoliation', 'zone-visage'],
  mask: ['masque-hebdo', 'zone-visage'],
  oil: ['huile-visage', 'emollience', 'zone-visage'],
  balm: ['baume'],
  mist: ['brume', 'preparation', 'zone-visage'],
  'body-lotion': ['lait-corps', 'zone-corps'],
  'body-cream': ['creme-corps', 'zone-corps'],
  'body-wash': ['nettoyant-corps', 'zone-corps'],
  'body-oil': ['huile-corps', 'zone-corps'],
  'body-scrub': ['gommage-corps', 'exfoliation', 'exfoliant-physique', 'zone-corps'],
  'hand-cream': ['creme-mains', 'zone-mains'],
  'lip-care': ['soin-levres', 'zone-levres'],
  'foot-cream': ['creme-pieds', 'zone-corps'],
  primer: ['primer', 'matin', 'zone-visage'],
  'spot-treatment': ['spot-treatment', 'soin-localise', 'zone-visage'],
  'self-tanner': ['auto-bronzant', 'zone-corps'],
  deodorant: ['deodorant'],
  patch: ['patch'],
}

// ─── kind → haircare primary (mirrors existing curated pattern) ───────────────

const KIND_HAIRCARE_PRIMARY: Record<string, string> = {
  shampoo: 'shampoing',
  conditioner: 'apres-shampoing',
  'hair-mask': 'masque-cheveux',
  'hair-oil': 'huile-cheveux',
  'hair-serum': 'serum-cheveux',
  styling: 'produit-coiffant',
}

// ─── kind → dental primary ────────────────────────────────────────────────────

const KIND_DENTAL_PRIMARY: Record<string, string> = {
  toothpaste: 'dentifrice',
  mouthwash: 'bain-de-bouche',
  'teeth-whitening': 'blanchiment-dentaire',
  floss: 'fil-dentaire',
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function extractField(block: string, field: string): string {
  const sq = new RegExp(`${field}:\\s*'([^']*)'`)
  const dq = new RegExp(`${field}:\\s*"([^"]*)"`)
  const m = block.match(sq) ?? block.match(dq)
  if (m) return m[1]!
  // Backtick: find manually to avoid regex escaping issues
  const marker = `${field}: \``
  const start = block.indexOf(marker)
  if (start >= 0) {
    const valStart = start + marker.length
    const end = block.indexOf('`', valStart)
    if (end >= 0) return block.slice(valStart, end)
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

  for (const ingredient of ingredients) {
    const trimmed = ingredient.trim()
    if (!trimmed) continue

    for (const [key, tags] of Object.entries(INCI_TO_SKINCARE)) {
      if (trimmed === key || trimmed.includes(key)) {
        for (const tag of tags) {
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

  // If protection-solaire is primary, ensure matin appears in secondary
  if (primary.includes('protection-solaire')) secondary.add('matin')

  // If exfoliation is primary via INCI, mark it as chemical
  if (primary.includes('exfoliation') && !secondary.has('exfoliant-physique')) {
    secondary.add('exfoliant-chimique')
  }

  return {
    primary,
    secondary: [...secondary].filter((t) => !primary.includes(t)),
    avoid: [...avoid],
  }
}

function computeTags(
  inci: string,
  kind: string,
  domain: 'skincare' | 'haircare' | 'dental'
): TagResult {
  if (domain === 'haircare') {
    const p = KIND_HAIRCARE_PRIMARY[kind]
    return { primary: p ? [p] : [], secondary: [], avoid: [] }
  }

  if (domain === 'dental') {
    const p = KIND_DENTAL_PRIMARY[kind]
    return { primary: p ? [p] : [], secondary: [], avoid: [] }
  }

  // Skincare with no INCI: only kind-based secondary, no primary
  if (!inci.trim()) {
    return { primary: [], secondary: KIND_SKINCARE_SEC[kind] ?? [], avoid: [] }
  }

  return computeSkincareTagsFromInci(inci, kind)
}

// ─── Code generation ──────────────────────────────────────────────────────────

function slugToCode(slug: string): string {
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

function renderTags(result: TagResult): string {
  if (!result.primary.length && !result.secondary.length && !result.avoid.length) {
    return EMPTY_TAGS_STR
  }
  return [
    'tags: {',
    `      primary: ${renderArray(result.primary)},`,
    `      secondary: ${renderArray(result.secondary)},`,
    `      avoid: ${renderArray(result.avoid)},`,
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

  let searchFrom = 0
  while (true) {
    const idx = content.indexOf(EMPTY_TAGS_STR, searchFrom)
    if (idx === -1) break
    searchFrom = idx + EMPTY_TAGS_STR.length

    const before = content.slice(0, idx)
    const lastSlugIdx = before.lastIndexOf('\n    slug:')
    const context = lastSlugIdx >= 0 ? before.slice(lastSlugIdx) : before.slice(-2000)

    const slug = extractField(context, 'slug')
    const kind = extractField(context, 'kind')
    const inci = extractField(context, 'inci')
    const domain = getDomain(filePath, kind)

    const result = computeTags(inci, kind, domain)
    const replacement = renderTags(result)

    if (replacement === EMPTY_TAGS_STR) {
      noMatch++
      continue
    }

    changes.push({ slug, index: idx, length: EMPTY_TAGS_STR.length, replacement })
  }

  if (changes.length > 0) {
    if (WRITE) {
      // Apply from end to start to keep indices valid
      let newContent = content
      for (let i = changes.length - 1; i >= 0; i--) {
        const c = changes[i]!
        newContent =
          newContent.slice(0, c.index) + c.replacement + newContent.slice(c.index + c.length)
      }
      writeFileSync(filePath, newContent)
    } else {
      const rel = filePath.replace(SEED_ROOT + '/', '')
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

const glob = new Bun.Glob('data/products/**/*.seed.ts')
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
