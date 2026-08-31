import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'
import { ShelfView } from '../ShelfView'

vi.mock('@/lib/queries/user-products', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/user-products')>()
  return {
    ...actual,
    useUpdateUserProduct: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQuery: () => ({ data: { criteriaWeights: undefined } }),
}))

function makeProduct(
  id: string,
  status: UserProduct['status'],
  name: string,
  sentiment: number | null = null
): UserProduct {
  return {
    id,
    userId: 'u1',
    productId: `p-${id}`,
    status,
    sentiment,
    wouldRepurchase: null,
    comment: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    purchases: [],
    review: null,
    product: {
      id: `p-${id}`,
      name,
      brand: 'Brand',
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
  } as unknown as UserProduct
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ShelfView', () => {
  const noop = () => {}
  const noopMany = async () => [] as string[]

  it('shows FirstTimeEmpty when products list is empty', () => {
    const onAdd = vi.fn()
    render(
      <ShelfView
        products={[]}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={onAdd}
      />
    )
    expect(screen.getByText(/étagère est vide/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /ajouter mon premier/i }))
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('Tout count reflects primary statuses only (archived + avoided excluded)', () => {
    const products = [
      makeProduct('1', 'in_stock', 'HG A', 6),
      makeProduct('2', 'in_stock', 'HG B', 6),
      makeProduct('3', 'in_stock', 'Stock A'),
      makeProduct('4', 'archived', 'Past A'), // excluded from Tout
    ]
    render(
      <ShelfView
        products={products}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )
    const tout = screen.getByRole('tab', { name: /tout/i })
    expect(tout).toHaveAttribute('aria-selected', 'true')
    expect(tout).toHaveTextContent('3')
    expect(screen.getByText(/Hors archivés et évités \(1\)/)).toBeInTheDocument()
  })

  it('filters to sentiment=6 when Saint Graal is picked from the Plus menu', () => {
    const products = [
      makeProduct('1', 'in_stock', 'Grail A', 6),
      makeProduct('2', 'in_stock', 'Stock A'),
    ]
    render(
      <ShelfView
        products={products}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )
    expect(screen.getByText('Grail A')).toBeInTheDocument()
    expect(screen.getByText('Stock A')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /plus de filtres/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /saint graal/i }))

    expect(screen.getByText('Grail A')).toBeInTheDocument()
    expect(screen.queryByText('Stock A')).not.toBeInTheDocument()
  })

  it('filters to wouldRepurchase=yes when À racheter is picked from the Plus menu', () => {
    const a = makeProduct('1', 'in_stock', 'Rachat A')
    const b = makeProduct('2', 'in_stock', 'Stock B')
    ;(a as { wouldRepurchase: 'yes' | null }).wouldRepurchase = 'yes'
    render(
      <ShelfView
        products={[a, b]}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /plus de filtres/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /à racheter/i }))
    expect(screen.getByText('Rachat A')).toBeInTheDocument()
    expect(screen.queryByText('Stock B')).not.toBeInTheDocument()
  })

  it('shows a per-shelf empty state for a status tab with no products', () => {
    const products = [makeProduct('1', 'in_stock', 'Stock A')]
    render(
      <ShelfView
        products={products}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )
    fireEvent.click(screen.getByRole('tab', { name: /wishlist/i }))
    // Target the heading: the decorative (aria-hidden) illustration carries the
    // same "Wishlist vide" text in an SVG <title>, so a plain getByText matches twice.
    expect(screen.getByRole('heading', { name: /Wishlist vide/i })).toBeInTheDocument()
  })

  it('persists the active tab in localStorage', () => {
    const products = [makeProduct('1', 'wishlist', 'Wish A')]
    const { unmount } = render(
      <ShelfView
        products={products}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )
    fireEvent.click(screen.getByRole('tab', { name: /wishlist/i }))
    expect(window.localStorage.getItem('collection:activeShelf')).toBe('wishlist')
    unmount()

    render(
      <ShelfView
        products={products}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )
    expect(screen.getByRole('tab', { name: /wishlist/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('keeps the server snapshot on Tout when another shelf is stored in the browser', () => {
    window.localStorage.setItem('collection:activeShelf', 'wishlist')

    const container = document.createElement('div')
    container.innerHTML = renderToString(
      <ShelfView
        products={[makeProduct('1', 'wishlist', 'Wish A')]}
        onStatusChange={noop}
        onStatusChangeMany={noopMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )

    expect(within(container).getByRole('tab', { name: /tout/i })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('keeps failed products selected until a bulk move finishes', async () => {
    vi.useFakeTimers()
    let resolveMove!: (movedIds: string[]) => void
    const onStatusChangeMany = vi.fn(
      () => new Promise<string[]>((resolve) => (resolveMove = resolve))
    )

    render(
      <ShelfView
        products={[
          makeProduct('1', 'in_stock', 'Stock A'),
          makeProduct('2', 'in_stock', 'Stock B'),
        ]}
        onStatusChange={noop}
        onStatusChangeMany={onStatusChangeMany}
        onToggleExpand={noop}
        onAddClick={noop}
      />
    )

    const firstCard = screen.getByRole('button', { name: /Voir les détails de .*Stock A/i })
    fireEvent.pointerDown(firstCard, { button: 0, pointerType: 'mouse', clientX: 0, clientY: 0 })
    act(() => vi.advanceTimersByTime(500))
    fireEvent.pointerUp(firstCard)
    fireEvent.click(screen.getByRole('button', { name: /Voir les détails de .*Stock B/i }))

    fireEvent.click(screen.getByRole('button', { name: /déplacer vers/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /archivé/i }))

    expect(onStatusChangeMany).toHaveBeenCalledWith(['1', '2'], 'archived')
    expect(screen.getByText('produits sélectionnés')).toBeInTheDocument()

    await act(async () => resolveMove(['1']))

    expect(screen.getByText('produit sélectionné')).toBeInTheDocument()
  })
})
