// What disproves each absence tag. The claim-veto side is covered by formula.test.ts;
// these tests own the refuter table itself: the divergences from algo-derm that the
// contradiction audit rests on, and the traps that would turn it into noise.

import { describe, expect, test } from 'bun:test'

import { SKINCARE_PRODUCT_TAG_SLUGS as S, type SkincareProductTagSlug } from '@aurore/shared'

import { ABSENCE_REFUTERS, refuterFor } from '../lib/absence-refuters'

function token(tag: SkincareProductTagSlug, inci: string): string | null {
  const entry = ABSENCE_REFUTERS.find((r) => r.tag === tag)
  if (!entry) throw new Error(`no refuter for ${tag}`)
  return entry.refutingToken(inci)
}

describe('table integrity', () => {
  test('every entry carries a note — a silent divergence from algo-derm is the failure mode', () => {
    for (const r of ABSENCE_REFUTERS) expect(r.note.length).toBeGreaterThan(20)
  })

  test('refuterFor throws on a tag with no declared refuter', () => {
    expect(() => refuterFor(S.SANS_HUILES_ESSENTIELLES)).toThrow(/No absence refuter/)
  })
})

describe('sans-silicones — wider than algo-derm on purpose', () => {
  // algo-derm's silicone heuristic lists dimethicone/trimethicone/cyclomethicone/amodimethicone
  // but no bare `methicone`, so these three escape it upstream.
  test.each([
    ['Aqua, Glycerin, Caprylyl Methicone', 'caprylyl methicone'],
    ['Aqua, Simethicone, Glycerin', 'simethicone'],
    ['Aqua, Polymethylsilsesquioxane', 'polymethylsilsesquioxane'],
  ])('%s → %s', (inci, expected) => {
    expect(token(S.SANS_SILICONES, inci)).toBe(expected)
  })

  test('a free-from list in the `inci` field is not a declaration of presence', () => {
    expect(token(S.SANS_SILICONES, 'Aqua, Glycerin, sans silicone /silicone free')).toBeNull()
  })
})

describe('sans-huiles-minerales — spelling gaps and scraper corruptions', () => {
  test('English `Microcrystalline Wax`, which algo-derm only lists as `cera microcristallina`', () => {
    expect(token(S.SANS_HUILES_MINERALES, 'Cera Alba, Microcrystalline Wax')).toBe(
      'microcrystalline wax'
    )
  })

  test('solid `Paraffin`, which algo-derm only lists as `paraffin wax`', () => {
    expect(token(S.SANS_HUILES_MINERALES, 'Aqua, Paraffin, Glycerin')).toBe('paraffin')
  })

  // Anchored on purpose: a synthetic isoparaffin is not what the claim denies.
  test('C13-14 Isoparaffin does not trip the anchored paraffin pattern', () => {
    expect(token(S.SANS_HUILES_MINERALES, 'Aqua, C13-14 Isoparaffin, Laureth-7')).toBeNull()
  })

  // The head is misspelt by the scraper; the parenthetical gloss is the only intact
  // declaration left, and the default tokenizer drops it.
  test('`Paranum Liquidum (Mineral Oil)` is read through the gloss', () => {
    expect(token(S.SANS_HUILES_MINERALES, 'Aqua, Paranum Liquidum (Mineral Oil), Glycerin')).toBe(
      'paranum liquidum mineral oil'
    )
  })
})

describe('sans-savon — anchored where algo-derm is not', () => {
  test('a real soap fires', () => {
    expect(token(S.SANS_SAVON, 'Sodium Palmate, Sodium Cocoate, Aqua')).toBe('sodium palmate')
  })

  // algo-derm's substring form reads the `laurate` inside `sulfolaurate` as a soap.
  test('Disodium 2-Sulfolaurate is a sulfonate, not a laurate soap', () => {
    expect(token(S.SANS_SAVON, 'Aqua, Disodium 2-Sulfolaurate, Glycerin')).toBeNull()
  })

  test('the alkali and the fatty-acid salt must sit in the same token', () => {
    expect(token(S.SANS_SAVON, 'Aqua, Glyceryl Stearate, Sodium Benzoate')).toBeNull()
  })
})

describe('the two fragrance questions stay separate', () => {
  test('`Parfum` refutes sans-parfum', () => {
    expect(token(S.SANS_PARFUM, 'Aqua, Glycerin, Parfum')).toBe('parfum')
  })

  // A product can carry Limonene from an essential oil and still be fragrance-free.
  test('an Annex III allergen alone does not refute sans-parfum', () => {
    expect(token(S.SANS_PARFUM, 'Aqua, Citrus Limon Peel Oil, Limonene')).toBeNull()
  })

  // The mirror image: `Parfum` says nothing about which allergens cross the labelling
  // threshold, so it cannot refute the allergen claim.
  test('the bare marker does not refute sans-allergenes-parfumants', () => {
    expect(token(S.SANS_ALLERGENES_PARFUMANTS, 'Aqua, Glycerin, Parfum')).toBeNull()
  })

  test('a declared allergen does', () => {
    expect(token(S.SANS_ALLERGENES_PARFUMANTS, 'Aqua, Parfum, Linalool')).toBe('linalool')
  })

  // algo-derm emits the tag off `["fragrance_allergen", "menthol"]`, so menthol counts here
  // even though it stays out of the Annex III set in inci-facts.
  test('menthol counts, following algo-derm’s own tag definition', () => {
    expect(token(S.SANS_ALLERGENES_PARFUMANTS, 'Aqua, Menthol, Glycerin')).toBe('menthol')
  })
})

describe('sans-sulfates mirrors algo-derm exactly', () => {
  test('a washing sulfate refutes', () => {
    expect(token(S.SANS_SULFATES, 'Aqua, Sodium Laureth Sulfate')).toBe('sodium laureth sulfate')
  })

  test.each([
    'Aqua, Sodium Cetearyl Sulfate',
    'Aqua, Sodium Coceth Sulfate',
  ])('%s is an emulsifier/mild variant, not a washing sulfate', (inci) => {
    expect(token(S.SANS_SULFATES, inci)).toBeNull()
  })
})
