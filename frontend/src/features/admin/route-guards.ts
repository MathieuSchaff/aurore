import { requireRole } from '@/lib/auth/requireSession'
import type { RouterContext } from '@/routerContext'

type GuardArgs = { context: RouterContext; location: { href: string } }

// Admin-only child routes of the shared /admin shell (dashboard, users). A
// contributor (« modérateur ») who reaches one by direct URL is sent to their
// report queue rather than an account/structure surface; someone who is not a member goes home.
export async function requireAdminOrRedirect({ context, location }: GuardArgs) {
  const session = await requireRole({
    queryClient: context.queryClient,
    href: location.href,
    allowedRoles: ['admin'],
    fallbackFor: { contributor: '/admin/reports' },
  })
  return { session }
}

// Content-moderation child routes reachable by admin∨contributor. The user-detail page
// exposes a content-only ban slice to a contributor (« mettre en pause »); the account
// surface (email/role header, force-private, role revocation) is gated in the component.
// Anyone who is not a member goes home.
export async function requireModeratorOrRedirect({ context, location }: GuardArgs) {
  const session = await requireRole({
    queryClient: context.queryClient,
    href: location.href,
    allowedRoles: ['admin', 'contributor'],
  })
  return { session }
}
