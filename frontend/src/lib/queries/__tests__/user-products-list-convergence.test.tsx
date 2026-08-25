import type {
  ProductDetailPage,
  ProductsPage,
  PublicProductReviewsResponse,
  UserProductStatus,
} from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { PRODUCT_DETAILS, PRODUCTS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { renderHookWithProviders } from '@/test/utils'
import { productQueries } from '../products'
import {
  useCreateUserProduct,
  useDeleteUserProduct,
  useUpdateUserProduct,
  useUpsertUserProductReview,
} from '../user-products'

const PRODUCT_ID = PRODUCTS[0].id

describe('user product list convergence', () => {
  it('refreshes the viewer list after adding a product to the shelf', async () => {
    let listCalls = 0
    let userStatus: UserProductStatus | null = null
    server.use(
      http.get('*/api/products', () => {
        listCalls++
        const data = {
          items: [{ ...PRODUCTS[0], userStatus }],
          total: 1,
          page: 1,
          limit: 20,
          hiddenCount: 0,
          excludedLabels: [],
          requiredLabels: [],
          rulesApplied: false,
        } satisfies ProductsPage
        return HttpResponse.json({
          success: true,
          data,
        })
      }),
      http.post('*/api/user-products', () => {
        userStatus = 'wishlist'
        return HttpResponse.json({
          success: true,
          data: { id: 'user-product-1', productId: PRODUCT_ID, status: userStatus },
        })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      list: useQuery(productQueries.list({}, 'user-1')),
      create: useCreateUserProduct(),
    }))

    await waitFor(() => expect(result.current.list.data?.items[0].userStatus).toBeNull())

    await act(() =>
      result.current.create.mutateAsync({ productId: PRODUCT_ID, status: 'wishlist' })
    )

    await waitFor(() => expect(result.current.list.data?.items[0].userStatus).toBe('wishlist'))
    expect(listCalls).toBe(2)
  })

  it('refreshes the viewer detail page after adding a product to the shelf', async () => {
    let detailCalls = 0
    let userStatus: UserProductStatus | null = null
    server.use(
      http.get('*/api/products/:slug/page', () => {
        detailCalls++
        const data = {
          product: PRODUCT_DETAILS[0],
          userStatus,
          dermoProfile: null,
          assessment: null,
          preferenceTargets: { ingredients: [], tags: [] },
        } satisfies ProductDetailPage
        return HttpResponse.json({
          success: true,
          data,
        })
      }),
      http.post('*/api/user-products', () => {
        userStatus = 'wishlist'
        return HttpResponse.json({
          success: true,
          data: { id: 'user-product-1', productId: PRODUCT_ID, status: userStatus },
        })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      detail: useQuery(productQueries.detailPage(PRODUCTS[0].slug, 'user-1')),
      create: useCreateUserProduct(),
    }))

    await waitFor(() => expect(result.current.detail.data?.userStatus).toBeNull())

    await act(() =>
      result.current.create.mutateAsync({ productId: PRODUCT_ID, status: 'wishlist' })
    )

    await waitFor(() => expect(result.current.detail.data?.userStatus).toBe('wishlist'))
    expect(detailCalls).toBe(2)
  })

  it('refreshes the viewer list and detail page after changing the shelf status', async () => {
    let listCalls = 0
    let detailCalls = 0
    let userStatus: UserProductStatus = 'wishlist'
    server.use(
      http.get('*/api/products', () => {
        listCalls++
        const data = {
          items: [{ ...PRODUCTS[0], userStatus }],
          total: 1,
          page: 1,
          limit: 20,
          hiddenCount: 0,
          excludedLabels: [],
          requiredLabels: [],
          rulesApplied: false,
        } satisfies ProductsPage
        return HttpResponse.json({
          success: true,
          data,
        })
      }),
      http.get('*/api/products/:slug/page', () => {
        detailCalls++
        const data = {
          product: PRODUCT_DETAILS[0],
          userStatus,
          dermoProfile: null,
          assessment: null,
          preferenceTargets: { ingredients: [], tags: [] },
        } satisfies ProductDetailPage
        return HttpResponse.json({
          success: true,
          data,
        })
      }),
      http.patch('*/api/user-products/:id', () => {
        userStatus = 'archived'
        return HttpResponse.json({
          success: true,
          data: { id: 'user-product-1', productId: PRODUCT_ID, status: userStatus },
        })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      list: useQuery(productQueries.list({}, 'user-1')),
      detail: useQuery(productQueries.detailPage(PRODUCTS[0].slug, 'user-1')),
      update: useUpdateUserProduct(),
    }))

    await waitFor(() => expect(result.current.list.data?.items[0].userStatus).toBe('wishlist'))
    await waitFor(() => expect(result.current.detail.data?.userStatus).toBe('wishlist'))

    await act(() =>
      result.current.update.mutateAsync({ id: 'user-product-1', input: { status: 'archived' } })
    )

    await waitFor(() => expect(result.current.list.data?.items[0].userStatus).toBe('archived'))
    await waitFor(() => expect(result.current.detail.data?.userStatus).toBe('archived'))
    expect(listCalls).toBe(2)
    expect(detailCalls).toBe(2)
  })

  it('refreshes the viewer list and detail page after removing a product from the shelf', async () => {
    let listCalls = 0
    let detailCalls = 0
    let userStatus: UserProductStatus | null = 'archived'
    server.use(
      http.get('*/api/products', () => {
        listCalls++
        const data = {
          items: [{ ...PRODUCTS[0], userStatus }],
          total: 1,
          page: 1,
          limit: 20,
          hiddenCount: 0,
          excludedLabels: [],
          requiredLabels: [],
          rulesApplied: false,
        } satisfies ProductsPage
        return HttpResponse.json({
          success: true,
          data,
        })
      }),
      http.get('*/api/products/:slug/page', () => {
        detailCalls++
        const data = {
          product: PRODUCT_DETAILS[0],
          userStatus,
          dermoProfile: null,
          assessment: null,
          preferenceTargets: { ingredients: [], tags: [] },
        } satisfies ProductDetailPage
        return HttpResponse.json({
          success: true,
          data,
        })
      }),
      http.delete('*/api/user-products/:id', () => {
        userStatus = null
        return new HttpResponse(null, { status: 204 })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      list: useQuery(productQueries.list({}, 'user-1')),
      detail: useQuery(productQueries.detailPage(PRODUCTS[0].slug, 'user-1')),
      remove: useDeleteUserProduct(),
    }))

    await waitFor(() => expect(result.current.list.data?.items[0].userStatus).toBe('archived'))
    await waitFor(() => expect(result.current.detail.data?.userStatus).toBe('archived'))

    await act(() => result.current.remove.mutateAsync('user-product-1'))

    await waitFor(() => expect(result.current.list.data?.items[0].userStatus).toBeNull())
    await waitFor(() => expect(result.current.detail.data?.userStatus).toBeNull())
    expect(listCalls).toBe(2)
    expect(detailCalls).toBe(2)
  })

  it('refreshes public reviews after editing an already public review', async () => {
    let publicReviewCalls = 0
    let comment = 'Avant'
    server.use(
      http.get('*/api/products/:slug/reviews/public', () => {
        publicReviewCalls++
        const data = {
          reviews: [
            {
              id: '44444444-4444-4444-8444-444444444444',
              tolerance: 4,
              efficacy: 4,
              sensoriality: null,
              stability: null,
              mixability: null,
              valueForMoney: null,
              comment,
              createdAt: '2026-08-16T08:00:00.000Z',
              reviewer: {
                username: 'alice',
                profilePublic: true,
                skinTypes: null,
                fitzpatrickType: null,
              },
            },
          ],
        } satisfies PublicProductReviewsResponse
        return HttpResponse.json({ success: true, data })
      }),
      http.put('*/api/user-products/:id/review', async ({ request }) => {
        const input = (await request.json()) as { comment: string }
        comment = input.comment
        return HttpResponse.json({
          success: true,
          data: {
            id: '44444444-4444-4444-8444-444444444444',
            userProductId: '55555555-5555-4555-8555-555555555555',
            tolerance: 4,
            efficacy: 4,
            sensoriality: null,
            stability: null,
            mixability: null,
            valueForMoney: null,
            comment,
            isPublic: true,
            ratingsPublic: true,
            createdAt: '2026-08-16T08:00:00.000Z',
            updatedAt: '2026-08-17T08:00:00.000Z',
          },
        })
      })
    )

    const { result } = renderHookWithProviders(() => ({
      reviews: useQuery(productQueries.publicReviews(PRODUCTS[0].slug)),
      updateReview: useUpsertUserProductReview(),
    }))

    await waitFor(() => expect(result.current.reviews.data?.reviews[0].comment).toBe('Avant'))

    await act(() =>
      result.current.updateReview.mutateAsync({
        id: '55555555-5555-4555-8555-555555555555',
        input: { comment: 'Après' },
      })
    )

    await waitFor(() => expect(result.current.reviews.data?.reviews[0].comment).toBe('Après'))
    expect(publicReviewCalls).toBe(2)
  })
})
