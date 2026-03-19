import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { authQueries } from '../lib/queries/auth'
import { silentRefresh } from '../lib/queries/silentRefresh'
import { useAuthStore } from '../store/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const store = useAuthStore.getState()

    // Token validation and recovery loop
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
      // Server-side session verification
      await context.queryClient.ensureQueryData(authQueries.session())
    } catch {
      // If server rejects the current token, try one last refresh
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
  component: () => <Outlet />,
})
