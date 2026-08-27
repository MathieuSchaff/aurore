import { queryOptions } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

export const catalogSubmissionKeys = {
  all: ['catalog-submissions'] as const,
  mine: () => [...catalogSubmissionKeys.all, 'mine'] as const,
}

export const catalogSubmissionQueries = {
  mine: () =>
    queryOptions({
      queryKey: catalogSubmissionKeys.mine(),
      queryFn: async () => {
        const res = await api.me.submissions.$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 30,
    }),
}
