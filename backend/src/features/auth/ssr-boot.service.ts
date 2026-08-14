import { type SsrBootResponse, ssrBootResponseSchema } from '@aurore/shared'

import type { DatabaseTransaction } from '../../db'
import { getProfile } from '../profile/service'
import { getUserById } from './user.utils'

export const anonymousSsrBootResponse = ssrBootResponseSchema.parse({
  session: { authenticated: false },
  profile: null,
})

export async function getAuthenticatedSsrBootResponse(
  db: DatabaseTransaction,
  userId: string
): Promise<SsrBootResponse> {
  const user = await getUserById(db, userId)
  if (!user) throw new Error('SSR boot user is missing')

  const profile = await getProfile(db, userId)
  if (!profile) throw new Error('SSR boot profile is missing')

  return ssrBootResponseSchema.parse({
    session: {
      authenticated: true,
      userId: user.id,
      user,
      role: user.role,
    },
    profile,
  })
}
