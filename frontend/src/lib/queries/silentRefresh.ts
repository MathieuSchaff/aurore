import type { QueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../store/auth'
import { api } from '../api'

/**
 * Silent refresh via httpOnly cookie.
 * Deduplicated to avoid multiple concurrent calls.
 */

let inflightRefresh: Promise<boolean> | null = null

export async function silentRefresh(queryClient: QueryClient): Promise<boolean> {
  if (inflightRefresh) return inflightRefresh

  inflightRefresh = (async () => {
    try {
      const res = await api.auth.refresh.$post()
      if (!res.ok) return false

      const json = await res.json()
      if (!json.success) return false

      const { accessToken, user } = json.data

      useAuthStore.getState().setAuth(accessToken, user)

      queryClient.setQueryData(['session'], {
        success: true as const,
        data: { authenticated: true, userId: user.id },
      })

      return true
    } catch {
      return false
    } finally {
      inflightRefresh = null
    }
  })()

  return inflightRefresh
}
