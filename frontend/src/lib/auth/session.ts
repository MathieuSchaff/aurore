import type { BannedErrorDetails, SsrBootResponse, UserPublic } from '@aurore/shared'

import { type QueryClient, useQueryClient } from '@tanstack/react-query'

import {
  CREDENTIAL_VALIDATION_FRESH_MS,
  type CredentialValidation,
  credentialValidationQueryKey,
} from '@/lib/auth/credentialValidation'
import { dropSessionScopedQueries } from '@/lib/auth/sessionCache'
import { isServer } from '@/lib/helpers/isServer'
import {
  type ClientAuthSession,
  clearBanEventState,
  clearClientAuthSession,
  clearSessionExpiredEventState,
  consumeBanEventState,
  freezeHydrationSnapshot,
  installClientCredential,
  markSessionExpiredEvent,
  publishClientAuthSession,
  readClientAuthSessionState,
  recordBanEvent,
  updateClientAuthUser,
  useBanEventState,
  useClientAuthSessionState,
  useSessionExpiredEventState,
} from './sessionState'
import type { SsrBootIssue } from './ssrBoot'

const BOOT_SESSION_QUERY_KEY = ['boot', 'session'] as const

type BootCapsule =
  | { status: 'pending' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: UserPublic }

export type SessionView =
  | { status: 'pending' }
  | { status: 'anonymous' }
  | {
      status: 'authenticated'
      user: UserPublic
      credential: 'restoring' | 'present'
    }

export type SessionEndReason = 'probe-failed' | 'logout' | 'account-deleted' | 'expired'

export interface ClientSessionSnapshot {
  readonly session: SessionView
  isCurrent(): boolean
}

function deriveClientSession(session: ClientAuthSession): SessionView {
  if (session.status === 'authenticated') {
    return {
      status: 'authenticated',
      user: session.user,
      credential: session.credential.status,
    }
  }

  return session
}

export function viewerId(session: SessionView): string | null {
  return session.status === 'authenticated' ? session.user.id : null
}

function useClientSession(): SessionView {
  return deriveClientSession(useClientAuthSessionState())
}

function useRequestSession(): SessionView {
  return readRequestSession(useQueryClient())
}

const useSessionForEnvironment = isServer ? useRequestSession : useClientSession

export function useSession(): SessionView {
  return useSessionForEnvironment()
}

export function readClientSession(): SessionView {
  return deriveClientSession(readClientAuthSessionState())
}

export function captureClientSession(): ClientSessionSnapshot {
  const source = readClientAuthSessionState()
  return {
    session: deriveClientSession(source),
    isCurrent: () => readClientAuthSessionState() === source,
  }
}

export function readRequestSession(queryClient: QueryClient): SessionView {
  if (!isServer) {
    throw new Error('readRequestSession is server-only')
  }
  const capsule = queryClient.getQueryData<BootCapsule>(BOOT_SESSION_QUERY_KEY)
  if (!capsule) {
    throw new Error('Root auth loader did not publish a boot capsule')
  }
  if (capsule.status === 'anonymous') {
    return { status: 'anonymous' }
  }
  if (capsule.status === 'authenticated') {
    return {
      status: 'authenticated',
      user: capsule.user,
      credential: 'restoring',
    }
  }

  return { status: 'pending' }
}

export function writeRequestBootSession(
  queryClient: QueryClient,
  issue: SsrBootIssue,
  session: SsrBootResponse['session']
): void {
  let capsule: BootCapsule
  if (issue === 'unknown') {
    capsule = { status: 'pending' }
  } else if (issue === 'anonymous') {
    capsule = { status: 'anonymous' }
  } else {
    if (!session.authenticated) {
      throw new Error('Authenticated boot issue requires an authenticated session')
    }
    capsule = { status: 'authenticated', user: session.user }
  }
  queryClient.setQueryData<BootCapsule>(BOOT_SESSION_QUERY_KEY, capsule)
}

export function seedClientSession(queryClient: QueryClient): void {
  const capsule = queryClient.getQueryData<BootCapsule>(BOOT_SESSION_QUERY_KEY)
  if (!capsule) throw new Error('Hydration did not restore the boot capsule')

  if (capsule.status === 'authenticated') {
    publishClientAuthSession({
      status: 'authenticated',
      user: capsule.user,
      credential: { status: 'restoring', bearer: null, expiresAt: null },
    })
  } else {
    publishClientAuthSession(capsule)
  }
  freezeHydrationSnapshot()

  queryClient.removeQueries({ queryKey: BOOT_SESSION_QUERY_KEY, exact: true })
}

export function installSession(
  queryClient: QueryClient,
  { accessToken, user }: { accessToken: string; user: UserPublic }
): void {
  const previousSession = readClientAuthSessionState()
  const previousUser = previousSession.status === 'authenticated' ? previousSession.user : null
  if (previousUser?.id !== user.id || previousUser.role !== user.role) {
    // Late Suspense boundaries still hydrate from the frozen pending snapshot
    // Keep their marked anonymous data so only the adopted viewer fetch runs
    dropSessionScopedQueries(queryClient, {
      preserveAnonymousViewerQueries: previousSession.status === 'pending',
    })
  }
  installClientCredential(accessToken, user)
  const validationKey = credentialValidationQueryKey(user.id)
  queryClient.setQueryDefaults(validationKey, {
    gcTime: CREDENTIAL_VALIDATION_FRESH_MS,
    staleTime: CREDENTIAL_VALIDATION_FRESH_MS,
  })
  queryClient.setQueryData<CredentialValidation>(validationKey, {
    authenticated: true,
    userId: user.id,
    role: user.role,
  })
}

export function updateSessionUser(user: UserPublic): void {
  updateClientAuthUser(user)
}

export function endSession(queryClient: QueryClient, reason: SessionEndReason): void {
  if (reason === 'logout' || reason === 'account-deleted') {
    queryClient.clear()
  } else {
    dropSessionScopedQueries(queryClient)
  }

  clearBanEventState()
  clearClientAuthSession()
  if (reason === 'expired') {
    markSessionExpiredEvent()
  } else {
    clearSessionExpiredEventState()
  }
}

export function recordBan(queryClient: QueryClient, details: BannedErrorDetails): void {
  if (!details.scope || details.scope === 'global') {
    dropSessionScopedQueries(queryClient)
  }
  recordBanEvent(details)
}

export function consumeBanEvent(): BannedErrorDetails | null {
  return consumeBanEventState()
}

export function useBanEvent(): BannedErrorDetails | null {
  return useBanEventState()
}

export function useSessionExpiredEvent(): boolean {
  return useSessionExpiredEventState()
}

export function clearSessionExpiredEvent(): void {
  clearSessionExpiredEventState()
}
