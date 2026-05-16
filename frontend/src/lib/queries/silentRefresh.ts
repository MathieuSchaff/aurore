import type { QueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../store/auth'
import { api } from '../api'

export type SilentRefreshResult = 'ok' | 'failed' | 'cooldown'

// Dedupe concurrent refresh triggers across components.
let inflightRefresh: Promise<SilentRefreshResult> | null = null

// Exponential backoff: 1s → 2s → 4s → … → 30s cap.
let failureCount = 0
let retryAfter = 0

// Test-only: module-level state otherwise leaks across tests in the same file.
export function __resetSilentRefreshState() {
  inflightRefresh = null
  failureCount = 0
  retryAfter = 0
}

export async function silentRefresh(queryClient: QueryClient): Promise<SilentRefreshResult> {
  if (inflightRefresh) return inflightRefresh
  // Cooldown window after recent failure — callers decide whether to wait or log out.
  if (Date.now() < retryAfter) return 'cooldown'

  inflightRefresh = (async (): Promise<SilentRefreshResult> => {
    try {
      const res = await api.auth.refresh.$post()
      if (!res.ok) {
        failureCount++
        retryAfter = Date.now() + Math.min(1000 * 2 ** (failureCount - 1), 30_000)
        return 'failed'
      }

      const json = await res.json()
      if (!json.success) {
        failureCount++
        retryAfter = Date.now() + Math.min(1000 * 2 ** (failureCount - 1), 30_000)
        return 'failed'
      }

      const { accessToken, user } = json.data

      useAuthStore.getState().setAuth(accessToken, user)
      queryClient.setQueryData(['session'], { authenticated: true, userId: user.id })

      failureCount = 0
      retryAfter = 0
      return 'ok'
    } catch {
      failureCount++
      retryAfter = Date.now() + Math.min(1000 * 2 ** (failureCount - 1), 30_000)
      return 'failed'
    } finally {
      inflightRefresh = null
    }
  })()

  return inflightRefresh
}
