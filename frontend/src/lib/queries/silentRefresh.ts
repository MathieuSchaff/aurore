import type { QueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../store/auth'
import { api } from '../api'

// We save the request here. If many parts of the app ask to refresh 
// at the same time, we only call the server one time.
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

      queryClient.setQueryData(['session'], { authenticated: true, userId: user.id })

      return true
    } catch {
      return false
    } finally {
      // When it is done, we reset the variable so we can refresh again later.
      inflightRefresh = null
    }
  })()

  return inflightRefresh
}
