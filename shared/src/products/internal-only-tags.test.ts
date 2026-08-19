import { describe, expect, it } from 'bun:test'

import { getProductTagsByCategory, isDisplayedProductTag } from './helpers'
import { SKINCARE_PRODUCT_CHARACTERISTIC_GROUPS } from './skincare/tag-taxonomy'

// docs/adr/0017: three algo-derm claim labels stay detected, stored and audited, but never
// reach a screen. This file is the guard: the flag is one boolean in the defs, and without
// these assertions nothing in the tree fails if it is dropped.
const INTERNAL_ONLY = ['hypoallergenique', 'non-irritant', 'non-comedogene']

describe('isDisplayedProductTag', () => {
  it('hides the three claim slugs', () => {
    for (const slug of INTERNAL_ONLY) expect(isDisplayedProductTag(slug)).toBe(false)
  })

  // Detecting a comedogenic formula reads the INCI, so it borrows no manufacturer claim.
  it('keeps comedogene, which reads the formula instead of a claim', () => {
    expect(isDisplayedProductTag('comedogene')).toBe(true)
  })

  it('keeps a slug no taxonomy declares', () => {
    expect(isDisplayedProductTag('slug-inconnu')).toBe(true)
  })
})

describe('taxonomy projections', () => {
  it('leaves internal-only slugs out of the filter options', () => {
    const slugs = getProductTagsByCategory('skincare', 'product_characteristic').map((t) => t.slug)
    for (const slug of INTERNAL_ONLY) expect(slugs).not.toContain(slug)
    expect(slugs).toContain('comedogene')
  })

  it('leaves internal-only slugs out of the display subgroups', () => {
    const grouped: string[] = Object.values(SKINCARE_PRODUCT_CHARACTERISTIC_GROUPS).flat()
    for (const slug of INTERNAL_ONLY) expect(grouped).not.toContain(slug)
    expect(grouped).toContain('comedogene')
  })
})
