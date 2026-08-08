// Full corpus reconcile: align every eligible product's auto-tags to the current orchestrator.
// Unlike `main.ts` (additive + relevance-upgrade only), this also removes stale rows and
// corrects relevance downgrades via `writeTagsForProduct` (DELETE non-manual + INSERT) per
// product; manual rows (source='manual') are never touched. See README "Propagating an
// orchestrator change to the existing corpus".
import { and, eq, inArray, ne } from 'drizzle-orm'

import { db } from '../../../../db'
import { productTagLinks } from '../../../../db/schema'
import { loadAutoTagFetchBundle } from '../../lib/fetch-auto-tag-bundle'
import { computeTagRowsForProduct } from '../../lib/orchestrator-input'
import { fetchEligibleProducts } from '../audit/db'
import { exitOnError, parseIntEnv, parseWriteSlugArgs } from '../cli-args'
import { diffReconcileProduct } from './reconcile-diff'
import { writeReconciledProducts } from './reconcile-write'

const { write: WRITE, slug: SLUG_ARG } = parseWriteSlugArgs()
// Usage (via `just reconcile-auto-tags`): dry-run by default, --write to apply, --slug <s>
// for a single product. LIMIT: cap product count.
const LIMIT = parseIntEnv('LIMIT')

async function main() {
  // fetchEligibleProducts elevates RLS in-tx (products_select_visible hides
  // non-`visible` rows from app_runtime); SLUG/LIMIT narrow the corpus after.
  let prods = await fetchEligibleProducts()
  if (SLUG_ARG) prods = prods.filter((p) => p.slug === SLUG_ARG)
  if (LIMIT !== null) prods = prods.slice(0, LIMIT)

  console.log(
    `🔁 Reconcile auto-tags · mode=${WRITE ? 'WRITE' : 'DRY-RUN'} · ${prods.length} products`
  )

  if (WRITE) {
    // Load the fetch set once for the whole corpus; the per-product writer would
    // otherwise re-scan the corpus-global brand-certs and tag-defs N times.
    const bundle = await loadAutoTagFetchBundle(
      prods.map((p) => p.id),
      db
    )
    const { reconciled, written } = await writeReconciledProducts(
      prods.map((p) => p.id),
      bundle,
      (count) => {
        if (count % 500 === 0) console.log(`  …${count}/${prods.length}`)
      }
    )
    console.log(
      `✓ reconciled ${reconciled} products · ${written} auto rows written (manual untouched)`
    )
    process.exit(0)
  }

  const productIds = prods.map((p) => p.id)
  const bundle = await loadAutoTagFetchBundle(productIds, db)
  const tagIdToSlug = new Map([...bundle.tagSlugToInfo].map(([slug, t]) => [t.id, slug]))

  const storedAutoTagRows = await db
    .select({
      productId: productTagLinks.productId,
      productTagId: productTagLinks.productTagId,
      relevance: productTagLinks.relevance,
    })
    .from(productTagLinks)
    .where(
      and(ne(productTagLinks.source, 'manual'), inArray(productTagLinks.productId, productIds))
    )
  const storedByProduct = new Map<string, Map<string, string>>()
  for (const r of storedAutoTagRows) {
    const m = storedByProduct.get(r.productId) ?? new Map()
    m.set(r.productTagId, r.relevance)
    storedByProduct.set(r.productId, m)
  }

  // Manual rows hold the PK; onConflictDoNothing yields to them, making
  // orchestrator-wanted tags on manual PKs a no-op. Tracked separately to
  // surface manual×auto overlap and prevent phantom recall inflation.
  const manualRows = await db
    .select({ productId: productTagLinks.productId, productTagId: productTagLinks.productTagId })
    .from(productTagLinks)
    .where(
      and(eq(productTagLinks.source, 'manual'), inArray(productTagLinks.productId, productIds))
    )
  const manualByProduct = new Map<string, Set<string>>()
  for (const r of manualRows) {
    const s = manualByProduct.get(r.productId) ?? new Set<string>()
    s.add(r.productTagId)
    manualByProduct.set(r.productId, s)
  }

  let netInsert = 0
  let manualShadowed = 0
  let netDelete = 0
  let relChanged = 0
  const relDirection = new Map<string, number>()
  const delBySlug = new Map<string, number>()
  const insBySlug = new Map<string, number>()

  for (const p of prods) {
    // Same kernel as the writers: withholds eczema-atopie, drops domain-ineligible
    // types, so the parity delta matches exactly what would be persisted.
    const { rows } = computeTagRowsForProduct(p, bundle)
    const diff = diffReconcileProduct({
      want: new Map(rows.map((r) => [r.tagId, r.relevance])),
      stored: storedByProduct.get(p.id) ?? new Map(),
      manual: manualByProduct.get(p.id) ?? new Set(),
    })

    netInsert += diff.inserts.length
    manualShadowed += diff.manualShadowed.length
    netDelete += diff.deletes.length
    relChanged += diff.relChanges.length
    for (const c of diff.relChanges) {
      const direction = `${c.from}→${c.to}`
      relDirection.set(direction, (relDirection.get(direction) ?? 0) + 1)
    }
    for (const tagId of diff.deletes) {
      const s = tagIdToSlug.get(tagId) ?? tagId
      delBySlug.set(s, (delBySlug.get(s) ?? 0) + 1)
    }
    for (const tagId of diff.inserts) {
      const s = tagIdToSlug.get(tagId) ?? tagId
      insBySlug.set(s, (insBySlug.get(s) ?? 0) + 1)
    }
  }

  console.log(`   net inserts       : ${netInsert}`)
  console.log(`   manual-shadowed   : ${manualShadowed}`)
  console.log(`   net deletes       : ${netDelete}`)
  console.log(`   relevance changes : ${relChanged}`)
  if (relDirection.size > 0) {
    console.log('   --- relevance by direction ---')
    for (const [d, n] of [...relDirection.entries()].sort((a, b) => b[1] - a[1]))
      console.log(`     ${n}\t${d}`)
  }
  // Named per slug on both sides: a bare "net inserts" total hides which claim
  // is about to land, so a tag held back on purpose reads as an anonymous
  // number and gets written by an operator who could not have seen it.
  if (insBySlug.size > 0) {
    console.log('   --- inserts by slug (top 25) ---')
    for (const [s, n] of [...insBySlug.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25))
      console.log(`     ${n}\t${s}`)
  }
  if (delBySlug.size > 0) {
    console.log('   --- deletes by slug (top 25) ---')
    for (const [s, n] of [...delBySlug.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25))
      console.log(`     ${n}\t${s}`)
  }
  console.log('Run with --write to apply (manual rows are never touched).')
  process.exit(0)
}

main().catch(exitOnError)
