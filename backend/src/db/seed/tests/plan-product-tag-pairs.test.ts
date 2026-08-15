import { describe, expect, it } from 'bun:test'

import { SKINCARE_PRODUCT_TAG_SLUGS } from '@aurore/shared'

import { planProductTagPairs } from '../seeders/plan-product-tag-pairs'

const S = SKINCARE_PRODUCT_TAG_SLUGS

const serum = (over: { slug?: string; description?: string | null } = {}) => ({
  slug: over.slug ?? 'serum-1',
  kind: 'serum',
  category: 'skincare',
  brand: 'Marque',
  name: 'Sérum',
  description: over.description ?? null,
  inci: null,
  texture: null,
})

const shampoo = () => ({
  slug: 'shampooing-1',
  kind: 'cleanser',
  category: 'haircare',
  brand: 'Marque',
  name: 'Shampooing',
  description: null,
  inci: null,
  texture: null,
})

describe('planProductTagPairs', () => {
  it("n'émet aucune paire auto pour une catégorie hors périmètre auto-tag", () => {
    const plan = planProductTagPairs({
      products: [shampoo()],
      manual: [],
      percentClaims: [],
      brandCertifications: [],
    })
    expect(plan.pairs).toEqual([])
    expect(plan.autoSecondaryCount).toBe(0)
    expect(plan.avoidCount).toBe(0)
  })

  it('garde une paire manuelle sur un produit hors périmètre auto-tag', () => {
    const plan = planProductTagPairs({
      products: [shampoo()],
      manual: [
        { slug: 'shampooing-1', tagSlug: 'peau-sensible', relevance: 'primary', source: 'manual' },
      ],
      percentClaims: [],
      brandCertifications: [],
    })
    expect(plan.pairs).toEqual([
      { slug: 'shampooing-1', tagSlug: 'peau-sensible', relevance: 'primary', source: 'manual' },
    ])
  })

  it("compte l'émission de l'orchestrateur, pas ce qui survit à la fusion manuelle", () => {
    const withoutManual = planProductTagPairs({
      products: [serum()],
      manual: [],
      percentClaims: [],
      brandCertifications: [],
    })
    const withManual = planProductTagPairs({
      products: [serum()],
      manual: [{ slug: 'serum-1', tagSlug: S.TYPE_SERUM, relevance: 'primary', source: 'manual' }],
      percentClaims: [],
      brandCertifications: [],
    })

    expect(withoutManual.autoSecondaryCount).toBeGreaterThan(0)
    expect(withManual.autoSecondaryCount).toBe(withoutManual.autoSecondaryCount)
    expect(withManual.dupes).toBe(1)
    expect(withManual.pairs.find((p) => p.tagSlug === S.TYPE_SERUM)?.source).toBe('manual')
  })

  it('retient le tag eczema-atopie et met le produit en file de revue quand la description le contre-indique', () => {
    const plan = planProductTagPairs({
      products: [serum({ description: 'Déconseillé aux peaux atopiques.' })],
      manual: [],
      percentClaims: [],
      brandCertifications: [],
    })
    expect(plan.pairs.some((p) => p.tagSlug === S.ECZEMA_ATOPIE)).toBe(false)
    expect(plan.eczemaReviewQueue).toEqual([
      {
        slug: 'serum-1',
        name: 'Sérum',
        description: 'Déconseillé aux peaux atopiques.',
      },
    ])
  })

  it('émet le tag eczema-atopie quand la description le revendique sans contre-indication', () => {
    const plan = planProductTagPairs({
      products: [serum({ description: 'Apaise les peaux à tendance atopique.' })],
      manual: [],
      percentClaims: [],
      brandCertifications: [],
    })
    expect(plan.pairs.some((p) => p.tagSlug === S.ECZEMA_ATOPIE)).toBe(true)
    expect(plan.eczemaReviewQueue).toEqual([])
  })
})
