import { withAdminRls } from '../../../../db/rls'
import type { AutoTagFetchBundle } from '../../lib/orchestrator-input'
import { writeTagsForProduct } from '../../write'

export async function writeReconciledProducts(
  productIds: readonly string[],
  bundle: AutoTagFetchBundle,
  onProgress?: (reconciled: number) => void
): Promise<{ reconciled: number; written: number }> {
  let reconciled = 0
  let written = 0

  for (const productId of productIds) {
    // Commit each product separately so a late failure is resumable and never holds one
    // admin transaction open across the whole corpus.
    const result = await withAdminRls((tx) => writeTagsForProduct(productId, tx, bundle))
    written += result.inserted
    reconciled++
    onProgress?.(reconciled)
  }

  return { reconciled, written }
}
