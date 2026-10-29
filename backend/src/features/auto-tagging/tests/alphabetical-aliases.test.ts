import { describe, expect, test } from 'bun:test'

import { detectAllAutoTags } from '../orchestrator'
import { detectPercentClaimTags, isFragileINCI } from '../passes/percent-claim-detection'

// Receutics lists Blue No. 1 before Camellia; renaming it to CI 42090 hides that order
const RECEUTICS_INCI = [
  'ACRYLATES/AMINOACRYLATES/C10-30 ALKYL',
  'ALGAE EXTRACT',
  'AMMONIUM HYDROXIDE',
  'Ascorbic Acid',
  'BLUE NO. 1 (CI 42090)',
  'CAMELLIA OLEIFERA LEAF EXTRACT',
  'Chamomilla Recutita (Matricaria) Flower Extract',
  'Cocamidopropyl Betaine',
  'COCOAMIDOPROPYL BETAINE (COCONUT DERIVATIVE)',
  'COLA ACUMINATA SEED EXTRACT',
  'DIAZOLIDINYL UREA',
  'Parfum',
  'GINKGO BILOBA LEAF EXTRACT',
  'Glycerin',
  'GLYCOL STEARATE',
  'Lactic Acid',
  'Lecithin',
  'LINOLEAMIDOPROPYL PG-DIMONIUM CHLORIDE',
  'Methylchloroisothiazolinone',
  'Methylisothiazolinone',
  'Panax Ginseng Root Extract',
  'Panthenol',
  'PAPAIN (PAPAYA ENZYME)',
  'PEG-20 ITACONATE COPOL',
  'PHOSPHATE',
  'Propylene Glycol',
  'Salicylic Acid',
  'Sodium C14-16 Olefin Sulfonate',
  'Sodium Citrate',
  'Sodium Lauroyl Sarcosinate',
  'Disodium EDTA',
  'Tocopheryl Acetate',
].join(', ')

describe('alphabetical INCI with renamed aliases', () => {
  test.each(['Step 1: Clear Skin Cleanser', 'Acne Clearing'])(
    'emits the late acids in %s without concentration rank caps',
    (name) => {
      const tags = detectAllAutoTags({
        inci: RECEUTICS_INCI,
        kind: 'cleanser',
        category: 'skincare',
        name,
      })
      expect(
        tags
          .filter((tag) => ['aha', 'bha'].includes(tag.tagSlug))
          .map((tag) => tag.tagSlug)
          .sort()
      ).toEqual(['aha', 'bha'])
    }
  )

  test('allows structured percent claims when alias normalization hides alphabetical order', () => {
    expect(isFragileINCI(RECEUTICS_INCI)).toBe(true)
    expect(
      detectPercentClaimTags(RECEUTICS_INCI, [
        { ingredientSlug: 'salicylic-acid', concentrationValue: 2, concentrationUnit: '%' },
      ])
    ).toContain('bha')
  })

  test('keeps the rank caps when the written list is not alphabetical', () => {
    const inci = `Aqua, ${RECEUTICS_INCI}`
    expect(isFragileINCI(inci)).toBe(false)
    const tags = detectAllAutoTags({
      inci,
      kind: 'cleanser',
      category: 'skincare',
      name: 'Cleanser',
    })
    expect(tags.filter((tag) => ['aha', 'bha'].includes(tag.tagSlug))).toEqual([])
  })
})
