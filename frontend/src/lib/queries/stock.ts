import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'

const productStockKeys = {
  all: ['stock'] as const,
  entries: () => [...productStockKeys.all, 'entries'] as const,
}

export const productStockQueries = {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productStockKeys.entries() })
      queryClient.invalidateQueries({ queryKey: ['user-products'] })
    },
  })
}
