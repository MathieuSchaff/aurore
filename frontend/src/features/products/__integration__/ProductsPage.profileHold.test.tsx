// Unmock react-router before any import that pulls in router internals; setup.ts mocks it globally.
import { vi } from 'vitest'

vi.unmock('@tanstack/react-router')

import { QueryClient } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { Route as ProductsIndexRouteImport } from '@/routes/products/index'
import { useAuthStore } from '@/store/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

const USER_ID = 'user-1'
const FIRST_PRODUCT_ID = '11111111-1111-1111-1111-111111111111'

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

function renderProducts() {
  const rootRoute = createRootRoute()
  const productsRoute = (
    ProductsIndexRouteImport as unknown as { update: (opts: object) => unknown }
  ).update({ id: '/products/', path: '/products/', getParentRoute: () => rootRoute })
  const routeTree = rootRoute.addChildren([productsRoute as never])
  const queryClient = makeClient()
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/products/'] }),
    defaultPendingMs: 0,
    context: {
      queryClient,
      auth: { isAuthenticated: true, accessToken: 'test-token' },
    },
  })
  return {
    router,
    queryClient,
    ...renderWithProviders(<RouterProvider router={router} />, { queryClient }),
  }
}

// Cache keys are [...productKeys.list(filters), userKey], so the tail says which
// identity the grid on screen is reading.
function listUserKeys(queryClient: QueryClient): unknown[] {
  return queryClient
    .getQueryCache()
    .getAll()
    .map((q) => q.queryKey as unknown[])
    .filter((key) => key[0] === 'products' && key[1] === 'list')
    .map((key) => key[key.length - 1])
}

let releaseProfile: () => void
let profileGate: Promise<void>

beforeEach(() => {
  profileGate = new Promise<void>((resolve) => {
    releaseProfile = resolve
  })
  server.use(
    http.get('*/api/profile/dermo', async () => {
      await profileGate
      return HttpResponse.json({
        success: true,
        data: { skinTypes: ['dry'], skinConcerns: [], phototype: null },
      })
    }),
    http.get('*/api/profile/preference-targets', async () => {
      await profileGate
      return HttpResponse.json({ success: true, data: { ingredients: [], tags: [] } })
    })
  )
  useAuthStore.setState({
    accessToken: 'test-token',
    tokenExpiresAt: Date.now() + 60_000,
    user: { id: USER_ID } as never,
    emailVerified: true,
    role: 'user',
    isDemo: false,
    bootRefreshAttempted: true,
    bootRefreshPending: false,
  })
})

afterEach(() => {
  releaseProfile()
  useAuthStore.setState({ accessToken: null, user: null, bootRefreshAttempted: false })
})

describe('ProductsPage — standing profile filter hold (A20b)', () => {
  it('keeps the anonymous list key until the standing setting resolves', async () => {
    const { queryClient } = renderProducts()
    await screen.findByText(/Hydrating Cleanser/)

    // Held: one list query, still on the anonymous identity. Without the hold the
    // grid would already have swapped to the user key and paid a second fetch.
    expect(listUserKeys(queryClient)).toEqual([null])

    releaseProfile()

    await waitFor(() => expect(listUserKeys(queryClient)).toContain(USER_ID))
  })

  it('lands the shelf-status overlay on the entry the page is reading', async () => {
    server.use(
      http.get('*/api/products/shelf-status', () =>
        HttpResponse.json({
          success: true,
          data: [{ productId: FIRST_PRODUCT_ID, userStatus: 'in_stock' }],
        })
      )
    )
    const { queryClient } = renderProducts()
    await screen.findByText(/Hydrating Cleanser/)

    // Silent failure mode of the hold: the loader converges under the user key while
    // the page reads the anonymous one, so the badges land on a cache entry nobody
    // renders and the collection markers vanish without an error.
    await waitFor(() => {
      const anonymous = queryClient
        .getQueryCache()
        .getAll()
        .find((q) => {
          const key = q.queryKey as unknown[]
          return key[0] === 'products' && key[1] === 'list' && key[key.length - 1] === null
        })
      const items = (anonymous?.state.data as { items: { id: string; userStatus: unknown }[] })
        ?.items
      expect(items?.find((item) => item.id === FIRST_PRODUCT_ID)?.userStatus).toBe('in_stock')
    })
  })
})
