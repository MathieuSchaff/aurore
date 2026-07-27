import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useAuthStore } from '../../store/auth'

export function useBannedRedirect() {
  const banned = useAuthStore((s) => s.banned)
  const bannedDetails = useAuthStore((s) => s.bannedDetails)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!banned) return
    useAuthStore.getState().clearBanned()
    if (pathname === '/auth/banned') return
    navigate({
      to: '/auth/banned',
      search: {
        reason: bannedDetails?.reason ?? undefined,
        expires: bannedDetails?.expiresAt ?? undefined,
      },
    })
  }, [banned, bannedDetails, navigate, pathname])
}
