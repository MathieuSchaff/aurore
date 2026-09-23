import { readBearerForTransport } from '@/lib/auth/credential'
import { ensureFresh } from '@/lib/auth/freshness'
import { withAuthHeader } from '@/lib/auth/helpers'
import { captureClientSession, endSession, readClientSession } from '@/lib/auth/session'
import { httpClient } from '@/lib/httpClient'
import { queryClient } from '@/lib/queryClient'

// A 401 doesn't always mean the user is logged out: the token may just be stale.
// Try one silent refresh + replay before showing an error.
export async function recoverUnauthorized(
  res: Response,
  input: RequestInfo | URL,
  init?: RequestInit,
  snapshot = captureClientSession()
): Promise<Response> {
  const { session } = snapshot
  if (session.status === 'anonymous' || !snapshot.isCurrent()) return res

  const refreshOutcome = await ensureFresh(queryClient)
  if (refreshOutcome === 'failed') {
    if (snapshot.isCurrent() && session.status === 'pending') {
      endSession(queryClient, 'probe-failed')
    }
    if (snapshot.isCurrent() && session.status === 'authenticated') {
      endSession(queryClient, 'expired')
    }
    return res
  }
  if (refreshOutcome !== 'ok') return res

  const current = readClientSession()
  if (current.status !== 'authenticated') return res
  if (session.status === 'authenticated' && current.user.id !== session.user.id) return res

  const token = readBearerForTransport()
  if (!token) return res

  return httpClient(input, withAuthHeader(init, token))
}
