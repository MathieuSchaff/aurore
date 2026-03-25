import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'
import { ProductCardCondensed } from '../ProductCardCondensed'

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
      kind: 'skincare',
      unit: 'ml',
      priceCents: 1000,
    },
    ...overrides,
  } as unknown as UserProduct
}

describe('ProductCardCondensed', () => {
  afterEach(() => cleanup())

  it('renders product name and brand', () => {
    render(<ProductCardCondensed product={makeProduct()} score="15" onClick={vi.fn()} />)
    expect(screen.getByText('Sérum HA')).toBeInTheDocument()
    expect(screen.getByText('The Ordinary')).toBeInTheDocument()
  })

  it('renders score with /20 suffix by default', () => {
    render(<ProductCardCondensed product={makeProduct()} score="15.0" onClick={vi.fn()} />)
    expect(screen.getByText('15.0/20')).toBeInTheDocument()
  })

  it('renders score with /5 suffix for out_of_5 scale', () => {
    render(<ProductCardCondensed product={makeProduct()} score="3.8" displayScale="out_of_5" onClick={vi.fn()} />)
    expect(screen.getByText('3.8/5')).toBeInTheDocument()
  })

  it('renders score with /10 suffix for out_of_10 scale', () => {
    render(<ProductCardCondensed product={makeProduct()} score="7.5" displayScale="out_of_10" onClick={vi.fn()} />)
    expect(screen.getByText('7.5/10')).toBeInTheDocument()
  })

  it('renders percentage score without extra suffix', () => {
    render(<ProductCardCondensed product={makeProduct()} score="75%" displayScale="percentage" onClick={vi.fn()} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders sentiment emoji', () => {
    render(
      <ProductCardCondensed
        product={makeProduct({ sentiment: 5 })}
        score={null}
        onClick={vi.fn()}
        onSentimentChange={vi.fn()}
      />
    )
    expect(screen.getByText('😍')).toBeInTheDocument()
  })

  it('renders price in euros', () => {
    render(<ProductCardCondensed product={makeProduct()} score={null} onClick={vi.fn()} />)
    expect(screen.getByText('10€')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<ProductCardCondensed product={makeProduct()} score={null} onClick={onClick} />)
    screen.getByText('Sérum HA').closest('.prod-card')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onClick).toHaveBeenCalled()
  })

  describe('score corner', () => {
    it('renders score corner for gold score (≥17/20)', () => {
      const { container } = render(<ProductCardCondensed product={makeProduct()} score="18" onClick={vi.fn()} />)
      const corner = container.querySelector('.prod-score-corner')
      expect(corner).toBeInTheDocument()
      expect(corner).toHaveClass('score-gold')
    })

    it('renders score corner for rare score (≥14/20)', () => {
      const { container } = render(<ProductCardCondensed product={makeProduct()} score="15" onClick={vi.fn()} />)
      const corner = container.querySelector('.prod-score-corner')
      expect(corner).toBeInTheDocument()
      expect(corner).toHaveClass('score-rare')
    })

    it('does not render score corner for good score (10-13/20)', () => {
      const { container } = render(<ProductCardCondensed product={makeProduct()} score="12" onClick={vi.fn()} />)
      expect(container.querySelector('.prod-score-corner')).not.toBeInTheDocument()
    })

    it('does not render score corner when score is null', () => {
      const { container } = render(<ProductCardCondensed product={makeProduct()} score={null} onClick={vi.fn()} />)
      expect(container.querySelector('.prod-score-corner')).not.toBeInTheDocument()
    })

    it('renders score-gold corner at exact threshold (17/20)', () => {
      const { container } = render(<ProductCardCondensed product={makeProduct()} score="17" onClick={vi.fn()} />)
      const corner = container.querySelector('.prod-score-corner')
      expect(corner).toBeInTheDocument()
      expect(corner).toHaveClass('score-gold')
    })

    it('renders score-rare corner just below gold threshold (16/20)', () => {
      const { container } = render(<ProductCardCondensed product={makeProduct()} score="16" onClick={vi.fn()} />)
      const corner = container.querySelector('.prod-score-corner')
      expect(corner).toBeInTheDocument()
      expect(corner).toHaveClass('score-rare')
    })
  })

  describe('sentiment badge', () => {
    it('renders badge with emoji when onSentimentChange provided and sentiment set', () => {
      const { container } = render(
        <ProductCardCondensed
          product={makeProduct({ sentiment: 5 })}
          score={null}
          onClick={vi.fn()}
          onSentimentChange={vi.fn()}
        />
      )
      expect(container.querySelector('.prod-sentiment-badge')).toBeInTheDocument()
      expect(screen.getByText('😍')).toBeInTheDocument()
    })

    it('renders badge with empty class when sentiment is null', () => {
      render(
        <ProductCardCondensed
          product={makeProduct({ sentiment: null })}
          score={null}
          onClick={vi.fn()}
          onSentimentChange={vi.fn()}
        />
      )
      const badge = screen.getByRole('button', { name: /sentiment/i })
      expect(badge).toHaveClass('empty')
      expect(badge).toHaveTextContent('○')
    })

    it('does not render badge when onSentimentChange is not provided', () => {
      render(<ProductCardCondensed product={makeProduct({ sentiment: 5 })} score={null} onClick={vi.fn()} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('calls onSentimentChange and not onClick when badge is clicked', () => {
      const onClick = vi.fn()
      const onSentimentChange = vi.fn()
      render(
        <ProductCardCondensed
          product={makeProduct({ sentiment: 4 })}
          score={null}
          onClick={onClick}
          onSentimentChange={onSentimentChange}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /sentiment/i }))
      expect(onSentimentChange).toHaveBeenCalledOnce()
      expect(onClick).not.toHaveBeenCalled()
    })

    it('applies and removes popping class after badge click', () => {
      vi.useFakeTimers()
      render(
        <ProductCardCondensed
          product={makeProduct({ sentiment: 4 })}
          score={null}
          onClick={vi.fn()}
          onSentimentChange={vi.fn()}
        />
      )
      const badge = screen.getByRole('button', { name: /sentiment/i })
      fireEvent.click(badge)
      expect(badge).toHaveClass('popping')
      act(() => { vi.advanceTimersByTime(350) })
      expect(badge).not.toHaveClass('popping')
      vi.useRealTimers()
    })
  })
})
