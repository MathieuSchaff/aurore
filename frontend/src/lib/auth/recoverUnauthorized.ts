import { ensureFresh } from '@/lib/auth/freshness'
import { withAuthHeader } from '@/lib/auth/helpers'
import { dropSessionScopedQueries } from '@/lib/auth/sessionCache'
import { httpClient } from '@/lib/httpClient'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/auth'

// A 401 doesn't always mean the user is logged out: the token may just be stale.
// Try one silent refresh + replay before showing an error.
export async function recoverUnauthorized(
  res: Response,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const hadSession = useAuthStore.getState().accessToken != null

  const refreshOutcome = await ensureFresh(queryClient)
  if (refreshOutcome !== 'ok') {
    // Anonymous visitors also 401 at boot: they never had a session to expire.
    if (refreshOutcome === 'failed' && hadSession) {
      // User-scoped query data must not survive the session that populated it. Scoped, not
      // clear(): a global wipe also evicts the public list the user is currently reading and
      // sends every mounted component back to its loading state.
      dropSessionScopedQueries(queryClient)
      useAuthStore.getState().markSessionExpired()
    }
    return res
  }

  const token = useAuthStore.getState().accessToken

  return httpClient(input, withAuthHeader(init, token))
}
