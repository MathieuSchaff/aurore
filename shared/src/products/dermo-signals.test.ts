import { describe, expect, test } from 'bun:test'

import { hasFragranceComponent } from './index'

describe('hasFragranceComponent', () => {
  test('finds an allergen declared last, past the linker cap', () => {
    const inci =
      'Aqua, Glycerin, Cetearyl Alcohol, Dimethicone, Butylene Glycol, Xanthan Gum, ' +
      'Phenoxyethanol, Sodium Hydroxide, Tocopherol, Parfum, Linalool, Limonene'

    expect(hasFragranceComponent(inci)).toBe(true)
  })

  test('matches whatever the scraper left on the token', () => {
    expect(hasFragranceComponent('Aqua, Limonene*')).toBe(true)
    expect(hasFragranceComponent('Aqua; Citral (Natural)')).toBe(true)
    expect(hasFragranceComponent('Aqua, GERANIOL')).toBe(true)
    expect(hasFragranceComponent('Aqua, Geraniol [n5107/A]')).toBe(true)
    expect(hasFragranceComponent('Aqua, Citronellol. [c3921a]')).toBe(true)
    expect(hasFragranceComponent('Aqua, Linalool.')).toBe(true)
  })

  test('matches a fragrance marker with its translation in tow', () => {
    expect(hasFragranceComponent('Aqua, Parfum (Fragrance)')).toBe(true)
    expect(hasFragranceComponent('Aqua, Fragrance/Parfum')).toBe(true)
  })

  test('ignores an allergen name that is only a substring of another token', () => {
    expect(hasFragranceComponent('Aqua, Citral Methyl Ether')).toBe(false)
    expect(hasFragranceComponent('Aqua, Sodium Citrate')).toBe(false)
  })

  test('does not fire on benzyl alcohol used as a preservative', () => {
    expect(hasFragranceComponent('Aqua, Glycerin, Benzyl Alcohol, Dehydroacetic Acid')).toBe(false)
  })

  test('returns false on a missing INCI', () => {
    expect(hasFragranceComponent(null)).toBe(false)
    expect(hasFragranceComponent(undefined)).toBe(false)
    expect(hasFragranceComponent('')).toBe(false)
  })
})
