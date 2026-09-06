import { describe, expect, it } from 'bun:test'

import { SKINCARE_INGREDIENT_TAG_DEFS } from '../ingredients/skincare/tag-slugs'
import { SKINCARE_PRODUCT_TAG_SLUGS } from '../products/skincare/tag-slugs'
import { USER_CONCERN_TO_PRODUCT_TAGS } from '../products/user-concern-bridge'
import { SKIN_CONCERNS } from './constants'

// A concern the user can declare is translated three times, in three layers, and nothing held
// them together: one added to SKIN_CONCERNS could stay mute in two of them without a sound,
// which is what happened. These are the two translations living in shared. The frontend risk
// axes and the backend algo-derm mapping are the third, out of reach from here

const INGREDIENT_CONCERN_SLUGS: ReadonlySet<string> = new Set(
  SKINCARE_INGREDIENT_TAG_DEFS.filter((def) => def.category === 'concern').map((def) => def.slug)
)

const PRODUCT_TAG_SLUGS: ReadonlySet<string> = new Set<string>(
  Object.values(SKINCARE_PRODUCT_TAG_SLUGS)
)

// Not an arbitration, a hold. `repulpant` is filed as skin_effect by BOTH taxonomies, product and
// ingredient, which agree with each other: the portrait is the only layer calling it a condition
// of the skin. Effect of the gap today: the profile filter on /ingredients does nothing for it,
// while the catalogue filter works through the bridge's anti-age mapping. Three ways out were
// weighed on 2026-08-31 and none is taken yet, so this set must not grow without that decision
const CONCERNS_WITHOUT_INGREDIENT_TAG: ReadonlySet<string> = new Set(['repulpant'])

describe('portrait vocabulary reaches both taxonomies', () => {
  for (const concern of SKIN_CONCERNS) {
    it(`${concern} maps to product tags that all exist`, () => {
      const targets = USER_CONCERN_TO_PRODUCT_TAGS[concern]
      expect(targets.length, `"${concern}" maps to an empty tag list`).toBeGreaterThan(0)
      // Catches the phantom target, which a missing key could not: a bridge entry pointing at a
      // slug the taxonomy never defined filters on nothing and reads as working
      for (const target of targets) {
        expect(
          PRODUCT_TAG_SLUGS.has(target),
          `"${concern}" maps to "${target}", absent from the skincare product taxonomy`
        ).toBe(true)
      }
    })

    // The convention is slug-for-slug here: unlike products, ingredient concern tags reuse the
    // portrait's own words. Verified against the tag defs, not assumed
    it(`${concern} has an ingredient tag in the concern category`, () => {
      if (CONCERNS_WITHOUT_INGREDIENT_TAG.has(concern)) return
      expect(
        INGREDIENT_CONCERN_SLUGS.has(concern),
        `"${concern}" has no ingredient tag under category "concern", so the profile filter on /ingredients stays silent for it`
      ).toBe(true)
    })
  }

  it('holds no stale exemption', () => {
    const declared: ReadonlySet<string> = new Set(SKIN_CONCERNS)
    for (const concern of CONCERNS_WITHOUT_INGREDIENT_TAG) {
      expect(
        INGREDIENT_CONCERN_SLUGS.has(concern),
        `"${concern}" is exempted but now has its ingredient tag: drop it from CONCERNS_WITHOUT_INGREDIENT_TAG`
      ).toBe(false)
      expect(
        declared.has(concern),
        `"${concern}" is exempted but is no longer a SKIN_CONCERN: drop it from CONCERNS_WITHOUT_INGREDIENT_TAG`
      ).toBe(true)
    }
  })
})
