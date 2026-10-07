import {
  type PreferenceTargets,
  type ProductDetailPage,
  productDetailPageSchema,
} from '@aurore/shared'

import type { DatabaseTransaction, DbOrTransaction } from '../../db'
import { logger } from '../../lib/logger'
import { computeDermoScoreForLoadedProduct } from '../dermo-score/service'
import { getDermoProfile, listPreferenceTargets } from '../profile/service'
import { getShelfStatusByProductIds } from './catalog.service'
import { getProductFullBySlug } from './detail.service'

interface ReadProductDetailPageInput {
  viewerId: string | null
  slug: string
}

async function readOptional<T>(
  database: DbOrTransaction,
  enrichment: string,
  read: (tx: DatabaseTransaction) => Promise<T>
): Promise<T | null> {
  try {
    // SQL failures must roll back before other parts of the page use the transaction
    return await database.transaction(read)
  } catch (err) {
    logger.warn({ err, enrichment }, 'Optional product detail unavailable')
    return null
  }
}

export async function readProductDetailPage(
  database: DbOrTransaction,
  input: ReadProductDetailPageInput
): Promise<ProductDetailPage> {
  const product = await getProductFullBySlug(input.slug, database)

  let userStatus: ProductDetailPage['userStatus'] = null
  let dermoProfile: ProductDetailPage['dermoProfile'] = null
  let preferenceTargets: PreferenceTargets = { ingredients: [], tags: [] }

  if (input.viewerId) {
    const viewerId = input.viewerId
    const shelfStatus = await readOptional(database, 'shelf', (tx) =>
      getShelfStatusByProductIds(tx, viewerId, [product.id])
    )
    userStatus = shelfStatus?.[0]?.status ?? null

    dermoProfile = await readOptional(database, 'profile', (tx) => getDermoProfile(tx, viewerId))
    preferenceTargets =
      (await readOptional(database, 'preferences', (tx) => listPreferenceTargets(tx, viewerId))) ??
      preferenceTargets
  }

  const dermoScore = await readOptional(database, 'assessment', (tx) =>
    computeDermoScoreForLoadedProduct(product, dermoProfile, tx)
  )

  return productDetailPageSchema.parse({
    product,
    userStatus,
    dermoProfile,
    assessment: dermoScore?.ok ? dermoScore.assessment : null,
    preferenceTargets,
  })
}
