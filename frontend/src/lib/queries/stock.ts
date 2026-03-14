import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'

type ListStockFilters = Record<string, never>

const productStockKeys = {
  all: ['stock'] as const,
  lists: () => [...productStockKeys.all, 'list'] as const,
  list: (filters: ListStockFilters = {}) => [...productStockKeys.lists(), filters] as const,
  detail: (productId: string) => [...productStockKeys.all, 'detail', productId] as const,
  entries: () => [...productStockKeys.all, 'entries'] as const,
}

export const productStockQueries = {
  list: () =>
    queryOptions({
      queryKey: productStockKeys.list(),
      queryFn: async () => {
        const res = await api.stock.$get()
        if (!res.ok) throw new Error('Failed to fetch stock')
        const data = await res.json()
        return data.data
      },
    }),

  detail: (productId: string) =>
    queryOptions({
      queryKey: productStockKeys.detail(productId),
      queryFn: async () => {
        const res = await api.stock[':productId'].$get({ param: { productId } })
        if (!res.ok) throw new Error('Stock entry not found')
        const data = await res.json()
        return data.data
      },
      enabled: !!productId,
    }),

  // NOUVEAU: Query pour l'historique des entrées
  entries: () =>
    queryOptions({
      queryKey: productStockKeys.entries(),
      queryFn: async () => {
        const res = await api.stock.entries.$get()
        if (!res.ok) throw new Error('Failed to fetch stock entries')
        const data = await res.json()
        return data.data
      },
    }),
}

export const useUpsertStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await api.stock[':productId'].$put({
        param: { productId },
        json: { qty: quantity },
      })
      if (!res.ok) throw new Error('Failed to update stock')
      const data = await res.json()
      return data.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productStockKeys.list(),
      })
      queryClient.setQueryData(productStockKeys.detail(variables.productId), data)
    },
  })
}

export const useDeleteStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.stock[':productId'].$delete({
        param: { productId },
      })
      if (!res.ok) throw new Error('Failed to delete stock')
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({
        queryKey: productStockKeys.list(),
      })
      queryClient.removeQueries({
        queryKey: productStockKeys.detail(productId),
      })
    },
  })
}

export const useAddStockEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      qty,
      pricePaidCents,
      purchasedAt,
    }: {
      productId: string
      qty: number
      pricePaidCents?: number
      purchasedAt: string
    }) => {
      const res = await api.stock[':productId'].entries.$post({
        param: { productId },
        json: { qty, pricePaidCents, purchasedAt },
      })
      if (!res.ok) throw new Error('Failed to add stock entry')
      const data = await res.json()
      return data.data
    },
    onSuccess: (_data, variables) => {
      // Invalide le stock actuel ET l'historique
      queryClient.invalidateQueries({ queryKey: productStockKeys.list() })
      queryClient.invalidateQueries({ queryKey: productStockKeys.detail(variables.productId) })
      queryClient.invalidateQueries({ queryKey: productStockKeys.entries() }) // NOUVEAU
    },
  })
}
