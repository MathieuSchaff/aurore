import { describe, expect, test } from 'bun:test'
import { ingredientTagMap } from '../data/ingredient-tags'
import { INGREDIENT_SLUGS, SUPPLEMENTS_CAROTENOIDES } from '../data/ingredients/ingredient-slugs'

describe('ingredient-tags split — invariance', () => {
  test('ingredientTagMap exposes 414 entries', () => {
    expect(Object.keys(ingredientTagMap).length).toBe(414)
  })

  test('a skincare slug routes through the aggregate', () => {
    const entry = ingredientTagMap[INGREDIENT_SLUGS.GLYCERIN]
    expect(entry).toBeDefined()
    expect(entry.primary.length).toBeGreaterThan(0)
  })

  test('a haircare slug routes through the aggregate', () => {
    const entry = ingredientTagMap[INGREDIENT_SLUGS.COCO_GLUCOSIDE]
    expect(entry).toBeDefined()
  })

  test('a supplement slug routes through the aggregate', () => {
    const entry = ingredientTagMap[SUPPLEMENTS_CAROTENOIDES.ASTAXANTHINE_SUPPLEMENT]
    expect(entry).toBeDefined()
    expect(entry.primary.length).toBeGreaterThan(0)
  })
})
