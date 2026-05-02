#!/usr/bin/env bun
// One-shot codemod: rewrite `TAG_SLUGS.<LEGACY>` references in skincare seeds
// to their v2 equivalents (product_type_v2 + texture + zone, or
// routine_step_v2 + routine_moment). Run before dropping the legacy axes.
//
// Usage:
//   bun run backend/src/db/seed/scripts/migrate-seeds-to-v2.ts          # dry run
//   bun run backend/src/db/seed/scripts/migrate-seeds-to-v2.ts --write  # apply

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const WRITE = process.argv.includes('--write')
const SEED_GLOB_ROOT = join(import.meta.dir, '..')

// Legacy product_type → list of v2 keys (product_type_v2 + optional texture + zone).
// Mirrors SKINCARE_LEGACY_TYPE_TO_V2 / _TO_TEXTURE / _TO_ZONE in shared.
const LEGACY_TYPE: Record<string, string[]> = {
  BAUME_DEMAQUILLANT: ['TYPE_NETTOYANT', 'TEXTURE_BAUME'],
  HUILE_DEMAQUILLANTE: ['TYPE_NETTOYANT', 'TEXTURE_HUILE'],
  HUILE_NETTOYANTE: ['TYPE_NETTOYANT', 'TEXTURE_HUILE'],
  GEL_NETTOYANT: ['TYPE_NETTOYANT', 'TEXTURE_GEL'],
  MOUSSE_NETTOYANTE: ['TYPE_NETTOYANT', 'TEXTURE_MOUSSE'],
  LAIT_NETTOYANT: ['TYPE_NETTOYANT', 'TEXTURE_LAIT'],
  CREME_NETTOYANTE: ['TYPE_NETTOYANT', 'TEXTURE_CREME'],
  EAU_MICELLAIRE: ['TYPE_NETTOYANT', 'TEXTURE_EAU'],
  NETTOYANT_CORPS: ['TYPE_NETTOYANT', 'ZONE_CORPS'],
  TONIQUE: ['TYPE_TONER', 'TEXTURE_EAU'],
  LOTION: ['TYPE_TONER', 'TEXTURE_EAU'],
  ESSENCE: ['TYPE_TONER'],
  BRUME: ['TYPE_MIST', 'TEXTURE_EAU'],
  SERUM: ['TYPE_SERUM'],
  AMPOULE: ['TYPE_SERUM'],
  HUILE_VISAGE: ['TYPE_SERUM', 'TEXTURE_HUILE', 'ZONE_VISAGE'],
  CREME_HYDRATANTE: ['TYPE_HYDRATANT', 'TEXTURE_CREME'],
  GEL_CREME: ['TYPE_HYDRATANT', 'TEXTURE_GEL'],
  CREME_DE_NUIT: ['TYPE_HYDRATANT', 'TEXTURE_CREME'],
  BAUME: ['TYPE_HYDRATANT', 'TEXTURE_BAUME'],
  LAIT_CORPS: ['TYPE_HYDRATANT', 'TEXTURE_LAIT', 'ZONE_CORPS'],
  CREME_CORPS: ['TYPE_HYDRATANT', 'TEXTURE_CREME', 'ZONE_CORPS'],
  HUILE_CORPS: ['TYPE_HYDRATANT', 'TEXTURE_HUILE', 'ZONE_CORPS'],
  CREME_MAINS: ['TYPE_HYDRATANT', 'TEXTURE_CREME', 'ZONE_MAINS'],
  CREME_PIEDS: ['TYPE_HYDRATANT', 'ZONE_PIEDS'],
  MASQUE_ARGILE: ['TYPE_MASQUE'],
  MASQUE_TISSU: ['TYPE_MASQUE'],
  MASQUE_HYDRATANT: ['TYPE_MASQUE'],
  SLEEPING_MASK: ['TYPE_MASQUE'],
  PATCH: ['TYPE_MASQUE', 'TEXTURE_PATCH'],
  EXFOLIANT_CHIMIQUE: ['TYPE_EXFOLIATION'],
  EXFOLIANT_PHYSIQUE: ['TYPE_EXFOLIATION'],
  GOMMAGE_CORPS: ['TYPE_EXFOLIATION', 'ZONE_CORPS'],
  CREME_SOLAIRE: ['TYPE_SOLAIRE', 'TEXTURE_CREME'],
  CREME_SOLAIRE_TEINTEE: ['TYPE_SOLAIRE', 'TEXTURE_CREME'],
  APRES_SOLEIL: ['TYPE_SOLAIRE'],
  AUTO_BRONZANT: ['TYPE_SOLAIRE'],
  SPOT_TREATMENT: ['TYPE_TRAITEMENT'],
  CONTOUR_YEUX: ['TYPE_TRAITEMENT', 'ZONE_YEUX'],
  SOIN_LEVRES: ['TYPE_TRAITEMENT', 'ZONE_LEVRES'],
  PRIMER: ['TYPE_PRIMER'],
  DEODORANT: ['TYPE_DEODORANT'],
  OUTIL_MASSAGE: ['TYPE_OUTIL'],
}

// Legacy routine_step → list of v2 keys (routine_step_v2 + routine_moment).
// NETTOYANT, MASQUE_HEBDO have no step mapping — covered by TYPE_NETTOYANT /
// TYPE_MASQUE on the type axis. MASQUE_HEBDO additionally adds the moment.
const LEGACY_ROUTINE: Record<string, string[]> = {
  MATIN: ['MOMENT_MATIN'],
  SOIR: ['MOMENT_SOIR'],
  NETTOYANT: [],
  DOUBLE_NETTOYAGE_1: ['STEP_NETTOYAGE_1'],
  DOUBLE_NETTOYAGE_2: ['STEP_NETTOYAGE_2'],
  PREPARATION: ['STEP_PREPARATION'],
  TRAITEMENT: ['STEP_TRAITEMENT'],
  HYDRATATION: ['STEP_HYDRATATION'],
  EMOLLIENCE: ['STEP_HYDRATATION'],
  PROTECTION_SOLAIRE: ['STEP_PROTECTION_SOLAIRE', 'MOMENT_MATIN'],
  OCCLUSION: ['STEP_OCCLUSIF', 'MOMENT_SOIR'],
  SOIN_YEUX: ['STEP_TRAITEMENT'],
  SOIN_LOCALISE: ['STEP_TRAITEMENT', 'MOMENT_USAGE_LOCALISE'],
  EXFOLIATION: ['STEP_TRAITEMENT'],
  MASQUE_HEBDO: ['MOMENT_HEBDOMADAIRE'],
}

const LEGACY: Record<string, string[]> = { ...LEGACY_TYPE, ...LEGACY_ROUTINE }

// Build a regex matching `TAG_SLUGS.<LEGACY>` with negative lookahead so e.g.
// NETTOYANT does not eat NETTOYANT_CORPS, BAUME does not eat BAUME_DEMAQUILLANT.
const KEYS = Object.keys(LEGACY).sort((a, b) => b.length - a.length)
const KEY_RE = new RegExp(`TAG_SLUGS\\.(${KEYS.join('|')})(?![A-Z_0-9])`, 'g')

// KEY (uppercase, snake) → slug string. Mirrors SKINCARE_PRODUCT_TAG_SLUGS.
const KEY_TO_SLUG: Record<string, string> = {
  BAUME_DEMAQUILLANT: 'baume-demaquillant',
  HUILE_DEMAQUILLANTE: 'huile-demaquillante',
  HUILE_NETTOYANTE: 'huile-nettoyante',
  GEL_NETTOYANT: 'gel-nettoyant',
  MOUSSE_NETTOYANTE: 'mousse-nettoyante',
  LAIT_NETTOYANT: 'lait-nettoyant',
  CREME_NETTOYANTE: 'creme-nettoyante',
  EAU_MICELLAIRE: 'eau-micellaire',
  TONIQUE: 'tonique',
  ESSENCE: 'essence',
  LOTION: 'lotion',
  BRUME: 'brume',
  PRIMER: 'primer',
  SERUM: 'serum',
  AMPOULE: 'ampoule',
  HUILE_VISAGE: 'huile-visage',
  SPOT_TREATMENT: 'spot-treatment',
  CREME_HYDRATANTE: 'creme-hydratante',
  GEL_CREME: 'gel-creme',
  CREME_DE_NUIT: 'creme-de-nuit',
  BAUME: 'baume',
  SLEEPING_MASK: 'sleeping-mask',
  CONTOUR_YEUX: 'contour-yeux',
  SOIN_LEVRES: 'soin-levres',
  EXFOLIANT_CHIMIQUE: 'exfoliant-chimique',
  EXFOLIANT_PHYSIQUE: 'exfoliant-physique',
  MASQUE_ARGILE: 'masque-argile',
  MASQUE_TISSU: 'masque-tissu',
  MASQUE_HYDRATANT: 'masque-hydratant',
  SLEEPING_MASK_2: 'sleeping-mask',
  CREME_SOLAIRE: 'creme-solaire',
  CREME_SOLAIRE_TEINTEE: 'creme-solaire-teintee',
  APRES_SOLEIL: 'apres-soleil',
  AUTO_BRONZANT: 'auto-bronzant',
  LAIT_CORPS: 'lait-corps',
  CREME_CORPS: 'creme-corps',
  CREME_MAINS: 'creme-mains',
  HUILE_CORPS: 'huile-corps',
  GOMMAGE_CORPS: 'gommage-corps',
  NETTOYANT_CORPS: 'nettoyant-corps',
  DEODORANT: 'deodorant',
  CREME_PIEDS: 'creme-pieds',
  PATCH: 'patch',
  OUTIL_MASSAGE: 'outil-massage',
  MATIN: 'matin',
  SOIR: 'soir',
  NETTOYANT: 'nettoyant',
  DOUBLE_NETTOYAGE_1: 'double-nettoyage-1',
  DOUBLE_NETTOYAGE_2: 'double-nettoyage-2',
  PREPARATION: 'preparation',
  TRAITEMENT: 'traitement',
  HYDRATATION: 'hydratation',
  EMOLLIENCE: 'emollience',
  PROTECTION_SOLAIRE: 'protection-solaire',
  OCCLUSION: 'occlusion',
  SOIN_YEUX: 'soin-yeux',
  SOIN_LOCALISE: 'soin-localise',
  EXFOLIATION: 'exfoliation',
  MASQUE_HEBDO: 'masque-hebdo',
}

const KEY_TO_V2_SLUGS = new Map<string, string>()
for (const [k, slug] of Object.entries(KEY_TO_SLUG)) {
  const v2Keys = LEGACY[k]
  if (v2Keys === undefined) continue
  KEY_TO_V2_SLUGS.set(slug, v2Keys.join('|'))
}

const SLUG_TO_V2: Record<string, string[]> = Object.fromEntries(
  Object.entries(LEGACY).flatMap(([key, v2Keys]) => {
    const slug = KEY_TO_SLUG[key]
    if (slug === undefined) return []
    const v2Slugs = v2Keys
      .map((k) => {
        const lower = k.toLowerCase().replace(/_/g, '-')
        return lower
      })
      .filter(Boolean)
    return [[slug, v2Slugs]]
  })
)

// Slugs to skip when found inside `kind:`, `slug:`, `unit:`, `category:` etc.
// Any line with one of these field prefixes is skipped (no rewrite).
const SKIP_FIELD_RE =
  /^\s*(kind|slug|unit|category|name|brand|url|imageUrl|description|notes|inci|amountUnit|pattern):\s/

// Replace literal slug strings only inside a `tags: { ... }` block. Walk each
// file with a brace counter; rewrite quoted slugs inside the block.
function rewriteLiteralSlugs(content: string): { out: string; hits: number } {
  const out: string[] = []
  let hits = 0
  const lines = content.split('\n')
  let depth = 0
  let inTags = false

  const SLUGS = Object.keys(SLUG_TO_V2)
  const SLUG_RE = new RegExp(`'(${SLUGS.join('|')})'`, 'g')

  for (const line of lines) {
    let next = line
    if (!inTags && /\btags:\s*\{/.test(line)) {
      inTags = true
      depth = 0
    }
    if (inTags) {
      for (const ch of line) {
        if (ch === '{') depth++
        else if (ch === '}') depth--
      }
      if (!SKIP_FIELD_RE.test(line)) {
        next = line.replace(SLUG_RE, (_full, slug: string) => {
          const v2 = SLUG_TO_V2[slug] ?? []
          if (v2.length === 0) {
            hits++
            return '__DROP_LIT__'
          }
          hits++
          return v2.map((s) => `'${s}'`).join(', ')
        })
      }
      if (depth <= 0) inTags = false
    }
    out.push(next)
  }

  let result = out.join('\n')
  // Cleanup __DROP_LIT__ remnants (slug with no v2 mapping like 'nettoyant').
  result = result
    .replace(/\[\s*__DROP_LIT__\s*,\s*/g, '[')
    .replace(/,\s*__DROP_LIT__\s*\]/g, ']')
    .replace(/\[\s*__DROP_LIT__\s*\]/g, '[]')
    .replace(/__DROP_LIT__,\s?/g, '')
    .replace(/,\s?__DROP_LIT__/g, '')
    .replace(/^\s*__DROP_LIT__,?\s*\n/gm, '')
  return { out: result, hits }
}

function rewriteLine(line: string): { out: string; drop: boolean } {
  let drop = false
  let out = line.replace(KEY_RE, (_full, key: string) => {
    const v2 = LEGACY[key] ?? []
    if (v2.length === 0) {
      drop = true
      return '__DROP__'
    }
    return v2.map((k) => `TAG_SLUGS.${k}`).join(', ')
  })
  if (!drop) return { out, drop: false }
  if (/^\s*__DROP__,?\s*$/.test(out)) return { out: '', drop: true }
  out = out
    .replace(/\[\s*__DROP__\s*,\s*/g, '[')
    .replace(/,\s*__DROP__\s*\]/g, ']')
    .replace(/\[\s*__DROP__\s*\]/g, '[]')
    .replace(/__DROP__,\s?/g, '')
    .replace(/,\s?__DROP__/g, '')
  return { out, drop: false }
}

function processFile(filePath: string): { changed: boolean; hits: number } {
  const content = readFileSync(filePath, 'utf-8')

  // Pass 1 — TAG_SLUGS.<LEGACY> → TAG_SLUGS.<V2>, ...
  const lines = content.split('\n')
  const newLines: string[] = []
  let hits = 0

  for (const line of lines) {
    if (!KEY_RE.test(line)) {
      KEY_RE.lastIndex = 0
      newLines.push(line)
      continue
    }
    KEY_RE.lastIndex = 0
    const { out, drop } = rewriteLine(line)
    hits++
    if (drop) continue
    newLines.push(out)
  }

  // Pass 2 — literal `'slug'` strings inside tags blocks.
  const intermediate = newLines.join('\n')
  const { out: next, hits: litHits } = rewriteLiteralSlugs(intermediate)
  hits += litHits

  if (next === content) return { changed: false, hits }
  if (WRITE) writeFileSync(filePath, next)
  return { changed: true, hits }
}

const glob = new Bun.Glob('data/products/**/*.ts')
let totalFiles = 0
let totalHits = 0

for (const file of glob.scanSync(SEED_GLOB_ROOT)) {
  const fullPath = join(SEED_GLOB_ROOT, file)
  const { changed, hits } = processFile(fullPath)
  if (changed) {
    totalFiles++
    totalHits += hits
    if (!WRITE) console.log(`  ${file} (+${hits})`)
  }
}

console.log('\n─── Migrate seeds → v2 ──────────────────────────────────')
console.log(`Mode  : ${WRITE ? 'WRITE' : 'DRY RUN'}`)
console.log(`Files : ${totalFiles}`)
console.log(`Hits  : ${totalHits}`)
if (!WRITE) console.log('\nRun with --write to apply.')
