import { act, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { productsSearchSchema } from '@/features/products/filters'
import type { ApiData, api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { anonymousTestSession } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

const { search } = vi.hoisted(() => ({ search: vi.fn() }))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: (await import('@/test/mocks/router')).LinkStub,
  createLink: (await import('@/test/mocks/router')).createLinkStub,
  useNavigate: () => vi.fn(),
  getRouteApi: () => ({ useSearch: search }),
  useHydrated: () => true,
}))

import { ProductsPage } from '@/features/products/pages/ProductsPage/ProductsPage'

beforeEach(() => {
  search.mockReturnValue(productsSearchSchema.parse({}))
  useAuthStore.setState({ session: anonymousTestSession() })
})

afterEach(cleanup)

describe('ProductsPage: loading errors', () => {
  it.each(['server', 'network'])(
    'distinguishes a %s failure from an empty catalogue',
    async (kind) => {
      server.use(
        http.get('*/api/products', () =>
          kind === 'network' ? HttpResponse.error() : new HttpResponse(null, { status: 500 })
        )
      )

      renderWithProviders(<ProductsPage />)

      // A failed request must not claim that the catalogue contains no products
      expect(
        await screen.findByRole('heading', { name: /chargement impossible/i })
      ).toBeInTheDocument()
      expect(screen.queryByText(/aucun produit/i)).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument()
    }
  )
  it('loads products when the user retries after a failure', async () => {
    server.use(http.get('*/api/products', () => new HttpResponse(null, { status: 503 })))
    renderWithProviders(<ProductsPage />)

    const retry = await screen.findByRole('button', { name: /réessayer/i })
    server.resetHandlers()
    await userEvent.click(retry)

    expect(await screen.findByText(/Hydrating Cleanser/)).toBeInTheDocument()
    expect(screen.queryByText(/chargement impossible/i)).not.toBeInTheDocument()
  })

  it.each([{}, { q: 'absent' }])(
    'keeps a successful empty result with search %j',
    async (params) => {
      search.mockReturnValue(productsSearchSchema.parse(params))
      const data = {
        items: [],
        total: 0,
        page: 1,
        limit: 24,
        hiddenCount: 0,
        excludedLabels: [],
        requiredLabels: [],
        rulesApplied: false,
      } satisfies ApiData<typeof api.products.$get>
      server.use(http.get('*/api/products', () => HttpResponse.json({ success: true, data })))

      renderWithProviders(<ProductsPage />)

      expect(await screen.findByRole('heading', { name: /aucun produit/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /réessayer/i })).not.toBeInTheDocument()
    }
  )

  it('keeps the dedicated rate limit message', async () => {
    server.use(
      http.get('*/api/products', () =>
        HttpResponse.json({ success: false, error: 'rate_limit_exceeded' }, { status: 429 })
      )
    )
    renderWithProviders(<ProductsPage />)

    expect(await screen.findByRole('heading', { name: /trop de requêtes/i })).toBeInTheDocument()
    expect(screen.queryByText(/chargement impossible/i)).not.toBeInTheDocument()
  })

  it('preserves displayed products when a background refresh fails', async () => {
    const queryClient = createTestQueryClient()
    renderWithProviders(<ProductsPage />, { queryClient })
    await screen.findByText(/Hydrating Cleanser/)
    server.use(http.get('*/api/products', () => new HttpResponse(null, { status: 503 })))

    await act(() => queryClient.invalidateQueries({ queryKey: ['products', 'list'] }))

    expect(screen.getByText(/Hydrating Cleanser/)).toBeInTheDocument()
    expect(screen.queryByText(/aucun produit|chargement impossible/i)).not.toBeInTheDocument()
  })
})
