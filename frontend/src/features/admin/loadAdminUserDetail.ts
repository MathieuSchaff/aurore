import type { UserPublic } from '@aurore/shared'

import type { QueryClient } from '@tanstack/react-query'

import { adminQueries } from '@/lib/queries/admin'

export function loadAdminUserDetailQueries(
  queryClient: QueryClient,
  userId: string,
  role: UserPublic['role']
) {
  const tasks: Promise<unknown>[] = [queryClient.ensureQueryData(adminQueries.userBans(userId))]
  if (role === 'admin') {
    tasks.push(queryClient.prefetchQuery(adminQueries.user(userId)))
  }
  return Promise.all(tasks)
}
