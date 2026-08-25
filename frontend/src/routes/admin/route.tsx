import { createFileRoute } from '@tanstack/react-router'

import { AdminLayout } from '@/features/admin/components/AdminLayout'
import { requireRole } from '@/lib/auth/requireSession'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context, location }) => {
    // The /admin shell is shared by admins and contributors; admin-only
    // surfaces gate themselves in their own child routes.
    const session = await requireRole({
      queryClient: context.queryClient,
      href: location.href,
      allowedRoles: ['admin', 'contributor'],
    })
    return { session }
  },
  component: AdminLayout,
})
