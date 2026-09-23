import { bannedErrorResponseSchema } from '@aurore/shared'

import type { QueryClient } from '@tanstack/react-query'

import { captureClientSession, recordBan } from './session'

export async function markBanIfBanned(
  queryClient: QueryClient,
  res: Response,
  isCurrent = captureClientSession().isCurrent
): Promise<void> {
  const body: unknown = await res
    .clone()
    .json()
    .catch(() => null)
  const parsed = bannedErrorResponseSchema.safeParse(body)
  if (parsed.success && isCurrent()) {
    const details = parsed.data.details
    recordBan(queryClient, {
      expiresAt: details?.expiresAt ?? null,
      reason: details?.reason ?? null,
      scope: details?.scope,
    })
  }
}
