#!/usr/bin/env bun
/**
 * infer-key-ingredients.ts — Pre-fill `keyIngredients: []` in candidate seed files.
 *
 * Reads each .seed.ts under output/candidates/, scans every product block, and rewrites
 * empty `keyIngredients: []` arrays with slugs inferred from the product's `inci`. Already-
 * populated arrays are preserved (idempotent for human-reviewed candidates).
 *
 * Match rules — see scripts/lib/inci-index.ts:
 *   1. INCI tokens are matched in order (= concentration descending)
 *   2. Excipient blocklist filters AQUA/GLYCERIN/PARFUM/EDTA/CARBOMER/etc.
 *   3. Index built first-write-wins; slug-files (skincare → haircare → dental → supplements)
 *      are parsed before markdown content so canonical slugs win over domain variants.
 *
 * Output annotates each rewritten array with a comment so reviewers know to add
 * notes/concentrations and prune false positives.
 *
 * Usage:
 *   bun run backend/src/db/seed/scripts/infer-key-ingredients.ts                # dry-run
 *   bun run backend/src/db/seed/scripts/infer-key-ingredients.ts --apply        # rewrite files
 *   bun run backend/src/db/seed/scripts/infer-key-ingredients.ts --only=eucerin # filter by filename substring
 *   bun run backend/src/db/seed/scripts/infer-key-ingredients.ts --max=10       # cap matches per product
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { INGREDIENT_SLUGS } from '../data/ingredients/ingredient-slugs'
import { buildInciIndex, inferKeyIngredients, type InciIndex } from './lib/inci-index'

const SEED_ROOT = join(import.meta.dir, '..')
const CANDIDATES_DIR = join(SEED_ROOT, 'output', 'candidates')
const PRODUCTS_TYPES_PATH = join(SEED_ROOT, 'data', 'products', 'types.ts')
const STUB_TYPES_PATH = join(SEED_ROOT, 'output', 'types.ts')

const DRY_RUN = !process.argv.includes('--apply')
const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith('--only='))
  return arg ? arg.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean) : null
})()
const MAX = (() => {
  const arg = process.argv.find((a) => a.startsWith('--max='))
  return arg ? Math.max(1, parseInt(arg.slice('--max='.length), 10)) || 8 : 8
})()

// ─── Reverse map: slug → INGREDIENT_SLUGS const name ──────────────────────────

const SLUG_TO_CONST: Record<string, string> = {}
for (const [k, v] of Object.entries(INGREDIENT_SLUGS)) {
  if (typeof v === 'string') SLUG_TO_CONST[v] = k
}

// ─── Walk candidates ─────────────────────────────────────────────────────────

function walkSeedFiles(dir: string): string[] {
  const entries: string[] = []
  let names: string[]
  try {
    names = readdirSync(dir)
  } catch {
    return []
  }
  for (const name of names) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      entries.push(...walkSeedFiles(full))
    } else if (name.endsWith('.seed.ts')) {
      entries.push(full)
    }
  }
  return entries
}

// ─── Per-file rewrite ────────────────────────────────────────────────────────

const PRODUCT_RE = /(\binci:\s*'((?:\\.|[^'\\])*)',[\s\S]*?\bkeyIngredients:\s*)\[\]([^\n]*)/g

// Reset previously-inferred arrays so re-runs reflect the current blocklist.
// Human-reviewed entries lose the AUTO-INFERRED marker, so they aren't matched.
// `\[\s*\{` requires a non-empty array — otherwise the non-greedy body would
// backtrack past empty `keyIngredients: []` lines and merge multiple products.
const AUTO_INFERRED_RE = /(\bkeyIngredients:\s*)\[\s*\{[\s\S]*?\]\s*\/\*\s*AUTO-INFERRED[^*]*\*\//g

interface FileResult {
  path: string
  productsTotal: number
  productsRewritten: number
  productsAlreadyFilled: number
  productsNoMatch: number
  productsReset: number
}

function categoryFromPath(filePath: string): string {
  const m = filePath.match(/[/\\]candidates[/\\]([^/\\]+)[/\\]/)
  return m?.[1] ?? ''
}

function rewriteFile(text: string, index: InciIndex, category: string): { text: string; result: Omit<FileResult, 'path'> } {
  let productsRewritten = 0
  let productsNoMatch = 0
  let productsReset = 0

  text = text.replace(AUTO_INFERRED_RE, () => {
    productsReset++
    return 'keyIngredients: []'
  })

  const allKeyMatches = text.match(/\bkeyIngredients:\s*\[/g) || []
  const productsTotal = allKeyMatches.length
  const emptyMatches = text.match(/\bkeyIngredients:\s*\[\]/g) || []
  const productsAlreadyFilled = productsTotal - emptyMatches.length

  const rewritten = text.replace(PRODUCT_RE, (_full, prefix: string, inciRaw: string, _trailing: string) => {
    const inci = unescapeInci(inciRaw)
    const slugs = inferKeyIngredients(inci, index, { max: MAX, candidateCategory: category })
    if (slugs.length === 0) {
      productsNoMatch++
      return `${prefix}[]`
    }
    productsRewritten++
    const lines = slugs.map((s) => {
      const constName = SLUG_TO_CONST[s] ?? s.toUpperCase().replace(/-/g, '_')
      return `      { slug: INGREDIENT_SLUGS.${constName} },`
    })
    return `${prefix}[\n${lines.join('\n')}\n    ] /* AUTO-INFERRED — review: add notes/concentrations, prune false positives */`
  })

  // Ensure import line is present when at least one product was rewritten.
  let final = rewritten
  if (productsRewritten > 0 && !/import\s*\{[^}]*INGREDIENT_SLUGS[^}]*\}\s*from\s*['"]\.\.\/\.\.\/types['"]/.test(final)) {
    const importLine = `import { INGREDIENT_SLUGS } from '../../types'\n`
    // Insert right after the existing `import type { UnifiedProductSeed } …` line.
    const m = final.match(/^import\s+type\s+\{\s*UnifiedProductSeed\s*\}\s+from\s+'\.\.\/\.\.\/types'\s*\n/m)
    if (m) {
      const idx = final.indexOf(m[0]) + m[0].length
      final = final.slice(0, idx) + importLine + final.slice(idx)
    } else {
      final = importLine + final
    }
  }

  return {
    text: final,
    result: { productsTotal, productsRewritten, productsAlreadyFilled, productsNoMatch, productsReset },
  }
}

function unescapeInci(s: string): string {
  return s.replace(/\\(.)/g, (_, c) => (c === 'n' ? '\n' : c === 'r' ? '\r' : c))
}

// ─── types.ts re-export plumbing ─────────────────────────────────────────────

const PRODUCTS_TYPES_REEXPORT = `export { INGREDIENT_SLUGS } from '../ingredients/ingredient-slugs'`
const STUB_TYPES_CONTENT = `// Re-export so candidates can import '../../types'.
// After moving a candidate to data/products/{cat}/{brand}/, the same path resolves to data/products/types.ts.
export type { UnifiedProductSeed } from '../data/products/types'
export { INGREDIENT_SLUGS } from '../data/products/types'
`

function ensureTypesReexports(): { productsTypesUpdated: boolean; stubUpdated: boolean } {
  let productsTypesUpdated = false
  let stubUpdated = false

  const productsTypes = readFileSync(PRODUCTS_TYPES_PATH, 'utf-8')
  if (!productsTypes.includes(PRODUCTS_TYPES_REEXPORT)) {
    if (!DRY_RUN) {
      const next = productsTypes.trimEnd() + '\n\n' + PRODUCTS_TYPES_REEXPORT + '\n'
      writeFileSync(PRODUCTS_TYPES_PATH, next, 'utf-8')
    }
    productsTypesUpdated = true
  }

  let currentStub = ''
  try {
    currentStub = readFileSync(STUB_TYPES_PATH, 'utf-8')
  } catch {
    /* missing — will be written below */
  }
  if (currentStub !== STUB_TYPES_CONTENT) {
    if (!DRY_RUN) writeFileSync(STUB_TYPES_PATH, STUB_TYPES_CONTENT, 'utf-8')
    stubUpdated = true
  }

  return { productsTypesUpdated, stubUpdated }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  console.log(`infer-key-ingredients — ${DRY_RUN ? 'DRY-RUN' : 'APPLY'} (max=${MAX})`)
  if (ONLY) console.log(`  filter: ${ONLY.join(', ')}`)

  const index = buildInciIndex()
  console.log(`  inci index: ${index.size} tokens`)

  const files = walkSeedFiles(CANDIDATES_DIR).filter((f) => {
    if (!ONLY) return true
    return ONLY.some((needle) => f.toLowerCase().includes(needle.toLowerCase()))
  })
  console.log(`  candidates: ${files.length} files`)

  const reexport = ensureTypesReexports()
  if (reexport.productsTypesUpdated) {
    console.log(`  ${DRY_RUN ? '[would update]' : '✓'} data/products/types.ts (re-export INGREDIENT_SLUGS)`)
  }
  if (reexport.stubUpdated) {
    console.log(`  ${DRY_RUN ? '[would update]' : '✓'} output/types.ts (re-export INGREDIENT_SLUGS)`)
  }

  let totals = {
    files: 0,
    productsTotal: 0,
    productsRewritten: 0,
    productsAlreadyFilled: 0,
    productsNoMatch: 0,
    productsReset: 0,
  }
  const perFile: FileResult[] = []

  for (const path of files) {
    const text = readFileSync(path, 'utf-8')
    const category = categoryFromPath(path)
    const { text: nextText, result } = rewriteFile(text, index, category)

    totals.files++
    totals.productsTotal += result.productsTotal
    totals.productsRewritten += result.productsRewritten
    totals.productsAlreadyFilled += result.productsAlreadyFilled
    totals.productsNoMatch += result.productsNoMatch
    totals.productsReset += result.productsReset

    if (result.productsRewritten === 0) continue
    perFile.push({ path, ...result })

    if (!DRY_RUN && nextText !== text) writeFileSync(path, nextText, 'utf-8')
  }

  console.log('')
  console.log(`Summary:`)
  console.log(`  files scanned             ${totals.files}`)
  console.log(`  files with rewrites       ${perFile.length}`)
  console.log(`  products total            ${totals.productsTotal}`)
  console.log(`  products auto-inferred reset  ${totals.productsReset} (re-processed)`)
  console.log(`  products rewritten        ${totals.productsRewritten}`)
  console.log(`  products already filled   ${totals.productsAlreadyFilled} (preserved — human review)`)
  console.log(`  products no INCI match    ${totals.productsNoMatch} (left empty)`)

  if (perFile.length > 0 && perFile.length <= 20) {
    console.log('')
    console.log(`Per-file:`)
    for (const r of perFile) {
      const rel = r.path.slice(CANDIDATES_DIR.length + 1)
      console.log(`  ${rel.padEnd(60)} ${r.productsRewritten}/${r.productsTotal} rewritten`)
    }
  } else if (perFile.length > 20) {
    console.log('')
    console.log(`Per-file (top 10 by rewrites):`)
    perFile
      .sort((a, b) => b.productsRewritten - a.productsRewritten)
      .slice(0, 10)
      .forEach((r) => {
        const rel = r.path.slice(CANDIDATES_DIR.length + 1)
        console.log(`  ${rel.padEnd(60)} ${r.productsRewritten}/${r.productsTotal} rewritten`)
      })
  }

  if (DRY_RUN) {
    console.log('')
    console.log('Dry-run. Re-run with --apply to write changes.')
  }
}

main()
