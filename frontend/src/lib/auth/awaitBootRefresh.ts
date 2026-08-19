import type { QueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../store/auth'
import { isServer } from '../helpers/isServer'
import { ensureFresh, isExpired } from './freshness'
import { hasSessionHint } from './sessionHint'

// Cold hard-nav to a role-gated route: the store still holds the default role ('user')
// because the boot refresh in __root is fire-and-forget and hasn't answered yet. A guard
// reading `role` now would redirect a real admin away, so we wait on the deduped
// ensureFresh probe. No session hint means nothing to wait for, so return immediately.
export async function awaitBootRefresh(queryClient: QueryClient): Promise<void> {
  // Server render is anonymous by construction, so there is nothing to wait for, and
  // hasSessionHint would read document.cookie. Callers must not have to know this.
  if (isServer) return

  const store = useAuthStore.getState()
  if (store.accessToken && !isExpired()) return
  if (!hasSessionHint()) return
  await ensureFresh(queryClient)
}
