import type {
  AdminDashboard,
  AdminUserAccount,
  ApiSuccess,
  DiscussionThread,
  ListUsersResponse,
  ModerateProfileResult,
  PublicProductPostsResponse,
  PublicProductReviewsResponse,
  PublicProfilePostsResponse,
  PublicProfileReviewsResponse,
  PublicProfileView,
  ReactionListView,
  SocialFeedResponse,
  UpdateRoleResult,
} from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { adminQueries, useDemoteToUser, useModerateProfileVisibility } from '../admin'
import { discussionQueries } from '../discussions'
import { productQueries } from '../products'
import { profileQueries } from '../profile'
import { reactionQueries, socialQueries } from '../social'

const USER_ID = '11111111-1111-4111-8111-111111111111'
const USERNAME = 'target-user'
const PRODUCT_SLUG = 'target-product'
const REACTABLE_ID = '22222222-2222-4222-8222-222222222222'

const ACCOUNT = {
  id: USER_ID,
  email: 'target@seed.local',
  role: 'user',
  emailVerifiedAt: '2026-08-20T10:00:00.000Z',
  createdAt: '2026-08-20T09:00:00.000Z',
  forcedPrivateByAdmin: false,
} satisfies AdminUserAccount

const DASHBOARD = {
  openReports: 0,
  activeBans: 0,
  hiddenReviews: 0,
  hiddenThreads: 0,
  hiddenReplies: 0,
  forcedPrivateProfiles: 0,
  pendingRoleRequests: 0,
} satisfies AdminDashboard

const PUBLIC_PROFILE = {
  username: USERNAME,
  bio: null,
  avatarUrl: null,
  links: null,
  skinTypes: null,
  fitzpatrickType: null,
  skinConcerns: null,
} satisfies PublicProfileView

const EMPTY_PROFILE_REVIEWS = { reviews: [] } satisfies PublicProfileReviewsResponse
const EMPTY_PROFILE_POSTS = { posts: [] } satisfies PublicProfilePostsResponse
const EMPTY_PRODUCT_REVIEWS = { reviews: [] } satisfies PublicProductReviewsResponse
const EMPTY_PRODUCT_POSTS = { posts: [] } satisfies PublicProductPostsResponse
const EMPTY_DISCUSSIONS = [] satisfies DiscussionThread[]
const EMPTY_SIMILAR = { profiles: [] } satisfies ApiData<typeof api.social.similar.$get>
const EMPTY_SEARCH = { profiles: [] } satisfies ApiData<typeof api.social.profiles.search.$get>
const EMPTY_FEED = { posts: [] } satisfies SocialFeedResponse
const EMPTY_REACTIONS = {
  reactableType: 'post',
  reactableId: REACTABLE_ID,
  reactions: { merci: [], 'moi-aussi': [], soutien: [] },
  viewerKinds: [],
} satisfies ReactionListView

type ReadCounters = {
  directory: number
  detail: number
  dashboard: number
  publicProfile: number
  profileReviews: number
  profilePosts: number
  productReviews: number
  productPosts: number
  discussions: number
  similar: number
  search: number
  feed: number
  reactions: number
}

function expectEveryRead(counters: ReadCounters, count: number) {
  expect(counters).toEqual({
    directory: count,
    detail: count,
    dashboard: count,
    publicProfile: count,
    profileReviews: count,
    profilePosts: count,
    productReviews: count,
    productPosts: count,
    discussions: count,
    similar: count,
    search: count,
    feed: count,
    reactions: count,
  })
}

describe('admin user account query convergence', () => {
  it('declares the locally rendered profile visibility error without a global toast', async () => {
    server.use(
      http.patch('*/api/admin/moderation/profiles/:userId/visibility', () =>
        HttpResponse.json({
          success: true,
          data: {
            userId: USER_ID,
            forcedPrivateByAdmin: true,
            forcedPrivateReason: null,
          },
        } satisfies ModerateProfileResult)
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useModerateProfileVisibility(USER_ID), {
      queryClient,
    })

    await act(() => result.current.mutateAsync({ forcedPrivate: true }))

    const mutation = queryClient.getMutationCache().find({
      mutationKey: ['admin', 'profile-visibility', 'update'],
    })
    expect(mutation?.meta?.handledErrorCodes).toEqual(['not_found'])
    expect(mutation?.meta?.errorMessage).toBeUndefined()
  })

  it('declares every locally rendered demotion error without a global toast', async () => {
    server.use(
      http.patch('*/api/admin/users/:id/role', () =>
        HttpResponse.json({
          success: true,
          data: { id: USER_ID, role: 'user' },
        } satisfies UpdateRoleResult)
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useDemoteToUser(USER_ID), { queryClient })

    await act(() => result.current.mutateAsync({ role: 'user' }))

    const mutation = queryClient.getMutationCache().find({
      mutationKey: ['admin', 'user-role', 'demote'],
    })
    expect(mutation?.meta?.handledErrorCodes).toEqual([
      'cannot_self_demote',
      'not_a_contributor',
      'not_found',
    ])
    expect(mutation?.meta?.errorMessage).toBeUndefined()
  })

  it('refetches the admin directory and detail after demotion without touching the dashboard', async () => {
    const counters = { directory: 0, detail: 0, dashboard: 0 }
    const account: AdminUserAccount = { ...ACCOUNT, role: 'contributor' }
    server.use(
      http.get('*/api/admin/users', () => {
        counters.directory += 1
        return HttpResponse.json({
          success: true,
          data: { items: [account] },
        } satisfies ApiSuccess<ListUsersResponse>)
      }),
      http.get('*/api/admin/users/:id', () => {
        counters.detail += 1
        return HttpResponse.json({
          success: true,
          data: account,
        } satisfies ApiSuccess<AdminUserAccount>)
      }),
      http.get('*/api/admin/dashboard', () => {
        counters.dashboard += 1
        return HttpResponse.json({
          success: true,
          data: DASHBOARD,
        } satisfies ApiSuccess<AdminDashboard>)
      }),
      http.patch('*/api/admin/users/:id/role', () => {
        account.role = 'user'
        return HttpResponse.json({
          success: true,
          data: { id: USER_ID, role: 'user' },
        } satisfies UpdateRoleResult)
      })
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        directory: useQuery(adminQueries.users()),
        detail: useQuery(adminQueries.user(USER_ID)),
        dashboard: useQuery(adminQueries.dashboard()),
        demote: useDemoteToUser(USER_ID),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.dashboard.isSuccess).toBe(true)
      expect(counters).toEqual({ directory: 1, detail: 1, dashboard: 1 })
    })

    await act(() => result.current.demote.mutateAsync({ role: 'user' }))

    await waitFor(() => {
      expect(counters).toEqual({ directory: 2, detail: 2, dashboard: 1 })
      expect(result.current.detail.data?.role).toBe('user')
    })
  })

  it('refetches every mounted public identity surface after forcing a profile private', async () => {
    const counters: ReadCounters = {
      directory: 0,
      detail: 0,
      dashboard: 0,
      publicProfile: 0,
      profileReviews: 0,
      profilePosts: 0,
      productReviews: 0,
      productPosts: 0,
      discussions: 0,
      similar: 0,
      search: 0,
      feed: 0,
      reactions: 0,
    }
    const account: AdminUserAccount = { ...ACCOUNT }

    server.use(
      http.get('*/api/admin/users', () => {
        counters.directory += 1
        const data = { items: [account] } satisfies ListUsersResponse
        return HttpResponse.json({ success: true, data } satisfies ApiSuccess<ListUsersResponse>)
      }),
      http.get('*/api/admin/users/:id', () => {
        counters.detail += 1
        return HttpResponse.json({
          success: true,
          data: account,
        } satisfies ApiSuccess<AdminUserAccount>)
      }),
      http.get('*/api/admin/dashboard', () => {
        counters.dashboard += 1
        return HttpResponse.json({
          success: true,
          data: DASHBOARD,
        } satisfies ApiSuccess<AdminDashboard>)
      }),
      http.get('*/api/profiles/:username/public', () => {
        counters.publicProfile += 1
        return HttpResponse.json({
          success: true,
          data: PUBLIC_PROFILE,
        } satisfies ApiSuccess<PublicProfileView>)
      }),
      http.get('*/api/profiles/:username/reviews', () => {
        counters.profileReviews += 1
        return HttpResponse.json({
          success: true,
          data: EMPTY_PROFILE_REVIEWS,
        } satisfies ApiSuccess<PublicProfileReviewsResponse>)
      }),
      http.get('*/api/profiles/:username/posts', () => {
        counters.profilePosts += 1
        return HttpResponse.json({
          success: true,
          data: EMPTY_PROFILE_POSTS,
        } satisfies ApiSuccess<PublicProfilePostsResponse>)
      }),
      http.get('*/api/products/:slug/reviews/public', () => {
        counters.productReviews += 1
        return HttpResponse.json({
          success: true,
          data: EMPTY_PRODUCT_REVIEWS,
        } satisfies ApiSuccess<PublicProductReviewsResponse>)
      }),
      http.get('*/api/products/:slug/posts', () => {
        counters.productPosts += 1
        return HttpResponse.json({
          success: true,
          data: EMPTY_PRODUCT_POSTS,
        } satisfies ApiSuccess<PublicProductPostsResponse>)
      }),
      http.get('*/api/products/:slug/discussions', () => {
        counters.discussions += 1
        return HttpResponse.json({ success: true, data: EMPTY_DISCUSSIONS } satisfies ApiSuccess<
          DiscussionThread[]
        >)
      }),
      http.get('*/api/social/similar', () => {
        counters.similar += 1
        return HttpResponse.json({ success: true, data: EMPTY_SIMILAR })
      }),
      http.get('*/api/social/profiles/search', () => {
        counters.search += 1
        return HttpResponse.json({ success: true, data: EMPTY_SEARCH })
      }),
      http.get('*/api/social/feed', () => {
        counters.feed += 1
        return HttpResponse.json({
          success: true,
          data: EMPTY_FEED,
        } satisfies ApiSuccess<SocialFeedResponse>)
      }),
      http.get('*/api/social/reactions', () => {
        counters.reactions += 1
        return HttpResponse.json({
          success: true,
          data: EMPTY_REACTIONS,
        } satisfies ApiSuccess<ReactionListView>)
      }),
      http.patch('*/api/admin/moderation/profiles/:userId/visibility', () => {
        account.forcedPrivateByAdmin = true
        const response = {
          success: true,
          data: {
            userId: USER_ID,
            forcedPrivateByAdmin: true,
            forcedPrivateReason: null,
          },
        } satisfies ModerateProfileResult
        return HttpResponse.json(response)
      })
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        directory: useQuery(adminQueries.users()),
        detail: useQuery(adminQueries.user(USER_ID)),
        dashboard: useQuery(adminQueries.dashboard()),
        publicProfile: useQuery(profileQueries.publicByUsername(USERNAME)),
        profileReviews: useQuery(profileQueries.reviewsByUsername(USERNAME)),
        profilePosts: useQuery(profileQueries.postsByUsername(USERNAME)),
        productReviews: useQuery(productQueries.publicReviews(PRODUCT_SLUG)),
        productPosts: useQuery(productQueries.posts(PRODUCT_SLUG)),
        discussions: useQuery(discussionQueries.threads('product', PRODUCT_SLUG)),
        similar: useQuery(socialQueries.similar()),
        search: useQuery(socialQueries.searchByConcern('anti-acne')),
        feed: useQuery(socialQueries.feed({ tone: 'principal', order: 'recency' })),
        reactions: useQuery(reactionQueries.list('post', REACTABLE_ID, null)),
        moderateProfile: useModerateProfileVisibility(USER_ID),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.reactions.isSuccess).toBe(true)
    })
    expectEveryRead(counters, 1)

    await act(() => result.current.moderateProfile.mutateAsync({ forcedPrivate: true }))

    await waitFor(() => expectEveryRead(counters, 2))
  })
})
