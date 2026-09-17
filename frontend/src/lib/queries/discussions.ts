import { type QueryClient, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'

export type DiscussionEntityType = 'product' | 'ingredient'

const discussionKeys = {
  all: ['discussions'] as const,
  threads: (entityType: DiscussionEntityType, slug: string) =>
    [...discussionKeys.all, entityType, slug] as const,
  thread: (entityType: DiscussionEntityType, slug: string, threadId: string) =>
    [...discussionKeys.threads(entityType, slug), threadId] as const,
}

export function invalidateDiscussionReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: discussionKeys.all })
}

// Every discussion write converges here. The list key is the prefix of every thread key
// under it, so one invalidation refreshes the open thread and the replyCount its row shows
function invalidateEntityDiscussions(
  queryClient: QueryClient,
  entityType: DiscussionEntityType,
  slug: string
) {
  return queryClient.invalidateQueries({ queryKey: discussionKeys.threads(entityType, slug) })
}

export const discussionQueries = {
  threads: (entityType: DiscussionEntityType, slug: string) =>
    queryOptions({
      queryKey: discussionKeys.threads(entityType, slug),
      queryFn: async () => {
        const res =
          entityType === 'product'
            ? await api.products[':slug'].discussions.$get({ param: { slug } })
            : await api.ingredients[':slug'].discussions.$get({ param: { slug } })
        return unwrapData(res)
      },
    }),

  thread: (entityType: DiscussionEntityType, slug: string, threadId: string) =>
    queryOptions({
      queryKey: discussionKeys.thread(entityType, slug, threadId),
      queryFn: async () => {
        const res =
          entityType === 'product'
            ? await api.products[':slug'].discussions[':threadId'].$get({
                param: { slug, threadId },
              })
            : await api.ingredients[':slug'].discussions[':threadId'].$get({
                param: { slug, threadId },
              })
        return unwrapData(res)
      },
    }),
}

export function useCreateThread(entityType: DiscussionEntityType, slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['discussions', 'thread', 'create'],
    mutationFn: async (input: { title: string; content: string }) => {
      const res =
        entityType === 'product'
          ? await api.products[':slug'].discussions.$post({ param: { slug }, json: input })
          : await api.ingredients[':slug'].discussions.$post({ param: { slug }, json: input })
      return unwrapData(res)
    },
    onSuccess: () => {
      invalidateEntityDiscussions(queryClient, entityType, slug)
    },
    meta: { errorMessage: 'Création de la discussion impossible.' },
  })
}

export function useCreateReply(entityType: DiscussionEntityType, slug: string, threadId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['discussions', 'reply', 'create'],
    mutationFn: async (input: { content: string }) => {
      const res =
        entityType === 'product'
          ? await api.products[':slug'].discussions[':threadId'].replies.$post({
              param: { slug, threadId },
              json: input,
            })
          : await api.ingredients[':slug'].discussions[':threadId'].replies.$post({
              param: { slug, threadId },
              json: input,
            })
      return unwrapData(res)
    },
    onSuccess: () => {
      invalidateEntityDiscussions(queryClient, entityType, slug)
    },
    meta: { errorMessage: 'Envoi de la réponse impossible.' },
  })
}

export function useDeleteThread(entityType: DiscussionEntityType, slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['discussions', 'thread', 'delete'],
    mutationFn: async (threadId: string) => {
      const res =
        entityType === 'product'
          ? await api.products[':slug'].discussions[':threadId'].$delete({
              param: { slug, threadId },
            })
          : await api.ingredients[':slug'].discussions[':threadId'].$delete({
              param: { slug, threadId },
            })
      await throwIfNotOk(res)
    },
    onSuccess: (_data, threadId) => {
      // Drop the thread rather than invalidate it: the only refetch left for it is a 404
      // The caller must leave the thread page in its own onSuccess. A page still mounted
      // rebuilds this key on the next render and fetches that 404
      queryClient.removeQueries({ queryKey: discussionKeys.thread(entityType, slug, threadId) })
      invalidateEntityDiscussions(queryClient, entityType, slug)
    },
    meta: { errorMessage: 'Suppression de la discussion impossible.' },
  })
}

export function useDeleteReply(entityType: DiscussionEntityType, slug: string, threadId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['discussions', 'reply', 'delete'],
    mutationFn: async (replyId: string) => {
      const res =
        entityType === 'product'
          ? await api.products[':slug'].discussions[':threadId'].replies[':replyId'].$delete({
              param: { slug, threadId, replyId },
            })
          : await api.ingredients[':slug'].discussions[':threadId'].replies[':replyId'].$delete({
              param: { slug, threadId, replyId },
            })
      await throwIfNotOk(res)
    },
    onSuccess: () => {
      invalidateEntityDiscussions(queryClient, entityType, slug)
    },
    meta: { errorMessage: 'Suppression de la réponse impossible.' },
  })
}
