import { describe, expect, it } from 'bun:test'

import {
  assertCorpusSnapshotUnchanged,
  buildCanonicalKeyMaps,
  type CorpusSnapshot,
  computeLinks,
  prepareCorpusReconcile,
  resolveToken,
  scopeReconcilePlan,
} from './main'
import { planReconcile } from './reconcile'

function corpusSnapshot(): CorpusSnapshot {
  return {
    ingredientRows: [
      {
        id: 'ingredient-niacinamide',
        slug: 'niacinamide',
        key: 'Niacinamide',
        type: 'skincare',
      },
    ],
    eligible: [
      {
        id: 'product-serum',
        slug: 'serum',
        inci: 'Niacinamide',
        category: 'skincare',
      },
    ],
    currentLinks: new Map(),
  }
}

describe('prepareCorpusReconcile', () => {
  it('closes the read transaction before planning the corpus', async () => {
    let transactionOpen = false
    const snapshot = corpusSnapshot()
    snapshot.eligible = new Proxy(snapshot.eligible, {
      get(target, property, receiver) {
        if (property === Symbol.iterator && transactionOpen) {
          throw new Error('corpus planning ran inside the read transaction')
        }
        return Reflect.get(target, property, receiver)
      },
    })

    const prepared = await prepareCorpusReconcile({
      async load() {
        transactionOpen = true
        try {
          return snapshot
        } finally {
          transactionOpen = false
        }
      },
    })

    expect(prepared.writes).toHaveLength(1)
  })

  it('does not add a generic Silybum link beside a curated proprietary active', async () => {
    const snapshot = corpusSnapshot()
    snapshot.ingredientRows = [
      {
        id: 'ingredient-fruit-extract',
        slug: 'silybum-marianum-fruit-extract',
        key: 'SILYBUM MARIANUM FRUIT EXTRACT',
        type: 'skincare',
      },
      {
        id: 'ingredient-comedoclastin',
        slug: 'comedoclastin',
        key: 'Comedoclastin',
        type: 'skincare',
      },
    ]
    const eligible = snapshot.eligible[0]
    if (!eligible) throw new Error('corpus fixture must contain one eligible product')
    snapshot.eligible[0] = {
      ...eligible,
      inci: 'Silybum Marianum Fruit Extract',
    }
    snapshot.currentLinks.set('product-serum', [
      {
        id: 'manual-comedoclastin',
        slug: 'comedoclastin',
        canonicalKey: 'Comedoclastin',
        curated: true,
      },
    ])

    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.stats.totalPairs).toBe(0)
    expect(prepared.writes).toEqual([])
  })

  it('removes an old automatic link when its canonical fallback is ambiguous', async () => {
    const token = 'Oenothera Biennis (Evening Primrose) Seed Extract*°'
    const canonicalKey = 'Oenothera Biennis Flower Extract'

    const snapshot = corpusSnapshot()
    snapshot.ingredientRows = ['candidate-a', 'candidate-b'].map((slug) => ({
      id: `ingredient-${slug}`,
      slug,
      key: canonicalKey,
      type: 'skincare',
    }))
    const eligible = snapshot.eligible[0]
    if (!eligible) throw new Error('corpus fixture must contain one eligible product')
    snapshot.eligible[0] = { ...eligible, inci: token }
    snapshot.currentLinks.set('product-serum', [
      {
        id: 'old-automatic-link',
        slug: 'candidate-a',
        canonicalKey,
        curated: false,
      },
    ])

    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.stats.collisionFreq).toEqual(new Map([[canonicalKey, 1]]))
    expect(prepared.writes).toEqual([{ inserts: [], removeIds: ['old-automatic-link'] }])
  })
})

describe('assertCorpusSnapshotUnchanged', () => {
  it('rejects a stale plan before it can be written', () => {
    const planned = corpusSnapshot()
    expect(() => assertCorpusSnapshotUnchanged(planned, corpusSnapshot())).not.toThrow()

    const changed = corpusSnapshot()
    changed.currentLinks.set('product-serum', [
      {
        id: 'manual-link',
        slug: 'vitamin-c',
        canonicalKey: 'Ascorbic Acid',
        curated: true,
      },
    ])

    expect(() => assertCorpusSnapshotUnchanged(planned, changed)).toThrow(
      'Corpus changed while links were planned; rerun link-ingredients'
    )
  })
})

describe('scopeReconcilePlan', () => {
  it('keeps only requested inserts and never deletes during a scoped relink', () => {
    const plan = planReconcile(
      [
        { id: 'stale', slug: 'stale', canonicalKey: null, curated: false },
        { id: 'manual', slug: 'manual', canonicalKey: null, curated: true },
      ],
      ['d4-record', 'other-record']
    )

    expect(scopeReconcilePlan(plan, new Set(['d4-record']))).toEqual({
      add: ['d4-record'],
      remove: [],
      keptCurated: [],
      aliasConflicts: [],
    })
  })
})

describe('computeLinks', () => {
  it('links only the four D1 Eugenia extract forms', () => {
    const d1Tokens = [
      'eugenia caryophyllus clove flower extract*',
      'EUGENIA CARYOPHYLLUS FLOWER EXTRACT',
      'Eugenia Caryophyllus Bud Extract',
      'Eugenia Caryophyllus Flower Extract',
    ]

    for (const token of d1Tokens) {
      expect(resolveToken(token, new Map(), new Map())).toEqual({
        kind: 'slug',
        slug: 'eugenia-caryophyllus-extract',
      })
    }

    expect(
      resolveToken('Eugenia Caryophyllus (Clove) Flower Extract', new Map(), new Map())
    ).toBeNull()
    expect(
      resolveToken('Eugenia Caryophyllus (Clove) Bud Extract', new Map(), new Map())
    ).toBeNull()
  })

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

  it('refuses a canonical key with two candidates in the preferred domain', () => {
    const token = 'Oenothera Biennis (Evening Primrose) Seed Extract*°'
    const key = 'Oenothera Biennis Flower Extract'
    const carriers = ['candidate-a', 'candidate-b']

    for (const rows of [carriers, [...carriers].reverse()]) {
      const maps = buildCanonicalKeyMaps(rows.map((slug) => ({ slug, key, type: 'skincare' })))
      const result = computeLinks(
        token,
        'skincare',
        maps.canonicalKeyToSlug,
        maps.canonicalKeyBySlug,
        maps.slugsByCanonicalKey
      )

      expect(result.slugs).toEqual([])
      expect(result.collisions).toEqual([key])
    }
  })

  it('links each declared Silybum material to its exact generic sheet', () => {
    const cases = [
      ['Silybum Marianum Extract', 'silybum-marianum-extract'],
      ['Silybum Marianum Fruit Extract', 'silybum-marianum-fruit-extract'],
      ['Silybum Marianum Seed Oil', 'silybum-marianum-seed-oil'],
      ['Silybum Marianum Ethyl Ester', 'silybum-marianum-ethyl-ester'],
    ] as const

    for (const [token, slug] of cases) {
      expect(computeLinks(token, 'skincare', new Map(), new Map()).slugs).toEqual([slug])
    }
  })

  // The routing is ranked on `ingredients.type`, never on the slug suffix nor on the file
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
    // canonicalKeyToSlug (unbridged with empty maps, asserted below by the test that keeps the
    // Oenothera seed extract unbridged), which is the only route that lets a test aim the
    // resolution at either twin of a real filler.
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

    // The local INCI audits call computeLinks one token at a time, and with an overridden
    // excipient list. Both used to be a private copy that missed the tie-break and put a
    // shampoo on the bare sheet, so both need to stay pinned here.
    describe('what the audits enter through', () => {
      it('routes a lone token by domain, as it does inside a declaration', () => {
        expect(linksOf('Niacinamide', 'haircare')).toEqual(['niacinamide-hair'])
        expect(linksOf('Niacinamide', 'skincare')).toEqual(['niacinamide'])
      })

      it('keeps the tie-break when the token blocklist is overridden away', () => {
        const empty = { nonDiscriminantTokens: new Set<string>() }
        const routed = (category: string) =>
          computeLinks(
            'Niacinamide',
            category,
            maps.canonicalKeyToSlug,
            maps.canonicalKeyBySlug,
            maps.slugsByCanonicalKey,
            empty
          ).slugs

        expect(routed('haircare')).toEqual(['niacinamide-hair'])
        expect(routed('skincare')).toEqual(['niacinamide'])
      })

      it('names the sheet the domain guard cut instead of dropping it silently', () => {
        // The guard fails closed on a slug whose domain is unknown or foreign, and used to drop
        // it without a word. An audit then reads the removal as unexplained historical drift.
        const foreign = buildCanonicalKeyMaps([
          { slug: 'probe-dental-sheet', key: probeKey, type: 'dental' },
        ])
        const result = computeLinks(
          PROBE_TOKEN,
          'skincare',
          new Map([[probeKey, 'probe-dental-sheet']]),
          foreign.canonicalKeyBySlug,
          foreign.slugsByCanonicalKey
        )

        expect(result.slugs).toHaveLength(0)
        expect(result.domainDropped).toContain('probe-dental-sheet')
      })

      it('reports a deferred spelling as deferred, not as a coverage gap', () => {
        expect(isDeferredInciToken('Eugenia Caryophyllus (Clove) Flower Extract')).toBe(true)
        expect(isDeferredInciToken('Eugenia Caryophyllus Flower Extract')).toBe(false)
      })
    })
  })

  // The token must stay OFF the blocklist, which cuts before the algo-derm bridge: a future
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
