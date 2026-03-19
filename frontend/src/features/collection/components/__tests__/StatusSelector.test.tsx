import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusSelector } from '../filters/StatusSelector'

describe('StatusSelector', () => {
  it('affiche les 6 options de statut', () => {
    render(<StatusSelector value="in_stock" onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(6)
  })

  it('affiche les labels corrects', () => {
    render(<StatusSelector value="in_stock" onChange={() => {}} />)
    expect(screen.getByText('En stock')).toBeInTheDocument()
    expect(screen.getByText('Wishlist')).toBeInTheDocument()
    expect(screen.getByText('Saint Graal')).toBeInTheDocument()
    expect(screen.getByText('À éviter')).toBeInTheDocument()
  })

  it('le statut actuel a aria-pressed=true', () => {
    render(<StatusSelector value="holy_grail" onChange={() => {}} />)
    const btn = screen.getByText('Saint Graal').closest('button')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('les autres statuts ont aria-pressed=false', () => {
    render(<StatusSelector value="holy_grail" onChange={() => {}} />)
    const btn = screen.getByText('En stock').closest('button')
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('clic sur un statut appelle onChange avec la bonne valeur', async () => {
    const onChange = vi.fn()
    render(<StatusSelector value="in_stock" onChange={onChange} />)
    await userEvent.click(screen.getByText('Archivé'))
    expect(onChange).toHaveBeenCalledWith('archived')
  })

  it('clic sur "À éviter" appelle onChange avec "avoided"', async () => {
    const onChange = vi.fn()
    render(<StatusSelector value="in_stock" onChange={onChange} />)
    await userEvent.click(screen.getByText('À éviter'))
    expect(onChange).toHaveBeenCalledWith('avoided')
  })
})
