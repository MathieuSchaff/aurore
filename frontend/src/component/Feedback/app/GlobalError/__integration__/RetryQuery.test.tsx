import { vi } from 'vitest'

vi.unmock('@tanstack/react-router')

import type { Ingredient } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'

import { ingredientQueries } from '@/lib/queries/ingredients'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { GlobalError } from '../GlobalError'

const ingredient = {
  id: '00000000-0000-0000-0000-000000000001',
  createdBy: '00000000-0000-0000-0000-000000000002',
  name: 'Niacinamide',
  slug: 'niacinamide',
  description: '',
  content: '',
  type: 'skincare',
  category: 'actif',
  createdAt: '2026-09-15T12:00:00.000Z',
  updatedAt: '2026-09-15T12:00:00.000Z',
} satisfies Ingredient

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('retrying a route with a failed suspense query', () => {
  it('fetches tags again after the source recovers', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    let available = false
    let tagRequests = 0
    server.use(
      http.get('*/api/ingredients/niacinamide', () =>
        HttpResponse.json({ success: true, data: ingredient })
      ),
      http.get('*/api/ingredients/:ingredientId/tags', () => {
        tagRequests += 1
        return available
          ? HttpResponse.json({ success: true, data: [] })
          : HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
      })
    )
    const queryClient = createTestQueryClient()
    const tags = ingredientQueries.tags(ingredient.id)
    queryClient.setQueryDefaults(tags.queryKey, { gcTime: Number.POSITIVE_INFINITY })
    const rootRoute = createRootRoute({ component: Outlet })
    const detailRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/ingredients/$slug/edit',
      loader: () => queryClient.ensureQueryData(ingredientQueries.bySlug(ingredient.slug)),
      component: () => {
        const { data } = useSuspenseQuery(ingredientQueries.bySlug(ingredient.slug))
        useSuspenseQuery(tags)
        return <h1>Modifier {data.name}</h1>
      },
    })
    const router = createRouter({
      routeTree: rootRoute.addChildren([detailRoute]),
      history: createMemoryHistory({ initialEntries: ['/ingredients/niacinamide/edit'] }),
      defaultErrorComponent: ({ error, reset }) => <GlobalError error={error} reset={reset} />,
      defaultOnCatch: () => {},
    })

    renderWithProviders(<RouterProvider router={router} />, { queryClient })
    const retry = await screen.findByRole('button', { name: /réessayer/i })
    expect(tagRequests).toBe(1)

    available = true
    // Router invalidation alone only reruns the detail loader, leaving tags in error
    await userEvent.click(retry)
    await screen.findByRole('heading', { name: /modifier.*niacinamide/i })
    expect(tagRequests).toBe(2)
    expect(queryClient.getQueryState(tags.queryKey)?.status).toBe('success')
  })
})
