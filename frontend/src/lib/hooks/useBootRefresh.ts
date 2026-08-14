import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import type { SsrBootIssue } from '@/lib/auth/ssrBoot'
import { useAuthStore } from '@/store/auth'

// Root loaders do not rerun at hydration, so the boot probe must live in a client effect.
export function useBootRefresh(bootIssue: SsrBootIssue) {
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    const store = useAuthStore.getState()
    if (store.accessToken) return
    if (store.bootRefreshAttempted) return
    if (bootIssue === 'unknown') store.setBootRefreshPending(true)
    store.markBootRefreshAttempted()
    if (bootIssue === 'anonymous') return
    void awaitBootRefresh(queryClient).finally(() => {
      const settled = useAuthStore.getState()
      settled.setBootRefreshPending(false)
      // SSR loaders ran anonymously. Run them again once auth is available.
      // Loader errors surface via route errorComponents; the rejection here is redundant.
      if (settled.accessToken) void router.invalidate().catch(() => {})
    })
  }, [bootIssue, queryClient, router])
}
