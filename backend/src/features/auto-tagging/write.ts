// Runtime auto-tag writer. Single-product wrapper used by
// `features/products/service.ts create/updateProduct()`; same orchestrator as
// the batch backfill, diverges only in I/O shape.

import { and, eq, ne } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db/index'
import { products, productTagLinks } from '../../db/schema'
import { logger } from '../../lib/logger'
import { loadAutoTagFetchBundle, ORCHESTRATOR_PRODUCT_COLUMNS } from './lib/fetch-auto-tag-bundle'
import { type AutoTagFetchBundle, computeTagRowsForProduct } from './lib/orchestrator-input'

interface WriteTagsResult {
  inserted: number
  detected: number
}

export async function writeTagsForProduct(
  productId: string,
  database: DatabaseTransaction,
  bundle?: AutoTagFetchBundle
): Promise<WriteTagsResult> {
  const [product] = await database
    .select({ id: products.id, ...ORCHESTRATOR_PRODUCT_COLUMNS })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)

  if (!product) return { inserted: 0, detected: 0 }

  // Loader reads run serially so a tx `database` stays safe; see
  // fetch-auto-tag-bundle.ts. Full-corpus callers (reconcile) inject a bundle
  // loaded once, skipping the per-product read of the corpus-global certs
  // and tag-defs.
  const resolvedBundle = bundle ?? (await loadAutoTagFetchBundle([productId], database))
  // Unknown slugs (missing `product_tags_defs` row) are silently dropped here, so the
  // runtime path stays resilient when orchestrator rules ship before the seed catches up.
  const { pairs, rows: resolved } = computeTagRowsForProduct(product, resolvedBundle)
  const rows = resolved.map((r) => ({
    productId: product.id,
    productTagId: r.tagId,
    relevance: r.relevance,
    source: r.source,
  }))

  // Atomic replace so a shrunk INCI drops stale tags. Manual rows are preserved
  // (separate CRUD path, must not be wiped by retag).
  return database.transaction(async (tx) => {
    await tx
      .delete(productTagLinks)
      .where(and(eq(productTagLinks.productId, product.id), ne(productTagLinks.source, 'manual')))

    if (rows.length === 0) return { inserted: 0, detected: pairs.length }

    // Idempotent via onConflictDoNothing on (productId, productTagId).
    // `.count` is absent on tx inserts with this driver; `.returning()` gives
    // the true affected-row count instead of the `rows.length` upper bound.
    const inserted = (
      await tx
        .insert(productTagLinks)
        .values(rows)
        .onConflictDoNothing()
        .returning({ productId: productTagLinks.productId })
    ).length

    return { inserted, detected: pairs.length }
  })
}

// Frozen log event name used by Grafana queries and alerts.
export const AUTOTAG_SKIP_EVENT_KIND = 'product_autotag_skipped' as const

export interface AutoTagSkipMeta {
  operation: 'create' | 'update'
  userId: string
}

export function buildAutoTagSkipLog(productId: string, meta: AutoTagSkipMeta, err: unknown) {
  return {
    event: AUTOTAG_SKIP_EVENT_KIND,
    productId,
    operation: meta.operation,
    userId: meta.userId,
    cause: err instanceof Error ? err.message : String(err),
    err: err instanceof Error ? err : undefined,
  }
}

export function recordAutoTagSkip(productId: string, meta: AutoTagSkipMeta, err: unknown): void {
  logger.warn(buildAutoTagSkipLog(productId, meta, err), AUTOTAG_SKIP_EVENT_KIND)
}

// Intake-only fail-soft wrapper. Seed-core and the backfill runner call
// `detectAllAutoTags` directly so their failures still propagate.
export async function writeTagsForProductFailSoft(
  database: DatabaseTransaction,
  productId: string,
  meta: AutoTagSkipMeta
): Promise<void> {
  try {
    await writeTagsForProduct(productId, database)
  } catch (err) {
    recordAutoTagSkip(productId, meta, err)
  }
}
