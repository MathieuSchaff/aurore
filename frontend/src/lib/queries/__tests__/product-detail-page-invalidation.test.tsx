import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { renderHookWithProviders } from '@/test/utils'
import { productQueries } from '../products'
import { useUpdateDermoProfile, useUpsertIngredientPreference } from '../profile'

const VIEWER_ID = 'user-1'
const PRODUCT = PRODUCT_DETAILS[0]

describe('product detail page invalidation', () => {
  it('refreshes the page after the dermo profile changes', async () => {
    let detailCalls = 0
    let skinTypes: string[] = []

    server.use(
      http.get('*/api/products/:slug/page', () => {
        detailCalls++
        return HttpResponse.json({
          success: true,
          data: {
            product: PRODUCT,
            userStatus: null,
            dermoProfile: {
              userId: VIEWER_ID,
              skinTypes,
              fitzpatrickType: null,
              skinConcerns: [],
              privateNotes: null,
              createdAt: '2026-08-16T08:00:00.000Z',
              updatedAt: '2026-08-16T08:00:00.000Z',
            },
            assessment: null,
            preferenceTargets: { ingredients: [], tags: [] },
          },
        })
      }),
      http.patch('*/api/profile/dermo', async ({ request }) => {
        const input = (await request.json()) as { skinTypes?: string[] }
        skinTypes = input.skinTypes ?? []
        return HttpResponse.json({
          success: true,
          data: {
            userId: VIEWER_ID,
            skinTypes,
            fitzpatrickType: null,
            skinConcerns: [],
            privateNotes: null,
            createdAt: '2026-08-16T08:00:00.000Z',
            updatedAt: '2026-08-17T08:00:00.000Z',
          },
        })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      detail: useQuery(productQueries.detailPage(PRODUCT.slug, VIEWER_ID)),
      updateProfile: useUpdateDermoProfile(),
    }))

    await waitFor(() => expect(result.current.detail.data?.dermoProfile?.skinTypes).toEqual([]))

    await act(() => result.current.updateProfile.mutateAsync({ skinTypes: ['peau-sensible'] }))

    await waitFor(() =>
      expect(result.current.detail.data?.dermoProfile?.skinTypes).toEqual(['peau-sensible'])
    )
    expect(detailCalls).toBe(2)
  })

  it('refreshes the page after a declared ingredient preference changes', async () => {
    let detailCalls = 0
    let ingredientTargets: Array<{
      canonicalKey: string
      name: string
      stance: 'exclude'
      createdAt: string
    }> = []

    server.use(
      http.get('*/api/products/:slug/page', () => {
        detailCalls++
        return HttpResponse.json({
          success: true,
          data: {
            product: PRODUCT,
            userStatus: null,
            dermoProfile: null,
            assessment: null,
            preferenceTargets: { ingredients: ingredientTargets, tags: [] },
          },
        })
      }),
      http.put('*/api/profile/ingredient-preferences', async ({ request }) => {
        const input = (await request.json()) as { canonicalKey: string; stance: 'exclude' }
        const target = {
          ...input,
          name: 'Niacinamide',
          createdAt: '2026-08-17T08:00:00.000Z',
        }
        ingredientTargets = [target]
        return HttpResponse.json({ success: true, data: target })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      detail: useQuery(productQueries.detailPage(PRODUCT.slug, VIEWER_ID)),
      upsertPreference: useUpsertIngredientPreference(),
    }))

    await waitFor(() =>
      expect(result.current.detail.data?.preferenceTargets.ingredients).toEqual([])
    )

    await act(() =>
      result.current.upsertPreference.mutateAsync({
        canonicalKey: 'Niacinamide',
        stance: 'exclude',
      })
    )

    await waitFor(() =>
      expect(result.current.detail.data?.preferenceTargets.ingredients).toEqual(ingredientTargets)
    )
    expect(detailCalls).toBe(2)
  })
})
