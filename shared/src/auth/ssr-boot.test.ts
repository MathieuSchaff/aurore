import { describe, expect, it } from 'bun:test'

import { ssrBootQuerySchema, ssrBootResponseSchema } from './ssr-boot'

describe('ssrBootResponseSchema', () => {
  it('parses a personalized products page', () => {
    const response = {
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
            profileMatches: ['acne-imperfections'],
            requireMatches: [],
            excludeMatches: [],
            tags: [
              {
                slug: 'acne-imperfections',
                tagType: 'concern',
                relevance: 'primary',
              },
            ],
            userStatus: 'wishlist',
          },
        ],
        total: 1,
        page: 1,
        limit: 24,
        hiddenCount: 0,
        excludedLabels: [],
        requiredLabels: [],
        rulesApplied: true,
      },
    }

    expect(ssrBootResponseSchema.parse(response)).toEqual(response)
  })

  it('parses a personalized product detail page', () => {
    const response = {
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
    }

    expect(ssrBootResponseSchema.parse(response)).toEqual(response)
  })
})

describe('ssrBootQuerySchema', () => {
  it('parses products filters through the list query contract', () => {
    expect(
      ssrBootQuerySchema.parse({
        view: 'products',
        category: 'skincare',
        q: 'niacinamide',
        page: '2',
        limit: '24',
      })
    ).toEqual({
      view: 'products',
      category: 'skincare',
      q: 'niacinamide',
      page: 2,
      limit: 24,
    })
  })

  it('parses a product detail view with its slug', () => {
    expect(
      ssrBootQuerySchema.parse({
        view: 'product-detail',
        slug: 'serum-test',
      })
    ).toEqual({
      view: 'product-detail',
      slug: 'serum-test',
    })
  })
})
