import { vi } from 'vitest'

vi.unmock('@tanstack/react-router')

import { ok } from '@aurore/shared'

import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import type { RouterContext } from '@/routerContext'
import { Route as IngredientsRoute } from '@/routes/ingredients/index'
import { anonymousTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

const LIST = {
  items: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      slug: 'hydratant-repere',
      name: 'Hydratant repère',
      type: 'haircare',
      category: 'actif',
      description: 'Un ingrédient de la deuxième page.',
      profileMatches: [],
    },
  ],
  total: 25,
} satisfies ApiData<typeof api.ingredients.$get>

describe('ingredient list route prefetch', () => {
  afterEach(() => resetTestAuthStore())

  it('prefetches page two with its filters before the page reuses that cache', async () => {
    resetTestAuthStore(anonymousTestSession())
    const requests: Record<string, string>[] = []
    server.use(
      http.get('*/api/ingredients', ({ request }) => {
        requests.push(Object.fromEntries(new URL(request.url).searchParams))
        return HttpResponse.json(ok(LIST))
      }),
      http.get('*/api/ingredients/filter-options', () => HttpResponse.json(ok({ tags: [] })))
    )
    const queryClient = createTestQueryClient()
    queryClient.setDefaultOptions({ queries: { retry: false, gcTime: Number.POSITIVE_INFINITY } })
    const rootRoute = createRootRouteWithContext<RouterContext>()()
    const originalOptions = { ...IngredientsRoute.options }
    // Attach the file route to the test root as the generated route tree does.
    Object.assign(IngredientsRoute.options, {
      getParentRoute: () => rootRoute,
      id: '/ingredients/',
      path: '/ingredients/',
    })
    const router = createRouter({
      routeTree: rootRoute.addChildren([IngredientsRoute]),
      context: { queryClient },
      history: createMemoryHistory({
        initialEntries: ['/ingredients/?page=2&type=haircare&concern=%5B%22hydratant%22%5D'],
      }),
    })
    const expectedKey = [
      'ingredients',
      'list',
      {
        concern: ['hydratant'],
        type: 'haircare',
        page: 2,
        limit: 24,
      },
    ] as const

    try {
      await router.load()
      // Assert before rendering: the page must not hide a missing or incomplete prefetch.
      await waitFor(() => expect(queryClient.getQueryData(expectedKey)).toEqual(LIST))
      expect(requests).toEqual([
        { concern: 'hydratant', ingredient_type: 'haircare', page: '2', limit: '24' },
      ])
      expect(
        queryClient.getQueryCache().findAll({ queryKey: ['ingredients', 'list'] })
      ).toHaveLength(1)

      const view = renderWithProviders(<RouterProvider router={router} />, { queryClient })
      try {
        expect(await screen.findByRole('link', { name: /hydratant repère/i })).toBeVisible()
        await waitFor(() => expect(queryClient.isFetching()).toBe(0))
        expect(
          queryClient.getQueryCache().find({ queryKey: expectedKey })?.getObserversCount()
        ).toBe(1)
        expect(
          queryClient.getQueryCache().findAll({ queryKey: ['ingredients', 'list'] })
        ).toHaveLength(1)
        expect(requests).toEqual([
          { concern: 'hydratant', ingredient_type: 'haircare', page: '2', limit: '24' },
        ])
      } finally {
        view.unmount()
      }
    } finally {
      queryClient.clear()
      Object.assign(IngredientsRoute.options, originalOptions)
    }
  })
})
