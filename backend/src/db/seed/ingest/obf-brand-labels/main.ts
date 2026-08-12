// Open Beauty Facts brand-level label ingestion. Streams the OBF CSV dump
// (~17 MB gz, ~120 MB raw, ~64k cosmetics rows) and aggregates per-brand
// vegan / cruelty-free / natural claims into `brand_certifications`
// (source `obf`). Manual seed preserved: only add evidence, lift false to
// true, never overwrite a manual `true` back to false.

// Usage:
//   bun run backend/src/db/seed/ingest/obf-brand-labels/main.ts                   # dry-run, cached dump
//   bun run backend/src/db/seed/ingest/obf-brand-labels/main.ts --download        # force a fresh download
//   bun run backend/src/db/seed/ingest/obf-brand-labels/main.ts --write           # apply DB upserts
//   bun run backend/src/db/seed/ingest/obf-brand-labels/main.ts --threshold 0.7   # stricter ratio

import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { gunzipSync } from 'node:zlib'

import { sql } from 'drizzle-orm'

import { db } from '../../..'
import { withAdminRls } from '../../../rls'
import { brandCertifications, normalizeBrand, products } from '../../../schema'
import type {
  BrandCertification,
  BrandCertificationInsert,
  BrandCertificationSources,
} from '../../../schema/products/brand-certifications'
import {
  aggregateBrandClaims,
  type BrandClaimRollup,
  brandToObfSlug,
  mergeObfSourcesIntoExisting,
  parseObfCsvLine,
  resolveObfColumns,
} from './lib'

const OBF_DUMP_URL =
  'https://static.openbeautyfacts.org/data/en.openbeautyfacts.org.products.csv.gz'
// Anchored to the script (not CWD): the recipe runs this in-container at
// /app/backend, where the bare 'backend/tmp/...' literal resolved to a
// doubled 'backend/backend/tmp/...'. Five levels up lands on the backend
// root, so cache lives under the gitignored backend/tmp/ from host or container.
const CACHE_DIR = join(import.meta.dir, '..', '..', '..', '..', '..', 'tmp', 'cache', 'obf')
const CACHE_FILE = join(CACHE_DIR, 'products.csv.gz')

const FORCE_DOWNLOAD = process.argv.includes('--download')
const WRITE = process.argv.includes('--write')
const NO_WHITELIST = process.argv.includes('--no-whitelist')
// Decision rule (default): a claim fires when ≥50% of the brand's OBF
// products carry the matching label AND the brand has ≥2 products in OBF.
const RATIO_THRESHOLD = numericFlag('--threshold', 0.5)
const MIN_PRODUCTS = numericFlag('--min', 2)
const MIN_LABEL_COUNT = numericFlag('--min-label-count', 3)

function numericFlag(name: string, fallback: number): number {
  const i = process.argv.indexOf(name)
  if (i === -1) return fallback
  const raw = process.argv[i + 1]
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Flag ${name} expects a number, got "${raw}"`)
  }
  return parsed
}

// Cache lives at `backend/tmp/cache/obf/products.csv.gz` (gitignored). Reuses
// the cached file unless --download is passed; OBF refreshes the dump daily,
// so a `--download` once a day is enough.
async function ensureDump(): Promise<Uint8Array> {
  if (FORCE_DOWNLOAD || !existsSync(CACHE_FILE)) {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true })
    console.log(`📥 Téléchargement du dump OBF (${OBF_DUMP_URL})...`)
    const res = await fetch(OBF_DUMP_URL)
    if (!res.ok) throw new Error(`Échec téléchargement OBF (HTTP ${res.status})`)
    const bytes = new Uint8Array(await res.arrayBuffer())
    await Bun.write(CACHE_FILE, bytes)
    const mb = (bytes.byteLength / 1024 / 1024).toFixed(1)
    console.log(`✅ Dump caché à ${CACHE_FILE} (${mb} MB)\n`)
    return bytes
  }
  console.log(`📂 Dump caché : ${CACHE_FILE}\n`)
  return new Uint8Array(await Bun.file(CACHE_FILE).arrayBuffer())
}

function* csvLines(rawCsv: string): Generator<string> {
  // Skip header line.
  let start = rawCsv.indexOf('\n') + 1
  if (start === 0) return
  while (start < rawCsv.length) {
    const nl = rawCsv.indexOf('\n', start)
    const end = nl === -1 ? rawCsv.length : nl
    yield rawCsv.slice(start, end)
    if (nl === -1) break
    start = nl + 1
  }
}

interface CorpusScope {
  whitelist: Set<string> | undefined
  corpusSlugToDisplay: Map<string, string> | undefined
}

interface MergePlan {
  inserts: BrandCertificationInsert[]
  updates: { brandNormalized: string; row: BrandCertificationInsert }[]
  newRows: number
  liftedFlags: number
  mergedSources: number
}

// OBF slugs of brands present in `products.brand` (after slugification).
// --no-whitelist ingests every OBF brand instead (much larger result set,
// mostly irrelevant).
async function resolveCorpusScope(): Promise<CorpusScope> {
  if (NO_WHITELIST) return { whitelist: undefined, corpusSlugToDisplay: undefined }
  const corpusBrands = await withAdminRls((tx) =>
    tx.selectDistinct({ brand: products.brand }).from(products)
  )
  const corpusSlugToDisplay = new Map<string, string>()
  for (const r of corpusBrands) {
    if (r.brand) corpusSlugToDisplay.set(brandToObfSlug(r.brand), r.brand)
  }
  const whitelist = new Set(corpusSlugToDisplay.keys())
  console.log(`🎯 Whitelist : ${whitelist.size} marques uniques du corpus produits`)
  return { whitelist, corpusSlugToDisplay }
}

async function readObfRows(): Promise<{ brandTags: string[]; labelTags: string[] }[]> {
  const gz = await ensureDump()
  console.log('🗜  Décompression...')
  const raw = gunzipSync(gz)
  const text = new TextDecoder().decode(raw)
  console.log(`   ${(text.length / 1024 / 1024).toFixed(1)} MB décompressés\n`)

  const headerEnd = text.indexOf('\n')
  if (headerEnd === -1) throw new Error('OBF dump has no header row — empty or truncated download.')
  const columns = resolveObfColumns(text.slice(0, headerEnd))

  let rowCount = 0
  const rows: { brandTags: string[]; labelTags: string[] }[] = []
  for (const line of csvLines(text)) {
    rowCount++
    const row = parseObfCsvLine(line, columns)
    if (row) rows.push(row)
  }
  console.log(`📊 OBF : ${rowCount} lignes · ${rows.length} parsées avec brand|label`)
  return rows
}

// Corpus brands that produced zero OBF rows are usually a slug mismatch
// between brandToObfSlug and OBF's canonical id (apostrophes, ampersands,
// numbers), a silent miss the ratio rule can never surface. List them so
// the gap is auditable instead of invisible.
function reportUnmatchedCorpusBrands(
  scope: CorpusScope,
  rollups: Map<string, BrandClaimRollup>
): void {
  const { whitelist, corpusSlugToDisplay } = scope
  if (!whitelist || !corpusSlugToDisplay) return
  const unmatched = [...whitelist].filter((slug) => !rollups.has(slug))
  console.log(`🔍 Corpus sans produit OBF : ${unmatched.length}/${whitelist.size}`)
  if (unmatched.length === 0) return
  const names = unmatched.map((slug) => corpusSlugToDisplay.get(slug) ?? slug).sort()
  const shown = names.slice(0, 30)
  console.log(`   ${shown.join(', ')}${names.length > 30 ? ` … (+${names.length - 30})` : ''}\n`)
}

function reportClaims(rollups: Map<string, BrandClaimRollup>): void {
  let veganClaim = 0
  let crueltyFreeClaim = 0
  let naturalClaim = 0
  for (const r of rollups.values()) {
    if (r.vegan.claim) veganClaim++
    if (r.crueltyFree.claim) crueltyFreeClaim++
    if (r.naturalCertified.claim) naturalClaim++
  }
  console.log(`🏷  Claims OBF (post-rule) :`)
  console.log(`   vegan         : ${veganClaim}`)
  console.log(`   cruelty-free  : ${crueltyFreeClaim}`)
  console.log(`   natural-cert  : ${naturalClaim}\n`)

  if (!process.argv.includes('--verbose')) return
  const claimed = [...rollups.values()].filter(
    (r) => r.vegan.claim || r.crueltyFree.claim || r.naturalCertified.claim
  )
  claimed.sort((a, b) => b.total - a.total)
  console.log('📋 Marques claimées (verbose) :')
  if (claimed.length > 0)
    console.table(
      claimed.map((r) => ({
        slug: r.obfSlug,
        vegan: r.vegan.claim ? `${r.vegan.count}/${r.total}` : '',
        cf: r.crueltyFree.claim ? `${r.crueltyFree.count}/${r.total}` : '',
        nat: r.naturalCertified.claim ? `${r.naturalCertified.count}/${r.total}` : '',
      }))
    )
}

async function buildMergePlan(
  rollups: Map<string, BrandClaimRollup>,
  corpusSlugToDisplay: Map<string, string> | undefined
): Promise<MergePlan> {
  const existing = await db.select().from(brandCertifications)
  const existingByObfSlug = new Map<string, BrandCertification>()
  for (const row of existing) {
    existingByObfSlug.set(brandToObfSlug(row.brandDisplay), row)
  }

  const inserts: BrandCertificationInsert[] = []
  const updates: { brandNormalized: string; row: BrandCertificationInsert }[] = []
  let liftedFlags = 0
  let mergedSources = 0
  let newRows = 0

  for (const rollup of rollups.values()) {
    const anyClaim = rollup.vegan.claim || rollup.crueltyFree.claim || rollup.naturalCertified.claim
    if (!anyClaim) continue

    const ex = existingByObfSlug.get(rollup.obfSlug)
    if (!ex) {
      // New brand discovered by OBF. Key on normalizeBrand(display), the same
      // function both readers use to look up a row; obfSlug alone (dashes,
      // no accents) never matches that lookup. Use the corpus's raw brand
      // text when whitelist mode resolved it; fall back to obfSlug only when
      // the true display name is unknown (--no-whitelist).
      newRows++
      const display = corpusSlugToDisplay?.get(rollup.obfSlug) ?? rollup.obfSlug
      inserts.push({
        brandNormalized: normalizeBrand(display),
        brandDisplay: display,
        isVegan: rollup.vegan.claim,
        isCrueltyFree: rollup.crueltyFree.claim,
        isNaturalCertified: rollup.naturalCertified.claim,
        sources: buildSourcesFromRollup(rollup),
        notes: `Auto-discovered via OBF dump (n=${rollup.total}, ratios v=${rollup.vegan.ratio.toFixed(2)} cf=${rollup.crueltyFree.ratio.toFixed(2)} nat=${rollup.naturalCertified.ratio.toFixed(2)}).`,
      })
      continue
    }

    // Existing row: merge sources jsonb and lift any false flag that OBF
    // newly asserts. Never flip a manual `true` back to false.
    const newSources = mergeObfSourcesIntoExisting(ex.sources ?? {}, rollup)
    const sourcesChanged = JSON.stringify(newSources) !== JSON.stringify(ex.sources ?? {})

    const liftedVegan = !ex.isVegan && rollup.vegan.claim
    const liftedCF = !ex.isCrueltyFree && rollup.crueltyFree.claim
    const liftedNat = !ex.isNaturalCertified && rollup.naturalCertified.claim
    const flagsChanged = liftedVegan || liftedCF || liftedNat

    if (!sourcesChanged && !flagsChanged) continue

    if (flagsChanged) liftedFlags++
    if (sourcesChanged) mergedSources++

    updates.push({
      brandNormalized: ex.brandNormalized,
      row: {
        brandNormalized: ex.brandNormalized,
        brandDisplay: ex.brandDisplay,
        isVegan: ex.isVegan || rollup.vegan.claim,
        isCrueltyFree: ex.isCrueltyFree || rollup.crueltyFree.claim,
        isNaturalCertified: ex.isNaturalCertified || rollup.naturalCertified.claim,
        sources: newSources,
        notes: ex.notes,
      },
    })
  }

  return { inserts, updates, newRows, liftedFlags, mergedSources }
}

function reportMergePlan(plan: MergePlan): void {
  console.log(`📝 Plan de merge :`)
  console.log(`   Nouvelles marques OBF (insert)        : ${plan.newRows}`)
  console.log(`   Existantes — flags liftés false→true   : ${plan.liftedFlags}`)
  console.log(`   Existantes — sources jsonb enrichies   : ${plan.mergedSources}\n`)
}

async function applyMergePlan(plan: MergePlan): Promise<void> {
  if (plan.inserts.length > 0) {
    const CHUNK = 200
    for (let i = 0; i < plan.inserts.length; i += CHUNK) {
      await db
        .insert(brandCertifications)
        .values(plan.inserts.slice(i, i + CHUNK))
        .onConflictDoUpdate({
          target: brandCertifications.brandNormalized,
          set: {
            isVegan: sql`brand_certifications.is_vegan OR excluded.is_vegan`,
            isCrueltyFree: sql`brand_certifications.is_cruelty_free OR excluded.is_cruelty_free`,
            isNaturalCertified: sql`brand_certifications.is_natural_certified OR excluded.is_natural_certified`,
            sources: sql`coalesce(brand_certifications.sources, '{}'::jsonb) || excluded.sources`,
          },
        })
    }
    console.log(`✅ ${plan.inserts.length} insert/upsert (nouvelles marques)`)
  }

  for (const u of plan.updates) {
    await db
      .update(brandCertifications)
      .set({
        isVegan: u.row.isVegan,
        isCrueltyFree: u.row.isCrueltyFree,
        isNaturalCertified: u.row.isNaturalCertified,
        sources: u.row.sources,
      })
      .where(sql`${brandCertifications.brandNormalized} = ${u.brandNormalized}`)
  }
  console.log(`✅ ${plan.updates.length} updates (existantes mergées)\n`)
}

async function main() {
  console.log('🌐 Ingest OBF brand-level labels')
  console.log(
    `   mode=${WRITE ? 'WRITE' : 'DRY-RUN'} · ratio≥${RATIO_THRESHOLD}@n≥${MIN_PRODUCTS} OR count≥${MIN_LABEL_COUNT}${
      NO_WHITELIST ? ' · all-brands' : ' · corpus-only'
    }\n`
  )

  const scope = await resolveCorpusScope()
  const rows = await readObfRows()

  const rollups = aggregateBrandClaims(rows, {
    ratioThreshold: RATIO_THRESHOLD,
    minProducts: MIN_PRODUCTS,
    minLabelCount: MIN_LABEL_COUNT,
    ...(scope.whitelist ? { brandWhitelist: scope.whitelist } : {}),
  })
  console.log(`   ${rollups.size} marques agrégées (post-whitelist)\n`)

  reportUnmatchedCorpusBrands(scope, rollups)
  reportClaims(rollups)

  const plan = await buildMergePlan(rollups, scope.corpusSlugToDisplay)
  reportMergePlan(plan)

  if (!WRITE) {
    console.log('Run avec --write pour appliquer.')
    return
  }

  await applyMergePlan(plan)
}

function buildSourcesFromRollup(rollup: BrandClaimRollup): BrandCertificationSources {
  const out: BrandCertificationSources = {}
  if (rollup.vegan.claim) out.vegan = ['obf']
  if (rollup.crueltyFree.claim) out.cruelty_free = ['obf']
  if (rollup.naturalCertified.claim) out.natural = ['obf']
  return out
}

main().catch((err) => {
  console.error('\n💥 Erreur :', err instanceof Error ? err.message : err)
  if (err instanceof Error && err.stack) console.error(err.stack)
  process.exit(1)
})
