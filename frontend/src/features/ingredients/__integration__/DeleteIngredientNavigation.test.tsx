import { vi } from 'vitest'

vi.unmock('@tanstack/react-router')

import { err, ok, type UserPublic } from '@aurore/shared'

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { notFoundOn404 } from '@/lib/routeErrors'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { IngredientEditPage } from '../page/IngredientEditPage/IngredientEditPage'

const ADMIN = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'admin@example.test',
  createdAt: '2026-08-01T00:00:00.000Z',
  emailVerified: true,
  role: 'admin',
  isDemo: false,
} satisfies UserPublic

const INGREDIENT = {
  id: '22222222-2222-4222-8222-222222222222',
  createdBy: ADMIN.id,
  name: 'Niacinamide',
  slug: 'niacinamide',
  type: 'skincare',
  category: 'actif',
  canonicalKey: 'Niacinamide',
  description: '',
  content: '',
  catalogQuality: 'verified',
  moderationStatus: 'visible',
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
} satisfies ApiData<(typeof api.ingredients)[':slug']['$get']>

const EDIT_PATH = '/ingredients/niacinamide/edit'

describe('deleting an ingredient', () => {
  beforeEach(() => {
    resetTestAuthStore(presentTestSession(ADMIN))
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    )
    server.use(
      http.get('*/api/ingredients/:ingredientId/tags', () => HttpResponse.json(ok([]))),
      http.get('*/api/ingredient-tags', () => HttpResponse.json(ok([])))
    )
  })

  afterEach(() => {
    resetTestAuthStore()
    vi.unstubAllGlobals()
  })

  function renderEditPage(loadList: () => Promise<void> = async () => {}) {
    const queryClient = createTestQueryClient()
    const detailQuery = ingredientQueries.bySlug(INGREDIENT.slug)
    queryClient.setQueryDefaults(detailQuery.queryKey, { gcTime: Number.POSITIVE_INFINITY })
    queryClient.setQueryData(detailQuery.queryKey, INGREDIENT)

    const rootRoute = createRootRoute({ component: Outlet })
    const editRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/ingredients/$slug/edit',
      loader: () => queryClient.ensureQueryData(detailQuery).catch(notFoundOn404),
      component: IngredientEditPage,
      notFoundComponent: () => <h1>Ingrédient introuvable</h1>,
    })
    // File-route identity keeps the trailing underscore while its URL omits it.
    Object.assign(editRoute.options, { id: '/ingredients/$slug_/edit' })
    const listRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/ingredients',
      loader: loadList,
      component: () => <h1>Liste des ingrédients</h1>,
    })
    const router = createRouter({
      routeTree: rootRoute.addChildren([editRoute, listRoute]),
      history: createMemoryHistory({ initialEntries: [EDIT_PATH] }),
      defaultPendingMs: 200,
    })
    const view = renderWithProviders(<RouterProvider router={router} />, { queryClient })
    return { queryClient, detailQuery, router, view }
  }

  it('keeps the observed detail until navigation finishes and fetches a 404 on history return', async () => {
    let detailReads = 0
    let deleted = false
    let releaseListLoader!: () => void
    const listLoader = new Promise<void>((resolve) => {
      releaseListLoader = resolve
    })
    server.use(
      http.delete('*/api/ingredients/:id', () => {
        deleted = true
        return new HttpResponse(null, { status: 204 })
      }),
      http.get('*/api/ingredients/niacinamide', () => {
        detailReads++
        return HttpResponse.json(err('ingredient_not_found'), { status: 404 })
      })
    )
    const { queryClient, detailQuery, router, view } = renderEditPage(() => listLoader)

    try {
      await userEvent.click(await screen.findByRole('button', { name: /supprimer/i }))
      await waitFor(() => expect(router.state.status).toBe('pending'))

      // Removing an observed suspense query early would refetch the deleted ingredient.
      expect(deleted).toBe(true)
      expect(screen.getByRole('textbox', { name: /^nom/i })).toHaveValue('Niacinamide')
      expect(queryClient.getQueryCache().find(detailQuery)?.getObserversCount()).toBe(1)
      expect(detailReads).toBe(0)

      releaseListLoader()
      await screen.findByRole('heading', { name: /liste des ingrédients/i })
      await waitFor(() => expect(queryClient.getQueryState(detailQuery.queryKey)).toBeUndefined())
      expect(detailReads).toBe(0)

      act(() => router.history.back())
      await screen.findByRole('heading', { name: /ingrédient introuvable/i })
      expect(router.state.location.pathname).toBe(EDIT_PATH)
      expect(detailReads).toBe(1)
      expect(screen.queryByRole('textbox', { name: /^nom/i })).not.toBeInTheDocument()
    } finally {
      releaseListLoader()
      view.unmount()
      queryClient.clear()
    }
  })

  it('keeps the ingredient and its route when deletion fails', async () => {
    server.use(
      http.delete('*/api/ingredients/:id', () =>
        HttpResponse.json(err('server_error'), { status: 500 })
      )
    )
    const { queryClient, detailQuery, router, view } = renderEditPage()

    try {
      await userEvent.click(await screen.findByRole('button', { name: /supprimer/i }))
      await waitFor(() => {
        expect(
          queryClient.getMutationCache().find({ mutationKey: ['ingredients', 'delete'] })?.state
            .status
        ).toBe('error')
      })
      expect(screen.getByRole('textbox', { name: /^nom/i })).toHaveValue('Niacinamide')
      expect(router.state.location.pathname).toBe(EDIT_PATH)
      expect(router.state.status).toBe('idle')
      expect(queryClient.getQueryData(detailQuery.queryKey)).toEqual(INGREDIENT)
    } finally {
      view.unmount()
      queryClient.clear()
    }
  })
})
