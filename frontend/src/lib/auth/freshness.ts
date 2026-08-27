import type { UserPublic } from '@aurore/shared'

import type { QueryClient } from '@tanstack/react-query'

import { readCredentialExpiration } from '@/lib/auth/credential'
import { httpClient } from '@/lib/httpClient'
import { type ClientSessionSnapshot, captureClientSession, installSession } from './session'

export type RefreshResult = 'ok' | 'failed' | 'cooldown' | 'superseded'

// Manual wire type: a typed `api.*` import here would bring back the api <-> freshness cycle.
type RefreshResponse =
  | { success: true; data: { accessToken: string; user: UserPublic } }
  | { success: false; error: string }

// Injected so freshness decisions are deterministic in tests without patching the global Date.
export interface Clock {
  now(): number
}

const systemClock: Clock = { now: () => Date.now() }
let clock: Clock = systemClock

// Treat a token as expired this far ahead of its real exp (clock skew + requests already in flight).
const EXPIRY_BUFFER_MS = 30_000
// Schedule the proactive refresh this far before expiry.
const PROACTIVE_LEAD_MS = 60_000

// Dedupe concurrent refresh triggers across components.
let inflightRefresh: Promise<RefreshResult> | null = null

// Exponential backoff: doubles each failure, from 1s up to a 30s cap.
let failureCount = 0
let retryAfter = 0

function recordFailure(): void {
  failureCount++
  retryAfter = clock.now() + Math.min(1000 * 2 ** (failureCount - 1), 30_000)
}

function clearFailures(): void {
  failureCount = 0
  retryAfter = 0
}

function failRefresh(owner: ClientSessionSnapshot): RefreshResult {
  if (!owner.isCurrent()) {
    clearFailures()
    return 'superseded'
  }
  recordFailure()
  return 'failed'
}

// Test-only: module-level state otherwise leaks across tests in the same file.
export function __resetFreshness() {
  inflightRefresh = null
  failureCount = 0
  retryAfter = 0
}

// Test-only: swap the clock; pass null to restore the system clock.
export function __setClock(c: Clock | null) {
  clock = c ?? systemClock
}

export function isExpired(bufferMs = EXPIRY_BUFFER_MS): boolean {
  const exp = readCredentialExpiration()
  if (!exp) return true
  return clock.now() > exp - bufferMs
}

// <= 0 means the proactive refresh is already due.
export function msUntilProactiveRefresh(expiresAt: number): number {
  return expiresAt - clock.now() - PROACTIVE_LEAD_MS
}

// Never rejects, so guards keep control of their redirect policy
export async function ensureFresh(queryClient: QueryClient): Promise<RefreshResult> {
  if (inflightRefresh) return inflightRefresh
  // Cooldown window after recent failure: callers decide whether to wait or log out.
  if (clock.now() < retryAfter) return 'cooldown'

  const owner = captureClientSession()
  inflightRefresh = (async (): Promise<RefreshResult> => {
    try {
      const res = await httpClient('/api/auth/refresh', {
        method: 'POST',
      })
      if (!res.ok) {
        return failRefresh(owner)
      }

      const json = (await res.json()) as RefreshResponse
      if (!json.success) {
        return failRefresh(owner)
      }

      if (!owner.isCurrent()) {
        clearFailures()
        return 'superseded'
      }
      const { accessToken, user } = json.data
      installSession(queryClient, { accessToken, user })

      clearFailures()
      return 'ok'
    } catch {
      return failRefresh(owner)
    } finally {
      inflightRefresh = null
    }
  })()

  return inflightRefresh
}
