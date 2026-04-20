import { describe, expect, test } from 'bun:test'
import {
  INGREDIENT_SLUGS,
  HUMECTANTS,
  RETINOIDES,
  SUPPLEMENTS_VITAMINES,
  DENTAL_ABRASIFS,
  HAIR_CONDITIONNEURS,
} from '../data/ingredients/ingredient-slugs'

describe('ingredient-slugs split refactor — invariance', () => {
  test('INGREDIENT_SLUGS snapshot (exact counts)', () => {
    const keys = Object.keys(INGREDIENT_SLUGS)
    const values = Object.values(INGREDIENT_SLUGS)

    // Exact key count — changes if any group gains or loses a slug.
    expect(keys.length).toBe(594)

    // Exact unique-value count. 592 = 594 keys − 2 intentional aliases
    // (ASTAXANTHINE/HAEMATOCOCCUS_PLUVIALIS and
    //  BUTYL_METHOXYDIBENZOYLMETHANE/AVOBENZONE, see ingredient-slugs.ts).
    expect(new Set(values).size).toBe(592)

    // Spot-check one slug from each domain stays reachable via the root aggregate.
    expect(INGREDIENT_SLUGS.GLYCERIN).toBe('glycerin')
    expect(INGREDIENT_SLUGS.RETINOL).toBeDefined()
    expect(INGREDIENT_SLUGS.VITAMINE_D3).toBeDefined()
    expect(INGREDIENT_SLUGS.HYDRATED_SILICA).toBeDefined()
    expect(INGREDIENT_SLUGS.SODIUM_LAURYL_SULFATE).toBeDefined()
  })

  test('individual group exports survive the root re-export', () => {
    expect(HUMECTANTS.GLYCERIN).toBe('glycerin')
    expect(RETINOIDES).toBeDefined()
    expect(SUPPLEMENTS_VITAMINES).toBeDefined()
    expect(DENTAL_ABRASIFS).toBeDefined()
    expect(HAIR_CONDITIONNEURS).toBeDefined()
  })
})
