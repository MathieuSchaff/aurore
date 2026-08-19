import {
  type PreferenceTargets,
  type ProductDetailPage,
  productDetailPageSchema,
} from '@aurore/shared'

import type { DbOrTransaction } from '../../db'
import { computeDermoScoreForLoadedProduct } from '../dermo-score/service'
import { getDermoProfile, listPreferenceTargets } from '../profile/service'
import { getShelfStatusByProductIds } from './catalog.service'
import { getProductFullBySlug } from './detail.service'

interface ReadProductDetailPageInput {
  viewerId: string | null
  slug: string
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
    const shelfStatus = await getShelfStatusByProductIds(database, input.viewerId, [product.id])
    userStatus = shelfStatus[0]?.status ?? null

    dermoProfile = await getDermoProfile(database, input.viewerId)
    preferenceTargets = await listPreferenceTargets(database, input.viewerId)
  }

  const dermoScore = await computeDermoScoreForLoadedProduct(product, dermoProfile, database)

  return productDetailPageSchema.parse({
    product,
    userStatus,
    dermoProfile,
    assessment: dermoScore.ok ? dermoScore.assessment : null,
    preferenceTargets,
  })
}
