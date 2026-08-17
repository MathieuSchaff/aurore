import { type SsrBootQuery, type SsrBootResponse, ssrBootResponseSchema } from '@aurore/shared'

import type { DatabaseTransaction } from '../../db'
import { normalizeInstant } from '../../utils/dates'
import { computeProductDermoScore } from '../dermo-score/service'
import { getProductFullBySlug, getShelfStatusByProductIds, listProducts } from '../products/service'
import { getDermoProfile, getProfile } from '../profile/service'
import { getUserById } from './user.utils'

export const anonymousSsrBootResponse = ssrBootResponseSchema.parse({
  session: { authenticated: false },
  profile: null,
})

function serializeJson(value: unknown): unknown {
  const json = JSON.stringify(value)
  if (json === undefined) throw new Error('SSR boot value is not serializable')
  return JSON.parse(json) as unknown
}

async function getSsrBootPage(db: DatabaseTransaction, userId: string, query: SsrBootQuery) {
  if (query.view === 'products') {
    return {
      view: query.view,
      ...(await listProducts(query, db, userId)),
    }
  }

  if (query.view === 'product-detail') {
    const productRow = await getProductFullBySlug(query.slug, db)
    const product = {
      ...productRow,
      createdAt: normalizeInstant(productRow.createdAt),
      updatedAt: normalizeInstant(productRow.updatedAt),
    }
    const shelfStatus = await getShelfStatusByProductIds(db, userId, [product.id])
    const dermoProfileRow = await getDermoProfile(db, userId)
    const dermoProfile = dermoProfileRow
      ? {
          ...dermoProfileRow,
          createdAt: normalizeInstant(dermoProfileRow.createdAt),
          updatedAt: normalizeInstant(dermoProfileRow.updatedAt),
        }
      : null
    const dermoScore = await computeProductDermoScore(query.slug, userId, db)
    return {
      view: query.view,
      product,
      userStatus: shelfStatus[0]?.status ?? null,
      dermoProfile,
      assessment: dermoScore.ok ? serializeJson(dermoScore.assessment) : null,
    }
  }

  return undefined
}

export async function getAuthenticatedSsrBootResponse(
  db: DatabaseTransaction,
  userId: string,
  query: SsrBootQuery = {}
): Promise<SsrBootResponse> {
  const user = await getUserById(db, userId)
  if (!user) throw new Error('SSR boot user is missing')

  const profile = await getProfile(db, userId)
  if (!profile) throw new Error('SSR boot profile is missing')

  const page = await getSsrBootPage(db, userId, query)

  return ssrBootResponseSchema.parse({
    session: {
      authenticated: true,
      userId: user.id,
      user,
      role: user.role,
    },
    profile,
    ...(page ? { page } : {}),
  })
}
