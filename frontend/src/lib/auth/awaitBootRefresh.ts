import type { QueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../store/auth'
import { isServer } from '../helpers/isServer'
import { type AuthSessionCache, authQueries } from '../queries/auth'
import { ensureFresh, isExpired } from './freshness'
import { dropSessionScopedQueries } from './sessionCache'

// Cold hard-nav to a role-gated route: the store still holds the default role ('user')
// because the boot refresh in __root is fire-and-forget and hasn't answered yet. A guard
// reading `role` now would redirect a real admin away, so we wait on the deduped
// ensureFresh probe.
export async function awaitBootRefresh(queryClient: QueryClient): Promise<void> {
  if (isServer) return

  const store = useAuthStore.getState()
  if (store.accessToken && !isExpired()) return
  const session = queryClient.getQueryData<AuthSessionCache>(authQueries.session().queryKey)
  if (session?.authenticated === false) return
  const result = await ensureFresh(queryClient)
  if (result === 'ok') return

  useAuthStore.getState().clearAuth()
  dropSessionScopedQueries(queryClient)
}
