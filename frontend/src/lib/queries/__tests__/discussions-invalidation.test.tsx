import type { DiscussionThreadWithReplies } from '@aurore/shared'

import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { discussionQueries, useCreateReply, useDeleteReply, useDeleteThread } from '../discussions'

const SLUG = 'creme-x'
const THREAD_ID = 'thread-1'

const { replies, ...listedThread } = {
  id: THREAD_ID,
  productId: 'prod-1',
  ingredientId: null,
  authorId: 'a1',
  authorName: 'lea',
  title: 'Sujet',
  content: 'Contenu',
  replyCount: 0,
  createdAt: '2026-06-25T00:00:00.000Z',
  replies: [] as DiscussionThreadWithReplies['replies'],
} satisfies DiscussionThreadWithReplies

function seedBothSurfaces() {
  const queryClient = createTestQueryClient()
  const threadsKey = discussionQueries.threads('product', SLUG).queryKey
  const threadKey = discussionQueries.thread('product', SLUG, THREAD_ID).queryKey
  // Without an infinite gcTime the seeded entries are collected before the assertion runs
  for (const queryKey of [threadsKey, threadKey]) {
    queryClient.setQueryDefaults(queryKey, { gcTime: Number.POSITIVE_INFINITY })
  }
  queryClient.setQueryData(threadsKey, [listedThread])
  queryClient.setQueryData(threadKey, { ...listedThread, replies })
  return { queryClient, threadsKey, threadKey }
}

describe('reply mutations', () => {
  it('invalidates the thread list too, since it carries replyCount', async () => {
    server.use(
      http.post('*/api/products/:slug/discussions/:threadId/replies', () =>
        HttpResponse.json({ success: true, data: {} }, { status: 201 })
      )
    )
    const { queryClient, threadsKey, threadKey } = seedBothSurfaces()

    const { result } = renderHookWithProviders(() => useCreateReply('product', SLUG, THREAD_ID), {
      queryClient,
    })
    await act(() => result.current.mutateAsync({ content: 'Réponse' }))

    expect(queryClient.getQueryState(threadKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(threadsKey)?.isInvalidated).toBe(true)
  })

  it('invalidates the thread list when a reply is deleted', async () => {
    server.use(
      http.delete(
        '*/api/products/:slug/discussions/:threadId/replies/:replyId',
        () => new HttpResponse(null, { status: 204 })
      )
    )
    const { queryClient, threadsKey, threadKey } = seedBothSurfaces()

    const { result } = renderHookWithProviders(() => useDeleteReply('product', SLUG, THREAD_ID), {
      queryClient,
    })
    await act(() => result.current.mutateAsync('reply-9'))

    expect(queryClient.getQueryState(threadKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(threadsKey)?.isInvalidated).toBe(true)
  })
})

describe('useDeleteThread', () => {
  it('drops the deleted thread instead of leaving a key that can only refetch a 404', async () => {
    server.use(
      http.delete(
        '*/api/products/:slug/discussions/:threadId',
        () => new HttpResponse(null, { status: 204 })
      )
    )
    const { queryClient, threadsKey, threadKey } = seedBothSurfaces()

    const { result } = renderHookWithProviders(
      () => useDeleteThread('product', SLUG, async () => {}),
      { queryClient }
    )
    await act(() => result.current.mutateAsync(THREAD_ID))

    expect(queryClient.getQueryState(threadKey)).toBeUndefined()
    expect(queryClient.getQueryState(threadsKey)?.isInvalidated).toBe(true)
  })
})
