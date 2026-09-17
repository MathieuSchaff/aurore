import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { ingredientQueries, useUpdateIngredientTags } from '../ingredients'

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
