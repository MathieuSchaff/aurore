import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'

import { dropSessionScopedQueries } from '../sessionCache'

const AUTHENTICATED_LIST_KEY = ['products', 'list', {}, 'user-1'] as const
const ANONYMOUS_LIST_KEY = ['products', 'list', {}, null] as const

describe('dropSessionScopedQueries', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
  })

  it('drops every product list because catalogue visibility depends on the session role', () => {
    const authenticatedList = {
      items: [{ id: 'p1', name: 'Crème', userStatus: 'in_stock' }],
      total: 1,
    }
    const anonymousList = {
      items: [{ id: 'p1', name: 'Crème', userStatus: null }],
      total: 1,
    }
    queryClient.setQueryData(AUTHENTICATED_LIST_KEY, authenticatedList)
    queryClient.setQueryData(ANONYMOUS_LIST_KEY, anonymousList)

    dropSessionScopedQueries(queryClient)

    expect(queryClient.getQueryData(AUTHENTICATED_LIST_KEY)).toBeUndefined()
    expect(queryClient.getQueryData(ANONYMOUS_LIST_KEY)).toBeUndefined()
  })

  it('drops every product detail page because moderators can see hidden catalogue rows', () => {
    const anonymousKey = ['products', 'detail-page', 'serum-test', null] as const
    const firstAccountKey = ['products', 'detail-page', 'serum-test', 'user-1'] as const
    const secondAccountKey = ['products', 'detail-page', 'serum-test', 'user-2'] as const
    const anonymousPage = { product: { id: 'p1' }, userStatus: null }
    queryClient.setQueryData(anonymousKey, anonymousPage)
    queryClient.setQueryData(firstAccountKey, {
      product: { id: 'p1' },
      userStatus: 'in_stock',
    })
    queryClient.setQueryData(secondAccountKey, {
      product: { id: 'p1' },
      userStatus: 'wishlist',
    })

    dropSessionScopedQueries(queryClient)

    expect(queryClient.getQueryData(firstAccountKey)).toBeUndefined()
    expect(queryClient.getQueryData(secondAccountKey)).toBeUndefined()
    expect(queryClient.getQueryData(anonymousKey)).toBeUndefined()
  })

  it('drops unscoped product and ingredient details that may contain hidden rows', () => {
    const productKey = ['products', 'hidden-product'] as const
    const ingredientKey = ['ingredients', 'hidden-ingredient'] as const
    queryClient.setQueryData(productKey, { moderationStatus: 'hidden' })
    queryClient.setQueryData(ingredientKey, { moderationStatus: 'hidden' })

    dropSessionScopedQueries(queryClient)

    expect(queryClient.getQueryData(productKey)).toBeUndefined()
    expect(queryClient.getQueryData(ingredientKey)).toBeUndefined()
  })

  it('drops private roots and keeps known public roots', () => {
    const privateKey = ['private', 'viewer'] as const
    const userProductsKey = ['user-products', 'list'] as const
    const articlesKey = ['articles', 'list'] as const
    queryClient.setQueryData(privateKey, { viewerId: 'viewer-1' })
    queryClient.setQueryData(userProductsKey, [{ id: 'user-product-1' }])
    queryClient.setQueryData(articlesKey, [{ id: 'article-1' }])

    dropSessionScopedQueries(queryClient)

    expect(queryClient.getQueryData(privateKey)).toBeUndefined()
    expect(queryClient.getQueryData(userProductsKey)).toBeUndefined()
    expect(queryClient.getQueryData(articlesKey)).toEqual([{ id: 'article-1' }])
  })
})
