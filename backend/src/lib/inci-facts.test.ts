import { describe, expect, test } from 'bun:test'

import { splitINCI } from 'algo-derm'

import { computeInciFacts } from './inci-facts'

// Through the module's public surface: `computeInciFacts` is what the product payload calls.
const hasFragranceComponent = (inci: string | null | undefined) =>
  computeInciFacts(inci).hasFragrance

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

  // The set is matched exactly, so an entry spelled outside CosIng never fires on a real label.
  test('spells the multi-word allergens the way a label declares them', () => {
    expect(hasFragranceComponent('Aqua, Anise Alcohol')).toBe(true)
    expect(hasFragranceComponent('Aqua, Anisyl Alcohol')).toBe(true)
    expect(hasFragranceComponent('Aqua, Amylcinnamyl Alcohol')).toBe(true)
    expect(hasFragranceComponent('Aqua, Hydroxyisohexyl 3-Cyclohexene Carboxaldehyde')).toBe(true)
    expect(hasFragranceComponent('Aqua, Alpha-Isomethyl Ionone')).toBe(true)
    expect(hasFragranceComponent('Aqua, Evernia Prunastri Extract')).toBe(true)
  })

  test('matches a fragrance marker with its translation in tow', () => {
    expect(hasFragranceComponent('Aqua, Parfum (Fragrance)')).toBe(true)
    expect(hasFragranceComponent('Aqua, Fragrance/Parfum')).toBe(true)
  })

  test('reads a period-separated list without swallowing a decimal dose', () => {
    expect(hasFragranceComponent('Aqua. Glycerin. Limonene. Phenoxyethanol')).toBe(true)
    expect(hasFragranceComponent('Aqua, Salicylic Acid 2.0%, Panthenol')).toBe(false)
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

// The whole reason the presence check does not reuse the strict split. algo-derm welds these
// tails to their token on purpose; without the fold the allergen behind them is invisible.
describe('separators algo-derm keeps welded', () => {
  test('a footnote legend glued to the last ingredient', () => {
    const inci = 'Aqua, Sodium Hydroxide, limonene**. * issu de l’agriculture biologique'
    expect(splitINCI(inci).at(-1)).toContain('issu de l’agriculture')
    expect(hasFragranceComponent(inci)).toBe(true)
  })

  test('a `;` the scraper used as a list comma', () => {
    expect(splitINCI('Aqua; Citral')).toHaveLength(1)
    expect(hasFragranceComponent('Aqua; Citral')).toBe(true)
  })
})

describe('computeInciFacts', () => {
  test('counts with the strict rule, so a comma inside a name is not a separator', () => {
    expect(computeInciFacts('1,2-Hexanediol, Butylene Glycol, Ceramide NP').inciCount).toBe(3)
    expect(computeInciFacts('Aqua, Salicylic Acid 2,0%, Glycerin').inciCount).toBe(3)
  })

  // The fold serves presence only: it must never inflate the count shown on the sheet.
  test('the presence fold does not leak into the count', () => {
    expect(computeInciFacts('Aqua, limonene**. * issu de l’agriculture biologique')).toEqual({
      inciCount: 2,
      hasFragrance: true,
    })
  })

  test('is empty on a missing INCI', () => {
    expect(computeInciFacts(null)).toEqual({ inciCount: 0, hasFragrance: false })
    expect(computeInciFacts('')).toEqual({ inciCount: 0, hasFragrance: false })
  })
})
