import { readBearerForTransport } from '@/lib/auth/credential'
import { ensureFresh } from '@/lib/auth/freshness'
import { withAuthHeader } from '@/lib/auth/helpers'
import { captureClientSession, endSession } from '@/lib/auth/session'
import { httpClient } from '@/lib/httpClient'
import { queryClient } from '@/lib/queryClient'

// A 401 doesn't always mean the user is logged out: the token may just be stale.
// Try one silent refresh + replay before showing an error.
export async function recoverUnauthorized(
  res: Response,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const snapshot = captureClientSession()
  const { session } = snapshot
  if (session.status === 'anonymous') return res

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
  if (refreshOutcome === 'cooldown') return res

  const token = readBearerForTransport()
  if (!token) return res

  return httpClient(input, withAuthHeader(init, token))
}
