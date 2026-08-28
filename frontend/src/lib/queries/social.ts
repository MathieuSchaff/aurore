import type { FeedOrder, PostTone, ReactableType, ReactionKind, SkinConcern } from '@aurore/shared'

import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiData, api } from '../api'
import { unwrapData } from '../helpers/apiError'
import { productKeys } from './products'

// Profiles surfaced by the similarity engine. Type derived from the route
// inference: band only, never a score (zéro-chiffre is a backend invariant).
export type SimilarProfile = ApiData<typeof api.social.similar.$get>['profiles'][number]

export const socialQueries = {
  similar: () =>
    queryOptions({
      queryKey: ['social', 'similar'],
      queryFn: async () => {
        const res = await api.social.similar.$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 60 * 5,
      // Keep the current list visible while switching concern/passive, no flash.
      placeholderData: keepPreviousData,
    }),

  searchByConcern: (concern: SkinConcern) =>
    queryOptions({
      queryKey: ['social', 'profiles', 'search', concern],
      queryFn: async () => {
        const res = await api.social.profiles.search.$get({ query: { concern } })
        return unwrapData(res)
      },
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData,
    }),

  // Deliberate posts from the similar cohort, ordered by recency or similarity.
  // Reactions never affect feed order.
  feed: (params: { tone: PostTone; order: FeedOrder; concern?: SkinConcern }) =>
    queryOptions({
      queryKey: ['social', 'feed', params] as const,
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

export const reactionKeys = {
  list: (reactableType: ReactableType, reactableId: string) =>
    ['social', 'reactions', reactableType, reactableId] as const,
}

export const reactionQueries = {
  list: (reactableType: ReactableType, reactableId: string) =>
    queryOptions({
      queryKey: reactionKeys.list(reactableType, reactableId),
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
export function useToggleReaction(reactableType: ReactableType, reactableId: string) {
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
      queryClient.setQueryData(reactionKeys.list(reactableType, reactableId), data)
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
      queryClient.invalidateQueries({ queryKey: ['profile', 'posts'] })
    },
    meta: { errorMessage: 'Publication impossible.' },
  })
}
