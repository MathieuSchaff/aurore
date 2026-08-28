import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from '../products'

const DISCOVERY_ROOTS = [
  ['products', 'list'],
  ['products', 'search'],
  ['products', 'search-flat'],
  ['products', 'check-duplicate'],
  ['products', 'brands'],
  ['products', 'filter-options'],
] as const

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

  it('invalidates discovery caches after updating a product', async () => {
    server.use(
      http.patch('*/api/products/:id', () =>
        HttpResponse.json({
          success: true,
          data: { id: 'product-1', slug: 'serum-test' },
        })
      )
    )
    const queryClient = createTestQueryClient()
    for (const queryKey of DISCOVERY_ROOTS) {
      queryClient.setQueryDefaults(queryKey, { gcTime: Number.POSITIVE_INFINITY })
      queryClient.setQueryData(queryKey, 'cached')
    }
    const { result } = renderHookWithProviders(() => useUpdateProduct(), { queryClient })

    await act(() => result.current.mutateAsync({ id: 'product-1', data: { name: 'Sérum test' } }))

    for (const queryKey of DISCOVERY_ROOTS) {
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
})
