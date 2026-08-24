import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { useVerifyEmail } from '@/lib/queries/auth'
import { server } from '@/test/msw/server'
import { renderHookWithProviders } from '@/test/utils'

describe('email verification boundary', () => {
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
