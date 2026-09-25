import {
  type DiscussionThread,
  type DiscussionThreadWithReplies,
  ok,
  type PrivacySettings,
  type ProfilePublic,
  type PublicProductPostsResponse,
  type PublicProductReviewsResponse,
  type SkinType,
  type UserDermoProfile,
} from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { discussionQueries } from '../discussions'
import { productQueries } from '../products'
import {
  profileKeys,
  useUpdateDermoProfile,
  useUpdatePrivacySettings,
  useUpdateProfile,
} from '../profile'
import { socialKeys } from '../social-keys'

function seedProfileDependentReads() {
  const queryClient = createTestQueryClient()
  const publicProfileKey = profileKeys.publicProfiles()
  const socialKey = socialKeys.similar('viewer')

  for (const queryKey of [publicProfileKey, socialKey]) {
    queryClient.setQueryDefaults(queryKey, { gcTime: Number.POSITIVE_INFINITY })
  }
  queryClient.setQueryData(publicProfileKey, { username: 'viewer' })
  queryClient.setQueryData(socialKey, { profiles: [] })

  return { publicProfileKey, queryClient, socialKey }
}

function expectProfileDependentReadsInvalidated(
  queryClient: ReturnType<typeof createTestQueryClient>,
  publicProfileKey: ReturnType<typeof profileKeys.publicProfiles>,
  socialKey: ReturnType<typeof socialKeys.similar>
) {
  expect(queryClient.getQueryState(publicProfileKey)?.isInvalidated).toBe(true)
  expect(queryClient.getQueryState(socialKey)?.isInvalidated).toBe(true)
}

describe('profile mutation invalidation', () => {
  it.each(['identity', 'dermo', 'privacy'] as const)(
    'refreshes every author projection after updating %s',
    async (kind) => {
      const userId = '11111111-1111-4111-8111-111111111111'
      const contentId = '22222222-2222-4222-8222-222222222222'
      const createdAt = '2026-09-15T12:00:00.000Z'
      let username = 'viewer'
      let skinTypes: SkinType[] = ['peau-seche']
      const privacy: PrivacySettings = {
        profilePublic: true,
        bioPublic: false,
        avatarPublic: false,
        linksPublic: false,
        skinTypesPublic: true,
        fitzpatrickPublic: false,
        skinConcernsPublic: false,
        discoverable: false,
        aiConsent: false,
      }
      const reads = {
        reviews: 0,
        posts: 0,
        productsList: 0,
        productsThread: 0,
        ingredientsList: 0,
        ingredientsThread: 0,
      }
      const thread = (entity: 'products' | 'ingredients'): DiscussionThread => ({
        id: contentId,
        productId: entity === 'products' ? contentId : null,
        ingredientId: entity === 'ingredients' ? contentId : null,
        authorId: userId,
        authorName: username,
        title: 'Expérience partagée',
        content: 'Mon expérience',
        replyCount: 1,
        createdAt,
      })

      server.use(
        http.patch('*/api/profile', () => {
          username = 'renamed-viewer'
          return HttpResponse.json(ok({ userId, username, links: [] } satisfies ProfilePublic))
        }),
        http.patch('*/api/profile/dermo', () => {
          skinTypes = ['peau-grasse']
          return HttpResponse.json(
            ok({
              userId,
              skinTypes,
              fitzpatrickType: null,
              skinConcerns: [],
              privateNotes: null,
              createdAt,
              updatedAt: createdAt,
            } satisfies UserDermoProfile)
          )
        }),
        http.patch('*/api/profile/privacy-settings', () => {
          privacy.skinTypesPublic = false
          return HttpResponse.json(ok(privacy))
        }),
        http.get('*/api/products/:slug/reviews/public', () => {
          reads.reviews++
          return HttpResponse.json(
            ok({
              reviews: [
                {
                  id: contentId,
                  tolerance: null,
                  efficacy: null,
                  sensoriality: null,
                  stability: null,
                  mixability: null,
                  valueForMoney: null,
                  comment: 'Mon avis',
                  createdAt,
                  reviewer: {
                    username,
                    profilePublic: true,
                    skinTypes: privacy.skinTypesPublic ? skinTypes : null,
                    fitzpatrickType: null,
                  },
                },
              ],
            } satisfies PublicProductReviewsResponse)
          )
        }),
        http.get('*/api/products/:slug/posts', () => {
          reads.posts++
          return HttpResponse.json(
            ok({
              posts: [
                {
                  id: contentId,
                  content: 'Mon expérience',
                  tone: 'principal',
                  concernSlug: null,
                  productAnchor: { slug: 'cream', name: 'Crème' },
                  ingredientAnchor: null,
                  createdAt,
                  author: { username, profilePublic: true },
                },
              ],
            } satisfies PublicProductPostsResponse)
          )
        }),
        ...(['products', 'ingredients'] as const).flatMap((entity) => [
          http.get(`*/api/${entity}/:slug/discussions`, () => {
            reads[`${entity}List`]++
            return HttpResponse.json(ok([thread(entity)]))
          }),
          http.get(`*/api/${entity}/:slug/discussions/:threadId`, () => {
            reads[`${entity}Thread`]++
            return HttpResponse.json(
              ok({
                ...thread(entity),
                replies: [
                  {
                    id: contentId,
                    threadId: contentId,
                    authorId: userId,
                    authorName: username,
                    content: 'Ma réponse',
                    createdAt,
                  },
                ],
              } satisfies DiscussionThreadWithReplies)
            )
          }),
        ])
      )
      const queryClient = createTestQueryClient()
      queryClient.setDefaultOptions({ queries: { retry: false, staleTime: 60_000 } })
      const { result, unmount } = renderHookWithProviders(
        () => ({
          reviews: useQuery(productQueries.publicReviews('cream')),
          posts: useQuery(productQueries.posts('cream')),
          productThreads: useQuery(discussionQueries.threads('product', 'cream')),
          productThread: useQuery(discussionQueries.thread('product', 'cream', contentId)),
          ingredientThreads: useQuery(discussionQueries.threads('ingredient', 'glycerin')),
          ingredientThread: useQuery(discussionQueries.thread('ingredient', 'glycerin', contentId)),
          identity: useUpdateProfile(),
          dermo: useUpdateDermoProfile(),
          privacy: useUpdatePrivacySettings(),
        }),
        { queryClient }
      )

      try {
        await waitFor(() => {
          expect(result.current.reviews.data?.reviews[0]?.reviewer.skinTypes).toEqual([
            'peau-seche',
          ])
          expect(result.current.productThread.data?.replies[0]?.authorName).toBe('viewer')
          expect(result.current.ingredientThread.data?.replies[0]?.authorName).toBe('viewer')
          expect(Object.values(reads)).toEqual([1, 1, 1, 1, 1, 1])
          expect(queryClient.isFetching()).toBe(0)
        })

        await act(async () => {
          if (kind === 'identity')
            await result.current.identity.mutateAsync({ username: 'renamed-viewer' })
          if (kind === 'dermo')
            await result.current.dermo.mutateAsync({ skinTypes: ['peau-grasse'] })
          if (kind === 'privacy')
            await result.current.privacy.mutateAsync({ skinTypesPublic: false })
        })

        // Fresh author rows used to survive these mutations until their staleTime elapsed.
        await waitFor(() => {
          expect(Object.values(reads)).toEqual([2, 2, 2, 2, 2, 2])
          const expectedName = kind === 'identity' ? 'renamed-viewer' : 'viewer'
          expect(result.current.reviews.data?.reviews[0]?.reviewer).toMatchObject({
            username: expectedName,
            skinTypes:
              kind === 'privacy' ? null : kind === 'dermo' ? ['peau-grasse'] : ['peau-seche'],
          })
          expect(result.current.posts.data?.posts[0]?.author.username).toBe(expectedName)
          expect(result.current.productThreads.data?.[0]?.authorName).toBe(expectedName)
          expect(result.current.productThread.data?.replies[0]?.authorName).toBe(expectedName)
          expect(result.current.ingredientThreads.data?.[0]?.authorName).toBe(expectedName)
          expect(result.current.ingredientThread.data?.replies[0]?.authorName).toBe(expectedName)
        })
      } finally {
        unmount()
        queryClient.clear()
      }
    }
  )

  it('invalidates public and social reads after updating the profile', async () => {
    server.use(
      http.patch('*/api/profile', () =>
        HttpResponse.json({ success: true, data: { username: 'viewer', bio: 'Nouveau texte' } })
      )
    )
    const { publicProfileKey, queryClient, socialKey } = seedProfileDependentReads()
    const { result } = renderHookWithProviders(() => useUpdateProfile(), { queryClient })

    await act(() => result.current.mutateAsync({ bio: 'Nouveau texte' }))

    expectProfileDependentReadsInvalidated(queryClient, publicProfileKey, socialKey)
  })

  it('invalidates public and social reads after updating the dermo profile', async () => {
    server.use(
      http.patch('*/api/profile/dermo', () =>
        HttpResponse.json({ success: true, data: { skinTypes: [] } })
      )
    )
    const { publicProfileKey, queryClient, socialKey } = seedProfileDependentReads()
    const { result } = renderHookWithProviders(() => useUpdateDermoProfile(), { queryClient })

    await act(() => result.current.mutateAsync({ skinTypes: [] }))

    expectProfileDependentReadsInvalidated(queryClient, publicProfileKey, socialKey)
  })

  it('invalidates public and social reads after updating privacy', async () => {
    server.use(
      http.patch('*/api/profile/privacy-settings', () =>
        HttpResponse.json({ success: true, data: { profilePublic: true } })
      )
    )
    const { publicProfileKey, queryClient, socialKey } = seedProfileDependentReads()
    const { result } = renderHookWithProviders(() => useUpdatePrivacySettings(), { queryClient })

    await act(() => result.current.mutateAsync({ profilePublic: true }))

    expectProfileDependentReadsInvalidated(queryClient, publicProfileKey, socialKey)
  })
})
