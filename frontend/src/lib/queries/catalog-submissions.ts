import { queryOptions } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

export const catalogSubmissionQueries = {
  mine: () =>
    queryOptions({
      queryKey: ['catalog-submissions', 'mine'],
      queryFn: async () => {
        const res = await api.me.submissions.$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 30,
    }),
}
