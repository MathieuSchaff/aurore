import type { UserPublic } from '@aurore/shared'

import { QueryClient, useQuery } from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../api', () => ({
  api: {
    'product-comparisons': {
      ':id': {
        $patch: vi.fn(),
        $get: vi.fn(),
      },
    },
  },
}))

import { endSession, installSession } from '@/lib/auth/session'
import { resetTestAuthStore } from '@/test/authSession'
import { renderHookWithProviders } from '@/test/utils'
import { api } from '../../api'
import { comparisonKeys, comparisonQueries, useUpdateComparison } from '../comparisons'

const mockPatch = vi.mocked(api['product-comparisons'][':id'].$patch) as unknown as ReturnType<
  typeof vi.fn
>

function makeResponse(init: { status?: number; body: unknown }): Response {
  return new Response(JSON.stringify(init.body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

const ID = '11111111-1111-1111-1111-111111111111'
const ENRICHED = { id: ID, name: 'Renamed', createdAt: '2026-06-16T00:00:00.000Z', products: [] }

describe('useUpdateComparison', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    mockPatch.mockReset()
    resetTestAuthStore()
  })

  afterEach(() => {
    queryClient.clear()
    resetTestAuthStore()
  })

  it('sends id as param + input as json, returns the enriched body', async () => {
    mockPatch.mockResolvedValue(makeResponse({ body: { success: true, data: ENRICHED } }))

    const { result } = renderHookWithProviders(() => useUpdateComparison(), { queryClient })
    result.current.mutate({ id: ID, input: { name: 'Renamed' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockPatch).toHaveBeenCalledWith({ param: { id: ID }, json: { name: 'Renamed' } })
    expect(result.current.data).toEqual(ENRICHED)
  })

  // Other open views still need a refresh after the detail adopts the PATCH response
  it('invalidates the detail and list queries on success', async () => {
    mockPatch.mockResolvedValue(makeResponse({ body: { success: true, data: ENRICHED } }))
    const refreshed = Promise.withResolvers<void>()
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockReturnValue(refreshed.promise)

    const { result } = renderHookWithProviders(() => useUpdateComparison(), { queryClient })
    result.current.mutate({ id: ID, input: { name: 'Renamed' } })

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledTimes(2))
    expect(result.current.isPending).toBe(true)
    refreshed.resolve()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['product-comparisons', 'detail', ID],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['product-comparisons', 'list'] })
  })

  // A failed refresh must not restore the pair that the successful PATCH replaced
  it('keeps the saved comparison when its detail refresh fails', async () => {
    const previous = { ...ENRICHED, name: 'Previous' }
    const mockGet = vi.mocked(api['product-comparisons'][':id'].$get) as unknown as ReturnType<
      typeof vi.fn
    >
    mockGet.mockResolvedValue(
      makeResponse({ status: 500, body: { success: false, error: 'server_error' } })
    )
    mockPatch.mockResolvedValue(makeResponse({ body: { success: true, data: ENRICHED } }))
    queryClient.setQueryData(comparisonKeys.detail(ID), previous)

    const { result } = renderHookWithProviders(
      () => ({
        detail: useQuery({ ...comparisonQueries.detail(ID), retry: false, staleTime: Infinity }),
        update: useUpdateComparison(),
      }),
      { queryClient }
    )
    result.current.update.mutate({ id: ID, input: { name: 'Renamed' } })

    await waitFor(() => expect(result.current.update.isSuccess).toBe(true))
    expect(result.current.detail.isRefetchError).toBe(true)
    expect(result.current.detail.data).toEqual(ENRICHED)
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  it.each(['logout', 'same account', 'other account', 'role change'] as const)(
    'does not restore a saved comparison across session changes (%s)',
    async (transition) => {
      const user = {
        id: 'comparison-owner',
        email: 'comparison@example.com',
        createdAt: '2026-10-23T12:00:00.000Z',
        emailVerified: false,
        role: 'user',
        isDemo: false,
      } satisfies UserPublic
      installSession(queryClient, { user, accessToken: 'initial-token' })
      const response = Promise.withResolvers<Response>()
      mockPatch.mockReturnValue(response.promise)
      const { result } = renderHookWithProviders(() => useUpdateComparison(), { queryClient })
      result.current.mutate({ id: ID, input: { name: 'Renamed' } })
      await waitFor(() => expect(mockPatch).toHaveBeenCalledTimes(1))
      if (transition === 'logout' || transition === 'same account') {
        endSession(queryClient, 'logout')
      }
      if (transition !== 'logout') {
        installSession(queryClient, {
          user: {
            ...user,
            id: transition === 'other account' ? 'replacement-owner' : user.id,
            role: transition === 'role change' ? 'admin' : 'user',
          },
          accessToken: 'replacement-token',
        })
      }
      // The transport can return a response sent before the private caches were purged
      response.resolve(makeResponse({ body: { success: true, data: ENRICHED } }))
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(queryClient.getQueryData(comparisonKeys.detail(ID))).toBeUndefined()
    }
  )

  it('throws when the response is not ok', async () => {
    mockPatch.mockResolvedValue(
      makeResponse({ status: 500, body: { success: false, error: 'server_error' } })
    )

    const { result } = renderHookWithProviders(() => useUpdateComparison(), { queryClient })
    result.current.mutate({ id: ID, input: { name: 'Renamed' } })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(Error)
  })
})
