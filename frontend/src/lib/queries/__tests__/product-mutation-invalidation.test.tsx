import type { EnrichedComparison, MySubmissionItem } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { createTestQueryClient, makeUserProduct, renderHookWithProviders } from '@/test/utils'
import { catalogSubmissionQueries } from '../catalog-submissions'
import { comparisonQueries } from '../comparisons'
import {
  useAddProductIngredient,
  useCreateProduct,
  useDeleteProduct,
  useRemoveProductIngredient,
  useUpdateProduct,
  useUpdateProductTags,
} from '../products'
import { userProductQueries } from '../user-products'

const DISCOVERY_ROOTS = [
  ['products', 'list'],
  ['products', 'search'],
  ['products', 'search-flat'],
  ['products', 'check-duplicate'],
  ['products', 'brands'],
  ['products', 'filter-options'],
] as const

const submission = {
  kind: 'product',
  id: 'product-1',
  name: 'Serum test',
  brand: 'Aurore',
  slug: 'serum-test',
  catalogQuality: 'unverified',
  moderationStatus: 'visible',
  moderationReason: null,
  createdAt: '2026-09-15T08:00:00.000Z',
  updatedAt: '2026-09-15T08:00:00.000Z',
} satisfies MySubmissionItem

const product = {
  ...PRODUCT_DETAILS[0],
  id: submission.id,
  name: submission.name,
  brand: submission.brand,
  slug: submission.slug,
  patents: [],
} satisfies ApiData<(typeof api.products)[':id']['$patch']>

describe('product mutation invalidation', () => {
  it('invalidates discovery caches after creating a product', async () => {
    server.use(
      http.post('*/api/products', () =>
        HttpResponse.json({
          success: true,
          data: { id: 'product-1', slug: 'serum-test' },
        })
      )
    )
    const queryClient = createTestQueryClient()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHookWithProviders(() => useCreateProduct(), { queryClient })

    await act(() =>
      result.current.mutateAsync({
        name: 'Serum test',
        brand: 'Aurore',
        category: 'skincare',
        kind: 'serum',
        unit: 'pump',
      })
    )

    for (const queryKey of DISCOVERY_ROOTS) {
      expect(invalidate).toHaveBeenCalledWith({ queryKey })
    }
  })

  it('invalidates every cached product representation after updating a product', async () => {
    server.use(
      http.patch('*/api/products/:id', () =>
        HttpResponse.json({
          success: true,
          data: { id: 'product-1', slug: 'new-serum-slug' },
        })
      )
    )
    const queryClient = createTestQueryClient()
    const cachedKeys = [
      ...DISCOVERY_ROOTS,
      ['products', 'by-ids', 'product-1'],
      ['products', 'old-serum-slug'],
      ['products', 'detail-page', 'old-serum-slug', null],
    ] as const
    for (const queryKey of cachedKeys) {
      queryClient.setQueryDefaults(queryKey, { gcTime: Number.POSITIVE_INFINITY })
      queryClient.setQueryData(queryKey, 'cached')
    }
    const { result } = renderHookWithProviders(() => useUpdateProduct(), { queryClient })

    await act(() =>
      result.current.mutateAsync({
        id: 'product-1',
        data: { name: 'Sérum test', slug: 'new-serum-slug' },
      })
    )

    for (const queryKey of cachedKeys) {
      expect(queryClient.getQueryState(queryKey)?.isInvalidated, queryKey.join(':')).toBe(true)
    }
  })

  it('invalidates discovery and id lookup caches after deleting a product', async () => {
    server.use(http.delete('*/api/products/:id', () => new HttpResponse(null, { status: 204 })))
    const queryClient = createTestQueryClient()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHookWithProviders(() => useDeleteProduct(), { queryClient })

    await act(() => result.current.mutateAsync({ id: 'product-1', slug: 'serum-test' }))

    for (const queryKey of [...DISCOVERY_ROOTS, ['products', 'by-ids']] as const) {
      expect(invalidate).toHaveBeenCalledWith({ queryKey })
    }
  })

  it.each(['create', 'update', 'delete'] as const)(
    'refreshes the open submissions dashboard after product %s despite its fresh cache',
    async (operation) => {
      let items: MySubmissionItem[] = operation === 'create' ? [] : [submission]
      let reads = 0
      server.use(
        http.get('*/api/me/submissions', () => {
          reads++
          return HttpResponse.json({ success: true, data: { items } })
        }),
        http.post('*/api/products', () => {
          items = [submission]
          return HttpResponse.json({ success: true, data: product })
        }),
        http.patch('*/api/products/:id', () => {
          items = [{ ...submission, name: 'Serum renamed', slug: 'serum-renamed' }]
          return HttpResponse.json({
            success: true,
            data: { ...product, name: 'Serum renamed', slug: 'serum-renamed' },
          })
        }),
        http.delete('*/api/products/:id', () => {
          items = []
          return new HttpResponse(null, { status: 204 })
        })
      )
      const { result } = renderHookWithProviders(() => ({
        submissions: useQuery(catalogSubmissionQueries.mine()),
        create: useCreateProduct(),
        update: useUpdateProduct(),
        remove: useDeleteProduct(),
      }))
      const initialNames = operation === 'create' ? [] : ['Serum test']
      await waitFor(() =>
        expect(result.current.submissions.data?.items.map(({ name }) => name)).toEqual(initialNames)
      )

      await act(async () => {
        if (operation === 'create') {
          await result.current.create.mutateAsync({
            name: 'Serum test',
            brand: 'Aurore',
            category: 'skincare',
            kind: 'serum',
            unit: 'pump',
          })
        } else if (operation === 'update') {
          await result.current.update.mutateAsync({
            id: submission.id,
            data: { name: 'Serum renamed', slug: 'serum-renamed' },
          })
        } else {
          await result.current.remove.mutateAsync({ id: submission.id, slug: submission.slug })
        }
      })

      const expectedNames =
        operation === 'delete' ? [] : [operation === 'update' ? 'Serum renamed' : 'Serum test']
      await waitFor(() =>
        expect(result.current.submissions.data?.items.map(({ name }) => name)).toEqual(
          expectedNames
        )
      )
      expect(reads).toBe(2)
    }
  )

  it('keeps an open collection and comparison synchronized through catalogue edits and deletion', async () => {
    const collected = makeUserProduct()
    collected.product = { ...collected.product, id: product.id, name: product.name }
    collected.productId = product.id
    let collection = [collected]
    let comparison: EnrichedComparison = {
      id: 'comparison-1',
      name: 'My comparison',
      createdAt: submission.createdAt,
      products: [
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          kind: 'serum',
          slug: product.slug,
          imageUrl: null,
          priceCents: null,
          totalAmount: null,
          amountUnit: null,
          pricePer: null,
          tags: [],
          ingredients: [],
        },
      ],
    }
    const ingredient = {
      id: 'ingredient-link-1',
      productId: product.id,
      ingredientId: 'ingredient-1',
      concentrationValue: '2',
      concentrationUnit: '%',
      concentrationPer: null,
      notes: null,
      source: 'manual',
      createdAt: submission.createdAt,
    } satisfies ApiData<(typeof api.products)[':productId']['ingredients']['$post']>
    server.use(
      http.get('*/api/user-products', () => HttpResponse.json({ success: true, data: collection })),
      http.get('*/api/product-comparisons/:id', () =>
        HttpResponse.json({ success: true, data: comparison })
      ),
      http.get('*/api/product-comparisons', () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: comparison.id,
              name: comparison.name,
              createdAt: comparison.createdAt,
              productCount: comparison.products.length,
            },
          ],
        })
      ),
      http.patch('*/api/products/:id', () => {
        collection = [{ ...collected, product: { ...collected.product, name: 'Serum renamed' } }]
        comparison = {
          ...comparison,
          products: comparison.products.map((item) => ({ ...item, name: 'Serum renamed' })),
        }
        return HttpResponse.json({ success: true, data: { ...product, name: 'Serum renamed' } })
      }),
      http.put('*/api/products/:id/tags', () => {
        comparison = {
          ...comparison,
          products: comparison.products.map((item) => ({
            ...item,
            tags: [{ slug: 'apaisant', tagType: 'skin_effect', relevance: 'primary' }],
          })),
        }
        return HttpResponse.json({ success: true, data: [] })
      }),
      http.post('*/api/products/:id/ingredients', () => {
        comparison = {
          ...comparison,
          products: comparison.products.map((item) => ({
            ...item,
            ingredients: [
              {
                id: ingredient.ingredientId,
                inciName: 'Glycerin',
                slug: 'glycerin',
                position: 0,
                signals: [],
              },
            ],
          })),
        }
        return HttpResponse.json({ success: true, data: ingredient })
      }),
      http.delete('*/api/products/:id/ingredients/:ingredientId', () => {
        comparison = {
          ...comparison,
          products: comparison.products.map((item) => ({ ...item, ingredients: [] })),
        }
        return new HttpResponse(null, { status: 204 })
      }),
      http.delete('*/api/products/:id', () => {
        collection = []
        comparison = { ...comparison, products: [] }
        return new HttpResponse(null, { status: 204 })
      })
    )
    const queryClient = createTestQueryClient()
    queryClient.setDefaultOptions({ queries: { retry: false, staleTime: 60_000, gcTime: 0 } })
    const { result } = renderHookWithProviders(
      () => ({
        collection: useQuery(userProductQueries.list()),
        comparison: useQuery(comparisonQueries.detail(comparison.id)),
        comparisons: useQuery(comparisonQueries.list()),
        update: useUpdateProduct(),
        updateTags: useUpdateProductTags(),
        addIngredient: useAddProductIngredient(),
        removeIngredient: useRemoveProductIngredient(),
        remove: useDeleteProduct(),
      }),
      { queryClient }
    )
    await waitFor(() => {
      expect(result.current.collection.data?.[0]?.product?.name).toBe('Serum test')
      expect(result.current.comparison.data?.products[0]?.name).toBe('Serum test')
      expect(result.current.comparisons.data?.[0]?.productCount).toBe(1)
    })

    await act(() =>
      result.current.update.mutateAsync({ id: product.id, data: { name: 'Serum renamed' } })
    )
    await waitFor(() => {
      expect(result.current.collection.data?.[0]?.product?.name).toBe('Serum renamed')
      expect(result.current.comparison.data?.products[0]?.name).toBe('Serum renamed')
    })

    await act(() =>
      result.current.updateTags.mutateAsync({
        productId: product.id,
        slug: product.slug,
        tags: [{ tagId: 'tag-1', relevance: 'primary' }],
      })
    )
    await waitFor(() =>
      expect(result.current.comparison.data?.products[0]?.tags.map(({ slug }) => slug)).toEqual([
        'apaisant',
      ])
    )

    await act(() =>
      result.current.addIngredient.mutateAsync({
        productId: product.id,
        slug: product.slug,
        ingredientId: ingredient.ingredientId,
      })
    )
    await waitFor(() =>
      expect(
        result.current.comparison.data?.products[0]?.ingredients.map(({ inciName }) => inciName)
      ).toEqual(['Glycerin'])
    )

    await act(() =>
      result.current.removeIngredient.mutateAsync({
        productId: product.id,
        slug: product.slug,
        ingredientId: ingredient.ingredientId,
      })
    )
    await waitFor(() =>
      expect(result.current.comparison.data?.products[0]?.ingredients).toEqual([])
    )

    await act(() => result.current.remove.mutateAsync({ id: product.id, slug: product.slug }))
    await waitFor(() => {
      expect(result.current.collection.data).toEqual([])
      expect(result.current.comparison.data?.products).toEqual([])
      expect(result.current.comparisons.data?.[0]?.productCount).toBe(0)
    })
  })
})
