import { type SsrBootQuery, type SsrBootResponse, ssrBootResponseSchema } from '@aurore/shared'

import type { DatabaseTransaction } from '../../db'
import { listProducts, readProductDetailPage } from '../products/service'
import { getProfile } from '../profile/service'
import { getUserById } from './user.utils'

export const anonymousSsrBootResponse = ssrBootResponseSchema.parse({
  session: { authenticated: false },
  profile: null,
})

async function getSsrBootPage(db: DatabaseTransaction, userId: string, query: SsrBootQuery) {
  if (query.view === 'products') {
    return {
      view: query.view,
      ...(await listProducts(query, db, userId)),
    }
  }

  if (query.view === 'product-detail') {
    return {
      view: query.view,
      ...(await readProductDetailPage(db, { viewerId: userId, slug: query.slug })),
    }
  }

  return undefined
}

export async function getAuthenticatedSsrBootResponse(
  db: DatabaseTransaction,
  userId: string,
  query: SsrBootQuery
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
