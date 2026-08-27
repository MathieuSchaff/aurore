import { createFileRoute } from '@tanstack/react-router'

import { AdminUserDetailPage } from '@/features/admin/components/AdminUserDetailPage'
import { loadAdminUserDetailQueries } from '@/features/admin/loadAdminUserDetail'
import { requireModeratorOrRedirect } from '@/features/admin/route-guards'

export const Route = createFileRoute('/admin/users_/$userId')({
  beforeLoad: requireModeratorOrRedirect,
  loader: ({ context, params }) =>
    loadAdminUserDetailQueries(context.queryClient, params.userId, context.session.user.role),
  component: AdminUserDetailPage,
})
