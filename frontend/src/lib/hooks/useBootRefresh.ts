import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import { readClientSession } from '@/lib/auth/session'
import type { SsrBootIssue } from '@/lib/auth/ssrBoot'

// Root loaders do not rerun at hydration, so the boot probe must live in a client effect.
export function useBootRefresh(bootIssue: SsrBootIssue) {
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    const session = readClientSession()
    if (bootIssue === 'anonymous' || session.status === 'anonymous') return
    if (session.status === 'authenticated' && session.credential === 'present') return

    let active = true
    void awaitBootRefresh(queryClient).finally(() => {
      if (!active) return
      // SSR loaders ran anonymously. Run them again once auth is available.
      // Loader errors surface via route errorComponents; the rejection here is redundant.
      const settled = readClientSession()
      if (settled.status === 'authenticated' && settled.credential === 'present') {
        void router.invalidate().catch(() => {})
      }
    })

    return () => {
      active = false
    }
  }, [bootIssue, queryClient, router])
}
