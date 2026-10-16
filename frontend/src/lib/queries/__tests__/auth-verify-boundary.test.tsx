import { ok, type UserPublic } from '@aurore/shared'

import { act, cleanup, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { __resetFreshness, ensureFresh } from '@/lib/auth/freshness'
import { readClientSession } from '@/lib/auth/session'
import { useVerifyEmail } from '@/lib/queries/auth'
import { presentTestSession, resetTestAuthStore, restoringTestSession } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'

const CURRENT_USER = {
  id: 'user-a',
  email: 'a@example.com',
  createdAt: '2026-09-15T12:00:00.000Z',
  emailVerified: false,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

beforeEach(() => {
  resetTestAuthStore()
  __resetFreshness()
})

afterEach(() => {
  cleanup()
  resetTestAuthStore()
  __resetFreshness()
})

describe('email verification boundary', () => {
  it('refreshes verified state even after a previous refresh entered cooldown', async () => {
    resetTestAuthStore(presentTestSession(CURRENT_USER))
    let refreshCalls = 0
    server.use(
      http.post('*/api/auth/verify-email', () => HttpResponse.json(ok(null))),
      http.post('*/api/auth/refresh', () => {
        refreshCalls++
        return refreshCalls === 1
          ? new HttpResponse(null, { status: 503 })
          : HttpResponse.json(
              ok({
                accessToken: 'verified-bearer',
                user: { ...CURRENT_USER, emailVerified: true },
              })
            )
      })
    )
    const qc = createTestQueryClient()
    const hook = renderHookWithProviders(() => useVerifyEmail(), { queryClient: qc })
    try {
      expect(await ensureFresh(qc)).toBe('failed')
      await act(() => hook.result.current.mutateAsync('verified-after-cooldown'))
      // A failed background refresh must not suppress the authoritative read after verification
      expect(readClientSession()).toMatchObject({
        status: 'authenticated',
        user: { id: CURRENT_USER.id, emailVerified: true },
      })
      expect(refreshCalls).toBe(2)
    } finally {
      hook.unmount()
      qc.clear()
    }
  })

  it.each([false, true])(
    'reads after an older refresh without changing a replacement account: %s',
    async (replaceAccount) => {
      resetTestAuthStore(presentTestSession(CURRENT_USER))
      const qc = createTestQueryClient()
      const started = Promise.withResolvers<void>()
      const release = Promise.withResolvers<void>()
      let refreshCalls = 0
      server.use(
        http.post('*/api/auth/refresh', async () => {
          refreshCalls++
          const verified = refreshCalls > 1
          if (!verified) {
            started.resolve()
            await release.promise
          }
          return HttpResponse.json(
            ok({
              accessToken: 'refreshed-bearer',
              user: { ...CURRENT_USER, emailVerified: verified },
            })
          )
        })
      )
      const older = ensureFresh(qc)
      let afterVerification: Promise<unknown> | undefined
      try {
        await started.promise
        // Verification needs a read started after its POST, rather than this old snapshot
        afterVerification = ensureFresh(qc, { force: true })
        const nextUser = { ...CURRENT_USER, id: 'replacement-user' }
        if (replaceAccount) resetTestAuthStore(presentTestSession(nextUser))
        release.resolve()
        await older
        await afterVerification
        expect(readClientSession()).toMatchObject({
          status: 'authenticated',
          user: replaceAccount ? nextUser : { ...CURRENT_USER, emailVerified: true },
        })
        expect(refreshCalls).toBe(replaceAccount ? 1 : 2)
      } finally {
        release.resolve()
        await Promise.allSettled([older, ...(afterVerification ? [afterVerification] : [])])
        qc.clear()
      }
    }
  )

  it('retries a transient refresh failure after verification succeeds', async () => {
    resetTestAuthStore(presentTestSession(CURRENT_USER))
    let refreshCalls = 0
    server.use(
      http.post('*/api/auth/verify-email', () => HttpResponse.json(ok(null))),
      http.post('*/api/auth/refresh', () => {
        refreshCalls++
        return refreshCalls === 1
          ? HttpResponse.error()
          : HttpResponse.json(
              ok({
                accessToken: 'verified-bearer',
                user: { ...CURRENT_USER, emailVerified: true },
              })
            )
      })
    )
    const hook = renderHookWithProviders(() => useVerifyEmail())
    await act(() => hook.result.current.mutateAsync('verified-after-network-failure'))
    expect(readClientSession()).toMatchObject({
      status: 'authenticated',
      user: { id: CURRENT_USER.id, emailVerified: true },
    })
    expect(refreshCalls).toBe(2)
  })

  it('keeps the current account unverified when the token belongs to another account', async () => {
    resetTestAuthStore(presentTestSession(CURRENT_USER))
    let refreshCalls = 0
    server.use(
      http.post('*/api/auth/verify-email', () => HttpResponse.json({ success: true, data: null })),
      http.post('*/api/auth/refresh', () => {
        refreshCalls++
        return HttpResponse.json({
          success: true,
          data: { accessToken: 'refreshed-test-bearer', user: CURRENT_USER },
        })
      })
    )
    const { result } = renderHookWithProviders(() => useVerifyEmail())

    await act(() => result.current.mutateAsync('token-for-user-b'))

    // A successful token verification does not identify the signed in account
    expect(readClientSession()).toMatchObject({
      status: 'authenticated',
      user: { id: CURRENT_USER.id, emailVerified: false },
    })
    expect(refreshCalls).toBe(1)
  })

  it.each(['present', 'restoring'])(
    'adopts server verification with a %s credential',
    async (state) => {
      resetTestAuthStore(
        state === 'present' ? presentTestSession(CURRENT_USER) : restoringTestSession(CURRENT_USER)
      )
      server.use(
        http.post('*/api/auth/verify-email', () =>
          HttpResponse.json({ success: true, data: null })
        ),
        http.post('*/api/auth/refresh', () =>
          HttpResponse.json({
            success: true,
            data: {
              accessToken: 'refreshed-test-bearer',
              user: { ...CURRENT_USER, emailVerified: true },
            },
          })
        )
      )
      const { result } = renderHookWithProviders(() => useVerifyEmail())

      await act(() => result.current.mutateAsync('token-for-user-a'))

      expect(readClientSession()).toMatchObject({
        status: 'authenticated',
        user: { id: CURRENT_USER.id, emailVerified: true },
      })
    }
  )

  it.each(['verification', 'refresh'])(
    'preserves a replacement account during %s',
    async (stage) => {
      resetTestAuthStore(presentTestSession(CURRENT_USER))
      const nextUser = {
        ...CURRENT_USER,
        id: 'user-b',
        email: 'b@example.com',
      } satisfies UserPublic
      let started!: () => void
      let release!: () => void
      const waiting = new Promise<void>((resolve) => {
        started = resolve
      })
      const gate = new Promise<void>((resolve) => {
        release = resolve
      })
      let refreshCalls = 0
      server.use(
        http.post('*/api/auth/verify-email', async () => {
          if (stage === 'verification') {
            started()
            await gate
          }
          return HttpResponse.json({ success: true, data: null })
        }),
        http.post('*/api/auth/refresh', async () => {
          refreshCalls++
          if (stage === 'refresh') {
            started()
            await gate
          }
          return HttpResponse.json({
            success: true,
            data: {
              accessToken: 'refreshed-test-bearer',
              user: { ...CURRENT_USER, emailVerified: true },
            },
          })
        })
      )
      const { result } = renderHookWithProviders(() => useVerifyEmail())

      await act(async () => {
        const verification = result.current.mutateAsync('delayed-token-for-user-a')
        await waiting
        resetTestAuthStore(presentTestSession(nextUser))
        release()
        await verification
      })

      expect(readClientSession()).toMatchObject({ status: 'authenticated', user: nextUser })
      expect(refreshCalls).toBe(stage === 'verification' ? 0 : 1)
    }
  )

  it('preserves verification success without changing identity when refresh fails', async () => {
    resetTestAuthStore(presentTestSession(CURRENT_USER))
    server.use(
      http.post('*/api/auth/verify-email', () => HttpResponse.json({ success: true, data: null })),
      http.post('*/api/auth/refresh', () => new HttpResponse(null, { status: 503 }))
    )
    const { result } = renderHookWithProviders(() => useVerifyEmail())

    await act(() => result.current.mutateAsync('valid-token'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(readClientSession()).toMatchObject({ status: 'authenticated', user: CURRENT_USER })
  })

  it('shares one request between concurrent submissions of the same token', async () => {
    let verificationCalls = 0
    server.use(
      http.post('*/api/auth/verify-email', () => {
        verificationCalls++
        return HttpResponse.json({ success: true, data: null })
      })
    )
    const { result } = renderHookWithProviders(() => useVerifyEmail())

    await act(async () => {
      await Promise.all([
        result.current.mutateAsync('shared-token'),
        result.current.mutateAsync('shared-token'),
      ])
    })

    expect(verificationCalls).toBe(1)
  })
})
