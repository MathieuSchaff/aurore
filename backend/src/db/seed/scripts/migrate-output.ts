#!/usr/bin/env bun
/**
 * migrate-output.ts — Atida scrapper output → seed candidates.
 *
 * Reads:  backend/src/db/seed/output/seeds/*.ts
 * Writes:
 *   - output/migration-report.json       — enrichment plan (never touches existing seeds)
 *   - output/candidates/{category}/      — new .seed.ts files ready for review
 *
 * Usage:
 *   bun run backend/src/db/seed/scripts/migrate-output.ts                          # dry-run all sources
 *   bun run backend/src/db/seed/scripts/migrate-output.ts --only=ducray,olaplex    # restrict to specific source files (basename, no .ts)
 *   bun run backend/src/db/seed/scripts/migrate-output.ts --apply                  # write candidates (preserves existing)
 *   bun run backend/src/db/seed/scripts/migrate-output.ts --apply --force          # overwrite existing candidates
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'

import {
  STANDARD_AMOUNT_UNITS,
  parseAmountFromName,
  cleanSlug,
  cleanName,
  cleanInci,
  inferKind,
  inferKindFallback,
  inferUnit,
  detectOutOfScope,
  brandToSlug,
  KIND_TO_CATEGORY,
  generateCandidateFile,
  getEnrichableFields,
  loadExistingSlugs,
  type NormalizedProduct,
  type MigrationEntry,
} from './lib/migration-helpers'

// ─── Paths ───────────────────────────────────────────────────────────────────

const SEED_ROOT = join(import.meta.dir, '..')
const OUTPUT_SEEDS_DIR = join(SEED_ROOT, 'output', 'seeds')
const PRODUCTS_DIR = join(SEED_ROOT, 'data', 'products')
const CANDIDATES_DIR = join(SEED_ROOT, 'output', 'candidates')
const REPORT_PATH = join(SEED_ROOT, 'output', 'migration-report.json')

const DRY_RUN = !process.argv.includes('--apply')
const FORCE = process.argv.includes('--force')
const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith('--only='))
  return arg ? arg.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean) : null
})()

// ─── Atida raw shape (mirrors the pre-processed output/seeds/*.ts records) ──

interface RawProduct {
  slug: string
  name: string
  brand: string
  kind: string
  unit: string
  totalAmount: number
  amountUnit: string
  priceCents: number
  description: string
  notes: string
  inci: string
  url: string
  imageUrl: string
}

// ─── Text parser for output/seeds/*.ts ───────────────────────────────────────

function extractStringField(text: string, key: string): string {
  const re = new RegExp(
    `\\b${key}:\\s*(?:"((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)'|\`((?:[^\`\\\\]|\\\\.)*)\`)`,
    's'
  )
  const m = text.match(re)
  if (!m) return ''
  const raw = m[1] ?? m[2] ?? m[3] ?? ''
  return raw.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'")
}

function extractNumberField(text: string, key: string): number {
  const m = text.match(new RegExp(`\\b${key}:\\s*(-?\\d+(?:\\.\\d+)?)`))
  return m ? parseFloat(m[1]) : 0
}

function extractObjectBlocks(text: string): string[] {
  // State machine: find each top-level {...} in an array literal
  const blocks: string[] = []
  let depth = 0
  let start = -1
  let inString = false
  let stringChar = ''
  let escaped = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (inString) {
      if (escaped) { escaped = false; continue }
      if (ch === '\\') { escaped = true; continue }
      if (ch === stringChar) inString = false
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true
      stringChar = ch
      continue
    }
    if (ch === '{') {
      if (depth === 0) start = i
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0 && start !== -1) {
        blocks.push(text.slice(start, i + 1))
        start = -1
      }
    }
  }
  return blocks
}

function parseOutputSeedFile(filePath: string): RawProduct[] {
  const text = readFileSync(filePath, 'utf-8')
  const arrayMatch = text.match(/=\s*(\[[\s\S]*\])\s*;?\s*$/)
  if (!arrayMatch) {
    console.warn(`  ⚠  Cannot parse array in ${basename(filePath)}`)
    return []
  }

  return extractObjectBlocks(arrayMatch[1])
    .map((block) => {
      const slug = extractStringField(block, 'slug')
      if (!slug) return null
      return {
        slug,
        name: extractStringField(block, 'name'),
        brand: extractStringField(block, 'brand'),
        kind: extractStringField(block, 'kind'),
        unit: extractStringField(block, 'unit'),
        totalAmount: extractNumberField(block, 'totalAmount'),
        amountUnit: extractStringField(block, 'amountUnit'),
        priceCents: extractNumberField(block, 'priceCents'),
        description: extractStringField(block, 'description'),
        notes: extractStringField(block, 'notes'),
        inci: extractStringField(block, 'inci'),
        url: extractStringField(block, 'url'),
        imageUrl: extractStringField(block, 'imageUrl'),
      } satisfies RawProduct
    })
    .filter((p): p is RawProduct => p !== null)
}

// ─── Normalize ────────────────────────────────────────────────────────────────

function normalize(raw: RawProduct, sourceFile: string): NormalizedProduct {
  // Fallback: Atida sometimes returns totalAmount=1/amountUnit="unité" for products
  // whose volume is only present in the name. Reparse from name in that case.
  let totalAmount = raw.totalAmount
  let amountUnit = raw.amountUnit
  const unitInvalid = !STANDARD_AMOUNT_UNITS.includes(amountUnit.toLowerCase())
  if (unitInvalid || totalAmount <= 0) {
    const parsed = parseAmountFromName(raw.name)
    if (parsed) {
      totalAmount = parsed.amount
      amountUnit = parsed.unit
    }
  }
  const cleanedName = cleanName(raw.name, raw.brand, totalAmount, amountUnit)
  const kind = raw.kind || inferKind(cleanedName) || inferKindFallback(cleanedName)
  const unit = raw.unit || inferUnit(cleanedName, kind)
  return {
    ...raw,
    totalAmount,
    amountUnit,
    originalSlug: raw.slug,
    originalName: raw.name,
    brandSlug: brandToSlug(raw.brand) || basename(sourceFile, '.ts'),
    slug: cleanSlug(raw.slug, totalAmount, amountUnit),
    name: cleanedName,
    kind,
    unit,
    category: KIND_TO_CATEGORY[kind] ?? '',
    inci: cleanInci(raw.inci),
    sourceFile,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿 Aurore — migrate-output')
  console.log(`   Mode   : ${DRY_RUN ? 'dry-run (pass --apply to write candidates)' : 'APPLY'}`)
  console.log(`   Source : output/seeds/`)
  console.log(`   Target : data/products/\n`)

  console.log('→ Scanning existing slug index...')
  const existingSlugs = await loadExistingSlugs(PRODUCTS_DIR)
  console.log(`  ${existingSlugs.size} slugs indexed\n`)

  let seedFiles = readdirSync(OUTPUT_SEEDS_DIR).filter((f) => f.endsWith('.ts'))
  if (ONLY) {
    const before = seedFiles.length
    seedFiles = seedFiles.filter((f) => ONLY.includes(basename(f, '.ts')))
    console.log(`→ --only=${ONLY.join(',')} → ${seedFiles.length}/${before} source files`)
    if (seedFiles.length === 0) {
      console.warn(`  ⚠  No matching source file. Available: ${readdirSync(OUTPUT_SEEDS_DIR).filter((f) => f.endsWith('.ts')).map((f) => basename(f, '.ts')).join(', ')}`)
      return
    }
  }
  console.log(`→ Processing ${seedFiles.length} source files...\n`)

  const allEntries: MigrationEntry[] = []
  const toCreate = new Map<string, NormalizedProduct[]>()

  for (const file of seedFiles) {
    const filePath = join(OUTPUT_SEEDS_DIR, file)
    const brandFile = basename(file, '.ts')
    const rawProducts = parseOutputSeedFile(filePath)
    console.log(`  ${brandFile.padEnd(26)} ${rawProducts.length} products`)

    for (const raw of rawProducts) {
      const p = normalize(raw, file)
      const existingFile = existingSlugs.get(p.slug)

      let entry: MigrationEntry

      // Out-of-scope products override kind inference: a "Lotion Anti-Chute" must skip even if
      // 'lotion' would otherwise resolve to toner.
      const oosReason = detectOutOfScope(p.originalName)

      if (existingFile && !oosReason) {
        entry = {
          action: 'enrich',
          slug: p.slug,
          brand: p.brand,
          name: p.name,
          category: p.category,
          sourceFile: file,
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
          sourceFile: file,
          skipReason: oosReason
            ? `${oosReason}: "${p.originalName}"`
            : `Kind not inferred from: "${p.originalName}"`,
        }
      } else {
        const groupKey = `${p.category}/${p.brandSlug}`
        if (!toCreate.has(groupKey)) toCreate.set(groupKey, [])
        toCreate.get(groupKey)!.push(p)
        entry = {
          action: 'create',
          slug: p.slug,
          brand: p.brand,
          name: p.name,
          category: p.category,
          sourceFile: file,
        }
      }

      allEntries.push(entry)
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────

  const counts = {
    total: allEntries.length,
    enrich: allEntries.filter((e) => e.action === 'enrich').length,
    create: allEntries.filter((e) => e.action === 'create').length,
    skip: allEntries.filter((e) => e.action === 'skip').length,
  }

  console.log(`
── Results ──────────────────────────────────────────
  Total   ${counts.total}
  Enrich  ${counts.enrich}  (exist in seed — fields available to copy)
  Create  ${counts.create}  (new → output/candidates/)
  Skip    ${counts.skip}  (kind not inferred — needs manual review)
─────────────────────────────────────────────────────
`)

  // ─── Report (always written) ──────────────────────────────────────────────

  const report = {
    generatedAt: new Date().toISOString(),
    mode: DRY_RUN ? 'dry-run' : 'apply',
    summary: counts,
    enrich: allEntries.filter((e) => e.action === 'enrich').map(({ action: _, ...e }) => e),
    create: allEntries.filter((e) => e.action === 'create').map(({ action: _, ...e }) => e),
    skip: allEntries.filter((e) => e.action === 'skip').map(({ action: _, ...e }) => e),
  }

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  console.log('✓ Report → output/migration-report.json')

  // ─── Candidate files (--apply only) ──────────────────────────────────────

  if (!DRY_RUN) {
    if (!existsSync(CANDIDATES_DIR)) mkdirSync(CANDIDATES_DIR, { recursive: true })
    // Stub so '../../types' resolves while files live in candidates/
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

      const outPath = join(dir, `${brandSlug}.seed.ts`)
      if (existsSync(outPath) && !FORCE) {
        console.log(`  ⊘ candidates/${category}/${brandSlug}.seed.ts (exists — pass --force to overwrite)`)
        skipped++
        continue
      }
      writeFileSync(outPath, generateCandidateFile(products, brandSlug), 'utf-8')
      console.log(`  ✓ candidates/${category}/${brandSlug}.seed.ts  (${products.length} products)`)
      written++
    }
    console.log(`\n✓ ${written} candidate files written${skipped ? ` · ${skipped} skipped (already exist)` : ''}`)
    console.log('  Review → move to data/products/{category}/{brand}/ when ready\n')
  } else {
    console.log(`\n  Dry-run: ${toCreate.size} candidate file groups pending (pass --apply)\n`)
  }
}

main().catch((err) => {
  console.error('\n✗ Migration failed:', err)
  process.exit(1)
})
