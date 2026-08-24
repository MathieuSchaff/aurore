import { productDetailSchema, productListItemSchema } from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import { PRODUCT_DETAILS, PRODUCTS } from './products'

describe('product MSW fixtures', () => {
  it('matches the product list contract', () => {
    expect(() =>
      PRODUCTS.forEach((product) => {
        productListItemSchema.parse(product)
      })
    ).not.toThrow()
  })

  it('matches the product detail contract', () => {
    expect(() =>
      PRODUCT_DETAILS.forEach((product) => {
        productDetailSchema.parse(product)
      })
    ).not.toThrow()
  })
})
