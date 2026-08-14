import type { QueryClient } from '@tanstack/react-query'

import { type AuthSessionCache, authQueries } from '@/lib/queries/auth'
import { useAuthStore } from '@/store/auth'

export function seedClientAuth(queryClient: QueryClient): void {
  const session = queryClient.getQueryData<AuthSessionCache>(authQueries.session().queryKey)
  if (!session?.authenticated || !session.user || !session.role) return

  useAuthStore.setState({
    user: session.user,
    emailVerified: session.user.emailVerified,
    role: session.role,
    isDemo: session.user.isDemo,
  })
}
