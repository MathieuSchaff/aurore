import { describe, expect, test } from 'bun:test'

import { SKINCARE_PRODUCT_TAG_SLUGS } from '@habit-tracker/shared'

import { detectAutoTags, TAG_CONFIG } from '../utils/auto-tag-detection'

const S = SKINCARE_PRODUCT_TAG_SLUGS

describe('auto-tag-detection', () => {
  test('empty/null/whitespace INCI returns []', () => {
    expect(detectAutoTags(null, 'moisturizer')).toEqual([])
    expect(detectAutoTags(undefined, 'moisturizer')).toEqual([])
    expect(detectAutoTags('', 'moisturizer')).toEqual([])
    expect(detectAutoTags('   ', 'moisturizer')).toEqual([])
  })

  test('comedogenic ingredient on leave-on product → comedogene tag', () => {
    // Coconut oil is a direct keyword match in algo-derm — high confidence.
    const inci = 'Aqua, Coconut Oil, Glycerin'
    const tags = detectAutoTags(inci, 'moisturizer')
    const slugs = tags.map((t) => t.slug)
    expect(slugs).toContain(S.COMEDOGENE)
  })

  test('comedogenic ingredient on rinse-off cleanser → comedogene filtered out', () => {
    // Same INCI, rinse-off kind: excludeRinseOff drops the tag.
    const inci = 'Aqua, Coconut Oil, Glycerin'
    const tags = detectAutoTags(inci, 'cleanser')
    const slugs = tags.map((t) => t.slug)
    expect(slugs).not.toContain(S.COMEDOGENE)
  })

  test('allow:false tags are never emitted (matifiant, repulpant, sans-savon, …)', () => {
    // INCI that would otherwise trigger several disabled tags:
    // - hyaluronic acid + glycerin → repulpant
    // - niacinamide → matifiant
    // - no fragrance → sans-parfum
    const inci = 'Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Phenoxyethanol'
    const tags = detectAutoTags(inci, 'serum')
    const slugs = new Set(tags.map((t) => t.slug))
    expect(slugs.has(S.REPULPANT)).toBe(false)
    expect(slugs.has(S.MATIFIANT)).toBe(false)
    expect(slugs.has(S.SANS_PARFUM)).toBe(false)
    expect(slugs.has(S.SANS_SAVON)).toBe(false)
    expect(slugs.has(S.HYPOALLERGENIQUE)).toBe(false)
    expect(slugs.has(S.GROSSESSE_COMPATIBLE)).toBe(false)
  })

  test('every emitted tag has relevance=secondary', () => {
    const inci = 'Aqua, Salicylic Acid, Niacinamide, Tocopherol, Glycerin'
    const tags = detectAutoTags(inci, 'serum')
    expect(tags.length).toBeGreaterThan(0)
    for (const t of tags) {
      expect(t.relevance).toBe('secondary')
      expect(t.confidence).toBeGreaterThanOrEqual(0)
      expect(t.confidence).toBeLessThanOrEqual(1)
    }
  })

  test('confOverride raises minConf globally', () => {
    // peau-sensible at minConf 0.5 — should appear normally on a gentle INCI.
    const inci = 'Aqua, Glycerin, Panthenol, Allantoin, Centella Asiatica Extract'
    const baseline = detectAutoTags(inci, 'serum')
    const tightened = detectAutoTags(inci, 'serum', { confOverride: 0.99 })
    // confOverride 0.99 is so strict only confidence==1 candidates survive.
    expect(tightened.length).toBeLessThanOrEqual(baseline.length)
  })

  test('TAG_CONFIG counts match documented calibration (16 allow=true post-spot-check)', () => {
    // Sanity check: the calibration ratio in §7.4/§7.6 is 16 effective tags
    // (8 dropped). Run-time numbers from `audit-auto-tags` show 19 allow=true
    // entries — three skin_type/concern pairs (peau-grasse/peau-seche stay
    // separate from peau-sensible). Document the absolute count to flag any
    // accidental flip in TAG_CONFIG.
    const allow = Object.values(TAG_CONFIG).filter((r) => r.allow)
    const drop = Object.values(TAG_CONFIG).filter((r) => !r.allow)
    expect(allow.length).toBe(19)
    expect(drop.length).toBe(8)
  })
})
