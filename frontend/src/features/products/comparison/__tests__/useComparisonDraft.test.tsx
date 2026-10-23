import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { endSession, installSession } from '@/lib/auth/session'
import { resetTestAuthStore } from '@/test/authSession'
import { useComparisonDraft } from '../hooks/useComparisonDraft'

const USER = {
  id: 'draft-owner',
  email: 'draft@example.com',
  createdAt: '2026-10-23T12:00:00.000Z',
  emailVerified: false,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

const queryClient = new QueryClient()

beforeEach(() => {
  queryClient.clear()
  resetTestAuthStore()
  installSession(queryClient, { user: USER, accessToken: 'draft-token' })
})

describe('comparison draft navigation', () => {
  it('isolates navigation entries and clears only the completed draft', () => {
    const { result, rerender } = renderHook(
      ({ entry }) => useComparisonDraft(entry, 'seed-product'),
      { initialProps: { entry: 'first' } }
    )
    expect(result.current.productIds).toEqual(['seed-product'])
    act(() => result.current.setProductIds(['seed-product', 'second-product']))
    act(() => result.current.setName('Premier brouillon'))
    rerender({ entry: 'second' })
    expect(result.current.name).toBe('')
    expect(result.current.productIds).toEqual(['seed-product'])
    act(() => result.current.setName('Autre brouillon'))
    act(() => result.current.clearDraft())
    expect(result.current.name).toBe('')
    rerender({ entry: 'first' })
    expect(result.current.name).toBe('Premier brouillon')
    expect(result.current.productIds).toEqual(['seed-product', 'second-product'])
  })

  it('ignores callbacks captured before a new login', () => {
    const first = renderHook(() => useComparisonDraft('same-entry'))
    act(() => first.result.current.setName('Ancien brouillon'))
    const previous = first.result.current
    first.unmount()
    endSession(queryClient, 'logout')
    installSession(queryClient, { user: USER, accessToken: 'new-token' })
    const current = renderHook(() => useComparisonDraft('same-entry'))
    act(() => current.result.current.setName('Nouveau brouillon'))
    // A delayed callback from the previous login must not adopt the new session
    act(() => previous.setName('Ancienne saisie'))
    act(() => previous.setProductIds(['old-product']))
    act(() => previous.clearDraft())
    expect(current.result.current.name).toBe('Nouveau brouillon')
    expect(current.result.current.productIds).toEqual([])
  })

  it.each(['logout', 'expired'] as const)('clears a mounted draft after %s', (reason) => {
    const { result } = renderHook(() => useComparisonDraft('mounted'))
    act(() => result.current.setName('Nom privé'))
    act(() => result.current.setProductIds(['product-a', 'product-b']))
    act(() => endSession(queryClient, reason))
    expect(result.current.name).toBe('')
    expect(result.current.productIds).toEqual([])
    act(() => result.current.setName('Saisie anonyme'))
    act(() => installSession(queryClient, { user: USER, accessToken: 'new-token' }))
    expect(result.current.name).toBe('')
    expect(result.current.productIds).toEqual([])
  })

  it.each(['account', 'role'])(
    'discards an unmounted draft after a temporary %s change',
    (change) => {
      const first = renderHook(() => useComparisonDraft('temporary-change'))
      act(() => first.result.current.setName('Nom privé'))
      first.unmount()
      installSession(queryClient, {
        user: change === 'account' ? { ...USER, id: 'other-owner' } : { ...USER, role: 'admin' },
        accessToken: 'changed-token',
      })
      installSession(queryClient, { user: USER, accessToken: 'returned-token' })
      const returned = renderHook(() => useComparisonDraft('temporary-change'))
      expect(returned.result.current.name).toBe('')
    }
  )

  it('keeps the draft through a refresh of the same session', () => {
    const { result } = renderHook(() => useComparisonDraft('refresh'))
    act(() => result.current.setName('À conserver'))
    act(() => installSession(queryClient, { user: USER, accessToken: 'fresh-token' }))
    expect(result.current.name).toBe('À conserver')
  })

  it.each(['same account', 'other account'])(
    'discards an unmounted draft after login as %s',
    (next) => {
      const first = renderHook(() => useComparisonDraft('private-draft'))
      act(() => first.result.current.setName('Nom privé'))
      act(() => first.result.current.setProductIds(['product-a', 'product-b']))
      first.unmount()
      endSession(queryClient, 'logout')
      installSession(queryClient, {
        user: next === 'same account' ? USER : { ...USER, id: 'other-owner' },
        accessToken: 'new-token',
      })
      const returned = renderHook(() => useComparisonDraft('private-draft'))
      expect(returned.result.current.name).toBe('')
      expect(returned.result.current.productIds).toEqual([])
    }
  )
})
