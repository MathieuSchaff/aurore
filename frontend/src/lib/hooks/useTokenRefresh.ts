import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { readCredentialExpiration, useCredentialExpiration } from '../auth/credential'
import { ensureFresh, isExpired, msUntilProactiveRefresh } from '../auth/freshness'

export function useTokenRefresh() {
  const tokenExpiresAt = useCredentialExpiration()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!tokenExpiresAt) return

    // A hidden tab refreshes nothing: a tab merely left open kept this firing around the clock,
    // which made it the site's busiest POST endpoint. The visibility listener below picks the
    // session back up on return, and a request that races the gap still recovers through the
    // 401 replay path
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') ensureFresh(queryClient)
    }

    const delay = msUntilProactiveRefresh(tokenExpiresAt)

    if (delay <= 0) {
      refreshIfVisible()
      return
    }

    const timer = setTimeout(refreshIfVisible, delay)
    return () => clearTimeout(timer)
  }, [tokenExpiresAt, queryClient])

  // Background tabs throttle timers, so refresh before focus queries resume. Due, not just
  // expired: a tab coming back after its proactive slot passed has no other trigger left
  useEffect(() => {
    function handleVisible() {
      if (document.visibilityState !== 'visible') return
      const expiresAt = readCredentialExpiration()
      if (!expiresAt) return
      if (isExpired() || msUntilProactiveRefresh(expiresAt) <= 0) ensureFresh(queryClient)
    }
    document.addEventListener('visibilitychange', handleVisible)
    return () => document.removeEventListener('visibilitychange', handleVisible)
  }, [queryClient])
}
