import { describe, expect, it } from 'bun:test'

import { productDraftIngredientSchema, updateProductDraftSchema } from './schemas'

const ingredientId = '33333333-3333-4333-8333-333333333333'

describe('product draft validation', () => {
  it.each([
    { concentrationValue: -1, concentrationUnit: '%' },
    { concentrationValue: 101, concentrationUnit: '%' },
    { concentrationValue: 2 },
    { concentrationUnit: '%' },
  ])('rejects an invalid declared dose %j', (dose) => {
    expect(productDraftIngredientSchema.safeParse({ ingredientId, ...dose }).success).toBe(false)
  })

  it('accepts cleared doses and preserves dose context', () => {
    expect(
      productDraftIngredientSchema.parse({
        ingredientId,
        concentrationValue: null,
        concentrationUnit: null,
        concentrationPer: 'capsule',
        notes: 'Packaging',
      })
    ).toMatchObject({
      concentrationValue: null,
      concentrationUnit: null,
      concentrationPer: 'capsule',
      notes: 'Packaging',
    })
  })

  it('rejects duplicate ingredient links', () => {
    expect(
      updateProductDraftSchema.safeParse({ ingredients: [{ ingredientId }, { ingredientId }] })
        .success
    ).toBe(false)
  })
})
