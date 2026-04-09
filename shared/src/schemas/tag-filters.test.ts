import { describe, expect, it } from 'vitest'

import { filterCategoriesFor, TAG_CATEGORY_META } from './tag-filters'
import { TAG_CATEGORIES } from './tag-taxonomy'

describe('TAG_CATEGORY_META', () => {
  it('has one entry per TagCategory', () => {
    for (const cat of TAG_CATEGORIES) {
      expect(TAG_CATEGORY_META[cat]).toBeDefined()
      expect(TAG_CATEGORY_META[cat].label.length).toBeGreaterThan(0)
      expect(TAG_CATEGORY_META[cat].placeholder.length).toBeGreaterThan(0)
    }
  })

  it('orders are unique', () => {
    const orders = TAG_CATEGORIES.map((c) => TAG_CATEGORY_META[c].order)
    expect(new Set(orders).size).toBe(orders.length)
  })
})

describe('filterCategoriesFor', () => {
  it('returns ingredient-compatible categories only for ingredient', () => {
    const cats = filterCategoriesFor('ingredient')
    expect(cats).not.toContain('skin_zone')
    expect(cats).not.toContain('product_type')
    expect(cats).not.toContain('routine_step')
    expect(cats).toContain('skin_type')
    expect(cats).toContain('concern')
    expect(cats).toContain('ingredient_attribute')
    expect(cats).toContain('shared_label')
  })

  it('returns product-compatible categories only for product', () => {
    const cats = filterCategoriesFor('product')
    expect(cats).not.toContain('ingredient_attribute')
    expect(cats).toContain('skin_zone')
    expect(cats).toContain('product_type')
    expect(cats).toContain('routine_step')
    expect(cats).toContain('product_label')
  })

  it('returns categories in meta order', () => {
    const cats = filterCategoriesFor('product')
    const orders = cats.map((c) => TAG_CATEGORY_META[c].order)
    expect([...orders]).toEqual([...orders].sort((a, b) => a - b))
  })
})
