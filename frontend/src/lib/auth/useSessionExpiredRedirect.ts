import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useAuthStore } from '../../store/auth'

// On the sessionExpired flag (401-recovery refresh failed): clear auth and send
// the user to login with the current path so they return here after logging in again.
export function useSessionExpiredRedirect() {
  const sessionExpired = useAuthStore((s) => s.sessionExpired)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!sessionExpired) return
    // Already on the auth flow: clear the flag without redirecting.
    if (pathname.startsWith('/auth/')) {
      useAuthStore.getState().clearSessionExpired()
      return
    }
    const store = useAuthStore.getState()
    store.clearAuth()
    store.clearSessionExpired()
    navigate({ to: '/auth/login', search: { redirect: pathname } })
  }, [sessionExpired, pathname, navigate])
}
