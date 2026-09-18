import { vi } from 'vitest'

vi.unmock('@tanstack/react-router')

import type { DiscussionThread, DiscussionThreadWithReplies } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from '@tanstack/react-router'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { Button } from '@/component/Button/Button'
import { discussionQueries, useDeleteThread } from '@/lib/queries/discussions'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

const SLUG = 'creme-x'
const THREAD_ID = 'thread-1'

const thread = {
  id: THREAD_ID,
  productId: 'prod-1',
  ingredientId: null,
  authorId: 'a1',
  authorName: 'lea',
  title: 'Sujet',
  content: 'Contenu',
  replyCount: 0,
  createdAt: '2026-06-25T00:00:00.000Z',
  replies: [],
} satisfies DiscussionThreadWithReplies

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe('deleting a discussion thread', () => {
  it('keeps deleted detail and list data out of the destination transition', async () => {
    let detailRequestCount = 0
    const listRequest = deferred()
    server.use(
      http.delete(
        '*/api/products/:slug/discussions/:threadId',
        () => new HttpResponse(null, { status: 204 })
      ),
      http.get('*/api/products/:slug/discussions/:threadId', () => {
        detailRequestCount += 1
        return HttpResponse.json({ success: false, error: 'thread_not_found' }, { status: 404 })
      }),
      http.get('*/api/products/:slug/discussions', async () => {
        await listRequest.promise
        return HttpResponse.json({ success: true, data: [] })
      })
    )

    const listLoader = deferred()
    const queryClient = createTestQueryClient()
    const threadKey = discussionQueries.thread('product', SLUG, THREAD_ID).queryKey
    queryClient.setQueryDefaults(threadKey, {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    })
    queryClient.setQueryData(threadKey, thread)
    const threadsKey = discussionQueries.threads('product', SLUG).queryKey
    queryClient.setQueryDefaults(threadsKey, {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    })
    const { replies: _replies, ...listedThread } = thread
    queryClient.setQueryData<DiscussionThread[]>(threadsKey, [listedThread])

    const rootRoute = createRootRoute({ component: Outlet })
    const detailRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/products/$slug/discussions/$threadId',
      component: () => {
        const navigate = useNavigate()
        const { data } = useSuspenseQuery(discussionQueries.thread('product', SLUG, THREAD_ID))
        const deleteThread = useDeleteThread('product', SLUG, () =>
          navigate({
            to: '/products/$slug/discussions',
            params: { slug: SLUG },
          })
        )
        return (
          <Button type="button" onClick={() => deleteThread.mutate(data.id)}>
            Supprimer la discussion
          </Button>
        )
      },
    })
    const listRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/products/$slug/discussions',
      loader: () => listLoader.promise,
      component: () => {
        const { data } = useSuspenseQuery(discussionQueries.threads('product', SLUG))
        return (
          <>
            <p>Liste des discussions</p>
            {data.map((item) => (
              <p key={item.id}>{item.title}</p>
            ))}
          </>
        )
      },
    })
    const router = createRouter({
      routeTree: rootRoute.addChildren([detailRoute, listRoute]),
      history: createMemoryHistory({
        initialEntries: [`/products/${SLUG}/discussions/${THREAD_ID}`],
      }),
      defaultPendingMs: 200,
    })

    renderWithProviders(<RouterProvider router={router} />, { queryClient })
    await screen.findByRole('button', { name: /supprimer.*discussion/i })

    try {
      await userEvent.click(screen.getByRole('button', { name: /supprimer.*discussion/i }))
      await waitFor(() => expect(router.state.status).toBe('pending'))

      // Removing the observed detail before Router commits the list rebuilds the key
      // and fetches the deleted thread while the destination loader is pending
      expect(queryClient.isMutating()).toBe(1)
      expect(detailRequestCount).toBe(0)
    } finally {
      listLoader.resolve()
    }

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(`/products/${SLUG}/discussions`)
    })
    try {
      expect(screen.queryByText(thread.title)).not.toBeInTheDocument()
    } finally {
      listRequest.resolve()
    }
    await waitFor(() => expect(queryClient.isMutating()).toBe(0))
    expect(detailRequestCount).toBe(0)
    expect(queryClient.getQueryState(threadKey)).toBeUndefined()
  })
})
