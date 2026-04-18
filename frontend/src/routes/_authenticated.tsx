import { createFileRoute, Outlet } from '@tanstack/react-router'

import { DemoBanner } from '../component/Feedback/app/DemoBanner/DemoBanner'
import { requireAuth } from '../lib/auth/requireAuth'
import { useTokenRefresh } from '../lib/hooks/useTokenRefresh'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    await requireAuth({ queryClient: context.queryClient, pathname: location.pathname })
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
