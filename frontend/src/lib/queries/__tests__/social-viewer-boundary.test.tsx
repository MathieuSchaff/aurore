import { useQuery } from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { renderHookWithProviders } from '@/test/utils'
import { socialQueries } from '../social'

it('does not reuse the previous reader cohort while loading another reader', async () => {
  const release = Promise.withResolvers<void>()
  let blocked = false
  const reads = { similar: 0, search: 0, feed: 0 }
  server.use(
    http.get('*/api/social/similar', async () => {
      reads.similar++
      if (blocked) await release.promise
      return HttpResponse.json({ success: true, data: { profiles: [] } })
    }),
    http.get('*/api/social/profiles/search', async () => {
      reads.search++
      if (blocked) await release.promise
      return HttpResponse.json({ success: true, data: { profiles: [] } })
    }),
    http.get('*/api/social/feed', async () => {
      reads.feed++
      if (blocked) await release.promise
      return HttpResponse.json({ success: true, data: { posts: [] } })
    })
  )
  const { result, rerender } = renderHookWithProviders(
    ({ userId }) => [
      useQuery(socialQueries.similar(userId)),
      useQuery(socialQueries.searchByConcern('anti-acne', userId)),
      useQuery(socialQueries.feed({ tone: 'principal', order: 'recency' }, userId)),
    ],
    { initialProps: { userId: 'first-reader' } }
  )
  await waitFor(() => expect(result.current.every((query) => query.isSuccess)).toBe(true))
  blocked = true
  try {
    rerender({ userId: 'next-reader' })
    await waitFor(() => expect(reads).toEqual({ similar: 2, search: 2, feed: 2 }))
    expect(result.current.every((query) => query.isPending && query.data === undefined)).toBe(true)
  } finally {
    release.resolve()
  }
  await waitFor(() => expect(result.current.every((query) => query.isSuccess)).toBe(true))
})
