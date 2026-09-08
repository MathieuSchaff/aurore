import { queryOptions } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

const ingredientTagKeys = {
  all: ['ingredient-tags'] as const,
  list: (category?: string, limit?: number) =>
    [...ingredientTagKeys.all, 'list', { category, limit }] as const,
}

export const ingredientTagQueries = {
  // Service default caps at 100 and the taxonomy is past that: a picker passes limit
  // to read every definition in one go
  list: (category?: string, limit?: number) =>
    queryOptions({
      queryKey: ingredientTagKeys.list(category, limit),
      queryFn: async () => {
        const res = await api['ingredient-tags'].$get({
          query: { category, ...(limit !== undefined && { limit: String(limit) }) },
        })
        return unwrapData(res)
      },
    }),
}
