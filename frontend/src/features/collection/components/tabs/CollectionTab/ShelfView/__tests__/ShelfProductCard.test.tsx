import { DndContext } from '@dnd-kit/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useUpdateUserProduct } from '@/lib/queries/user-products'
import type { UserProduct } from '@/lib/queries/user-products'
import { ShelfProductCard } from '../ShelfProductCard'

vi.mock('@/lib/queries/user-products', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/user-products')>()
  return { ...actual, useUpdateUserProduct: vi.fn() }
})

function makeProduct(overrides: Record<string, unknown> = {}): UserProduct {
  return {
    id: '1',
    userId: 'u1',
    productId: 'p1',
    status: 'in_stock',
    sentiment: 4,
    wouldRepurchase: 'yes',
    comment: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    purchases: [],
    review: null,
    product: { id: 'p1', name: 'Sérum HA', brand: 'The Ordinary' },
    ...overrides,
  } as unknown as UserProduct
}

function renderWithDnd(ui: React.ReactElement) {
  return render(<DndContext>{ui}</DndContext>)
}

describe('ShelfProductCard', () => {
  let mutate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mutate = vi.fn()
    vi.mocked(useUpdateUserProduct).mockReturnValue({ mutate } as any)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders product name and brand', () => {
    renderWithDnd(<ShelfProductCard product={makeProduct()} score={null} onClick={vi.fn()} />)
    expect(screen.getByText('Sérum HA')).toBeInTheDocument()
    expect(screen.getByText('The Ordinary')).toBeInTheDocument()
  })

  it('renders sentiment emoji when sentiment exists', () => {
    renderWithDnd(
      <ShelfProductCard product={makeProduct({ sentiment: 5 })} score={null} onClick={vi.fn()} />
    )
    expect(screen.getByText('😍')).toBeInTheDocument()
  })

  it('renders empty badge when sentiment is null', () => {
    renderWithDnd(
      <ShelfProductCard product={makeProduct({ sentiment: null })} score={null} onClick={vi.fn()} />
    )
    const badge = screen.getByRole('button', { name: /sentiment/i })
    expect(badge).toHaveClass('empty')
  })

  it('calls onClick when card body is clicked', () => {
    const onClick = vi.fn()
    renderWithDnd(<ShelfProductCard product={makeProduct()} score={null} onClick={onClick} />)
    ;(screen.getByText('Sérum HA').closest('.prod-card') as HTMLElement)?.click()
    expect(onClick).toHaveBeenCalled()
  })

  describe('sentiment cycle', () => {
    it('cycles null → 1 when sentiment is null', () => {
      renderWithDnd(
        <ShelfProductCard product={makeProduct({ sentiment: null })} score={null} onClick={vi.fn()} />
      )
      fireEvent.click(screen.getByRole('button', { name: /sentiment/i }))
      expect(mutate).toHaveBeenCalledWith({ id: '1', input: { sentiment: 1 } })
    })

    it('cycles 1 → 2', () => {
      renderWithDnd(
        <ShelfProductCard product={makeProduct({ sentiment: 1 })} score={null} onClick={vi.fn()} />
      )
      fireEvent.click(screen.getByRole('button', { name: /sentiment/i }))
      expect(mutate).toHaveBeenCalledWith({ id: '1', input: { sentiment: 2 } })
    })

    it('cycles 5 → null', () => {
      renderWithDnd(
        <ShelfProductCard product={makeProduct({ sentiment: 5 })} score={null} onClick={vi.fn()} />
      )
      fireEvent.click(screen.getByRole('button', { name: /sentiment/i }))
      expect(mutate).toHaveBeenCalledWith({ id: '1', input: { sentiment: null } })
    })

    it('resets to null for unknown sentiment value', () => {
      renderWithDnd(
        <ShelfProductCard product={makeProduct({ sentiment: 99 as any })} score={null} onClick={vi.fn()} />
      )
      fireEvent.click(screen.getByRole('button', { name: /sentiment/i }))
      expect(mutate).toHaveBeenCalledWith({ id: '1', input: { sentiment: null } })
    })
  })
})
