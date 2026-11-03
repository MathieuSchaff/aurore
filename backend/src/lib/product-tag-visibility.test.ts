import { describe, expect, test } from 'bun:test'

import { isDisplayedProductTagLink } from './product-tag-visibility'

describe('undisclosed aromatic mixtures', () => {
  test('hides stored aromatic absence inferences and preserves manual choices', () => {
    for (const marker of ['Flavor', 'FLAVOUR', 'Aroma', 'Flavor (Aroma)']) {
      for (const slug of [
        'sans-parfum',
        'sans-allergenes-parfumants',
        'sans-huiles-essentielles',
      ]) {
        expect(isDisplayedProductTagLink(slug, 'secondary', 'algo-derm', `Aqua, ${marker}`)).toBe(
          false
        )
        expect(isDisplayedProductTagLink(slug, 'secondary', 'manual', `Aqua, ${marker}`)).toBe(true)
      }
      for (const slug of ['sans-silicones', 'sans-alcool-denature']) {
        expect(isDisplayedProductTagLink(slug, 'secondary', 'algo-derm', `Aqua, ${marker}`)).toBe(
          true
        )
      }
    }
  })

  test('keeps the existing Parfum policy and ignores botanical substrings', () => {
    expect(
      isDisplayedProductTagLink(
        'sans-allergenes-parfumants',
        'secondary',
        'algo-derm',
        'Aqua, Parfum'
      )
    ).toBe(false)
    expect(
      isDisplayedProductTagLink(
        'sans-huiles-essentielles',
        'secondary',
        'algo-derm',
        'Aqua, Parfum'
      )
    ).toBe(true)
    expect(
      isDisplayedProductTagLink(
        'sans-huiles-essentielles',
        'secondary',
        'algo-derm',
        'Aqua, Syzygium Aromaticum Extract'
      )
    ).toBe(true)
  })
})
