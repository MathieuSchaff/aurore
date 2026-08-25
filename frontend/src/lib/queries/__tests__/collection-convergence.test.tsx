import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { collectionQueries, type FormulaMotifs } from '../collection'
import { compatibilityScoresQuery } from '../compatibility'
import { useAddProductIngredient, useUpdateProduct } from '../products'
import { useUpdateDermoProfile } from '../profile'
import {
  useBulkUpdateUserProduct,
  useCreateUserProduct,
  useDeleteUserProduct,
  useUpdateUserProduct,
} from '../user-products'

const USER_ID = '11111111-1111-4111-8111-111111111111'
const PRODUCT_ID = '22222222-2222-4222-8222-222222222222'
const USER_PRODUCT_ID = '33333333-3333-4333-8333-333333333333'
const NOW = '2026-08-21T08:00:00.000Z'

type CreatedUserProduct = ApiData<(typeof api)['user-products']['$post']>
type UpdatedProduct = ApiData<(typeof api.products)[':id']['$patch']>
type AddedProductIngredient = ApiData<(typeof api.products)[':productId']['ingredients']['$post']>

const createdUserProduct = {
  id: USER_PRODUCT_ID,
  userId: USER_ID,
  productId: PRODUCT_ID,
  status: 'in_stock',
  sentiment: null,
  wouldRepurchase: null,
  comment: null,
  ressenti: [],
  routine: [],
  preferences: [],
  createdAt: NOW,
  updatedAt: NOW,
} satisfies CreatedUserProduct

const emptyMotifs = {
  productsAnalyzed: 0,
  benefits: [],
  notes: [],
} satisfies FormulaMotifs

const populatedMotifs = {
  productsAnalyzed: 1,
  benefits: [],
  notes: [],
} satisfies FormulaMotifs

const updatedProduct = {
  ...PRODUCT_DETAILS[0],
  inci: 'Aqua, Glycerin',
  patents: [],
} satisfies UpdatedProduct

const addedProductIngredient = {
  id: '55555555-5555-4555-8555-555555555555',
  productId: PRODUCT_ID,
  ingredientId: '44444444-4444-4444-8444-444444444444',
  concentrationValue: '2',
  concentrationUnit: '%',
  concentrationPer: null,
  notes: null,
  source: 'manual',
  createdAt: NOW,
} satisfies AddedProductIngredient

describe('collection query convergence', () => {
  it('refreshes formula motifs after adding a product to the collection', async () => {
    let formulaMotifs = emptyMotifs
    let motifReads = 0
    server.use(
      http.get('*/api/collection/formula-motifs', () => {
        motifReads++
        return HttpResponse.json({ success: true, data: formulaMotifs })
      }),
      http.post('*/api/user-products', () => {
        formulaMotifs = populatedMotifs
        return HttpResponse.json({ success: true, data: createdUserProduct })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      motifs: useQuery(collectionQueries.formulaMotifs()),
      create: useCreateUserProduct(),
    }))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(0))

    await act(() =>
      result.current.create.mutateAsync({ productId: PRODUCT_ID, status: 'in_stock' })
    )

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(1))
    expect(motifReads).toBe(2)
  })

  it('refreshes formula motifs after moving a product out of the analyzed collection', async () => {
    let formulaMotifs = populatedMotifs
    let motifReads = 0
    server.use(
      http.get('*/api/collection/formula-motifs', () => {
        motifReads++
        return HttpResponse.json({ success: true, data: formulaMotifs })
      }),
      http.patch('*/api/user-products/:id', () => {
        formulaMotifs = emptyMotifs
        return HttpResponse.json({
          success: true,
          data: { ...createdUserProduct, status: 'avoided' },
        })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      motifs: useQuery(collectionQueries.formulaMotifs()),
      update: useUpdateUserProduct(),
    }))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(1))

    await act(() =>
      result.current.update.mutateAsync({ id: USER_PRODUCT_ID, input: { status: 'avoided' } })
    )

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(0))
    expect(motifReads).toBe(2)
  })

  it('refreshes formula motifs after removing a product from the collection', async () => {
    let formulaMotifs = populatedMotifs
    let motifReads = 0
    server.use(
      http.get('*/api/collection/formula-motifs', () => {
        motifReads++
        return HttpResponse.json({ success: true, data: formulaMotifs })
      }),
      http.delete('*/api/user-products/:id', () => {
        formulaMotifs = emptyMotifs
        return new HttpResponse(null, { status: 204 })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      motifs: useQuery(collectionQueries.formulaMotifs()),
      remove: useDeleteUserProduct(),
    }))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(1))

    await act(() => result.current.remove.mutateAsync(USER_PRODUCT_ID))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(0))
    expect(motifReads).toBe(2)
  })

  it('refreshes formula motifs after the dermo profile changes', async () => {
    let formulaMotifs = emptyMotifs
    let motifReads = 0
    server.use(
      http.get('*/api/collection/formula-motifs', () => {
        motifReads++
        return HttpResponse.json({ success: true, data: formulaMotifs })
      }),
      http.patch('*/api/profile/dermo', () => {
        formulaMotifs = populatedMotifs
        return HttpResponse.json({
          success: true,
          data: {
            userId: USER_ID,
            skinTypes: ['peau-sensible'],
            fitzpatrickType: null,
            skinConcerns: [],
            privateNotes: null,
            createdAt: NOW,
            updatedAt: NOW,
          },
        })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      motifs: useQuery(collectionQueries.formulaMotifs()),
      updateDermo: useUpdateDermoProfile(),
    }))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(0))

    await act(() => result.current.updateDermo.mutateAsync({ skinTypes: ['peau-sensible'] }))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(1))
    expect(motifReads).toBe(2)
  })

  it('refreshes formula motifs after a collected product formula changes', async () => {
    let formulaMotifs = emptyMotifs
    let motifReads = 0
    server.use(
      http.get('*/api/collection/formula-motifs', () => {
        motifReads++
        return HttpResponse.json({ success: true, data: formulaMotifs })
      }),
      http.patch('*/api/products/:id', () => {
        formulaMotifs = populatedMotifs
        return HttpResponse.json({ success: true, data: updatedProduct })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      motifs: useQuery(collectionQueries.formulaMotifs()),
      updateProduct: useUpdateProduct(),
    }))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(0))

    await act(() =>
      result.current.updateProduct.mutateAsync({
        id: PRODUCT_ID,
        data: { inci: 'Aqua, Glycerin' },
      })
    )

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(1))
    expect(motifReads).toBe(2)
  })

  it('refreshes formula motifs after a known concentration changes', async () => {
    let formulaMotifs = emptyMotifs
    let motifReads = 0
    server.use(
      http.get('*/api/collection/formula-motifs', () => {
        motifReads++
        return HttpResponse.json({ success: true, data: formulaMotifs })
      }),
      http.post('*/api/products/:productId/ingredients', () => {
        formulaMotifs = populatedMotifs
        return HttpResponse.json({ success: true, data: addedProductIngredient })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      motifs: useQuery(collectionQueries.formulaMotifs()),
      addIngredient: useAddProductIngredient(),
    }))

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(0))

    await act(() =>
      result.current.addIngredient.mutateAsync({
        productId: PRODUCT_ID,
        ingredientId: '44444444-4444-4444-8444-444444444444',
        slug: 'serum-test',
        concentrationValue: 2,
        concentrationUnit: '%',
      })
    )

    await waitFor(() => expect(result.current.motifs.data?.productsAnalyzed).toBe(1))
    expect(motifReads).toBe(2)
  })

  it('refreshes compatibility after upserting an existing collection product', async () => {
    let score: number | null = null
    let compatibilityReads = 0
    server.use(
      http.post('*/api/collection/compatibility-scores', () => {
        compatibilityReads++
        return HttpResponse.json({
          success: true,
          data: { scores: { [PRODUCT_ID]: score } },
        })
      }),
      http.post('*/api/user-products', () => {
        score = 91
        return HttpResponse.json({ success: true, data: createdUserProduct })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      compatibility: useQuery(compatibilityScoresQuery([PRODUCT_ID])),
      create: useCreateUserProduct(),
    }))

    await waitFor(() => expect(result.current.compatibility.data?.[PRODUCT_ID]).toBeNull())

    await act(() =>
      result.current.create.mutateAsync({ productId: PRODUCT_ID, status: 'in_stock' })
    )

    await waitFor(() => expect(result.current.compatibility.data?.[PRODUCT_ID]).toBe(91))
    expect(compatibilityReads).toBe(2)
  })

  it('declares bulk updates without a global error toast', async () => {
    server.use(
      http.patch('*/api/user-products/:id', () =>
        HttpResponse.json({ success: true, data: createdUserProduct })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useBulkUpdateUserProduct(), { queryClient })

    await act(() =>
      result.current.mutateAsync({ id: USER_PRODUCT_ID, input: { status: 'archived' } })
    )

    const mutation = queryClient.getMutationCache().find({
      mutationKey: ['user-products', 'update', 'bulk'],
    })
    expect(mutation?.meta?.errorMessage).toBeUndefined()
  })
})
