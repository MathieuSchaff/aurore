import { vi } from 'vitest'

vi.unmock('@tanstack/react-router')

import type { Article, UserPublic } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
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
import { afterEach, describe, expect, it } from 'vitest'

import { articleQueries } from '@/lib/queries/articles'
import { notFoundOn404 } from '@/lib/routeErrors'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { BlogArticlePage } from '../page/BlogArticlePage/BlogArticlePage'

const ADMIN = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'admin@example.test',
  createdAt: '2026-08-01T00:00:00.000Z',
  emailVerified: true,
  role: 'admin',
  isDemo: false,
} satisfies UserPublic

const ARTICLE = {
  id: '22222222-2222-4222-8222-222222222222',
  createdBy: ADMIN.id,
  title: 'Comprendre une formule',
  slug: 'comprendre-une-formule',
  category: 'skincare',
  content: 'Quelques repères pour lire une formule.',
  excerpt: null,
  coverImageUrl: null,
  publishedAt: '2026-08-01T00:00:00.000Z',
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
} satisfies Article

describe('deleting a blog article', () => {
  afterEach(() => {
    resetTestAuthStore()
    vi.unstubAllGlobals()
  })

  it('keeps the observed detail until navigation finishes and fetches a 404 on history return', async () => {
    let detailReads = 0
    let deleted = false
    let releaseListLoader!: () => void
    const listLoader = new Promise<void>((resolve) => {
      releaseListLoader = resolve
    })
    let releaseListRequest!: () => void
    const listRequest = new Promise<void>((resolve) => {
      releaseListRequest = resolve
    })
    server.use(
      http.delete('*/api/articles/:slug', () => {
        deleted = true
        return new HttpResponse(null, { status: 204 })
      }),
      http.get('*/api/articles/:slug', () => {
        detailReads += 1
        return HttpResponse.json({ success: false, error: 'article_not_found' }, { status: 404 })
      }),
      http.get('*/api/articles', async () => {
        await listRequest
        return HttpResponse.json({ success: true, data: { items: [], total: 0 } })
      })
    )
    resetTestAuthStore(presentTestSession(ADMIN))
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    )

    const queryClient = createTestQueryClient()
    const detailQuery = articleQueries.bySlug(ARTICLE.slug, ADMIN.id)
    const listQuery = articleQueries.list({ category: ARTICLE.category }, null)
    queryClient.setQueryDefaults(detailQuery.queryKey, {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    })
    queryClient.setQueryData(detailQuery.queryKey, ARTICLE)
    queryClient.setQueryDefaults(listQuery.queryKey, {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    })
    queryClient.setQueryData(listQuery.queryKey, { items: [ARTICLE], total: 1 })

    const rootRoute = createRootRoute({ component: Outlet })
    const detailRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/blog/$category/$slug',
      loader: () => queryClient.ensureQueryData(detailQuery).catch(notFoundOn404),
      component: () => <BlogArticlePage slug={ARTICLE.slug} />,
      notFoundComponent: () => <h1>Article introuvable</h1>,
    })
    const listRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/blog/$category',
      loader: async () => {
        await listLoader
        return queryClient.ensureQueryData(listQuery)
      },
      component: () => {
        const { data } = useSuspenseQuery(listQuery)
        return (
          <>
            <h1>Liste des articles</h1>
            {data.items.map((article) => (
              <p key={article.id}>{article.title}</p>
            ))}
          </>
        )
      },
    })
    const detailPath = `/blog/${ARTICLE.category}/${ARTICLE.slug}`
    const router = createRouter({
      routeTree: rootRoute.addChildren([detailRoute, listRoute]),
      history: createMemoryHistory({ initialEntries: [detailPath] }),
      defaultPendingMs: 200,
    })
    const view = renderWithProviders(<RouterProvider router={router} />, { queryClient })

    try {
      await userEvent.click(await screen.findByRole('button', { name: /supprimer/i }))
      await waitFor(() => expect(router.state.status).toBe('pending'))

      // An early removal rebuilds the still-observed suspense query and reads the deleted article
      expect(deleted).toBe(true)
      expect(screen.getByRole('heading', { name: ARTICLE.title })).toBeVisible()
      expect(queryClient.getQueryCache().find(detailQuery)?.getObserversCount()).toBe(1)
      expect(detailReads).toBe(0)

      releaseListLoader()
      await screen.findByRole('heading', { name: /liste des articles/i })
      await waitFor(() => expect(queryClient.getQueryState(detailQuery.queryKey)).toBeUndefined())
      expect(detailReads).toBe(0)
      expect(queryClient.getQueryState(listQuery.queryKey)?.fetchStatus).toBe('fetching')
      expect(screen.queryByText(ARTICLE.title)).not.toBeInTheDocument()
      expect(queryClient.getQueryData(listQuery.queryKey)).toEqual({ items: [], total: 0 })
      releaseListRequest()
      await waitFor(() => expect(queryClient.isFetching()).toBe(0))

      act(() => router.history.back())
      await screen.findByRole('heading', { name: /article introuvable/i })
      expect(router.state.location.pathname).toBe(detailPath)
      expect(detailReads).toBe(1)
      expect(screen.queryByRole('heading', { name: ARTICLE.title })).not.toBeInTheDocument()
    } finally {
      releaseListLoader()
      releaseListRequest()
      view.unmount()
      queryClient.clear()
    }
  })

  it('keeps the article and its route when deletion fails', async () => {
    server.use(
      http.delete('*/api/articles/:slug', () =>
        HttpResponse.json({ success: false, error: 'article_delete_failed' }, { status: 500 })
      )
    )
    resetTestAuthStore(presentTestSession(ADMIN))
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    )

    const queryClient = createTestQueryClient()
    const detailQuery = articleQueries.bySlug(ARTICLE.slug, ADMIN.id)
    queryClient.setQueryDefaults(detailQuery.queryKey, { staleTime: Number.POSITIVE_INFINITY })
    queryClient.setQueryData(detailQuery.queryKey, ARTICLE)
    const rootRoute = createRootRoute({ component: Outlet })
    const detailRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/blog/$category/$slug',
      component: () => <BlogArticlePage slug={ARTICLE.slug} />,
    })
    const detailPath = `/blog/${ARTICLE.category}/${ARTICLE.slug}`
    const router = createRouter({
      routeTree: rootRoute.addChildren([detailRoute]),
      history: createMemoryHistory({ initialEntries: [detailPath] }),
    })
    const view = renderWithProviders(<RouterProvider router={router} />, { queryClient })

    try {
      await userEvent.click(await screen.findByRole('button', { name: /supprimer/i }))
      await waitFor(() => {
        expect(queryClient.getMutationCache().getAll()[0]?.state.status).toBe('error')
      })
      expect(screen.getByRole('heading', { name: ARTICLE.title })).toBeVisible()
      expect(router.state.location.pathname).toBe(detailPath)
      expect(router.state.status).toBe('idle')
      expect(queryClient.getQueryData(detailQuery.queryKey)).toEqual(ARTICLE)
    } finally {
      view.unmount()
      queryClient.clear()
    }
  })
})
