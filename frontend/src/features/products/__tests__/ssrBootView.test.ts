import type { SsrBootResponse } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { productKeys, productQueries, toProductDetailPageData } from '@/lib/queries/products'
import { hasSeededSsrBootProductsPage, seedSsrBootPage, selectSsrBootView } from '../ssrBootView'

describe('selectSsrBootView', () => {
  it('maps the products route and validated search to one boot view', () => {
    expect(
      selectSsrBootView('/products', {
        category: 'skincare',
        concern: ['acne-imperfections'],
        profile_filter: true,
        page: 2,
      })
    ).toEqual({
      view: 'products',
      filters: {
        category: 'skincare',
        concern: ['acne-imperfections'],
        apply_preferences: true,
        sort: 'newest',
        page: 2,
        limit: 24,
      },
      query: {
        view: 'products',
        category: 'skincare',
        concern: 'acne-imperfections',
        apply_preferences: 'true',
        sort: 'newest',
        page: '2',
        limit: '24',
      },
    })
  })

  it('preserves the explicit show-hidden reversal in the boot list filters', () => {
    expect(
      selectSsrBootView('/products', {
        profile_filter: true,
        show_hidden: true,
      })
    ).toMatchObject({
      filters: {
        apply_preferences: true,
        include_excluded: true,
      },
      query: {
        apply_preferences: 'true',
        include_excluded: 'true',
      },
    })
  })

  it('maps a product detail route to its slugged boot view', () => {
    expect(selectSsrBootView('/products/serum-test', {})).toEqual({
      view: 'product-detail',
      slug: 'serum-test',
      query: {
        view: 'product-detail',
        slug: 'serum-test',
      },
    })
  })

  it.each(['/products/serum-test/discussions', '/products/serum-test/discussions/thread-1'])(
    'maps the nested product layout route %s to the same boot view',
    (pathname) => {
      expect(selectSsrBootView(pathname, {})).toEqual({
        view: 'product-detail',
        slug: 'serum-test',
        query: {
          view: 'product-detail',
          slug: 'serum-test',
        },
      })
    }
  )

  it.each(['/products/new', '/products/compare', '/products/serum-test/edit'])(
    'does not treat the non-layout route %s as a product detail',
    (pathname) => {
      expect(selectSsrBootView(pathname, {})).toBeUndefined()
    }
  )

  it('ignores a product detail slug rejected by the boot contract', () => {
    expect(selectSsrBootView(`/products/${'x'.repeat(201)}`, {})).toBeUndefined()
  })

  it('seeds one products entry under the first-render cache key', () => {
    const queryClient = new QueryClient()
    const view = selectSsrBootView('/products', {
      category: 'skincare',
      profile_filter: true,
    })
    if (view?.view !== 'products') throw new Error('products view was not selected')

    const boot = {
      session: {
        authenticated: true,
        userId: '019c0000-0000-7000-8000-000000000001',
        user: {
          id: '019c0000-0000-7000-8000-000000000001',
          email: 'aurore@example.test',
          createdAt: '2026-08-16T10:00:00.000Z',
          emailVerified: true,
          role: 'user',
          isDemo: false,
        },
        role: 'user',
      },
      profile: {
        userId: '019c0000-0000-7000-8000-000000000001',
        username: 'aurore-test',
        avatarUrl: null,
        links: [],
      },
      page: {
        view: 'products',
        items: [
          {
            id: '019c0000-0000-7000-8000-000000000002',
            slug: 'serum-test',
            name: 'Serum test',
            brand: 'Aurore',
            kind: 'serum',
            unit: 'pump',
            priceCents: 2500,
            totalAmount: 30,
            amountUnit: 'ml',
            imageUrl: null,
            profileMatches: [],
            requireMatches: [],
            excludeMatches: [],
            tags: [],
            userStatus: 'wishlist',
          },
        ],
        total: 1,
        page: 1,
        limit: 24,
        hiddenCount: 0,
        excludedLabels: [],
        requiredLabels: [],
        rulesApplied: false,
      },
    } satisfies SsrBootResponse

    seedSsrBootPage(queryClient, boot, view)

    const expectedKey = productQueries.list(view.filters, boot.session.userId).queryKey
    expect(queryClient.getQueryData(expectedKey)).toEqual({
      items: boot.page.items,
      total: 1,
      page: 1,
      limit: 24,
      hiddenCount: 0,
      excludedLabels: [],
      requiredLabels: [],
      rulesApplied: false,
    })
    expect(queryClient.getQueryCache().findAll({ queryKey: productKeys.lists() })).toHaveLength(1)
    expect(hasSeededSsrBootProductsPage(queryClient, view, boot.session.userId)).toBe(true)
    expect(
      hasSeededSsrBootProductsPage(queryClient, view, '019c0000-0000-7000-8000-000000000099')
    ).toBe(false)
  })

  it('seeds a product detail under the viewer key without an anonymous copy', () => {
    const queryClient = new QueryClient()
    const view = selectSsrBootView('/products/serum-test', {})
    if (view?.view !== 'product-detail') throw new Error('product detail view was not selected')

    const boot = {
      session: {
        authenticated: true,
        userId: '019c0000-0000-7000-8000-000000000001',
        user: {
          id: '019c0000-0000-7000-8000-000000000001',
          email: 'aurore@example.test',
          createdAt: '2026-08-16T10:00:00.000Z',
          emailVerified: true,
          role: 'user',
          isDemo: false,
        },
        role: 'user',
      },
      profile: {
        userId: '019c0000-0000-7000-8000-000000000001',
        username: 'aurore-test',
        avatarUrl: null,
        links: [],
      },
      page: {
        view: 'product-detail',
        product: {
          id: '019c0000-0000-7000-8000-000000000002',
          createdBy: '019c0000-0000-7000-8000-000000000003',
          name: 'Serum test',
          brand: 'Aurore',
          category: 'skincare',
          kind: 'serum',
          texture: null,
          unit: 'dropper',
          inci: 'Niacinamide',
          description: null,
          totalAmount: 30,
          amountUnit: 'ml',
          slug: 'serum-test',
          url: null,
          imageUrl: null,
          notes: null,
          priceCents: 2500,
          moderationStatus: 'visible',
          catalogQuality: 'verified',
          createdAt: '2026-08-16T09:00:00.000Z',
          updatedAt: '2026-08-16T09:00:00.000Z',
          inciCount: 1,
          hasFragrance: false,
          ingredients: [],
          tags: [],
        },
        userStatus: 'wishlist',
        dermoProfile: {
          userId: '019c0000-0000-7000-8000-000000000001',
          skinTypes: ['peau-sensible'],
          fitzpatrickType: 2,
          skinConcerns: ['anti-acne'],
          privateNotes: null,
          createdAt: '2026-08-16T08:00:00.000Z',
          updatedAt: '2026-08-16T08:00:00.000Z',
        },
        assessment: {
          explanation: {
            topDrivers: [],
            topBenefitDrivers: [],
            confidenceFactors: [],
          },
          ingredientSignals: [],
          regulatoryFindings: [],
          interactions: [],
          coverage: { matched: 1, total: 1 },
          matchedEvidence: [],
        },
        preferenceTargets: {
          ingredients: [],
          tags: [],
        },
      },
    } satisfies SsrBootResponse

    seedSsrBootPage(queryClient, boot, view)

    const { view: _view, ...detailPage } = boot.page
    expect(
      queryClient.getQueryData(productQueries.detailPage(view.slug, boot.session.userId).queryKey)
    ).toEqual(toProductDetailPageData(detailPage))
    expect(queryClient.getQueryData(productQueries.detailPage(view.slug, null).queryKey)).toBe(
      undefined
    )
  })
})
