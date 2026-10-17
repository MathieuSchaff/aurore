import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { CropModal } from '../CropModal'
import { ImageUpload } from '../ImageUpload'

const { confirmCrop } = vi.hoisted(() => ({ confirmCrop: vi.fn() }))

vi.mock('../useImageUpload', () => ({
  useImageUpload: () => ({
    state: { phase: 'cropping', sourceUrl: 'blob:draft' },
    confirmCrop,
    cancel: vi.fn(),
    pickFile: vi.fn(),
    dropFile: vi.fn(),
  }),
}))

vi.mock('../CropModal', () => ({
  CropModal: ({ onConfirm }: ComponentProps<typeof CropModal>) => (
    <button type="button" onClick={() => void onConfirm({ x: 0, y: 0, size: 1200 })}>
      Prepare image
    </button>
  ),
}))

describe('draft image preparation', () => {
  it.each([true, false])('releases the form after preparation succeeds=%s', async (succeeds) => {
    const completion = Promise.withResolvers<{ url: string }>()
    confirmCrop.mockReturnValueOnce(completion.promise)
    const onBusyChange = vi.fn()
    const onSuccess = vi.fn()
    render(
      <ImageUpload
        shape="square"
        outputSize={1200}
        endpoint="/api/uploads/product/draft?draft=true"
        alt="Draft image"
        notFoundLabel="Produit"
        onBusyChange={onBusyChange}
        onSuccess={onSuccess}
        successMessage="Image préparée"
      />
    )

    await userEvent.click(await screen.findByRole('button', { name: 'Prepare image' }))
    expect(onBusyChange).toHaveBeenLastCalledWith(true)
    expect(onSuccess).not.toHaveBeenCalled()
    if (succeeds) completion.resolve({ url: 'https://cdn.example.com/draft.webp' })
    else completion.reject(new Error('Upload failed'))
    await waitFor(() => expect(onBusyChange).toHaveBeenLastCalledWith(false))
    if (succeeds) expect(onSuccess).toHaveBeenCalledWith('https://cdn.example.com/draft.webp')
    else expect(onSuccess).not.toHaveBeenCalled()
  })
})
