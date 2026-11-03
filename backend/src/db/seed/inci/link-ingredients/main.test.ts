import { describe, expect, it } from 'bun:test'

import {
  assertCorpusSnapshotUnchanged,
  buildCanonicalKeyMaps,
  type CorpusSnapshot,
  computeLinks,
  isDeferredInciToken,
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

function supplementSnapshot(inci = 'Niacinamide, vitamine A (Retinyl Palmitate)'): CorpusSnapshot {
  const snapshot = corpusSnapshot()
  snapshot.eligible = [
    { id: 'product-supplement', slug: 'supplement', inci, category: 'complement' },
  ]
  snapshot.ingredientRows.push({
    id: 'ingredient-retinyl',
    slug: 'retinyl-palmitate',
    key: 'Retinyl Palmitate',
    type: 'skincare',
  })
  snapshot.currentLinks.set('product-supplement', [
    {
      id: 'automatic-retinyl',
      slug: 'retinyl-palmitate',
      canonicalKey: 'Retinyl Palmitate',
      curated: false,
    },
  ])
  return snapshot
}

function pigmentSnapshot(inci: string): CorpusSnapshot {
  const snapshot = corpusSnapshot()
  snapshot.eligible = [{ id: 'product-serum', slug: 'serum', category: 'skincare', inci }]
  snapshot.ingredientRows.push(
    { id: 'red', slug: 'oxide-de-fer', key: 'CI 77491', type: 'skincare' },
    { id: 'yellow', slug: 'ci-77492', key: 'CI 77492', type: 'skincare' },
    { id: 'black', slug: 'ci-77499', key: 'CI 77499', type: 'skincare' }
  )
  snapshot.currentLinks.set('product-serum', [
    { id: 'niacinamide-link', slug: 'niacinamide', canonicalKey: 'Niacinamide', curated: false },
    { id: 'red-link', slug: 'oxide-de-fer', canonicalKey: 'CI 77491', curated: false },
  ])
  return snapshot
}

describe('prepareCorpusReconcile', () => {
  it('reports ambiguous lines without creating a compound link or deleting uncertain history', async () => {
    const snapshot = pigmentSnapshot('Arginine\nPCA, Niacinamide')
    snapshot.ingredientRows.push({
      id: 'arginine-pca',
      slug: 'arginine-pca',
      key: 'Arginine PCA',
      type: 'skincare',
    })
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([])
    expect(prepared.stats.heldDeletions).toContainEqual({
      productId: 'product-serum',
      productSlug: 'serum',
      linkId: 'red-link',
      ingredientSlug: 'oxide-de-fer',
      rawTokens: ['Arginine\nPCA'],
      reason: 'unresolved-line-boundary',
    })
    expect(prepared.stats.unresolvedLineBoundaries).toEqual([
      {
        productId: 'product-serum',
        productSlug: 'serum',
        rawTokens: ['Arginine\nPCA'],
      },
    ])
    const red = snapshot.currentLinks.get('product-serum')?.find((link) => link.id === 'red-link')
    if (!red) throw new Error('Red link fixture missing')
    red.curated = true
    const curated = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(curated.writes).toEqual([])
    expect(curated.stats.keptCurated).toBe(1)
    expect(curated.stats.heldDeletions).toEqual([])
    const product = snapshot.eligible[0]
    if (!product) throw new Error('Product fixture missing')
    product.inci = 'Arginine PCA, Niacinamide'
    const repaired = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(repaired.writes).toEqual([
      {
        inserts: [{ productId: 'product-serum', ingredientId: 'arginine-pca', source: 'linker' }],
        removeIds: [],
      },
    ])
    expect(repaired.stats.unresolvedLineBoundaries).toEqual([])
    red.curated = false
    const automatic = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(automatic.writes).toEqual([
      {
        inserts: [{ productId: 'product-serum', ingredientId: 'arginine-pca', source: 'linker' }],
        removeIds: ['red-link'],
      },
    ])
  })

  it('reports non-pigment optional declarations while retaining curated and uncertain links', async () => {
    const snapshot = pigmentSnapshot('Niacinamide, [+/- Retinol]')
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([])
    expect(prepared.stats.heldDeletions).toContainEqual({
      productId: 'product-serum',
      productSlug: 'serum',
      linkId: 'red-link',
      ingredientSlug: 'oxide-de-fer',
      rawTokens: ['[+/- Retinol]'],
      reason: 'optional-declaration',
    })
    expect(prepared.stats.unresolvedOptionalDeclarations).toEqual([
      {
        productId: 'product-serum',
        productSlug: 'serum',
        rawTokens: ['[+/- Retinol]'],
      },
    ])
    const red = snapshot.currentLinks.get('product-serum')?.find((link) => link.id === 'red-link')
    if (!red) throw new Error('Red link fixture missing')
    red.curated = true
    const curated = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(curated.writes).toEqual([])
    expect(curated.stats.keptCurated).toBe(1)
    expect(curated.stats.heldDeletions).toEqual([])
  })

  it('refuses optional single pigments instead of inserting a certain link', async () => {
    const raw = '[+/- CI 77491]'
    const snapshot = pigmentSnapshot(`Niacinamide, ${raw}`)
    snapshot.currentLinks.set('product-serum', [
      { id: 'niacinamide-link', slug: 'niacinamide', canonicalKey: 'Niacinamide', curated: false },
    ])
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([])
  })

  it('links both closed CI declarations joined by an underscore before an ILN footer', async () => {
    const snapshot = pigmentSnapshot(
      'Niacinamide, IRON OXIDES (CI 77491)_IRON OXIDES(CI 77492)[ILN49864]'
    )
    snapshot.currentLinks.set('product-serum', [
      { id: 'niacinamide-link', slug: 'niacinamide', canonicalKey: 'Niacinamide', curated: false },
    ])
    const before = structuredClone(snapshot)
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([
      {
        inserts: [
          { productId: 'product-serum', ingredientId: 'red', source: 'linker' },
          { productId: 'product-serum', ingredientId: 'yellow', source: 'linker' },
        ],
        removeIds: [],
      },
    ])
    expect(prepared.stats.unresolvedCiGroups).toEqual([])
    expect(snapshot).toEqual(before)
  })

  it.each(['*', '**', ' *'])(
    'reconciles annotated CI groups without uncertainty holds: %s',
    async (suffix) => {
      const snapshot = pigmentSnapshot(
        `Niacinamide, Iron Oxides (CI 77491, CI 77492, CI 77499)${suffix}`
      )
      const before = structuredClone(snapshot)
      const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
      expect(prepared.writes).toEqual([
        {
          inserts: [
            { productId: 'product-serum', ingredientId: 'yellow', source: 'linker' },
            { productId: 'product-serum', ingredientId: 'black', source: 'linker' },
          ],
          removeIds: [],
        },
      ])
      expect(prepared.stats.unresolvedCiGroups).toEqual([])
      expect(prepared.stats.heldDeletions).toEqual([])
      expect(snapshot).toEqual(before)
    }
  )

  it('keeps a declared red pigment and adds the other identities from its CI group', async () => {
    const snapshot = pigmentSnapshot('Niacinamide, Iron Oxides (CI 77491, 77492, 77499)')
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([
      {
        inserts: [
          { productId: 'product-serum', ingredientId: 'yellow', source: 'linker' },
          { productId: 'product-serum', ingredientId: 'black', source: 'linker' },
        ],
        removeIds: [],
      },
    ])
  })

  it('resolves a CI group before the natural-origin footer without treating the footer as an ingredient', async () => {
    const snapshot = pigmentSnapshot(
      'Niacinamide, IRON OXIDES (CI 77499, CI 77491, CI 77492) 100% natural origin *organic **made using organic and non-organic ingredients'
    )
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(
      prepared.writes.flatMap((write) => write.inserts.map((row) => row.ingredientId))
    ).toEqual(['black', 'yellow'])
    expect(prepared.writes.flatMap((write) => write.removeIds)).toEqual([])
    expect(prepared.stats.unresolvedCiGroups).toEqual([])
  })

  it('holds deletions and refuses partial inserts when a CI group contains an unknown code', async () => {
    const raw = 'Iron Oxides (CI 77492, CI 99999)'
    const snapshot = pigmentSnapshot(`Niacinamide, ${raw}`)
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([])
    expect(prepared.stats.heldDeletions).toEqual([
      {
        productId: 'product-serum',
        productSlug: 'serum',
        linkId: 'red-link',
        ingredientSlug: 'oxide-de-fer',
        rawTokens: [raw],
        reason: 'unresolved-ci-group',
      },
    ])
  })

  it.each([
    [
      'joined optional list',
      'Niacinamide, +/- Mica, Iron Oxides (CI 77491)_Iron Oxides(CI 77492)[ILN49864]',
    ],
    [
      'joined may-contain list',
      'Niacinamide, May contain: Mica, Iron Oxides (CI 77491)_Iron Oxides(CI 77492)',
    ],
    ['joined unknown code', 'Niacinamide, Iron Oxides (CI 77492)_Iron Oxides(CI 99999)'],
    ['joined missing closure', 'Niacinamide, Iron Oxides (CI 77491)_Iron Oxides(CI 77492'],
    ['joined missing first closure', 'Niacinamide, Iron Oxides (CI 77491_Iron Oxides(CI 77492)'],
    ['joined nano qualifier', 'Niacinamide, Iron Oxides (CI 77491)_Iron Oxides(CI 77492) [nano]'],
    [
      'joined internal qualifier',
      'Niacinamide, Iron Oxides (CI 77491) [nano]_Iron Oxides(CI 77492)',
    ],
    ['joined non-CI suffix', 'Niacinamide, Iron Oxides (CI 77491)_Iron Oxides(CI 77492)_Parfum'],
    [
      'joined negated declaration',
      'Niacinamide, sans Iron Oxides (CI 77491)_Iron Oxides(CI 77492)',
    ],
    ['joined unknown footer', 'Niacinamide, Iron Oxides (CI 77491)_Iron Oxides(CI 77492)[other]'],
    ['optional bracket', 'Niacinamide, [+/- Iron Oxides (CI 77491, CI 77499)]'],
    ['annotated optional group', 'Niacinamide, +/- Iron Oxides (CI 77491, CI 77499)*'],
    ['annotated nano group', 'Niacinamide, Iron Oxides (CI 77491, CI 77499) (nano)*'],
    ['annotated unknown code', 'Niacinamide, Iron Oxides (CI 77491, CI 99999)*'],
    ['annotated arbitrary suffix', 'Niacinamide, Iron Oxides (CI 77491, CI 77499)* text'],
    ['internal asterisk', 'Niacinamide, Iron Oxides (CI 77491, CI 77499*)'],
    ['optional label', 'Niacinamide, May contain: Iron Oxides (CI 77491, CI 77499)'],
    ['optional whitespace', 'Niacinamide, [May   contain: Iron Oxides (CI 77491, CI 77499)]'],
    ['optional symbol', 'Niacinamide, [± Iron Oxides (CI 77491, CI 77499)]'],
    ['nano qualifier', 'Niacinamide, Iron Oxides (CI 77491, CI 77499) [nano]'],
    ['unclosed group', 'Niacinamide, Iron Oxides (CI 77491, CI 77499'],
    ['unclosed group with an implicit prefix', 'Niacinamide, Iron Oxides (CI 77491, 77499'],
    ['negated group', 'Niacinamide, sans Iron Oxides (CI 77491, CI 77499)'],
    ['unbridged pigment', 'Niacinamide, Iron Oxides (CI 77491, CI 77891)'],
  ])('preserves uncertainty without partial CI links for %s', async (_, inci) => {
    const snapshot = pigmentSnapshot(inci)
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([])
    expect(prepared.stats.heldDeletions.map((hold) => hold.linkId)).toEqual(['red-link'])
    expect(prepared.stats.heldDeletions[0]?.reason).toBe('unresolved-ci-group')
    expect(prepared.stats.unresolvedCiGroups).toHaveLength(1)
  })

  it.each([
    'Niacinamide, Iron Oxides (CI 77491/77499/CI 77491), CI 77499',
    'Niacinamide, CI 77499, Iron Oxides (CI 77491, CI 77499)',
    'Niacinamide, Iron Oxide (CI 77491)_Iron Oxides(CI 77499)_Iron Oxides(CI 77491), CI 77499',
  ])('deduplicates CI group members and separately declared pigments: %s', async (inci) => {
    const snapshot = pigmentSnapshot(inci)
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([
      {
        inserts: [{ productId: 'product-serum', ingredientId: 'black', source: 'linker' }],
        removeIds: [],
      },
    ])
  })

  it('keeps later non-CI ingredients when a pigment group has no closing parenthesis', async () => {
    const snapshot = pigmentSnapshot('Niacinamide, Iron Oxides (CI 77491, CI 77499, Parfum')
    snapshot.ingredientRows.push({
      id: 'fragrance',
      slug: 'fragrance',
      key: 'Parfum',
      type: 'skincare',
    })
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([
      {
        inserts: [{ productId: 'product-serum', ingredientId: 'fragrance', source: 'linker' }],
        removeIds: [],
      },
    ])
    expect(prepared.stats.heldDeletions[0]?.rawTokens).toEqual(['Iron Oxides (CI 77491, CI 77499'])
  })

  it.each([
    'Niacinamide, Iron Oxides (CI 77491, CI 77492, CI 77499)',
    'Niacinamide, Iron Oxides (CI 77491, CI 77492, CI 77499)*',
    'Niacinamide, Iron Oxides (CI 77492)_Iron Oxides(CI 77499)[ILN49864]',
  ])('holds the whole group when a member has no catalogue identity: %s', async (inci) => {
    const snapshot = pigmentSnapshot(inci)
    snapshot.ingredientRows = snapshot.ingredientRows.filter((row) => row.id !== 'black')
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([])
    expect(prepared.stats.heldDeletions[0]?.linkId).toBe('red-link')
  })

  it('reports an unresolved CI group even when the empty-target guard already prevents deletion', async () => {
    const raw = 'Iron Oxides (CI 77491, CI 99999)'
    const snapshot = pigmentSnapshot(raw)
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([])
    expect(prepared.stats.heldDeletions).toEqual([])
    expect(prepared.stats.unresolvedCiGroups).toEqual([
      {
        productId: 'product-serum',
        productSlug: 'serum',
        rawTokens: [raw],
      },
    ])
  })

  it('resumes deletion after an uncertain CI group becomes an explicit yellow declaration', async () => {
    const snapshot = pigmentSnapshot('Niacinamide, Iron Oxides (CI 77492)')
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })
    expect(prepared.writes).toEqual([
      {
        inserts: [{ productId: 'product-serum', ingredientId: 'yellow', source: 'linker' }],
        removeIds: ['red-link'],
      },
    ])
    expect(prepared.stats.heldDeletions).toEqual([])
  })

  it('keeps CI links with human data and scopes inserts without mutating the snapshot', async () => {
    const snapshot = pigmentSnapshot('Niacinamide, Iron Oxides (CI 77491, CI 77492, CI 77499)')
    const current = snapshot.currentLinks.get('product-serum')
    if (!current?.[1]) throw new Error('missing red fixture')
    current[1].curated = true
    const before = structuredClone(snapshot)
    const prepared = await prepareCorpusReconcile(
      { load: async () => snapshot },
      new Set(['ci-77499'])
    )
    expect(prepared.writes).toEqual([
      {
        inserts: [{ productId: 'product-serum', ingredientId: 'black', source: 'linker' }],
        removeIds: [],
      },
    ])
    expect(snapshot).toEqual(before)
  })

  it('holds automatic deletions when a supplement has an unresolved parenthetical group', async () => {
    const snapshot = supplementSnapshot()
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([
      {
        inserts: [
          {
            productId: 'product-supplement',
            ingredientId: 'ingredient-niacinamide',
            source: 'linker',
          },
        ],
        removeIds: [],
      },
    ])
  })

  it.each([
    ['one child', 'vitamine A (Retinyl Palmitate)'],
    ['several children', 'vitamine A (Retinyl Palmitate, Maltodextrin)'],
    ['unclosed group', 'vitamine A (Retinyl Palmitate'],
    ['unrelated stale link', 'mélange inconnu (autre substance)'],
    ['negated group', 'complexe sans (Retinol, Parfum)'],
  ])('reports the exact held row and unresolved token: %s', async (_, raw) => {
    const snapshot = supplementSnapshot(`Niacinamide, ${raw}`)
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.stats.heldDeletions).toEqual([
      {
        productId: 'product-supplement',
        productSlug: 'supplement',
        linkId: 'automatic-retinyl',
        ingredientSlug: 'retinyl-palmitate',
        rawTokens: [raw],
        reason: 'unresolved-parenthetical-group',
      },
    ])
    expect(prepared.writes.flatMap((write) => write.removeIds)).toEqual([])
    expect(
      prepared.writes.flatMap((write) => write.inserts.map((row) => row.ingredientId))
    ).toEqual(['ingredient-niacinamide'])
    expect(prepared.stats.keptCurated).toBe(0)
    expect(snapshot.currentLinks.get('product-supplement')?.[0]?.curated).toBe(false)
  })

  it.each([
    ['flat absence', 'Niacinamide, Maltodextrin', 'complement'],
    [
      'resolved botanical annotation',
      'Niacinamide, Helianthus Annuus (Sunflower) Seed Oil',
      'complement',
    ],
    ['resolved chemical parenthesis', 'Niacinamide, Hydrogenated Poly(C6-14 Olefin)', 'complement'],
    ['resolved but unbridged pigment', 'Niacinamide, Titanium Dioxide (CI 77891)', 'complement'],
    ['chemical decimal', 'Niacinamide, 1,2-Hexanediol', 'complement'],
    ['cosmetic group', 'Niacinamide, vitamine A (Retinyl Palmitate)', 'skincare'],
  ])('still deletes an automatic stale row after %s', async (_, inci, category) => {
    const snapshot = supplementSnapshot(inci)
    snapshot.eligible = snapshot.eligible.map((product) => ({ ...product, category }))
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes.flatMap((write) => write.removeIds)).toEqual(['automatic-retinyl'])
    expect(prepared.stats.heldDeletions).toEqual([])
  })

  it('reports the existing splitter token for a nested group without expanding it', async () => {
    const snapshot = supplementSnapshot(
      'Niacinamide, complexe (vitamine A (Retinyl Palmitate), Maltodextrin)'
    )
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.stats.heldDeletions[0]?.rawTokens).toEqual([
      'complexe (vitamine A (Retinyl Palmitate)',
    ])
    expect(prepared.writes.flatMap((write) => write.removeIds)).toEqual([])
    expect(
      prepared.writes.flatMap((write) => write.inserts.map((row) => row.ingredientId))
    ).toEqual(['ingredient-niacinamide'])
  })

  it('keeps a flat declared ingredient without an uncertainty hold', async () => {
    const snapshot = supplementSnapshot('Niacinamide, Retinyl Palmitate')
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes.flatMap((write) => write.removeIds)).toEqual([])
    expect(prepared.stats.heldDeletions).toEqual([])
  })

  it('keeps curated rows separate from uncertainty holds and leaves the snapshot intact', async () => {
    const snapshot = supplementSnapshot()
    const current = snapshot.currentLinks.get('product-supplement')
    if (!current) throw new Error('missing supplement fixture')
    current.push({
      id: 'human-retinol',
      slug: 'retinol',
      canonicalKey: 'Retinol',
      curated: true,
    })
    const before = structuredClone(snapshot)
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.stats.keptCurated).toBe(1)
    expect(prepared.stats.heldDeletions.map((hold) => hold.linkId)).toEqual(['automatic-retinyl'])
    expect(snapshot).toEqual(before)
  })

  it('does not insert an alias of an automatic row held by the guard', async () => {
    const snapshot = supplementSnapshot(
      'Niacinamide, Hyaluronic Acid, mélange inconnu (autre substance)'
    )
    snapshot.ingredientRows.push(
      { id: 'ha', slug: 'hyaluronic-acid', key: 'Hyaluronic Acid', type: 'skincare' },
      { id: 'sodium', slug: 'sodium-hyaluronate', key: 'Hyaluronic Acid', type: 'skincare' }
    )
    snapshot.currentLinks.set('product-supplement', [
      {
        id: 'automatic-sodium',
        slug: 'sodium-hyaluronate',
        canonicalKey: 'Hyaluronic Acid',
        curated: false,
      },
    ])
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(
      prepared.writes.flatMap((write) => write.inserts.map((row) => row.ingredientId))
    ).toEqual(['ingredient-niacinamide'])
    expect(prepared.stats.aliasConflicts).toBe(1)
    expect(prepared.stats.heldDeletions.map((hold) => hold.linkId)).toEqual(['automatic-sodium'])
  })

  it('does not report held deletions in an insert-only scoped relink', async () => {
    const snapshot = supplementSnapshot()
    const prepared = await prepareCorpusReconcile(
      { load: async () => snapshot },
      new Set(['niacinamide'])
    )

    expect(prepared.writes.flatMap((write) => write.removeIds)).toEqual([])
    expect(prepared.stats.heldDeletions).toEqual([])
  })

  it('leaves the empty-target protection distinct from the parenthetical guard', async () => {
    const snapshot = supplementSnapshot('vitamine A (Retinyl Palmitate)')
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([])
    expect(prepared.stats.untouchedNoTarget).toBe(1)
    expect(prepared.stats.heldDeletions).toEqual([])
  })

  it('holds collision-only deletions even when no target survives', async () => {
    const key = 'Oenothera Biennis Flower Extract'
    const snapshot = supplementSnapshot(
      'Oenothera Biennis Flower Extract*°, mélange inconnu (autre substance)'
    )
    snapshot.ingredientRows = ['candidate-a', 'candidate-b'].map((slug) => ({
      id: slug,
      slug,
      key,
      type: 'skincare',
    }))
    snapshot.currentLinks.set('product-supplement', [
      {
        id: 'automatic-collision',
        slug: 'candidate-a',
        canonicalKey: key,
        curated: false,
      },
    ])
    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([])
    expect(prepared.stats.heldDeletions.map((hold) => hold.linkId)).toEqual(['automatic-collision'])
    expect(prepared.stats.removedRows).toBe(0)
  })

  it('keeps uncertainty visible on a second plan with no effective writes', async () => {
    const snapshot = supplementSnapshot()
    const first = await prepareCorpusReconcile({ load: async () => snapshot })
    const current = snapshot.currentLinks.get('product-supplement')
    if (!current) throw new Error('missing supplement fixture')
    for (const write of first.writes) {
      for (const insert of write.inserts) {
        const ingredient = snapshot.ingredientRows.find((row) => row.id === insert.ingredientId)
        if (!ingredient) throw new Error('missing inserted ingredient')
        current.push({
          id: `simulated-${ingredient.id}`,
          slug: ingredient.slug,
          canonicalKey: ingredient.key,
          curated: false,
        })
      }
    }
    const second = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(second.writes).toEqual([])
    expect(second.stats.heldDeletions).toEqual(first.stats.heldDeletions)
    expect(second.stats.changedProducts).toBe(0)
  })

  it('preserves a manual UV-filter link when only its pigment is declared', async () => {
    const snapshot = corpusSnapshot()
    snapshot.ingredientRows.push({
      id: 'titanium-filter',
      slug: 'titanium-dioxide',
      key: 'Titanium Dioxide',
      type: 'skincare',
    })
    snapshot.eligible = [
      {
        id: 'product-serum',
        slug: 'serum',
        inci: 'Niacinamide, Titanium Dioxide [CI 77891]',
        category: 'skincare',
      },
    ]
    snapshot.currentLinks.set('product-serum', [
      { id: 'niacinamide-link', slug: 'niacinamide', canonicalKey: 'Niacinamide', curated: false },
      {
        id: 'manual-titanium',
        slug: 'titanium-dioxide',
        canonicalKey: 'Titanium Dioxide',
        curated: true,
      },
    ])

    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([])
    expect(prepared.stats.keptCurated).toBe(1)
  })

  it('plans the missing CI pigment without replacing manual ingredient links', async () => {
    const snapshot = corpusSnapshot()
    snapshot.ingredientRows = [
      { id: 'red', slug: 'oxide-de-fer', key: 'CI 77491', type: 'skincare' },
      { id: 'black', slug: 'ci-77499', key: 'CI 77499', type: 'skincare' },
      {
        id: 'vitamin-e',
        slug: 'tocopheryl-acetate',
        key: 'Tocopheryl Acetate',
        type: 'skincare',
      },
    ]
    snapshot.eligible = [
      {
        id: 'product-oil',
        slug: 'body-oil',
        inci: 'Iron Oxides (CI 77491), Iron Oxides (CI 77499)',
        category: 'skincare',
      },
    ]
    snapshot.currentLinks.set('product-oil', [
      { id: 'red-link', slug: 'oxide-de-fer', canonicalKey: 'CI 77491', curated: false },
      {
        id: 'manual-vitamin-e',
        slug: 'tocopheryl-acetate',
        canonicalKey: 'Tocopheryl Acetate',
        curated: true,
      },
    ])

    const prepared = await prepareCorpusReconcile({ load: async () => snapshot })

    expect(prepared.writes).toEqual([
      {
        inserts: [{ productId: 'product-oil', ingredientId: 'black', source: 'linker' }],
        removeIds: [],
      },
    ])
    expect(prepared.stats.changes).toEqual(['body-oil · +ci-77499'])
  })

  it('closes the read transaction before planning the corpus', async () => {
    let transactionOpen = false
    const snapshot = corpusSnapshot()
    const eligible = snapshot.eligible
    const iterate = eligible[Symbol.iterator].bind(eligible)
    Object.defineProperty(eligible, Symbol.iterator, {
      value: () => {
        if (transactionOpen) {
          throw new Error('corpus planning ran inside the read transaction')
        }
        return iterate()
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
    const token = 'Oenothera Biennis Flower Extract*°'
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
    expect(prepared.stats.changes).toEqual(['serum · -candidate-a'])
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
      heldDeletions: [],
      keptCurated: [],
      aliasConflicts: [],
    })
  })
})

describe('computeLinks', () => {
  it.each([
    ['Arginine\nPCA', [], ['Arginine\nPCA']],
    ['Fictus Plantus Extract\nNiacinamide', [], ['Fictus Plantus Extract\nNiacinamide']],
    ['Niacinamide\nPanthenol', ['niacinamide', 'panthenol'], []],
    ['Sodium\rHyaluronate', ['sodium-hyaluronate'], []],
    ['Arginine\r\nPCA, Niacinamide', ['niacinamide'], ['Arginine\r\nPCA']],
    ['Niacinamide\nPanthenol, [+/- Retinol\nSalicylic Acid]', ['niacinamide', 'panthenol'], []],
  ])('keeps uncertain lines out of catalogue targets: %s', (raw, expected, unresolved) => {
    const result = computeLinks(raw, 'skincare', new Map(), new Map())
    expect(result.slugs).toEqual(expected)
    expect(result.unresolvedLineBoundaries).toEqual(unresolved)
  })

  it('keeps certain CI members before and after an optional single pigment', () => {
    const keys = new Map([
      ['oxide-de-fer', 'CI 77491'],
      ['ci-77492', 'CI 77492'],
      ['ci-77499', 'CI 77499'],
    ])
    const slugs = new Map([...keys].map(([slug, key]) => [key, slug]))
    const result = computeLinks('CI 77491, [+/- CI 77492], CI 77499', 'skincare', slugs, keys)
    expect(result.slugs).toEqual(['oxide-de-fer', 'ci-77499'])
    expect(result.unresolvedCiGroups).toEqual(['[+/- CI 77492]'])
  })

  it.each([
    'Niacinamide, [+/- Retinol, Salicylic Acid',
    'Niacinamide, [+/- Retinol], [± Salicylic Acid]',
  ])('keeps an open or repeated optional region from becoming certain: %s', (inci) => {
    expect(computeLinks(inci, 'skincare', new Map(), new Map()).slugs).toEqual(['niacinamide'])
  })

  it.each([
    ['Niacinamide, [+/- Retinol], Salicylic Acid', ['niacinamide', 'salicylic-acid']],
    ['Retinol, [+/- Retinol]', ['retinol']],
    ['Niacinamide, May contain: Retinol, Salicylic Acid', ['niacinamide']],
    ['Niacinamide, (Peut contenir) Retinol, Salicylic Acid', ['niacinamide']],
    ['Niacinamide, (+/-)-Alpha-Tocopherol, Retinol', ['niacinamide', 'retinol']],
  ])('links only certain ingredients across an optional declaration: %s', (inci, expected) => {
    expect(computeLinks(inci, 'skincare', new Map(), new Map()).slugs).toEqual(expected)
  })

  describe('governed language aliases', () => {
    const maps = buildCanonicalKeyMaps([
      { slug: 'glycolipids', key: 'Glycolipids', type: 'skincare' },
      { slug: 'oryza-sativa-bran-oil', key: 'Oryza Sativa Bran Oil', type: 'skincare' },
    ])
    const linksOf = (inci: string) =>
      computeLinks(
        inci,
        'skincare',
        maps.canonicalKeyToSlug,
        maps.canonicalKeyBySlug,
        maps.slugsByCanonicalKey
      ).slugs

    it('links translated names to existing identities', () => {
      expect(linksOf('Glycolipides, Rice Bran Oil')).toEqual([
        'glycolipids',
        'oryza-sativa-bran-oil',
      ])
    })

    it('links bilingual rice oil once when every segment names the same identity', () => {
      expect(linksOf('Oryza Sativa Bran Oil / Rice Bran Oil')).toEqual(['oryza-sativa-bran-oil'])
      expect(linksOf('Rice Bran Oil, Oryza Sativa Bran Oil')).toEqual(['oryza-sativa-bran-oil'])
    })

    it('keeps derivatives and incomplete slash declarations separate', () => {
      for (const token of [
        'Hydrogenated Rice Bran Oil',
        'Oryza Sativa Bran Wax',
        'Oryza Sativa Bran Oil Extract',
        'Oryza Sativa Extract',
        'Rice Bran Oil / Unknownium',
        'Rice Bran Oil / Glycolipides',
      ]) {
        expect(linksOf(token)).not.toContain('oryza-sativa-bran-oil')
      }
    })
  })

  it('refuses an incomplete CI declaration even when its pigment has a catalogue sheet', () => {
    const maps = buildCanonicalKeyMaps([
      { slug: 'ci-77891', key: 'CI 77891', type: 'skincare' },
      { slug: 'titanium-dioxide', key: 'Titanium Dioxide', type: 'skincare' },
    ])
    const token = 'Titanium Dioxide (CI 77891'

    expect(resolveToken(token, maps.canonicalKeyToSlug, maps.canonicalKeyBySlug)).toBeNull()
    const result = computeLinks(token, 'skincare', maps.canonicalKeyToSlug, maps.canonicalKeyBySlug)
    expect(result.slugs).toEqual([])
    expect(result.unbridged).toEqual([])
  })

  it('leaves declared white pigment unbridged instead of borrowing the UV-filter sheet', () => {
    const maps = buildCanonicalKeyMaps([
      { slug: 'titanium-dioxide', key: 'Titanium Dioxide', type: 'skincare' },
      { slug: 'titanium-dioxide-hair', key: 'Titanium Dioxide', type: 'haircare' },
    ])

    for (const token of ['CI 77891', 'Titanium Dioxide (CI 77891)', 'Titanium Dioxide [CI77891]']) {
      expect(resolveToken(token, maps.canonicalKeyToSlug, maps.canonicalKeyBySlug)).toEqual({
        kind: 'unbridged',
        evidenceInci: 'CI 77891',
      })
      for (const category of ['skincare', 'haircare']) {
        const result = computeLinks(
          token,
          category,
          maps.canonicalKeyToSlug,
          maps.canonicalKeyBySlug,
          maps.slugsByCanonicalKey
        )
        expect(result.slugs).toEqual([])
        expect(result.unbridged).toEqual([token])
      }
    }

    expect(
      computeLinks(
        'Titanium Dioxide [nano]',
        'skincare',
        maps.canonicalKeyToSlug,
        maps.canonicalKeyBySlug
      ).slugs
    ).toEqual(['titanium-dioxide'])
  })

  it('refuses an unknown CI qualifier without borrowing the generic UV-filter name', () => {
    for (const token of ['Titanium Dioxide [CI 99999]', 'Titanium Dioxide (CI 99999']) {
      expect(resolveToken(token, new Map(), new Map())).toBeNull()
    }
  })

  it('keeps distinct iron oxide identities declared by parenthesized CI codes', () => {
    const canonicalKeyToSlug = new Map([
      ['CI 77491', 'oxide-de-fer'],
      ['CI 77499', 'ci-77499'],
    ])
    const canonicalKeyBySlug = new Map([
      ['oxide-de-fer', 'CI 77491'],
      ['ci-77499', 'CI 77499'],
    ])

    const result = computeLinks(
      'Iron Oxides (CI 77491), Iron Oxides (CI 77499)',
      'skincare',
      canonicalKeyToSlug,
      canonicalKeyBySlug
    )

    expect(result.slugs).toEqual(['oxide-de-fer', 'ci-77499'])
  })

  it('links iron oxide colours and the bentonite color index to their own sheets', () => {
    const maps = buildCanonicalKeyMaps([
      { slug: 'oxide-de-fer', key: 'CI 77491', type: 'skincare' },
      { slug: 'ci-77492', key: 'CI 77492', type: 'skincare' },
      { slug: 'ci-77499', key: 'CI 77499', type: 'skincare' },
      { slug: 'bentonite', key: 'Bentonite', type: 'skincare' },
    ])

    const result = computeLinks(
      'Iron Oxides (Yellow), Iron Oxides (Red), Iron Oxides (Black), Bentonite (Ci 77004)',
      'skincare',
      maps.canonicalKeyToSlug,
      maps.canonicalKeyBySlug,
      maps.slugsByCanonicalKey
    )

    expect(result.slugs).toEqual(['ci-77492', 'oxide-de-fer', 'ci-77499', 'bentonite'])
  })

  it('links only the four Eugenia extract forms', () => {
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
    const token = 'Oenothera Biennis Flower Extract*°'
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
      // link, or the fix silently drops the link for every actif a shampoo declares.
      expect(linksOf('Aqua, Retinol', 'haircare')).toContain('retinol')
    })

    it('links the substance once, whichever sheet it lands on', () => {
      const slugs = linksOf('Aqua, Niacinamide', 'haircare')

      expect(slugs.filter((s) => s.startsWith('niacinamide'))).toHaveLength(1)
    })

    // Locks the 53-link regression of the first cut: the excipient list holds only bare slugs,
    // so a filler must be caught on both sides of the swap. The probe token resolves through
    // canonicalKeyToSlug (unbridged with empty maps, asserted below by the test that keeps the
    // Oenothera flower extract unbridged), which is the only route that lets a test aim the
    // resolution at either twin of a real filler.
    const PROBE_TOKEN = 'Oenothera Biennis Flower Extract*°'
    const probeKey = (() => {
      const probe = resolveToken(PROBE_TOKEN, new Map(), new Map())
      // Distinguish the two ways a probe stops being usable: a new aurore sheet bridges it, or an
      // upstream resolution change drops it. Both need a new token, but not the same follow-up.
      if (probe === null) throw new Error('probe token no longer resolves, pick another')
      if (probe.kind !== 'unbridged') throw new Error('probe token now bridges, pick another')
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

    it('checks the excipient list again when the swap lands on a filler', () => {
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

  // Both Oenothera fiches declare the oil. The seed extract used to fold onto the flower record
  // through stripBotanicalParts; algo-derm's organ guard now refuses a hit whose INCI names an
  // organ the query never did, so the token resolves to nothing at all rather than to the wrong
  // organ. Kept as a regression lock: if the guard ever loosens, the seed extract must still not
  // land on the oil sheet.
  it('resolves an Oenothera seed extract to nothing rather than to the flower or oil record', () => {
    const raw = 'Oenothera Biennis (Evening Primrose) Seed Extract*°'

    const result = computeLinks(raw, 'skincare', new Map(), new Map())

    expect(resolveToken(raw, new Map(), new Map())).toBeNull()
    expect(result.slugs).toEqual([])
    // Not blocked either: the blocklist cuts before the algo-derm bridge, so a token listed there
    // would keep a future Oenothera extract fiche from ever linking (the Avena Sativa trap).
    expect(result.blocked).toEqual([])
  })

  // The oil declaration still links, which is what proves the genus is off the blocklist: the
  // assertions above would all pass on a blocked token.
  it('keeps the Oenothera oil declaration on its fiche', () => {
    expect(computeLinks('Oenothera Biennis Oil', 'skincare', new Map(), new Map()).slugs).toEqual([
      'huile-onagre',
    ])
  })

  // Guards the probe token the filler tests aim through: no aurore sheet declares the flower
  // extract, so algo-derm resolves it and the bridge finds nothing.
  it('leaves the Oenothera flower extract unbridged', () => {
    const raw = 'Oenothera Biennis Flower Extract*°'

    const result = computeLinks(raw, 'skincare', new Map(), new Map())

    expect(result.slugs).toEqual([])
    expect(result.unbridged).toContain(raw)
  })
})
