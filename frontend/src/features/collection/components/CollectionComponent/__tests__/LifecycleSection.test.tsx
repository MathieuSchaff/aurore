import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LifecycleSection } from '../LifecycleSection'

describe('LifecycleSection', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    purchases: [],
    userProductId: 'up-1',
    openPurchaseMutation: { mutate: vi.fn() } as any,
    finishPurchaseMutation: { mutate: vi.fn() } as any,
  }

  it('affiche un message si aucun achat disponible', () => {
    render(<LifecycleSection {...defaultProps} />)
    expect(screen.getByText(/Aucun flacon à ouvrir/)).toBeInTheDocument()
  })

  it('affiche un bouton "Commencer un flacon" si un achat est non ouvert', () => {
    const purchases = [{ id: 'pur-1', openedAt: null, finishedAt: null }]
    render(<LifecycleSection {...defaultProps} purchases={purchases as any} />)
    expect(screen.getByText('Commencer un flacon')).toBeInTheDocument()
  })

  it('affiche un bouton "Terminer le flacon" si un flacon est ouvert', () => {
    const purchases = [{ id: 'pur-1', openedAt: '2026-01-01', finishedAt: null }]
    render(<LifecycleSection {...defaultProps} purchases={purchases as any} />)
    expect(screen.getByText('Terminer le flacon')).toBeInTheDocument()
    expect(screen.getByText(/En cours d'utilisation depuis/)).toBeInTheDocument()
  })

  it('affiche l\'historique des flacons terminés', () => {
    const purchases = [
      { id: 'pur-1', openedAt: '2026-01-01', finishedAt: '2026-02-01' },
      { id: 'pur-2', openedAt: '2026-02-15', finishedAt: '2026-03-15' },
    ]
    render(<LifecycleSection {...defaultProps} purchases={purchases as any} />)
    expect(screen.getByText('Historique (2)')).toBeInTheDocument()
    expect(screen.getAllByText(/\d+ j/)).toHaveLength(2)
  })

  it('clic sur "Commencer un flacon" appelle openPurchaseMutation', async () => {
    const openPurchaseMutation = { mutate: vi.fn() } as any
    const purchases = [{ id: 'pur-1', openedAt: null, finishedAt: null }]
    render(
      <LifecycleSection
        {...defaultProps}
        purchases={purchases as any}
        openPurchaseMutation={openPurchaseMutation}
      />
    )

    await userEvent.click(screen.getByText('Commencer un flacon'))
    expect(openPurchaseMutation.mutate).toHaveBeenCalled()
  })

  it('clic sur "Terminer le flacon" appelle finishPurchaseMutation', async () => {
    const finishPurchaseMutation = { mutate: vi.fn() } as any
    const purchases = [{ id: 'pur-1', openedAt: '2026-01-01', finishedAt: null }]
    render(
      <LifecycleSection
        {...defaultProps}
        purchases={purchases as any}
        finishPurchaseMutation={finishPurchaseMutation}
      />
    )

    await userEvent.click(screen.getByText('Terminer le flacon'))
    expect(finishPurchaseMutation.mutate).toHaveBeenCalled()
  })
})
