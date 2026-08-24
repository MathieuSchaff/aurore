import type { FeedOrder, PostTone, ReactableType, ReactionKind, SkinConcern } from '@aurore/shared'

import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiData, api } from '../api'
import { unwrapData } from '../helpers/apiError'
import { productKeys } from './products'
import { profileKeys } from './profile'
import { socialKeys } from './social-keys'

export { invalidateSocialReads, socialKeys } from './social-keys'

// Profiles surfaced by the similarity engine. Type derived from the route
// inference: band only, never a score (zéro-chiffre is a backend invariant).
export type SimilarProfile = ApiData<typeof api.social.similar.$get>['profiles'][number]

function profileDiscoveryOptions(concern: SkinConcern | null) {
  return queryOptions({
    queryKey: concern === null ? socialKeys.similar() : socialKeys.profileSearch(concern),
    queryFn: async () => {
      if (concern === null) {
        return unwrapData(await api.social.similar.$get())
      }
      return unwrapData(await api.social.profiles.search.$get({ query: { concern } }))
    },
    staleTime: 1000 * 60 * 5,
    // Keep the current list while switching between passive and concern search
    placeholderData: keepPreviousData,
  })
}

export const socialQueries = {
  similar: () => profileDiscoveryOptions(null),

  searchByConcern: (concern: SkinConcern) => profileDiscoveryOptions(concern),

  // Deliberate posts from the similar cohort, ordered by recency or similarity.
  // Reactions never affect feed order.
  feed: (params: { tone: PostTone; order: FeedOrder; concern?: SkinConcern }) =>
    queryOptions({
      queryKey: socialKeys.feed(params),
      queryFn: async () => {
        const query = params.concern
          ? { tone: params.tone, order: params.order, concern: params.concern }
          : { tone: params.tone, order: params.order }
        const res = await api.social.feed.$get({ query })
        return unwrapData(res)
      },
      staleTime: 1000 * 60,
      // Keep the current list while switching tone/concern/order, no flash.
      placeholderData: keepPreviousData,
    }),
}

// One feed item: a surface post plus the author's ordinal closeness band.
export type FeedItem = ApiData<typeof api.social.feed.$get>['posts'][number]

// The signed reactor list for one Reactable: who reacted, by kind, plus the
// viewer's own kinds. Never a count.
export type ReactionList = ApiData<typeof api.social.reactions.$get>

export const reactionQueries = {
  list: (reactableType: ReactableType, reactableId: string, userId: string | null) =>
    queryOptions({
      queryKey: socialKeys.reactions(reactableType, reactableId, userId),
      queryFn: async () => {
        const res = await api.social.reactions.$get({ query: { reactableType, reactableId } })
        return unwrapData(res)
      },
      staleTime: 1000 * 60,
    }),
}

// Signed toggle: POST ensures a kind on, DELETE ensures it off; the caller passes
// `on` from the current pressed-state. The mutation returns the fresh signed list,
// so we seed the cache directly instead of refetching.
export function useToggleReaction(
  reactableType: ReactableType,
  reactableId: string,
  userId: string | null
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['social', 'reaction', 'toggle'],
    mutationFn: async (input: { kind: ReactionKind; on: boolean }) => {
      const body = { json: { reactableType, reactableId, kind: input.kind } }
      const res = input.on
        ? await api.social.reactions.$post(body)
        : await api.social.reactions.$delete(body)
      return unwrapData(res)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(socialKeys.reactions(reactableType, reactableId, userId), data)
    },
    meta: { errorMessage: 'Réaction impossible.' },
  })
}

// The product is the implicit anchor, so the caller only supplies content + tone.
// On success, only product/profile post surfaces refresh.
export function useCreatePost(productId: string, slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['social', 'post', 'create'],
    mutationFn: async (input: { content: string; tone: PostTone }) => {
      const res = await api.social.posts.$post({
        json: { content: input.content, tone: input.tone, productId },
      })
      return unwrapData(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.posts(slug) })
      // Broad prefix invalidation: the composer lacks the author's username, so
      // every cached ['profile','posts',*] refetches; only the author's differs.
      queryClient.invalidateQueries({ queryKey: profileKeys.posts() })
    },
    meta: { errorMessage: 'Publication impossible.' },
  })
}
