import { useQueryClient } from '@tanstack/react-query'

import { type AuthSessionCache, authQueries } from '@/lib/queries/auth'
import { useAuthStore } from '@/store/auth'

export function useBootPending(): boolean {
  const queryClient = useQueryClient()
  const bootRefreshPending = useAuthStore((s) => s.bootRefreshPending)
  const bootRefreshAttempted = useAuthStore((s) => s.bootRefreshAttempted)
  const accessToken = useAuthStore((s) => s.accessToken)
  const session = queryClient.getQueryData<AuthSessionCache>(authQueries.session().queryKey)
  const bootDecisionPending =
    session?.authenticated !== false && !bootRefreshAttempted && !accessToken
  return bootRefreshPending || bootDecisionPending
}
