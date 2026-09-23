import {
  type IngredientFilterOptions,
  ok,
  type ProductDetail,
  type ProductDetailPage,
} from '@aurore/shared'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import {
  ingredientQueries,
  useCreateIngredient,
  useDeleteIngredient,
  useUpdateIngredient,
  useUpdateIngredientTags,
} from '../ingredients'
import { productQueries } from '../products'

const INGREDIENT = {
  id: '33333333-3333-4333-8333-333333333333',
  slug: 'retinol',
  name: 'Retinol',
  type: 'skincare',
  category: 'actif',
  canonicalKey: 'Retinol',
  description: '',
  content: '',
  createdBy: '44444444-4444-4444-8444-444444444444',
  catalogQuality: 'verified',
  moderationStatus: 'visible',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
} satisfies ApiData<(typeof api.ingredients)[':slug']['$get']>

describe('ingredient mutation convergence', () => {
  it.each(['create', 'update', 'delete'] as const)(
    'refreshes discovery and product compositions after %s',
    async (kind) => {
      let ingredient = { ...INGREDIENT }
      let exists = kind !== 'create'
      const product = PRODUCT_DETAILS[0]
      const reads = {
        list: 0,
        search: 0,
        identities: 0,
        options: 0,
        slugs: 0,
        filters: 0,
        product: 0,
        page: 0,
        detail: 0,
      }
      const names = () =>
        exists ? [{ id: ingredient.id, name: ingredient.name, slug: ingredient.slug }] : []
      const productDetail = (): ProductDetail => ({
        ...product,
        ingredients:
          exists && kind !== 'create'
            ? [
                {
                  productId: product.id,
                  ingredientId: ingredient.id,
                  concentrationValue: '0.1',
                  concentrationUnit: '%',
                  concentrationPer: null,
                  notes: null,
                  ingredientName: ingredient.name,
                  ingredientSlug: ingredient.slug,
                  ingredientCategory: ingredient.category,
                  ingredientDescription: ingredient.description,
                  ingredientCanonicalKey: ingredient.canonicalKey,
                },
              ]
            : [],
      })
      server.use(
        http.post('*/api/ingredients', () => {
          exists = true
          return HttpResponse.json(ok(ingredient), { status: 201 })
        }),
        http.patch('*/api/ingredients/:id', () => {
          ingredient = { ...ingredient, name: 'Retinol renamed' }
          return HttpResponse.json(ok(ingredient))
        }),
        http.delete('*/api/ingredients/:id', () => {
          exists = false
          return new HttpResponse(null, { status: 204 })
        }),
        http.get('*/api/ingredients/search', () => {
          reads.search++
          return HttpResponse.json(
            ok(
              names().map((item) => ({
                ...item,
                type: 'skincare',
                category: 'actif',
                canonicalKey: 'Retinol',
                filterable: kind !== 'create',
              })) satisfies ApiData<typeof api.ingredients.search.$get>
            )
          )
        }),
        http.get('*/api/ingredients/search-identities', () => {
          reads.identities++
          return HttpResponse.json(
            ok(
              names().map((item) => ({
                ...item,
                type: 'skincare',
                category: 'actif',
                canonicalKey: 'Retinol',
              })) satisfies ApiData<(typeof api.ingredients)['search-identities']['$get']>
            )
          )
        }),
        http.get('*/api/ingredients/options', () => {
          reads.options++
          return HttpResponse.json(
            ok(names() satisfies ApiData<typeof api.ingredients.options.$get>)
          )
        }),
        http.get('*/api/ingredients/by-slugs', () => {
          reads.slugs++
          return HttpResponse.json(
            ok(
              names().map(({ slug, name }) => ({ slug, name })) satisfies ApiData<
                (typeof api.ingredients)['by-slugs']['$get']
              >
            )
          )
        }),
        http.get('*/api/ingredients/filter-options', () => {
          reads.filters++
          return HttpResponse.json(ok({ tags: [] } satisfies IngredientFilterOptions))
        }),
        http.get('*/api/ingredients', () => {
          reads.list++
          const items = names().map((item) => ({
            ...item,
            type: 'skincare' as const,
            category: 'actif',
            description: '',
            profileMatches: [],
          }))
          return HttpResponse.json(
            ok({ items, total: items.length } satisfies ApiData<typeof api.ingredients.$get>)
          )
        }),
        http.get('*/api/ingredients/retinol', () => {
          reads.detail++
          return exists
            ? HttpResponse.json(ok(ingredient))
            : new HttpResponse(null, { status: 404 })
        }),
        http.get('*/api/products/:slug/page', () => {
          reads.page++
          return HttpResponse.json(
            ok({
              product: productDetail(),
              userStatus: null,
              dermoProfile: null,
              assessment: null,
              preferenceTargets: { ingredients: [], tags: [] },
            } satisfies ProductDetailPage)
          )
        }),
        http.get('*/api/products/:slug', () => {
          reads.product++
          return HttpResponse.json(ok(productDetail()))
        })
      )
      const queryClient = createTestQueryClient()
      queryClient.setDefaultOptions({ queries: { retry: false, staleTime: 60_000 } })
      const { result, unmount } = renderHookWithProviders(
        () => ({
          list: useQuery(ingredientQueries.list()),
          search: useQuery(ingredientQueries.search('ret')),
          infinite: useInfiniteQuery(ingredientQueries.searchInfinite('ret')),
          identities: useInfiniteQuery(ingredientQueries.searchDeclarableInfinite('ret')),
          options: useQuery(ingredientQueries.options()),
          slugs: useQuery(ingredientQueries.bySlugs(['retinol'])),
          filters: useQuery(ingredientQueries.filterOptions()),
          detail: useQuery({ ...ingredientQueries.bySlug('retinol'), enabled: kind !== 'create' }),
          product: useQuery(productQueries.bySlug(product.slug)),
          anonymousPage: useQuery(productQueries.detailPage(product.slug, null)),
          viewerPage: useQuery(productQueries.detailPage(product.slug, INGREDIENT.createdBy)),
          create: useCreateIngredient(),
          update: useUpdateIngredient(),
          delete: useDeleteIngredient(),
        }),
        { queryClient }
      )

      try {
        await waitFor(() => {
          expect(result.current.options.data?.map((item) => item.name)).toEqual(
            kind === 'create' ? [] : ['Retinol']
          )
          expect(reads).toEqual({
            list: 1,
            search: 2,
            identities: 1,
            options: 1,
            slugs: 1,
            filters: 1,
            product: 1,
            page: 2,
            detail: kind === 'create' ? 0 : 1,
          })
          expect(queryClient.isFetching()).toBe(0)
        })
        await act(async () => {
          if (kind === 'create')
            await result.current.create.mutateAsync({ name: 'Retinol', type: 'skincare' })
          if (kind === 'update')
            await result.current.update.mutateAsync({
              id: ingredient.id,
              data: { name: 'Retinol renamed', expectedUpdatedAt: ingredient.updatedAt },
            })
          if (kind === 'delete') await result.current.delete.mutateAsync(ingredient.id)
        })

        // Search and formula readers used to keep their old rows despite a successful CRUD response.
        await waitFor(() => {
          const expected =
            kind === 'delete' ? [] : [kind === 'update' ? 'Retinol renamed' : 'Retinol']
          expect(result.current.list.data?.items.map((item) => item.name)).toEqual(expected)
          expect(result.current.search.data?.map((item) => item.name)).toEqual(expected)
          expect(result.current.infinite.data?.pages[0]?.items.map((item) => item.name)).toEqual(
            expected
          )
          expect(result.current.identities.data?.pages[0]?.items.map((item) => item.name)).toEqual(
            expected
          )
          expect(result.current.options.data?.map((item) => item.name)).toEqual(expected)
          expect(result.current.slugs.data?.map((item) => item.name)).toEqual(expected)
          const expectedComposition = kind === 'update' ? ['Retinol renamed'] : []
          expect(
            result.current.product.data?.ingredients.map((item) => item.ingredientName)
          ).toEqual(expectedComposition)
          expect(
            result.current.anonymousPage.data?.product.ingredients.map(
              (item) => item.ingredientName
            )
          ).toEqual(expectedComposition)
          expect(
            result.current.viewerPage.data?.product.ingredients.map((item) => item.ingredientName)
          ).toEqual(expectedComposition)
          expect(reads).toEqual({
            list: 2,
            search: 4,
            identities: 2,
            options: 2,
            slugs: 2,
            filters: 2,
            product: 2,
            page: 4,
            detail: kind === 'create' ? 0 : 1,
          })
        })
        // The mounted edit page keeps its detail until its navigation callback removes it.
        expect(result.current.detail.isError).toBe(false)
        expect(result.current.detail.data?.name).toBe(
          kind === 'update' ? 'Retinol renamed' : 'Retinol'
        )
      } finally {
        unmount()
        queryClient.clear()
      }
    }
  )
})

describe('useUpdateIngredientTags', () => {
  it('invalidates tag, detail, list and filter option surfaces', async () => {
    server.use(
      http.put('*/api/ingredients/:ingredientId/tags', () =>
        HttpResponse.json({ success: true, data: [] })
      )
    )
    const queryClient = createTestQueryClient()
    const tagQuery = ingredientQueries.tags('ingredient-1')
    const detailQuery = ingredientQueries.bySlug('retinol')
    const listQuery = ingredientQueries.list()
    const filterOptionsQuery = ingredientQueries.filterOptions()
    queryClient.setQueryData(tagQuery.queryKey, [])
    queryClient.setQueryData(detailQuery.queryKey, {
      id: 'ingredient-1',
      slug: 'retinol',
      name: 'Retinol',
      type: 'skincare',
      category: 'actif',
      canonicalKey: null,
      description: '',
      content: '',
      createdBy: 'admin-1',
      catalogQuality: 'verified',
      moderationStatus: 'visible',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } satisfies ApiData<(typeof api.ingredients)[':slug']['$get']>)
    queryClient.setQueryData(listQuery.queryKey, { items: [], total: 0 })
    queryClient.setQueryData(filterOptionsQuery.queryKey, { tags: [] })

    const { result } = renderHookWithProviders(() => useUpdateIngredientTags(), { queryClient })

    await act(() =>
      result.current.mutateAsync({
        ingredientId: 'ingredient-1',
        expectedUpdatedAt: '2026-01-01T00:00:00.000Z',
        tags: [],
      })
    )

    expect(queryClient.getQueryState(tagQuery.queryKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(detailQuery.queryKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(listQuery.queryKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(filterOptionsQuery.queryKey)?.isInvalidated).toBe(true)
  })
})
