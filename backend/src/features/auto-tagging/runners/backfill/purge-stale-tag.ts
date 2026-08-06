// Tag-scoped slice of reconcile: delete non-manual links of ONE tag that the
// current detector no longer emits. Exists because full reconcile is all-or-
// nothing (DELETE + re-INSERT every tag), unusable while an insert lot is on
// hold, e.g. after a gate tightening whose stale links must go out while the
// non-irritant backlog stays unwritten.
//
// Usage (via `just autotag-purge-stale`):
//   TAG=<tagSlug> bun run …/runners/backfill/purge-stale-tag.ts            # dry-run
//   TAG=<tagSlug> bun run …/runners/backfill/purge-stale-tag.ts --write    # apply
import { and, eq, inArray, ne } from 'drizzle-orm'

import { db } from '../../../../db'
import { withAdminRls } from '../../../../db/rls'
import { productTagLinks, productTagTypes } from '../../../../db/schema'
import { loadAutoTagFetchBundle } from '../../lib/fetch-auto-tag-bundle'
import { computeTagRowsForProduct } from '../../lib/orchestrator-input'
import { fetchEligibleProducts } from '../audit/db'
import { exitOnError, parseWriteSlugArgs } from '../cli-args'

const { write: WRITE } = parseWriteSlugArgs()
const TAG = process.env.TAG

async function main() {
  if (!TAG) throw new Error('TAG=<tagSlug> is required')
  const [tagRow] = await db
    .select({ id: productTagTypes.id })
    .from(productTagTypes)
    .where(eq(productTagTypes.slug, TAG))
  if (!tagRow) throw new Error(`tag "${TAG}" not found`)

  const linked = await db
    .select({ productId: productTagLinks.productId })
    .from(productTagLinks)
    .where(and(eq(productTagLinks.productTagId, tagRow.id), ne(productTagLinks.source, 'manual')))
  const linkedIds = new Set(linked.map((r) => r.productId))
  console.log(`🧹 Purge stale [${TAG}] · mode=${WRITE ? 'WRITE' : 'DRY-RUN'}`)
  console.log(`   ${linkedIds.size} non-manual links in DB`)

  // fetchEligibleProducts elevates RLS in-tx; a plain read would hide
  // non-visible products and silently under-purge.
  const prods = (await fetchEligibleProducts()).filter((p) => linkedIds.has(p.id))
  const bundle = await loadAutoTagFetchBundle(prods.map((p) => p.id))
  const stale: string[] = []
  const staleSlugs: string[] = []
  for (const p of prods) {
    const { rows } = computeTagRowsForProduct(p, bundle)
    if (!rows.some((r) => r.tagSlug === TAG)) {
      stale.push(p.id)
      staleSlugs.push(p.slug)
    }
  }
  console.log(`   ${stale.length} stale (detector no longer emits)`)
  for (const s of staleSlugs.slice(0, 20)) console.log(`     - ${s}`)
  if (staleSlugs.length > 20) console.log(`     … +${staleSlugs.length - 20}`)

  if (stale.length === 0) {
    console.log('\n✨ Rien à purger.')
    return
  }
  if (!WRITE) {
    console.log('\nRun avec --write pour supprimer.')
    return
  }
  // Inside a transaction this driver carries no affected-row count (only
  // db.delete() does), so RETURNING is the only truthful source. A gap with the
  // planned count is then real: count in DB before blaming RLS.
  const deletedRows = await withAdminRls((tx) =>
    tx
      .delete(productTagLinks)
      .where(
        and(
          eq(productTagLinks.productTagId, tagRow.id),
          ne(productTagLinks.source, 'manual'),
          inArray(productTagLinks.productId, stale)
        )
      )
      .returning({ productId: productTagLinks.productId })
  )
  const deleted = deletedRows.length
  if (deleted !== stale.length) {
    console.warn(`   ⚠ ${deleted} lignes supprimées pour ${stale.length} planifiées`)
  }
  console.log(`✓ ${deleted} liens supprimés (${linkedIds.size - deleted} restants légitimes)`)
}

main().catch(exitOnError)
