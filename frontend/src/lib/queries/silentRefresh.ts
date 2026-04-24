import type { QueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../store/auth'
import { api } from '../api'

// If several components trigger a refresh at the same time, we reuse the same
// in-flight promise instead of sending multiple requests to the server
let inflightRefresh: Promise<boolean> | null = null

// Exponential backoff state: 1s → 2s → 4s → … → 30s cap
let failureCount = 0
let retryAfter = 0

export async function silentRefresh(queryClient: QueryClient): Promise<boolean> {
  if (inflightRefresh) return inflightRefresh
  if (Date.now() < retryAfter) return false

  inflightRefresh = (async () => {
    try {
      const res = await api.auth.refresh.$post()
      if (!res.ok) {
        failureCount++
        retryAfter = Date.now() + Math.min(1000 * 2 ** (failureCount - 1), 30_000)
        return false
      }

      const json = await res.json()
      if (!json.success) {
        failureCount++
        retryAfter = Date.now() + Math.min(1000 * 2 ** (failureCount - 1), 30_000)
        return false
      }

      const { accessToken, user } = json.data

      useAuthStore.getState().setAuth(accessToken, user)
      queryClient.setQueryData(['session'], { authenticated: true, userId: user.id })

      failureCount = 0
      retryAfter = 0
      return true
    } catch {
      failureCount++
      retryAfter = Date.now() + Math.min(1000 * 2 ** (failureCount - 1), 30_000)
      return false
    } finally {
      inflightRefresh = null
    }
  })()

  return inflightRefresh
}
