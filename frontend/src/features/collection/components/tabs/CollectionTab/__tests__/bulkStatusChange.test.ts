import { describe, expect, it, vi } from 'vitest'

import { moveProductsToStatus } from '../bulkStatusChange'

describe('moveProductsToStatus', () => {
  it('announces one partial result and returns only successful products', async () => {
    const updateStatus = vi
      .fn()
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('update failed'))
    const announce = vi.fn()

    const movedIds = await moveProductsToStatus(
      ['product-1', 'product-2'],
      'archived',
      updateStatus,
      announce
    )

    expect(movedIds).toEqual(['product-1'])
    expect(announce).toHaveBeenCalledOnce()
    expect(announce).toHaveBeenCalledWith('1 produit déplacé, 1 échec')
  })
})
