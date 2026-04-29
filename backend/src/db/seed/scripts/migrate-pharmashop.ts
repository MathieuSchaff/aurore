#!/usr/bin/env bun
/**
 * migrate-pharmashop.ts — Pharmashop description.txt → seed candidates.
 *
 * Reads:  backend/src/db/seed/output/product-details/{slug-dir}/description.txt
 *      OR backend/src/db/seed/output/product-details/*.txt  (flat variant)
 * Writes:
 *   - output/migration-pharmashop-report.json     — enrichment plan (read-only on data/products/)
 *   - output/candidates/{category}/{brand}.pharmashop.seed.ts
 *
 * Suffix `.pharmashop.seed.ts` keeps these candidates separate from the Atida ones written by
 * migrate-output.ts (`.seed.ts`), so reviewers can tell at a glance which scrapper produced
 * each file.
 *
 * Usage:
 *   bun run backend/src/db/seed/scripts/migrate-pharmashop.ts                          # dry-run all
 *   bun run backend/src/db/seed/scripts/migrate-pharmashop.ts --only=eucerin,svr       # filter source files (path substring, lowercased)
 *   bun run backend/src/db/seed/scripts/migrate-pharmashop.ts --apply                  # write candidates (preserves existing)
 *   bun run backend/src/db/seed/scripts/migrate-pharmashop.ts --apply --force          # overwrite existing candidates
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import {
  brandToSlug,
  cleanInci,
  cleanName,
  cleanSlug,
  detectOutOfScope,
  generateCandidateFile,
  getEnrichableFields,
  inferKind,
  inferKindFallback,
  inferUnit,
  KIND_TO_CATEGORY,
  loadExistingSlugs,
  type MigrationEntry,
  type NormalizedProduct,
  parseAmountFromName,
} from './lib/migration-helpers'
import { type ParsedPharmashopProduct, parsePharmashopDescription } from './lib/pharmashop-parser'

// ─── Paths ───────────────────────────────────────────────────────────────────

const SEED_ROOT = join(import.meta.dir, '..')
const PRODUCT_DETAILS_DIR = join(SEED_ROOT, 'output', 'product-details')
const PRODUCTS_DIR = join(SEED_ROOT, 'data', 'products')
const CANDIDATES_DIR = join(SEED_ROOT, 'output', 'candidates')
const REPORT_PATH = join(SEED_ROOT, 'output', 'migration-pharmashop-report.json')

const DRY_RUN = !process.argv.includes('--apply')
const FORCE = process.argv.includes('--force')
const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith('--only='))
  return arg
    ? arg
        .slice('--only='.length)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : null
})()

// ─── Source file discovery ──────────────────────────────────────────────────

function listSourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      const desc = join(full, 'description.txt')
      if (existsSync(desc)) out.push(desc)
    } else if (st.isFile() && name.endsWith('.txt')) {
      out.push(full)
    }
  }
  return out.sort()
}

// ─── URL context → category override ────────────────────────────────────────
// Pharmashop URLs encode placement (`/bebe/maman/vergetures/`, `/soins-corps/`). When a
// skincare-leaning kind is parked in a bodycare URL, remap to the body-* equivalent so
// the candidate lands in `output/candidates/bodycare/` instead of `skincare/`.

const URL_BODYCARE_RE = /\/(?:bebe\/maman\/vergetures|soins?-corps|corps|hygiene-corps)\//i

const SKINCARE_TO_BODYCARE: Record<string, string> = {
  oil: 'body-oil',
  moisturizer: 'body-lotion',
  cleanser: 'body-wash',
  exfoliant: 'body-scrub',
  balm: 'body-lotion',
}

function applyUrlContext(url: string, kind: string): string {
  if (URL_BODYCARE_RE.test(url) && kind in SKINCARE_TO_BODYCARE) {
    return SKINCARE_TO_BODYCARE[kind]
  }
  return kind
}

// ─── Brand normalization ────────────────────────────────────────────────────
// Pharmashop emits brand in CAPS (`LA MARQUE EUCERIN` → `EUCERIN`). Existing seeds use
// Title Case (`Eucerin`, `La Roche-Posay`). Short all-caps tokens (≤4 chars) are kept as
// acronyms (SVR, ACM, NUXE).

function normalizeBrand(brand: string): string {
  const trimmed = brand.trim()
  if (!trimmed) return ''
  if (trimmed.length <= 4 && /^[A-Z]+$/.test(trimmed)) return trimmed
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((w) =>
      w
        .split('-')
        .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
        .join('-')
    )
    .join(' ')
}

// ─── Normalize one parsed product into the shared seed shape ────────────────

function normalize(parsed: ParsedPharmashopProduct, sourceFile: string): NormalizedProduct {
  const brand = normalizeBrand(parsed.brand)

  let totalAmount = parsed.totalAmount
  let amountUnit = parsed.amountUnit
  if (totalAmount <= 0 || !amountUnit) {
    const fb = parseAmountFromName(parsed.title)
    if (fb) {
      totalAmount = fb.amount
      amountUnit = fb.unit
    }
  }

  const cleanedName = cleanName(parsed.title, brand, totalAmount, amountUnit)
  const inferredKind = inferKind(cleanedName) || inferKindFallback(cleanedName)
  const kind = applyUrlContext(parsed.url, inferredKind)
  const unit = parsed.unitHint || inferUnit(cleanedName, kind)

  return {
    slug: cleanSlug(parsed.slug, totalAmount, amountUnit),
    name: cleanedName,
    brand,
    kind,
    unit,
    totalAmount,
    amountUnit,
    priceCents: parsed.priceCents,
    description: parsed.description,
    notes: '',
    inci: cleanInci(parsed.inciRaw),
    url: parsed.url,
    imageUrl: '',
    brandSlug: brandToSlug(brand),
    category: KIND_TO_CATEGORY[kind] ?? '',
    originalSlug: parsed.slug,
    originalName: parsed.title,
    sourceFile,
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿 Aurore — migrate-pharmashop')
  console.log(`   Mode   : ${DRY_RUN ? 'dry-run (pass --apply to write candidates)' : 'APPLY'}`)
  console.log(`   Source : output/product-details/`)
  console.log(`   Target : data/products/\n`)

  if (!existsSync(PRODUCT_DETAILS_DIR)) {
    console.error(`✗ ${PRODUCT_DETAILS_DIR} does not exist`)
    process.exit(1)
  }

  console.log('→ Scanning existing slug index...')
  const existingSlugs = await loadExistingSlugs(PRODUCTS_DIR)
  console.log(`  ${existingSlugs.size} slugs indexed\n`)

  let sourceFiles = listSourceFiles(PRODUCT_DETAILS_DIR)
  console.log(`→ Found ${sourceFiles.length} source files`)

  if (ONLY) {
    const before = sourceFiles.length
    sourceFiles = sourceFiles.filter((f) => ONLY.some((needle) => f.toLowerCase().includes(needle)))
    console.log(`→ --only=${ONLY.join(',')} → ${sourceFiles.length}/${before} matching`)
    if (sourceFiles.length === 0) return
  }
  console.log(`→ Processing ${sourceFiles.length} files...\n`)

  const allEntries: MigrationEntry[] = []
  const toCreate = new Map<string, NormalizedProduct[]>()
  const counters = { parsed: 0, parseFail: 0, missingInci: 0, missingBrand: 0 }

  for (const sourceFile of sourceFiles) {
    const text = readFileSync(sourceFile, 'utf-8')
    const parsed = parsePharmashopDescription(text)
    const sourceRel = relative(SEED_ROOT, sourceFile)

    if (!parsed) {
      counters.parseFail++
      allEntries.push({
        action: 'skip',
        slug: '',
        brand: '',
        name: '',
        category: '',
        sourceFile: sourceRel,
        skipReason: 'Parse failed (no URL or no "Ajouter à ma liste" anchor)',
      })
      continue
    }
    counters.parsed++
    if (!parsed.inciRaw) counters.missingInci++
    if (!parsed.brand) counters.missingBrand++

    const p = normalize(parsed, sourceRel)
    const existingFile = existingSlugs.get(p.slug)
    const oosReason = detectOutOfScope(p.originalName)

    let entry: MigrationEntry

    if (existingFile && !oosReason) {
      entry = {
        action: 'enrich',
        slug: p.slug,
        brand: p.brand,
        name: p.name,
        category: p.category,
        sourceFile: sourceRel,
        existingProductFile: existingFile,
        enrichableFields: getEnrichableFields(p),
      }
    } else if (oosReason || !p.kind) {
      entry = {
        action: 'skip',
        slug: p.slug,
        brand: p.brand,
        name: p.name,
        category: '',
        sourceFile: sourceRel,
        skipReason: oosReason
          ? `${oosReason}: "${p.originalName}"`
          : `Kind not inferred from: "${p.originalName}"`,
      }
    } else if (!p.brandSlug) {
      entry = {
        action: 'skip',
        slug: p.slug,
        brand: p.brand,
        name: p.name,
        category: p.category,
        sourceFile: sourceRel,
        skipReason: `Empty brand — cannot group: "${p.originalName}"`,
      }
    } else {
      const groupKey = `${p.category}/${p.brandSlug}`
      let group = toCreate.get(groupKey)
      if (!group) {
        group = []
        toCreate.set(groupKey, group)
      }
      // Pharmashop ships separate fiches per format (50ml + 100ml of same SKU). The
      // slug derives from the cleaned name and collides; suffix with volume so each
      // candidate gets a unique slug.
      if (group.some((x) => x.slug === p.slug) && p.totalAmount > 0 && p.amountUnit) {
        p.slug = `${p.slug}-${p.totalAmount}${p.amountUnit}`
      }
      group.push(p)
      entry = {
        action: 'create',
        slug: p.slug,
        brand: p.brand,
        name: p.name,
        category: p.category,
        sourceFile: sourceRel,
      }
    }
    allEntries.push(entry)
  }

  // ─── Summary ──────────────────────────────────────────────────────────────

  const counts = {
    total: allEntries.length,
    parsed: counters.parsed,
    parseFail: counters.parseFail,
    missingInci: counters.missingInci,
    missingBrand: counters.missingBrand,
    enrich: allEntries.filter((e) => e.action === 'enrich').length,
    create: allEntries.filter((e) => e.action === 'create').length,
    skip: allEntries.filter((e) => e.action === 'skip').length,
  }

  console.log(`
── Results ──────────────────────────────────────────
  Total        ${counts.total}
  Parsed       ${counts.parsed}
  Parse fail   ${counts.parseFail}
  Missing INCI ${counts.missingInci}  (placeholder-only or empty COMPOSITION)
  No brand     ${counts.missingBrand}
  Enrich       ${counts.enrich}  (slug already in seed)
  Create       ${counts.create}
  Skip         ${counts.skip}  (out-of-scope, no kind, or no brand)
─────────────────────────────────────────────────────
`)

  // ─── Report (always written) ─────────────────────────────────────────────

  const report = {
    generatedAt: new Date().toISOString(),
    mode: DRY_RUN ? 'dry-run' : 'apply',
    summary: counts,
    enrich: allEntries.filter((e) => e.action === 'enrich').map(({ action: _, ...e }) => e),
    create: allEntries.filter((e) => e.action === 'create').map(({ action: _, ...e }) => e),
    skip: allEntries.filter((e) => e.action === 'skip').map(({ action: _, ...e }) => e),
  }
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  console.log('✓ Report → output/migration-pharmashop-report.json')

  // ─── Candidate files (--apply only) ──────────────────────────────────────

  if (!DRY_RUN) {
    if (!existsSync(CANDIDATES_DIR)) mkdirSync(CANDIDATES_DIR, { recursive: true })
    const stubPath = join(SEED_ROOT, 'output', 'types.ts')
    if (!existsSync(stubPath)) {
      writeFileSync(
        stubPath,
        `// Re-export so candidates can import '../../types'.\n` +
          `// After moving a candidate to data/products/{cat}/{brand}/, the same path resolves to data/products/types.ts.\n` +
          `export type { UnifiedProductSeed } from '../data/products/types'\n`,
        'utf-8'
      )
      console.log('  ✓ output/types.ts (re-export stub)')
    }

    let written = 0
    let skipped = 0
    for (const [groupKey, products] of toCreate) {
      const [category, brandSlug] = groupKey.split('/')
      const dir = join(CANDIDATES_DIR, category)
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

      const outPath = join(dir, `${brandSlug}.pharmashop.seed.ts`)
      if (existsSync(outPath) && !FORCE) {
        console.log(
          `  ⊘ candidates/${category}/${brandSlug}.pharmashop.seed.ts (exists — pass --force to overwrite)`
        )
        skipped++
        continue
      }
      writeFileSync(
        outPath,
        generateCandidateFile(products, brandSlug, {
          exportSuffix: 'PHARMASHOP_SEED',
          headerNote: 'Source: Pharmashop output/product-details/',
        }),
        'utf-8'
      )
      console.log(
        `  ✓ candidates/${category}/${brandSlug}.pharmashop.seed.ts  (${products.length} products)`
      )
      written++
    }
    console.log(
      `\n✓ ${written} candidate files written${skipped ? ` · ${skipped} skipped (already exist)` : ''}\n`
    )
  } else {
    console.log(`\n  Dry-run: ${toCreate.size} candidate file groups pending (pass --apply)\n`)
  }
}

main().catch((err) => {
  console.error('\n✗ Migration failed:', err)
  process.exit(1)
})
