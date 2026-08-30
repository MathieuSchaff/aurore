import type { UserPublic } from '@aurore/shared'

import type { QueryClient } from '@tanstack/react-query'
import { isRedirect, redirect } from '@tanstack/react-router'

import { authQueries } from '../queries/auth'
import { ensureFresh, isExpired } from './freshness'
import { isHydrating } from './hydrationGate'
import { captureClientSession, endSession, readClientSession, type SessionView } from './session'

export type AuthenticatedSession = Extract<SessionView, { status: 'authenticated' }>

export interface RequireSessionOptions {
  queryClient: QueryClient
  href: string
}

export interface RequireRoleOptions extends RequireSessionOptions {
  allowedRoles: ReadonlyArray<UserPublic['role']>
  fallbackFor?: Partial<Record<UserPublic['role'], string>>
}

export async function requireSession({
  queryClient,
  href,
}: RequireSessionOptions): Promise<AuthenticatedSession> {
  const snapshot = captureClientSession()
  const { session } = snapshot
  if (session.status === 'anonymous') return redirectToLogin(href, { leaveDocument: true })

  const hasCredential = hasPresentCredential(session)
  if (!hasCredential || isExpired()) {
    return refreshSession(queryClient, href, hasCredential)
  }

  try {
    const validation = await queryClient.ensureQueryData(authQueries.validation(session.user.id))
    if (!snapshot.isCurrent()) return requireSession({ queryClient, href })
    if (validation.userId !== session.user.id || validation.role !== session.user.role) {
      return refreshSession(queryClient, href, true)
    }
    return session
  } catch (error) {
    if (isRedirect(error)) throw error
    if (!snapshot.isCurrent()) return requireSession({ queryClient, href })
    return refreshSession(queryClient, href, true)
  }
}

export async function requireRole({
  queryClient,
  href,
  allowedRoles,
  fallbackFor,
}: RequireRoleOptions): Promise<AuthenticatedSession> {
  let session = readClientSession()
  if (session.status === 'anonymous') return redirectToLogin(href, { leaveDocument: true })

  if (session.status !== 'authenticated' || !hasPresentCredential(session) || isExpired()) {
    session = await refreshSession(queryClient, href, false)
  }

  if (allowedRoles.includes(session.user.role)) return session

  throw redirect({ to: fallbackFor?.[session.user.role] ?? '/' })
}

function hasPresentCredential(
  session: SessionView
): session is AuthenticatedSession & { credential: 'present' } {
  return session.status === 'authenticated' && session.credential === 'present'
}

const USABLE_REFRESH_RESULTS = new Set(['ok', 'superseded'])

function canUseRefreshedSession(
  session: SessionView,
  snapshotIsCurrent: boolean,
  result: Awaited<ReturnType<typeof ensureFresh>>,
  allowCooldown: boolean
): session is AuthenticatedSession {
  if (session.status !== 'authenticated') return false
  if (!snapshotIsCurrent) return true
  if (USABLE_REFRESH_RESULTS.has(result)) return true
  return allowCooldown && result === 'cooldown'
}

async function refreshSession(
  queryClient: QueryClient,
  href: string,
  allowCooldown: boolean
): Promise<AuthenticatedSession> {
  const snapshot = captureClientSession()
  const result = await ensureFresh(queryClient)
  const session = readClientSession()
  const snapshotIsCurrent = snapshot.isCurrent()
  if (canUseRefreshedSession(session, snapshotIsCurrent, result, allowCooldown)) return session

  if (!snapshotIsCurrent || result === 'superseded') return redirectToLogin(href)

  endSession(queryClient, snapshot.session.status === 'authenticated' ? 'expired' : 'probe-failed')
  return redirectToLogin(href)
}

// leaveDocument: only for a session the server already knew anonymous. A session
// that died on the client (probe rejected, expired) keeps the router redirect: the
// refresh cookie is still set, so a fresh document would boot authenticated and
// bounce off the login page, and the in-memory "expired" notice would be lost.
async function redirectToLogin(
  href: string,
  { leaveDocument = false }: { leaveDocument?: boolean } = {}
): Promise<never> {
  if (leaveDocument && isHydrating()) {
    // Document navigation, not a router redirect: see hydrationGate.ts. The load
    // promise never settles, the document is on its way out.
    window.location.replace(`/auth/login?redirect=${encodeURIComponent(href)}`)
    await new Promise<never>(() => {})
  }
  throw redirect({
    to: '/auth/login',
    search: { redirect: href },
  })
}
