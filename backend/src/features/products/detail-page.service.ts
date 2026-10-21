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
): Promise<{ data: T | null; available: boolean }> {
  try {
    // SQL failures must roll back before other parts of the page use the transaction
    return { data: await database.transaction(read), available: true }
  } catch (err) {
    logger.warn({ err, enrichment }, 'Optional product detail unavailable')
    return { data: null, available: false }
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

  const unavailable: ProductDetailPage['unavailable'] = []

  if (input.viewerId) {
    const viewerId = input.viewerId
    const shelfStatus = await readOptional(database, 'shelf', (tx) =>
      getShelfStatusByProductIds(tx, viewerId, [product.id])
    )
    userStatus = shelfStatus.data?.[0]?.status ?? null

    const profile = await readOptional(database, 'profile', (tx) => getDermoProfile(tx, viewerId))
    dermoProfile = profile.data
    if (!profile.available) unavailable.push('profile')
    const preferences = await readOptional(database, 'preferences', (tx) =>
      listPreferenceTargets(tx, viewerId)
    )
    preferenceTargets = preferences.data ?? preferenceTargets
    if (!preferences.available) unavailable.push('preferences')
  }

  const dermoScore = await readOptional(database, 'assessment', (tx) =>
    computeDermoScoreForLoadedProduct(product, dermoProfile, tx)
  )

  return productDetailPageSchema.parse({
    product,
    userStatus,
    dermoProfile,
    assessment: dermoScore.data?.ok ? dermoScore.data.assessment : null,
    unavailable,
    preferenceTargets,
  })
}
