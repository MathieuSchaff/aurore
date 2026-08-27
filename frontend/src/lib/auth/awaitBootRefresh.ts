import type { QueryClient } from '@tanstack/react-query'

import { isServer } from '../helpers/isServer'
import { ensureFresh, isExpired } from './freshness'
import { captureClientSession, endSession } from './session'

export async function awaitBootRefresh(queryClient: QueryClient): Promise<void> {
  if (isServer) return

  const snapshot = captureClientSession()
  const { session } = snapshot
  if (session.status === 'anonymous') return
  if (session.status === 'authenticated' && session.credential === 'present' && !isExpired()) return
  const result = await ensureFresh(queryClient)
  if (result === 'ok' || result === 'superseded' || !snapshot.isCurrent()) return

  endSession(queryClient, 'probe-failed')
}
