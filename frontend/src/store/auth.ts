import type { BannedErrorDetails, UserPublic } from '@aurore/shared'

import { create } from 'zustand'

type ClientCredential =
  | { status: 'restoring'; bearer: null; expiresAt: null }
  | { status: 'present'; bearer: string; expiresAt: number }

export type ClientAuthSession =
  | { status: 'pending' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: UserPublic; credential: ClientCredential }

interface AuthStore {
  session: ClientAuthSession
  sessionExpired: boolean
  bannedDetails: BannedErrorDetails | null

  publishSession: (session: ClientAuthSession) => void
  setAuth: (bearer: string, user: UserPublic) => void
  clearAuth: () => void
  updateUser: (user: UserPublic) => void
  markSessionExpired: () => void
  clearSessionExpired: () => void
  markBanned: (details: BannedErrorDetails) => void
  clearBanned: () => void
}

function decodeTokenExp(token: string): number {
  try {
    const encodedPayload = token.split('.')[1]
    if (!encodedPayload) return 0
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64)) as { exp?: unknown }
    return typeof payload.exp === 'number' ? payload.exp * 1000 : 0
  } catch {
    // Malformed credentials stay representable but are immediately treated as expired
    return 0
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: { status: 'pending' },
  sessionExpired: false,
  bannedDetails: null,

  publishSession: (session) => set({ session }),
  setAuth: (bearer, user) =>
    set({
      session: {
        status: 'authenticated',
        user,
        credential: { status: 'present', bearer, expiresAt: decodeTokenExp(bearer) },
      },
      sessionExpired: false,
    }),
  clearAuth: () => set({ session: { status: 'anonymous' } }),
  updateUser: (user) =>
    set((state) => {
      if (state.session.status !== 'authenticated') return state
      return { session: { ...state.session, user } }
    }),
  markSessionExpired: () => set({ sessionExpired: true }),
  clearSessionExpired: () => set({ sessionExpired: false }),
  markBanned: (details) => set({ bannedDetails: details }),
  clearBanned: () => set({ bannedDetails: null }),
}))
