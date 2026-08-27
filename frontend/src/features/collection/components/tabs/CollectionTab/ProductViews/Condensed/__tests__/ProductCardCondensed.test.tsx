import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'
import { makeUserProduct } from '@/test/utils'
import { ProductCardCondensed } from '../ProductCardCondensed'

vi.mock('@/lib/queries/user-products', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/user-products')>()
  return {
    ...actual,
    useUpdateUserProduct: vi.fn(() => ({
      mutate: vi.fn(),
    })),
  }
})

// Card reads prefs via useQuery. Stub it.
vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQuery: () => ({ data: { criteriaWeights: undefined } }),
}))

// All ratings at 4/5 unweighted = 16/20, which exercises the score-rare threshold.
function makeProduct(overrides: Partial<UserProduct> = {}) {
  return makeUserProduct({
    sentiment: 4,
    wouldRepurchase: 'yes',
    review: {
      id: 'r1',
      userProductId: '1',
      comment: null,
      tolerance: 4,
      efficacy: 4,
      sensoriality: 4,
      stability: 4,
      mixability: 4,
      valueForMoney: 4,
      isPublic: false,
      ratingsPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    product: {
      ...makeUserProduct().product,
      id: 'p1',
      name: 'Sérum HA',
      brand: 'The Ordinary',
      kind: 'serum',
      priceCents: 1000,
    },
    ...overrides,
  })
}

describe('ProductCardCondensed', () => {
  afterEach(() => cleanup())

  it('renders product name and brand', () => {
    render(<ProductCardCondensed p={makeProduct()} onToggleExpand={vi.fn()} />)
    expect(screen.getByText('Sérum HA')).toBeInTheDocument()
    expect(screen.getByText('The Ordinary')).toBeInTheDocument()
  })

  it('displays a zero catalog price', () => {
    const product = makeProduct()
    product.product.priceCents = 0

    render(<ProductCardCondensed p={product} onToggleExpand={vi.fn()} />)

    expect(screen.getByText('0.00 €')).toBeInTheDocument()
  })

  it('renders sentiment icon', () => {
    render(<ProductCardCondensed p={makeProduct({ sentiment: 5 })} onToggleExpand={vi.fn()} />)
    expect(screen.getByTitle("J'adore")).toBeInTheDocument()
  })

  it('calls onToggleExpand when clicked', () => {
    const onToggleExpand = vi.fn()
    render(<ProductCardCondensed p={makeProduct()} onToggleExpand={onToggleExpand} />)
    fireEvent.click(screen.getByText('Sérum HA'))
    expect(onToggleExpand).toHaveBeenCalled()
  })

  it('renders score corner ornament for high score', () => {
    // Ornament-only signal. All 4/5 unweighted = 16/20, which is score-rare.
    const { container } = render(
      <ProductCardCondensed p={makeProduct()} onToggleExpand={vi.fn()} />
    )
    expect(container.querySelector('.prod-score-corner.score-rare')).toBeInTheDocument()
  })
})
