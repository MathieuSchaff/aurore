import { type QueryClient, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'

type EntityType = 'product' | 'ingredient'

const discussionKeys = {
  all: ['discussions'] as const,
  threads: (entityType: EntityType, slug: string) =>
    [...discussionKeys.all, entityType, slug] as const,
  thread: (entityType: EntityType, slug: string, threadId: string) =>
    [...discussionKeys.threads(entityType, slug), threadId] as const,
}

export function invalidateDiscussionReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: discussionKeys.all })
}

export const discussionQueries = {
  threads: (entityType: EntityType, slug: string) =>
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

  thread: (entityType: EntityType, slug: string, threadId: string) =>
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

export function useCreateThread(entityType: EntityType, slug: string) {
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
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads(entityType, slug) })
    },
    meta: { errorMessage: 'Création de la discussion impossible.' },
  })
}

export function useCreateReply(entityType: EntityType, slug: string, threadId: string) {
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
      queryClient.invalidateQueries({ queryKey: discussionKeys.thread(entityType, slug, threadId) })
    },
    meta: { errorMessage: 'Envoi de la réponse impossible.' },
  })
}

export function useDeleteThread(entityType: EntityType, slug: string) {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads(entityType, slug) })
    },
    meta: { errorMessage: 'Suppression de la discussion impossible.' },
  })
}

export function useDeleteReply(entityType: EntityType, slug: string, threadId: string) {
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
      queryClient.invalidateQueries({ queryKey: discussionKeys.thread(entityType, slug, threadId) })
    },
    meta: { errorMessage: 'Suppression de la réponse impossible.' },
  })
}
