import { describe, expect, it } from 'bun:test'

import { buildCanonicalKeyMaps, computeLinks, resolveToken } from './main'

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

  // Real dev↔prod divergence: both carriers are skincare, so the `-hair` tie-break above gives
  // no signal and the winner falls back to the row order Postgres happens to return. Which slug
  // SHOULD win is an open decision (bugs.md, 2026-07-29: bare slug, most-linked slug, or refuse
  // the shared key at write time), so this asserts only what is already settled: one link
  // survives and both slugs were candidates. Naming a winner here would take that decision.
  it('keeps exactly one slug when two share a canonical key and neither is a domain shadow', () => {
    const key = 'SILYBUM MARIANUM FRUIT EXTRACT'
    const carriers = ['angiopausine', 'comedoclastin']

    for (const rows of [carriers, [...carriers].reverse()]) {
      const { canonicalKeyToSlug, canonicalKeyBySlug } = buildCanonicalKeyMaps(
        rows.map((slug) => ({ slug, key }))
      )

      const result = computeLinks(key, 'skincare', canonicalKeyToSlug, canonicalKeyBySlug)

      expect(result.slugs).toHaveLength(1)
      expect(carriers).toContain(result.slugs[0] as string)
    }
  })

  // A12. The routing is ranked on `ingredients.type`, never on the slug suffix nor on the file
  // that declares the slug: the haircare slug file carries 0 `// INCI:` lines, so `-hair` slugs
  // are not in the INCI index at all, and 19 of them are declared in the skincare file. Both of
  // those oracles would call the shadow a skincare row.
  describe('domain routing', () => {
    const maps = buildCanonicalKeyMaps([
      { slug: 'niacinamide', key: 'Niacinamide', type: 'skincare' },
      { slug: 'niacinamide-hair', key: 'Niacinamide', type: 'haircare' },
    ])

    const linksOf = (inci: string, category: string) =>
      computeLinks(
        inci,
        category,
        maps.canonicalKeyToSlug,
        maps.canonicalKeyBySlug,
        maps.slugsByCanonicalKey
      ).slugs

    it('sends a haircare product to the haircare sheet of the substance', () => {
      const slugs = linksOf('Aqua, Niacinamide', 'haircare')

      expect(slugs).toContain('niacinamide-hair')
      expect(slugs).not.toContain('niacinamide')
    })

    it('leaves a skincare product on the bare sheet', () => {
      const slugs = linksOf('Aqua, Niacinamide', 'skincare')

      expect(slugs).toContain('niacinamide')
      expect(slugs).not.toContain('niacinamide-hair')
    })

    it('keeps the shared sheet when the substance has none for that domain', () => {
      // What CATEGORY_DOMAIN_ALLOWLIST is for: a shared active with no domain sheet must still
      // link, or the fix silently un-links every actif a shampoo declares.
      expect(linksOf('Aqua, Retinol', 'haircare')).toContain('retinol')
    })

    it('links the substance once, whichever sheet it lands on', () => {
      const slugs = linksOf('Aqua, Niacinamide', 'haircare')

      expect(slugs.filter((s) => s.startsWith('niacinamide'))).toHaveLength(1)
    })

    // Locks the 53-link regression of the first cut: the excipient list holds only bare slugs,
    // so a filler must be caught on both sides of the swap. The probe token resolves through
    // canonicalKeyToSlug (unbridged with empty maps, asserted by the A18 test below), which is
    // the only route that lets a test aim the resolution at either twin of a real filler.
    const PROBE_TOKEN = 'Oenothera Biennis (Evening Primrose) Seed Extract*°'
    const probeKey = (() => {
      const probe = resolveToken(PROBE_TOKEN, new Map(), new Map())
      if (probe?.kind !== 'unbridged') throw new Error('probe token now bridges, pick another')
      return probe.evidenceInci
    })()
    const fillerMaps = buildCanonicalKeyMaps([
      { slug: 'aqua', key: 'Aqua', type: 'skincare' },
      { slug: 'aqua-hair', key: 'Aqua', type: 'haircare' },
    ])

    it('blocks a filler before the swap can move it to the haircare sheet', () => {
      const result = computeLinks(
        PROBE_TOKEN,
        'haircare',
        new Map([[probeKey, 'aqua']]),
        fillerMaps.canonicalKeyBySlug,
        fillerMaps.slugsByCanonicalKey
      )

      expect(result.blocked).toContain('aqua')
      expect(result.slugs).toHaveLength(0)
    })

    it('re-checks the excipient list when the swap lands on a filler', () => {
      const result = computeLinks(
        PROBE_TOKEN,
        'skincare',
        new Map([[probeKey, 'aqua-hair']]),
        fillerMaps.canonicalKeyBySlug,
        fillerMaps.slugsByCanonicalKey
      )

      expect(result.blocked).toContain('aqua')
      expect(result.slugs).toHaveLength(0)
    })
  })

  // A18: the token must stay OFF the blocklist, which cuts before the algo-derm bridge: a future
  // Oenothera extract fiche would silently never link (the Avena Sativa trap). Asserting only the
  // absent oil slug would also pass if it were blocked, hence the unbridged assertion. Both fiches
  // declare the oil; stripBotanicalParts folds the seed extract onto the flower record.
  it('leaves an Oenothera seed extract unbridged rather than on the oil fiche', () => {
    const raw = 'Oenothera Biennis (Evening Primrose) Seed Extract*°'

    const result = computeLinks(raw, 'skincare', new Map(), new Map())

    expect(result.slugs).not.toContain('huile-onagre')
    expect(result.slugs).not.toContain('evening-primrose-oil')
    expect(result.unbridged).toContain(raw)
  })
})
