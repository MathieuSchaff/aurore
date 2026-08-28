import { QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetTestAuthStore } from '@/test/authSession'
import { recordBan, useBanEvent } from '../session'
import { useBannedRedirect } from '../useBannedRedirect'

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => navigate,
  useRouterState: () => '/',
}))

describe('useBannedRedirect', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    navigate.mockReset()
    resetTestAuthStore()
  })

  it('redirects a global ban without exposing or consuming its details', async () => {
    recordBan(queryClient, {
      expiresAt: null,
      reason: 'Abus',
      scope: 'global',
    })
    const signal = renderHook(() => useBanEvent())
    expect(signal.result.current).toMatchObject({ scope: 'global' })
    renderHook(() => useBannedRedirect())

    await waitFor(() => expect(navigate).toHaveBeenCalledOnce())
    expect(navigate).toHaveBeenCalledWith({ to: '/auth/banned' })
    expect(signal.result.current).toMatchObject({ reason: 'Abus', scope: 'global' })
  })

  it('keeps the current page for a scoped ban and consumes its signal', async () => {
    recordBan(queryClient, {
      expiresAt: null,
      reason: 'Création suspendue',
      scope: 'product_create',
    })
    const signal = renderHook(() => useBanEvent())
    expect(signal.result.current).toMatchObject({ scope: 'product_create' })
    renderHook(() => useBannedRedirect())

    await waitFor(() => expect(signal.result.current).toBeNull())
    expect(navigate).not.toHaveBeenCalled()
  })
})
