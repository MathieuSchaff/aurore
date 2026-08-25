import { describe, expect, it } from 'vitest'

import { productQueries } from '../products'

describe('productQueries.list', () => {
  it('separates anonymous and authenticated viewers without preference filters', () => {
    expect([
      productQueries.list({}, null).queryKey,
      productQueries.list({}, 'user-1').queryKey,
      productQueries.list({}, 'user-2').queryKey,
    ]).toEqual([
      ['products', 'list', {}, null],
      ['products', 'list', {}, 'user-1'],
      ['products', 'list', {}, 'user-2'],
    ])
  })
})

describe('productQueries.detailPage', () => {
  it('separates anonymous visitors and successive accounts', () => {
    expect([
      productQueries.detailPage('serum-test', null).queryKey,
      productQueries.detailPage('serum-test', 'user-1').queryKey,
      productQueries.detailPage('serum-test', 'user-2').queryKey,
    ]).toEqual([
      ['products', 'detail-page', 'serum-test', null],
      ['products', 'detail-page', 'serum-test', 'user-1'],
      ['products', 'detail-page', 'serum-test', 'user-2'],
    ])
  })
})

describe('SSR product query session scope', () => {
  it('marks the viewer that owns each list and detail page key', () => {
    expect([
      productQueries.list({}, null).meta?.sessionScope,
      productQueries.list({}, 'user-1').meta?.sessionScope,
      productQueries.detailPage('serum-test', null).meta?.sessionScope,
      productQueries.detailPage('serum-test', 'user-1').meta?.sessionScope,
    ]).toEqual([
      { viewerId: null },
      { viewerId: 'user-1' },
      { viewerId: null },
      { viewerId: 'user-1' },
    ])
  })
})
