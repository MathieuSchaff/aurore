import type { CreateComparisonInput, UpdateComparisonInput } from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'

const comparisonKeys = {
  all: ['product-comparisons'] as const,
  list: () => [...comparisonKeys.all, 'list'] as const,
  detail: (id: string) => [...comparisonKeys.all, 'detail', id] as const,
}

export const comparisonQueries = {
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

export const useUpdateComparison = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['product-comparisons', 'update'],
    mutationFn: async ({ id, input }: { id: string; input: UpdateComparisonInput }) => {
      const res = await api['product-comparisons'][':id'].$patch({
        param: { id },
        json: input,
      })
      return unwrapData(res)
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: comparisonKeys.detail(id) })
      qc.invalidateQueries({ queryKey: comparisonKeys.list() })
    },
    meta: { errorMessage: 'Mise à jour de la comparaison impossible.' },
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
