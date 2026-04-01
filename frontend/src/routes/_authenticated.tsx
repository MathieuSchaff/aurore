import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { DemoBanner } from '../component/Feedback/DemoBanner/DemoBanner'
import { useTokenRefresh } from '../lib/hooks/useTokenRefresh'
import { authQueries } from '../lib/queries/auth'
import { silentRefresh } from '../lib/queries/silentRefresh'
import { useAuthStore } from '../store/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const store = useAuthStore.getState()

    // We check if the token is still okay, if not we try to refresh it.
    if (!store.accessToken || store.isTokenExpired()) {
      const refreshed = await silentRefresh(context.queryClient)

      if (!refreshed) {
        store.clearAuth()
        context.queryClient.removeQueries({ queryKey: ['session'] })
        context.queryClient.removeQueries({ queryKey: ['auth'] })

        throw redirect({
          to: '/login',
          search: { redirect: location.pathname },
        })
      }

      return
    }

    try {
      // We ask the server if the session is really correct.
      await context.queryClient.ensureQueryData(authQueries.session())
    } catch {
      // The server said no, so we try one last time to refresh before we stop.
      const refreshed = await silentRefresh(context.queryClient)

      if (!refreshed) {
        store.clearAuth()
        context.queryClient.removeQueries({ queryKey: ['session'] })
        context.queryClient.removeQueries({ queryKey: ['auth'] })

        throw redirect({
          to: '/login',
          search: { redirect: location.pathname },
        })
      }
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  useTokenRefresh()
  return (
    <>
      <DemoBanner />
      <Outlet />
    </>
  )
}
