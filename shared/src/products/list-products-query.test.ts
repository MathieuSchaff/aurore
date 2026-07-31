import { describe, expect, test } from 'bun:test'

import { skincareListProductsQuery } from './list-products-query'

describe('skincareListProductsQuery boolean query parameters', () => {
  test('parses literal true and false strings', () => {
    expect(
      skincareListProductsQuery.parse({
        category: 'skincare',
        apply_preferences: 'true',
        include_excluded: 'false',
      })
    ).toMatchObject({
      apply_preferences: true,
      include_excluded: false,
    })
  })

  test('preserves boolean inputs', () => {
    expect(
      skincareListProductsQuery.parse({
        category: 'skincare',
        apply_preferences: false,
        include_excluded: true,
      })
    ).toMatchObject({
      apply_preferences: false,
      include_excluded: true,
    })
  })
})
