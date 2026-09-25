import { type Article, type ArticleCategoryCounts, err, ok, type UserPublic } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import { __resetFreshness } from '@/lib/auth/freshness'
import { endSession, installSession, seedClientSession } from '@/lib/auth/session'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { articleQueries, useCreateArticle, useUpdateArticle } from '../articles'

const ADMIN = {
  id: 'admin-1',
  email: 'admin@example.test',
  createdAt: '2026-01-01T00:00:00.000Z',
  emailVerified: true,
  role: 'admin',
  isDemo: false,
} satisfies UserPublic

const DRAFT = {
  id: 'draft-1',
  createdBy: ADMIN.id,
  title: 'Private draft',
  // A draft slug may equal the list-key segment without being a public list
  slug: 'list',
  excerpt: null,
  content: 'Unpublished editorial content',
  category: 'skincare',
  coverImageUrl: null,
  publishedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
} satisfies Article

const PUBLISHED = {
  ...DRAFT,
  id: 'published-1',
  title: 'Published article',
  slug: 'published-article',
  publishedAt: '2026-01-01T00:00:00.000Z',
} satisfies Article

const COUNTS = {
  skincare: 1,
  haircare: 0,
  dental: 0,
  nutrition: 0,
  supplements: 0,
  phytotherapie: 0,
  routines: 0,
  science: 0,
  lifestyle: 0,
} satisfies ArticleCategoryCounts

describe('article session boundary', () => {
  beforeEach(() => {
    __resetFreshness()
    resetTestAuthStore(presentTestSession(ADMIN))
  })

  afterEach(() => {
    __resetFreshness()
    resetTestAuthStore()
  })

  it('fetches private article reads for each viewer and reuses the published list', async () => {
    let detailReads = 0
    let draftListReads = 0
    let publishedListReads = 0
    server.use(
      http.get('*/api/articles/:slug', () => {
        detailReads++
        return HttpResponse.json(ok(DRAFT))
      }),
      http.get('*/api/articles', ({ request }) => {
        if (new URL(request.url).searchParams.get('publishedOnly') === 'false') {
          draftListReads++
          return HttpResponse.json(ok({ items: [DRAFT, PUBLISHED], total: 2 }))
        }
        publishedListReads++
        return HttpResponse.json(ok({ items: [PUBLISHED], total: 1 }))
      })
    )
    const qc = createTestQueryClient()
    qc.setQueryDefaults(['articles'], { gcTime: Number.POSITIVE_INFINITY })
    try {
      await qc.ensureQueryData(articleQueries.bySlug(DRAFT.slug, ADMIN.id))
      await qc.ensureQueryData(articleQueries.list({ publishedOnly: false }, ADMIN.id))
      await qc.ensureQueryData(articleQueries.list({ publishedOnly: true }, ADMIN.id))

      // Keep the cache to verify that the factories isolate viewers without a session purge
      const secondAdmin = { ...ADMIN, id: 'admin-2' }
      resetTestAuthStore(presentTestSession(secondAdmin))
      await qc.ensureQueryData(articleQueries.bySlug(DRAFT.slug, secondAdmin.id))
      await qc.ensureQueryData(articleQueries.list({ publishedOnly: false }, secondAdmin.id))
      await qc.ensureQueryData(articleQueries.list({ publishedOnly: true }, secondAdmin.id))

      expect(detailReads).toBe(2)
      expect(draftListReads).toBe(2)
      expect(publishedListReads).toBe(1)
    } finally {
      qc.clear()
    }
  })

  it.each([
    { mutation: 'create', transition: 'unchanged' },
    { mutation: 'update', transition: 'unchanged' },
    { mutation: 'create', transition: 'demoted' },
    { mutation: 'update', transition: 'demoted' },
    { mutation: 'create', transition: 'replaced' },
    { mutation: 'update', transition: 'replaced' },
  ] as const)(
    'keeps $mutation results in their initiating session after the viewer is $transition',
    async ({ mutation, transition }) => {
      let releaseMutation!: () => void
      let mutationReceived = false
      let detailReads = 0
      let listReads = 0
      let countReads = 0
      const responseGate = new Promise<void>((resolve) => {
        releaseMutation = resolve
      })
      const mutationResponse = async () => {
        mutationReceived = true
        await responseGate
        return HttpResponse.json(ok(DRAFT))
      }
      server.use(
        http.post('*/api/articles', mutationResponse),
        http.patch('*/api/articles/:slug', mutationResponse),
        http.get('*/api/articles/categories', () => {
          countReads++
          return HttpResponse.json(ok(COUNTS))
        }),
        http.get('*/api/articles/:slug', () => {
          detailReads++
          return HttpResponse.json(err('article_not_found'), { status: 404 })
        }),
        http.get('*/api/articles', () => {
          listReads++
          return HttpResponse.json(ok({ items: [PUBLISHED], total: 1 }))
        })
      )
      const qc = createTestQueryClient()
      qc.setQueryDefaults(['articles'], {
        gcTime: Number.POSITIVE_INFINITY,
        staleTime: Number.POSITIVE_INFINITY,
      })
      const originalDetail = articleQueries.bySlug(DRAFT.slug, ADMIN.id)
      if (mutation === 'update') qc.setQueryData(originalDetail.queryKey, DRAFT)
      const hook = renderHookWithProviders(
        () => ({
          create: useCreateArticle(),
          update: useUpdateArticle(),
          published: useQuery(articleQueries.list({ publishedOnly: true }, null)),
          counts: useQuery(articleQueries.categoryCounts()),
        }),
        { queryClient: qc }
      )
      let pendingMutation!: Promise<Article>
      try {
        await waitFor(() => expect(hook.result.current.published.isSuccess).toBe(true))
        await waitFor(() => expect(hook.result.current.counts.isSuccess).toBe(true))
        act(() => {
          pendingMutation =
            mutation === 'create'
              ? hook.result.current.create.mutateAsync({
                  title: DRAFT.title,
                  slug: DRAFT.slug,
                  content: DRAFT.content,
                  category: DRAFT.category,
                })
              : hook.result.current.update.mutateAsync({
                  slug: DRAFT.slug,
                  data: { title: DRAFT.title },
                })
        })
        await waitFor(() => expect(mutationReceived).toBe(true))
        const currentUser =
          transition === 'replaced'
            ? { ...ADMIN, id: 'admin-2' }
            : { ...ADMIN, role: 'user' as const }
        if (transition !== 'unchanged') {
          act(() => installSession(qc, { accessToken: 'next-token', user: currentUser }))
          expect(qc.getQueryData(originalDetail.queryKey)).toBeUndefined()
        }
        await act(async () => {
          releaseMutation()
          await pendingMutation
        })

        if (transition === 'unchanged') {
          expect(await qc.ensureQueryData(originalDetail)).toEqual(DRAFT)
          expect(detailReads).toBe(0)
        } else {
          // A late response used to recreate the purged draft under the current viewer's key
          const currentDetail = articleQueries.bySlug(DRAFT.slug, currentUser.id)
          expect(qc.getQueryData(originalDetail.queryKey)).toBeUndefined()
          expect(qc.getQueryData(currentDetail.queryKey)).toBeUndefined()
          await expect(qc.ensureQueryData(currentDetail)).rejects.toMatchObject({
            code: 'article_not_found',
            status: 404,
          })
          expect(detailReads).toBe(1)
        }
        await waitFor(() => expect(listReads).toBe(2))
        await waitFor(() => expect(countReads).toBe(2))
      } finally {
        releaseMutation()
        hook.unmount()
        qc.clear()
      }
    }
  )

  it.each(['expired', 'probe-failed', 'demoted', 'logout'] as const)(
    'requires an authorized read before reopening a cached draft after %s',
    async (transition) => {
      let canReadDrafts = true
      let detailReads = 0
      server.use(
        http.get('*/api/articles/categories', () => HttpResponse.json(ok(COUNTS))),
        http.get('*/api/articles/:slug', () => {
          detailReads++
          return canReadDrafts
            ? HttpResponse.json(ok(DRAFT))
            : HttpResponse.json(err('article_not_found'), { status: 404 })
        }),
        http.get('*/api/articles', ({ request }) => {
          const publishedOnly = new URL(request.url).searchParams.get('publishedOnly') !== 'false'
          const items = !publishedOnly && canReadDrafts ? [PUBLISHED, DRAFT] : [PUBLISHED]
          return HttpResponse.json(ok({ items, total: items.length }))
        }),
        http.post('*/api/auth/refresh', () =>
          HttpResponse.json(err('unauthorized'), { status: 401 })
        )
      )
      const qc = createTestQueryClient()
      qc.setQueryDefaults(['articles'], { gcTime: Number.POSITIVE_INFINITY })
      const detail = articleQueries.bySlug(DRAFT.slug, ADMIN.id)
      const drafts = articleQueries.list({ publishedOnly: false }, ADMIN.id)
      const published = articleQueries.list({ publishedOnly: true }, null)
      const counts = articleQueries.categoryCounts()

      try {
        await qc.fetchQuery(detail)
        await qc.fetchQuery(drafts)
        const publicList = await qc.fetchQuery(published)
        await qc.fetchQuery(counts)
        canReadDrafts = false

        if (transition === 'demoted') {
          installSession(qc, { accessToken: 'user-token', user: { ...ADMIN, role: 'user' } })
        } else if (transition === 'probe-failed') {
          qc.setQueryData(['boot', 'session'], { status: 'authenticated', user: ADMIN })
          seedClientSession(qc)
          await awaitBootRefresh(qc)
        } else {
          endSession(qc, transition)
        }

        // The public loader uses ensureQueryData, which would reuse even a stale draft
        expect(qc.getQueryData(detail.queryKey)).toBeUndefined()
        expect(qc.getQueryData(drafts.queryKey)).toBeUndefined()
        if (transition !== 'logout') {
          expect(qc.getQueryData(published.queryKey)).toEqual(publicList)
          expect(qc.getQueryData(counts.queryKey)).toEqual(COUNTS)
        }
        await expect(qc.ensureQueryData(detail)).rejects.toMatchObject({
          code: 'article_not_found',
          status: 404,
        })
        expect(detailReads).toBe(2)
        expect(await qc.ensureQueryData(drafts)).toEqual({ items: [PUBLISHED], total: 1 })
      } finally {
        qc.clear()
      }
    }
  )
})
