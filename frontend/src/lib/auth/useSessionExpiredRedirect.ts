import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

import { clearSessionExpiredEvent, useSessionExpiredEvent } from './session'

// On the sessionExpired flag, send the user to login with the current path so
// they return here after logging in again. endSession already cleared identity.
export function useSessionExpiredRedirect() {
  const sessionExpired = useSessionExpiredEvent()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!sessionExpired) return
    // Already on the auth flow: clear the flag without redirecting.
    if (pathname.startsWith('/auth/')) {
      clearSessionExpiredEvent()
      return
    }
    clearSessionExpiredEvent()
    navigate({ to: '/auth/login', search: { redirect: pathname } })
  }, [sessionExpired, pathname, navigate])
}
