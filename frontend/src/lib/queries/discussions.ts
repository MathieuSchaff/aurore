import type { DiscussionThread } from '@aurore/shared'

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

// The list key prefixes each thread key
// One invalidation refreshes both reply counts and the open thread
function invalidateEntityDiscussions(
  queryClient: QueryClient,
  entityType: DiscussionEntityType,
  slug: string
) {
  return queryClient.invalidateQueries({ queryKey: discussionKeys.threads(entityType, slug) })
}

function pruneThreadList(
  queryClient: QueryClient,
  entityType: DiscussionEntityType,
  slug: string,
  threadId: string
) {
  queryClient.setQueryData<DiscussionThread[]>(
    discussionKeys.threads(entityType, slug),
    (threads) => threads?.filter((thread) => thread.id !== threadId)
  )
}

function invalidateThreadList(
  queryClient: QueryClient,
  entityType: DiscussionEntityType,
  slug: string
) {
  return queryClient.invalidateQueries({
    queryKey: discussionKeys.threads(entityType, slug),
    exact: true,
  })
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

export function useDeleteThread(
  entityType: DiscussionEntityType,
  slug: string,
  leaveThreadPage: () => Promise<void>
) {
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
    onSuccess: async (_data, threadId) => {
      pruneThreadList(queryClient, entityType, slug, threadId)
      await invalidateThreadList(queryClient, entityType, slug)
      await leaveThreadPage()
      queryClient.removeQueries({ queryKey: discussionKeys.thread(entityType, slug, threadId) })
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
