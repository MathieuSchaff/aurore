import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterPanel } from './FilterPanel'
import type { CollectionFilters, SortOption } from '../../../utils/collectionFilters'
import { DEFAULT_FILTERS } from '../../../utils/collectionFilters'

const defaultProps = {
  filters: DEFAULT_FILTERS,
  sortBy: 'name' as SortOption,
  brands: ['CeraVe', 'The Ordinary'],
  kinds: ['skincare', 'sérum'],
  onChange: vi.fn(),
  onSortChange: vi.fn(),
  onReset: vi.fn(),
}

describe('FilterPanel', () => {
  it('affiche tous les types de filtre', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByLabelText('Statut')).toBeInTheDocument()
    expect(screen.getByLabelText('Marque')).toBeInTheDocument()
    expect(screen.getByLabelText('Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Ressenti')).toBeInTheDocument()
    expect(screen.getByLabelText('Rachat ?')).toBeInTheDocument()
    expect(screen.getByLabelText('Note min.')).toBeInTheDocument()
    expect(screen.getByLabelText('Prix max (€)')).toBeInTheDocument()
    expect(screen.getByLabelText('Trier par')).toBeInTheDocument()
  })

  it("sélection d'un statut appelle onChange avec les bons filtres", async () => {
    const onChange = vi.fn()
    render(<FilterPanel {...defaultProps} onChange={onChange} />)
    await userEvent.selectOptions(screen.getByLabelText('Statut'), 'in_stock')
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'in_stock' }))
  })

  it("sélection d'une marque appelle onChange", async () => {
    const onChange = vi.fn()
    render(<FilterPanel {...defaultProps} onChange={onChange} />)
    await userEvent.selectOptions(screen.getByLabelText('Marque'), 'CeraVe')
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ brand: 'CeraVe' }))
  })

  it('le bouton reset appelle onReset', async () => {
    const onReset = vi.fn()
    const activeFilters: CollectionFilters = { ...DEFAULT_FILTERS, status: 'in_stock' }
    render(<FilterPanel {...defaultProps} filters={activeFilters} onReset={onReset} />)
    await userEvent.click(screen.getByLabelText('Réinitialiser les filtres'))
    expect(onReset).toHaveBeenCalled()
  })

  it("badge de filtres actifs s'affiche quand filtre actif", () => {
    const activeFilters: CollectionFilters = { ...DEFAULT_FILTERS, status: 'in_stock', brand: 'CeraVe' }
    render(<FilterPanel {...defaultProps} filters={activeFilters} />)
    expect(screen.getByLabelText('2 filtre(s) actif(s)')).toBeInTheDocument()
  })

  it("pas de badge quand aucun filtre actif", () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.queryByLabelText(/filtre\(s\) actif/)).not.toBeInTheDocument()
  })

  it('reset désactivé quand aucun filtre actif', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByLabelText('Réinitialiser les filtres')).toBeDisabled()
  })

  it('changement de tri appelle onSortChange', async () => {
    const onSortChange = vi.fn()
    render(<FilterPanel {...defaultProps} onSortChange={onSortChange} />)
    await userEvent.selectOptions(screen.getByLabelText('Trier par'), 'note')
    expect(onSortChange).toHaveBeenCalledWith('note')
  })
})
