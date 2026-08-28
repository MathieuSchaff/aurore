import type { UserPublic } from '@aurore/shared'

import { clearHydrationSnapshot } from '@/lib/auth/sessionState'
import { type ClientAuthSession, useAuthStore } from '@/store/auth'

export function pendingTestSession(): ClientAuthSession {
  return { status: 'pending' }
}

export function anonymousTestSession(): ClientAuthSession {
  return { status: 'anonymous' }
}

export function restoringTestSession(user: UserPublic): ClientAuthSession {
  return {
    status: 'authenticated',
    user,
    credential: { status: 'restoring', bearer: null, expiresAt: null },
  }
}

export function presentTestSession(
  user: UserPublic,
  bearer = 'test-bearer',
  expiresAt = Date.now() + 3_600_000
): ClientAuthSession {
  return {
    status: 'authenticated',
    user,
    credential: { status: 'present', bearer, expiresAt },
  }
}

export function resetTestAuthStore(session: ClientAuthSession = pendingTestSession()): void {
  clearHydrationSnapshot()
  useAuthStore.setState({ session, sessionExpired: false, bannedDetails: null })
}
