import { describe, expect, it } from 'bun:test'

import { buildCanonicalKeyMaps, computeLinks } from './main'

describe('computeLinks', () => {
  it('links a slash-separated multilingual name when every segment names the same substance', () => {
    const result = computeLinks(
      'MARIS SAL/SEA SALT/SEL MARIN',
      'skincare',
      new Map([['Sel Marin', 'sea-salt']]),
      new Map([['sea-salt', 'Sel Marin']])
    )

    expect(result.slugs).toContain('sea-salt')
  })

  it('keeps an exact chemical slash name as one ingredient', () => {
    const result = computeLinks('Copper Lysinate/Prolinate', 'skincare', new Map(), new Map())

    expect(result.slugs).toContain('copper-lysinate-prolinate')
  })

  it('keeps a whole-token botanical fallback ahead of slash segments', () => {
    const result = computeLinks(
      'HEDERA HELIX (IVY) LEAF/STEM EXTRACT',
      'skincare',
      new Map(),
      new Map()
    )

    expect(result.slugs).toContain('hedera-helix-extract')
  })

  it('rejects a slash token when only one segment resolves', () => {
    const result = computeLinks(
      'UNOBTAINIUM/SEA SALT/UNKNOWNIUM',
      'skincare',
      new Map([['Sel Marin', 'sea-salt']]),
      new Map([['sea-salt', 'Sel Marin']])
    )

    expect(result.slugs).not.toContain('sea-salt')
  })

  it('rejects a slash token when its segments name different substances', () => {
    const result = computeLinks(
      'SEA SALT/NIACINAMIDE',
      'skincare',
      new Map([['Sel Marin', 'sea-salt']]),
      new Map([['sea-salt', 'Sel Marin']])
    )

    expect(result.slugs).not.toContain('sea-salt')
  })

  it('prefers the bare slug when two slugs share a canonical key', () => {
    const { canonicalKeyToSlug, canonicalKeyBySlug } = buildCanonicalKeyMaps([
      { slug: 'sea-salt', key: 'Sel Marin' },
      { slug: 'sea-salt-hair', key: 'Sel Marin' },
    ])

    const result = computeLinks('SEL MARIN', 'skincare', canonicalKeyToSlug, canonicalKeyBySlug)

    expect(result.slugs).toEqual(['sea-salt'])
  })
})
