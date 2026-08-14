import type { AppType } from '@aurore/backend'
import { type SsrBootResponse, ssrBootResponseSchema } from '@aurore/shared'

import { createServerOnlyFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { hc } from 'hono/client'

type SsrBootIssue = 'authenticated' | 'anonymous' | 'unknown'

interface SsrBootResult {
  issue: SsrBootIssue
  hasRefreshTokenCookie: boolean
  data: SsrBootResponse
}

const anonymousBootData = ssrBootResponseSchema.parse({
  session: { authenticated: false },
  profile: null,
})

type SsrBootFailureCause = 'configuration_error' | 'http_error' | 'invalid_response'

class SsrBootFailure extends Error {
  constructor(readonly cause: SsrBootFailureCause) {
    super(cause)
  }
}

function hasRefreshTokenCookie(cookieHeader: string): boolean {
  return cookieHeader.split(/;\s*/).some((cookie) => cookie.startsWith('refresh_token='))
}

function bootFailureCause(error: unknown): string {
  if (error instanceof SsrBootFailure) return error.cause
  if (error instanceof DOMException && ['AbortError', 'TimeoutError'].includes(error.name)) {
    return 'timeout'
  }
  return 'network_error'
}

export const loadSsrBoot = createServerOnlyFn(async (): Promise<SsrBootResult> => {
  const cookieHeader = getRequestHeader('cookie') ?? ''
  const hasRefreshCookie = hasRefreshTokenCookie(cookieHeader)

  if (hasRefreshCookie) {
    const startedAt = performance.now()
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      if (!apiUrl) throw new SsrBootFailure('configuration_error')

      const client = hc<AppType>(apiUrl)
      const response = await client.api.boot.$get(undefined, {
        headers: { cookie: cookieHeader },
        init: { signal: AbortSignal.timeout(2000) },
      })
      if (!response.ok) throw new SsrBootFailure('http_error')

      const json = (await response.json().catch(() => {
        throw new SsrBootFailure('invalid_response')
      })) as { data?: unknown }
      const parsed = ssrBootResponseSchema.safeParse(json.data)
      if (!parsed.success) throw new SsrBootFailure('invalid_response')
      const data = parsed.data
      return {
        issue: data.session.authenticated ? 'authenticated' : 'anonymous',
        hasRefreshTokenCookie: true,
        data,
      }
    } catch (error) {
      console.error(
        JSON.stringify({
          event: 'ssr_boot_fallback',
          route: '/api/boot',
          cause: bootFailureCause(error),
          durationMs: Math.round(performance.now() - startedAt),
        })
      )
      return {
        issue: 'unknown',
        hasRefreshTokenCookie: true,
        data: anonymousBootData,
      }
    }
  }

  return {
    issue: 'anonymous',
    hasRefreshTokenCookie: hasRefreshCookie,
    data: anonymousBootData,
  }
})
