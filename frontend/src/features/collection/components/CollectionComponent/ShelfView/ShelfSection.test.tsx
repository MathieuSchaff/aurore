import { DndContext } from '@dnd-kit/core'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { UserProduct } from '../../../../../lib/queries/user-products'
import { ShelfSection } from './ShelfSection'

function makeProduct(overrides: Record<string, unknown> = {}): UserProduct {
  return {
    id: '1',
    userId: 'u1',
    productId: 'p1',
    status: 'in_stock',
    sentiment: null,
    wouldRepurchase: null,
    comment: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    purchases: [],
    review: null,
    product: { id: 'p1', name: 'Sérum', brand: 'Marque' },
    ...overrides,
  } as unknown as UserProduct
}

function renderWithDnd(ui: React.ReactElement) {
  return render(<DndContext>{ui}</DndContext>)
}

describe('ShelfSection', () => {
  it('renders header with status label and count', () => {
    renderWithDnd(
      <ShelfSection
        status="in_stock"
        products={[makeProduct(), makeProduct({ id: '2' })]}
        isCollapsed={false}
        onToggleCollapse={vi.fn()}
        onProductClick={vi.fn()}
      />
    )
    expect(screen.getByText('En stock')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows products when not collapsed', () => {
    renderWithDnd(
      <ShelfSection
        status="in_stock"
        products={[makeProduct()]}
        isCollapsed={false}
        onToggleCollapse={vi.fn()}
        onProductClick={vi.fn()}
      />
    )
    expect(screen.getByText('Sérum')).toBeInTheDocument()
  })

  it('hides products when collapsed', () => {
    renderWithDnd(
      <ShelfSection
        status="in_stock"
        products={[makeProduct()]}
        isCollapsed={true}
        onToggleCollapse={vi.fn()}
        onProductClick={vi.fn()}
      />
    )
    expect(screen.queryByText('Sérum')).not.toBeInTheDocument()
  })

  it('calls onToggleCollapse when header is clicked', () => {
    const onToggle = vi.fn()
    renderWithDnd(
      <ShelfSection
        status="in_stock"
        products={[makeProduct()]}
        isCollapsed={false}
        onToggleCollapse={onToggle}
        onProductClick={vi.fn()}
      />
    )
    screen.getByText('En stock').closest('button')?.click()
    expect(onToggle).toHaveBeenCalled()
  })
})
