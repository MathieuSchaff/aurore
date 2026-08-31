import { SKIN_CONCERNS } from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import { groupConcernsByFamily } from '../concern-families'

describe('groupConcernsByFamily', () => {
  it('places every concern exactly once, families first then the loners', () => {
    const { families, others } = groupConcernsByFamily()
    const placed = [...families.flatMap((f) => f.concerns), ...others]

    expect([...placed].sort()).toEqual([...SKIN_CONCERNS].sort())
    expect(placed).toHaveLength(SKIN_CONCERNS.length)
    for (const family of families) expect(family.concerns.length).toBeGreaterThan(1)
  })

  // The four redness nuances feed one product tag on purpose, there is no
  // per-product clinical data to tell them apart: the family is where that
  // choice becomes visible to the user
  it('opens with the redness family and its four nuances', () => {
    const { families } = groupConcernsByFamily()

    expect(families[0]).toEqual({
      tagSlug: 'rougeurs-vasculaires',
      concerns: ['anti-rougeurs', 'rosacee', 'couperose', 'flushs'],
    })
  })

  it('files a concern with two targets under its first target only', () => {
    const { families } = groupConcernsByFamily()
    const acne = families.find((f) => f.tagSlug === 'acne-imperfections')

    expect(acne?.concerns).toContain('post-acne')
    expect(families.find((f) => f.tagSlug === 'reparation-cutanee')).toBeUndefined()
  })

  it('keeps a concern alone behind its tag out of the titled families', () => {
    const { others } = groupConcernsByFamily()

    expect(others).toEqual(expect.arrayContaining(['keratose-pilaire', 'eczema', 'cicatrisation']))
  })
})
