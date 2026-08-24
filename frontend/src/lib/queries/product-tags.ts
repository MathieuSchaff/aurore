import { queryOptions } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

const productTagKeys = {
  all: ['product-tags'] as const,
  lists: () => [...productTagKeys.all, 'list'] as const,
  list: (category?: string, limit?: number) =>
    [...productTagKeys.lists(), { category, limit }] as const,
}

export const productTagQueries = {
  // Service default caps at 100; the rule composer passes limit to read the
  // full taxonomy in one go.
  list: (category?: string, limit?: number) =>
    queryOptions({
      queryKey: productTagKeys.list(category, limit),
      queryFn: async () => {
        const res = await api['product-tags'].$get({
          query: { category, ...(limit !== undefined && { limit: String(limit) }) },
        })
        return unwrapData(res)
      },
    }),
}
