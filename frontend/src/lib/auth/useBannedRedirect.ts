import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

import { consumeBanEvent, useBanEvent } from './session'

export function useBannedRedirect() {
  const bannedDetails = useBanEvent()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!bannedDetails) return
    if (bannedDetails.scope && bannedDetails.scope !== 'global') {
      consumeBanEvent()
      return
    }
    if (pathname === '/auth/banned') return
    navigate({ to: '/auth/banned' })
  }, [bannedDetails, navigate, pathname])
}
