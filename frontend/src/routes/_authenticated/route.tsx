import { createFileRoute, Outlet } from '@tanstack/react-router'

import { DemoBanner } from '@/component/Feedback/app/DemoBanner/DemoBanner'
import { requireSession } from '@/lib/auth/requireSession'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location, preload }) => {
    if (preload) return
    await requireSession({
      queryClient: context.queryClient,
      href: location.href,
    })
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <>
      <DemoBanner />
      <Outlet />
    </>
  )
}
