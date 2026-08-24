import type { BannedErrorDetails, UserPublic } from '@aurore/shared'

import { useSyncExternalStore } from 'react'

import { type ClientAuthSession, useAuthStore } from '@/store/auth'

export type { ClientAuthSession }

type AuthStoreState = ReturnType<typeof useAuthStore.getState>

// Zustand hands React its initial state as the hydration snapshot, so the nav would
// hydrate as `pending` against markup the server rendered as anonymous or signed in.
// The seed freezes the state the server rendered from. Suspense boundaries can still be
// hydrating when a failed boot refresh flips the store to anonymous, and they must
// hydrate against that frozen state, then pick up the change through the live snapshot
let hydrationSnapshot: AuthStoreState | null = null

export function freezeHydrationSnapshot(): void {
  hydrationSnapshot = useAuthStore.getState()
}

export function clearHydrationSnapshot(): void {
  hydrationSnapshot = null
}

function useHydratedAuthStore<T>(select: (state: AuthStoreState) => T): T {
  const read = () => select(useAuthStore.getState())
  const readHydration = () => select(hydrationSnapshot ?? useAuthStore.getState())
  return useSyncExternalStore(useAuthStore.subscribe, read, readHydration)
}

export function useClientAuthSessionState(): ClientAuthSession {
  return useHydratedAuthStore((state) => state.session)
}

export function readClientAuthSessionState(): ClientAuthSession {
  return useAuthStore.getState().session
}

export function publishClientAuthSession(session: ClientAuthSession): void {
  useAuthStore.getState().publishSession(session)
}

export function installClientCredential(bearer: string, user: UserPublic): void {
  useAuthStore.getState().setAuth(bearer, user)
}

export function clearClientAuthSession(): void {
  useAuthStore.getState().clearAuth()
}

export function updateClientAuthUser(user: UserPublic): void {
  useAuthStore.getState().updateUser(user)
}

export function markSessionExpiredEvent(): void {
  useAuthStore.getState().markSessionExpired()
}

export function clearSessionExpiredEventState(): void {
  useAuthStore.getState().clearSessionExpired()
}

export function useSessionExpiredEventState(): boolean {
  return useHydratedAuthStore((state) => state.sessionExpired)
}

export function recordBanEvent(details: BannedErrorDetails): void {
  useAuthStore.getState().markBanned(details)
}

export function clearBanEventState(): void {
  useAuthStore.getState().clearBanned()
}

export function consumeBanEventState(): BannedErrorDetails | null {
  const details = useAuthStore.getState().bannedDetails
  if (details) useAuthStore.getState().clearBanned()
  return details
}

export function useBanEventState(): BannedErrorDetails | null {
  return useHydratedAuthStore((state) => state.bannedDetails)
}

export function readCredentialBearerState(): string | null {
  const session = readClientAuthSessionState()
  return session.status === 'authenticated' && session.credential.status === 'present'
    ? session.credential.bearer
    : null
}

export function readCredentialExpirationState(): number | null {
  const session = readClientAuthSessionState()
  return session.status === 'authenticated' && session.credential.status === 'present'
    ? session.credential.expiresAt
    : null
}

export function useCredentialExpirationState(): number | null {
  return useHydratedAuthStore((state) =>
    state.session.status === 'authenticated' && state.session.credential.status === 'present'
      ? state.session.credential.expiresAt
      : null
  )
}
