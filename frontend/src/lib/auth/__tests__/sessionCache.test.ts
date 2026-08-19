import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'

import { dropSessionScopedQueries } from '../sessionCache'

const LIST_KEY = ['products', 'list', {}, 'user-1'] as const

describe('dropSessionScopedQueries', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
  })

  it('keeps the product list but clears the shelf status it carries', () => {
    queryClient.setQueryData(LIST_KEY, {
      items: [
        { id: 'p1', name: 'Crème', userStatus: 'owned' },
        { id: 'p2', name: 'Sérum', userStatus: null },
      ],
      total: 2,
    })

    dropSessionScopedQueries(queryClient)

    expect(queryClient.getQueryData(LIST_KEY)).toEqual({
      items: [
        { id: 'p1', name: 'Crème', userStatus: null },
        { id: 'p2', name: 'Sérum', userStatus: null },
      ],
      total: 2,
    })
  })

  // A list caught while fetching has no data yet. Seeding it with a partial body here would hand
  // ProductsPage a defined payload whose `items` is undefined, which throws on `data?.items.map`.
  it('leaves a list that has not loaded yet without a body', () => {
    queryClient.getQueryCache().build(queryClient, { queryKey: LIST_KEY })

    dropSessionScopedQueries(queryClient)

    expect(queryClient.getQueryData(LIST_KEY)).toBeUndefined()
  })
})
