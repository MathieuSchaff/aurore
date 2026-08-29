import type { UserPublic } from '@aurore/shared'

import { QueryClient, type QueryKey } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { type ProductsSearch, productsSearchSchema } from '@/features/products/filters'
import { setProfileFilterOff } from '@/features/products/profileFilterSetting'
import { useAuthStore } from '@/store/auth'
import { anonymousTestSession, presentTestSession, restoringTestSession } from '@/test/authSession'
import { renderWithProviders } from '@/test/utils'

const { getSearch, navigate, useHydrated } = vi.hoisted(() => ({
  getSearch: vi.fn<() => ProductsSearch>(),
  navigate: vi.fn(),
  useHydrated: vi.fn(() => true),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: ({ children }: { children: ReactNode }) => children,
  createLink:
    () =>
    ({ children }: { children: ReactNode }) =>
      children,
  getRouteApi: () => ({ useSearch: getSearch, useNavigate: () => navigate }),
  useHydrated,
  useNavigate: () => navigate,
}))

import { ProductsPage } from '@/features/products/pages/ProductsPage/ProductsPage'

const USER_ID = 'user-1'
const USER = {
  id: USER_ID,
  email: 'viewer@example.com',
  createdAt: '2026-08-21T06:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

function renderProducts() {
  const queryClient = makeClient()
  return {
    queryClient,
    ...renderWithProviders(<ProductsPage />, { queryClient }),
  }
}

function productListKeys(queryClient: QueryClient): QueryKey[] {
  return queryClient
    .getQueryCache()
    .getAll()
    .map((query) => query.queryKey)
    .filter((key) => key[0] === 'products' && key[1] === 'list')
}

function readApplyPreferences(key: QueryKey): unknown {
  const filters = key[2]
  if (typeof filters !== 'object' || filters === null) return undefined
  return Reflect.get(filters, 'apply_preferences')
}

beforeEach(() => {
  vi.clearAllMocks()
  getSearch.mockReturnValue(productsSearchSchema.parse({}))
  useHydrated.mockReturnValue(true)
  useAuthStore.setState({
    session: presentTestSession(USER, 'test-token', Date.now() + 60_000),
  })
})

afterEach(() => {
  setProfileFilterOff(USER_ID, false)
  useAuthStore.setState({ session: anonymousTestSession() })
})

describe('ProductsPage: viewer-owned list key under the standing setting', () => {
  it('uses one viewer key for a mute URL with the setting sent as auto', async () => {
    const { queryClient } = renderProducts()
    await screen.findByText(/Hydrating Cleanser/)

    const keys = productListKeys(queryClient)
    expect(keys).toHaveLength(1)
    expect(keys[0]?.at(-1)).toBe(USER_ID)
    expect(readApplyPreferences(keys[0] ?? [])).toBe('auto')
  })

  it('keeps the SSR rule key while a device opt-out is still hydrating', async () => {
    setProfileFilterOff(USER_ID, true)
    useHydrated.mockReturnValue(false)

    const { queryClient } = renderProducts()
    await screen.findByText(/Hydrating Cleanser/)

    const keys = productListKeys(queryClient)
    expect(keys).toHaveLength(1)
    expect(keys[0]?.at(-1)).toBe(USER_ID)
    expect(readApplyPreferences(keys[0] ?? [])).toBe('auto')
  })

  it('a device opt-out keeps one viewer key and sends no setting at all', async () => {
    setProfileFilterOff(USER_ID, true)
    const { queryClient } = renderProducts()
    await screen.findByText(/Hydrating Cleanser/)

    const keys = productListKeys(queryClient)
    expect(keys).toHaveLength(1)
    expect(keys[0]?.at(-1)).toBe(USER_ID)
    expect(readApplyPreferences(keys[0] ?? [])).toBeUndefined()
  })

  it('applies declared rules while a seeded viewer restores its credential', async () => {
    useAuthStore.setState({ session: restoringTestSession(USER) })

    const { queryClient } = renderProducts()
    await screen.findByText(/Hydrating Cleanser/)

    const keys = productListKeys(queryClient)
    expect(keys).toHaveLength(1)
    expect(keys[0]?.at(-1)).toBe(USER_ID)
    expect(readApplyPreferences(keys[0] ?? [])).toBe('auto')
  })
})
