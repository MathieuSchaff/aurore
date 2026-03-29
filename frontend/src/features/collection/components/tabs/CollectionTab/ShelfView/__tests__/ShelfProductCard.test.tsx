import { DndContext } from '@dnd-kit/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'
import { useUpdateUserProduct } from '@/lib/queries/user-products'
import { ShelfProductCard } from '../ShelfProductCard'

vi.mock('@/lib/queries/user-products', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/user-products')>()
  return {
    ...actual,
    useUpdateUserProduct: vi.fn(() => ({
      mutate: vi.fn(),
    })),
  }
})

function makeProduct(overrides: Partial<UserProduct> = {}): UserProduct {
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
    product: {
      id: 'p1',
      name: 'Sérum HA',
      brand: 'The Ordinary',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: null,
      url: null,
      createdBy: 'u1',
      kind: 'skincare',
      unit: 'ml',
      priceCents: 1000,
      inci: null,
      productTags: [],
    },
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

  it('renders product name', () => {
    renderWithDnd(<ShelfProductCard p={makeProduct()} onToggleExpand={vi.fn()} />)
    expect(screen.getByText('Sérum HA')).toBeInTheDocument()
  })

  it('renders sentiment emoji when sentiment exists', () => {
    renderWithDnd(<ShelfProductCard p={makeProduct({ sentiment: 5 })} onToggleExpand={vi.fn()} />)
    expect(screen.getByText('😍')).toBeInTheDocument()
  })

  it('calls onToggleExpand when card body is clicked', () => {
    const onToggleExpand = vi.fn()
    renderWithDnd(<ShelfProductCard p={makeProduct()} onToggleExpand={onToggleExpand} />)
    fireEvent.click(screen.getByText('Sérum HA'))
    expect(onToggleExpand).toHaveBeenCalled()
  })

  describe('sentiment cycle', () => {
    it('cycles null → 1 when sentiment is null', () => {
      renderWithDnd(
        <ShelfProductCard p={makeProduct({ sentiment: null })} onToggleExpand={vi.fn()} />
      )
      fireEvent.click(screen.getByText('—'))
      expect(mutate).toHaveBeenCalledWith({ id: '1', input: { sentiment: 1 } })
    })

    it('cycles 1 → 2', () => {
      renderWithDnd(<ShelfProductCard p={makeProduct({ sentiment: 1 })} onToggleExpand={vi.fn()} />)
      fireEvent.click(screen.getByText('🤢'))
      expect(mutate).toHaveBeenCalledWith({ id: '1', input: { sentiment: 2 } })
    })

    it('cycles 5 → null', () => {
      renderWithDnd(<ShelfProductCard p={makeProduct({ sentiment: 5 })} onToggleExpand={vi.fn()} />)
      fireEvent.click(screen.getByText('😍'))
      expect(mutate).toHaveBeenCalledWith({ id: '1', input: { sentiment: null } })
    })
  })
})
