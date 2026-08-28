import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { ingredientQueries, useUpdateIngredientTags } from '../ingredients'

describe('useUpdateIngredientTags', () => {
  it('invalidates tag, list and filter option surfaces', async () => {
    server.use(
      http.put('*/api/ingredients/:ingredientId/tags', () =>
        HttpResponse.json({ success: true, data: [] })
      )
    )
    const queryClient = createTestQueryClient()
    const tagQuery = ingredientQueries.tags('ingredient-1')
    const listQuery = ingredientQueries.list()
    const filterOptionsQuery = ingredientQueries.filterOptions()
    queryClient.setQueryData(tagQuery.queryKey, [])
    queryClient.setQueryData(listQuery.queryKey, { items: [], total: 0 })
    queryClient.setQueryData(filterOptionsQuery.queryKey, { tags: [] })

    const { result } = renderHookWithProviders(() => useUpdateIngredientTags(), { queryClient })

    await act(() => result.current.mutateAsync({ ingredientId: 'ingredient-1', tags: [] }))

    expect(queryClient.getQueryState(tagQuery.queryKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(listQuery.queryKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(filterOptionsQuery.queryKey)?.isInvalidated).toBe(true)
  })
})
