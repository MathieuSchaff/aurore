import type {
  CreateComparisonInput,
  EnrichedComparison,
  UpdateComparisonInput,
} from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { captureClientSession } from '../auth/session'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'

export const comparisonKeys = {
  all: ['product-comparisons'] as const,
  list: () => [...comparisonKeys.all, 'list'] as const,
  preview: (ids: string[]) => [...comparisonKeys.all, 'preview', ...ids] as const,
  detail: (id: string) => [...comparisonKeys.all, 'detail', id] as const,
}

export const comparisonQueries = {
  preview: (ids: string[]) =>
    queryOptions({
      queryKey: comparisonKeys.preview(ids),
      queryFn: async ({ signal }) => {
        const res = await api['product-comparisons'].preview.$get(
          { query: { ids: ids.join(',') } },
          { init: { signal } }
        )
        return unwrapData(res)
      },
    }),
  list: () =>
    queryOptions({
      queryKey: comparisonKeys.list(),
      queryFn: async () => {
        const res = await api['product-comparisons'].$get()
        return unwrapData(res)
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: comparisonKeys.detail(id),
      queryFn: async () => {
        const res = await api['product-comparisons'][':id'].$get({ param: { id } })
        return unwrapData(res)
      },
    }),
}

export const useCreateComparison = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['product-comparisons', 'create'],
    mutationFn: async (input: CreateComparisonInput) => {
      const res = await api['product-comparisons'].$post({ json: input })
      return unwrapData(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: comparisonKeys.list() })
    },
    meta: { errorMessage: 'Création de la comparaison impossible.' },
  })
}

export const useUpdateComparison = ({ inlineError = false } = {}) => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['product-comparisons', 'update'],
    onMutate: captureClientSession,
    mutationFn: async ({ id, input }: { id: string; input: UpdateComparisonInput }) => {
      const res = await api['product-comparisons'][':id'].$patch({
        param: { id },
        json: input,
      })
      return unwrapData(res)
    },
    onSuccess: (comparison, { id, input }, owner) => {
      if (owner.isCurrent()) {
        qc.setQueryData<EnrichedComparison>(comparisonKeys.detail(id), (current) => {
          if (!current) return comparison
          // A delayed PATCH snapshot must not undo fields saved by another mutation
          return {
            ...comparison,
            name: input.name === undefined ? current.name : comparison.name,
            products: input.productIds === undefined ? current.products : comparison.products,
          }
        })
      }
      return Promise.all([
        qc.invalidateQueries({ queryKey: comparisonKeys.detail(id) }),
        qc.invalidateQueries({ queryKey: comparisonKeys.list() }),
      ])
    },
    meta: { errorMessage: inlineError ? undefined : 'Mise à jour de la comparaison impossible.' },
  })
}

export const useDeleteComparison = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['product-comparisons', 'delete'],
    mutationFn: async (id: string) => {
      const res = await api['product-comparisons'][':id'].$delete({ param: { id } })
      await throwIfNotOk(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: comparisonKeys.all })
    },
    meta: { errorMessage: 'Suppression de la comparaison impossible.' },
  })
}
