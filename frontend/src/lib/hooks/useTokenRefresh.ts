import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { readCredentialExpiration, useCredentialExpiration } from '../auth/credential'
import { ensureFresh, isExpired, msUntilProactiveRefresh } from '../auth/freshness'

export function useTokenRefresh() {
  const tokenExpiresAt = useCredentialExpiration()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!tokenExpiresAt) return

    const delay = msUntilProactiveRefresh(tokenExpiresAt)

    if (delay <= 0) {
      ensureFresh(queryClient)
      return
    }

    const timer = setTimeout(() => ensureFresh(queryClient), delay)
    return () => clearTimeout(timer)
  }, [tokenExpiresAt, queryClient])

  // Background tabs throttle timers, so refresh before focus queries resume
  useEffect(() => {
    function handleVisible() {
      if (document.visibilityState !== 'visible') return
      if (!readCredentialExpiration()) return
      if (isExpired()) ensureFresh(queryClient)
    }
    document.addEventListener('visibilitychange', handleVisible)
    return () => document.removeEventListener('visibilitychange', handleVisible)
  }, [queryClient])
}
