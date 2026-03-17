import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CollectionCard, type CollectionCardProduct } from './CollectionCard'

const baseItem: CollectionCardProduct = {
  id: 'test-1',
  status: 'in_stock',
  qty: 1,
  sentiment: null,
  comment: null,
  updatedAt: '2026-01-01T00:00:00Z',
  review: null,
  product: {
    name: 'CeraVe Hydrating Cleanser',
    brand: 'CeraVe',
    kind: 'skincare',
    priceCents: 1299,
    unit: 'flacon pompe',
  },
}

describe('CollectionCard', () => {
  it('affiche le nom et la marque', () => {
    render(<CollectionCard item={baseItem} />)
    expect(screen.getByText('CeraVe Hydrating Cleanser')).toBeInTheDocument()
    expect(screen.getByText('CeraVe')).toBeInTheDocument()
  })

  it('affiche le badge de statut', () => {
    render(<CollectionCard item={baseItem} />)
    expect(screen.getByLabelText('Statut : En stock')).toBeInTheDocument()
  })

  it('affiche le prix', () => {
    render(<CollectionCard item={baseItem} />)
    expect(screen.getByText('12.99€')).toBeInTheDocument()
  })

  it("n'affiche pas de note si review null", () => {
    render(<CollectionCard item={baseItem} />)
    expect(screen.queryByLabelText(/Note/)).not.toBeInTheDocument()
  })

  it('affiche la note calculée si review renseignée', () => {
    const item: CollectionCardProduct = {
      ...baseItem,
      review: { tolerance: 4, efficacy: 4, sensoriality: 4, stability: 4, mixability: 4, valueForMoney: 4 },
    }
    render(<CollectionCard item={item} />)
    const noteEl = screen.getByLabelText(/Note/)
    expect(noteEl).toBeInTheDocument()
    expect(noteEl.textContent).toBe('16.0')
  })

  it("n'affiche pas d'emoji si sentiment null", () => {
    render(<CollectionCard item={baseItem} />)
    expect(screen.queryByLabelText(/Ressenti/)).not.toBeInTheDocument()
  })

  it('affiche l\'emoji de sentiment si renseigné', () => {
    const item: CollectionCardProduct = { ...baseItem, sentiment: 5 }
    render(<CollectionCard item={item} />)
    expect(screen.getByLabelText('Ressenti : 😍')).toBeInTheDocument()
  })

  it('statut avoided → affiche "À éviter"', () => {
    const item: CollectionCardProduct = { ...baseItem, status: 'avoided' }
    render(<CollectionCard item={item} />)
    expect(screen.getByLabelText('Statut : À éviter')).toBeInTheDocument()
  })

  it('statut holy_grail → affiche "Saint Graal"', () => {
    const item: CollectionCardProduct = { ...baseItem, status: 'holy_grail' }
    render(<CollectionCard item={item} />)
    expect(screen.getByLabelText('Statut : Saint Graal')).toBeInTheDocument()
  })

  it("n'affiche pas le badge quantité si qty = 0", () => {
    const item: CollectionCardProduct = { ...baseItem, qty: 0 }
    render(<CollectionCard item={item} />)
    expect(screen.queryByText(/flacon pompe/)).not.toBeInTheDocument()
  })
})
