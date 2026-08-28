import { queryOptions } from '@tanstack/react-query'

import { type ApiData, api } from '../api'
import { unwrapData } from '../helpers/apiError'

export const collectionKeys = {
  all: ['collection'] as const,
  formulaMotifs: () => [...collectionKeys.all, 'formula-motifs'] as const,
}

export type FormulaMotifs = ApiData<(typeof api)['collection']['formula-motifs']['$get']>

// Theoretical (algo-derm) signals aggregated across the shelf; personalized via the
// authed user's dermo profile server-side, so the cache is keyed per user implicitly.
export const collectionQueries = {
  formulaMotifs: () =>
    queryOptions({
      queryKey: collectionKeys.formulaMotifs(),
      queryFn: async () => {
        const res = await api.collection['formula-motifs'].$get()
        return unwrapData(res)
      },
      staleTime: 5 * 60 * 1000,
    }),
}
