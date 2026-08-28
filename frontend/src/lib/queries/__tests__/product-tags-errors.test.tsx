import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { useUpdateProductTags } from '../products'

describe('useUpdateProductTags', () => {
  it('declares every inline product form error without a global toast', async () => {
    server.use(
      http.put('*/api/products/:productId/tags', () =>
        HttpResponse.json({ success: true, data: [] })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useUpdateProductTags(), { queryClient })

    await act(() =>
      result.current.mutateAsync({
        productId: 'product-1',
        slug: 'product-1',
        tags: [],
      })
    )

    const mutation = queryClient.getMutationCache().find({
      mutationKey: ['products', 'tags', 'update'],
    })
    expect(mutation?.meta?.handledErrorCodes).toEqual([
      'product_already_exists',
      'tag_domain_mismatch',
      'unauthorized_access',
    ])
    expect(mutation?.meta?.errorMessage).toBeUndefined()
  })
})
