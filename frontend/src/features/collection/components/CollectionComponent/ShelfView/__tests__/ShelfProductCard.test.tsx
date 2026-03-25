import { DndContext } from '@dnd-kit/core'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { UserProduct } from '../../../../../../lib/queries/user-products'
import { ShelfProductCard } from '../ShelfProductCard'

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
  afterEach(() => cleanup())

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

  it('does not render sentiment when null', () => {
    renderWithDnd(
      <ShelfProductCard product={makeProduct({ sentiment: null })} score={null} onClick={vi.fn()} />
    )
    expect(screen.queryByText('😍')).not.toBeInTheDocument()
    expect(screen.queryByText('👍')).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    renderWithDnd(<ShelfProductCard product={makeProduct()} score={null} onClick={onClick} />)
    ;(screen.getByText('Sérum HA').closest('.shelf-card') as HTMLElement)?.click()
    expect(onClick).toHaveBeenCalled()
  })
})
