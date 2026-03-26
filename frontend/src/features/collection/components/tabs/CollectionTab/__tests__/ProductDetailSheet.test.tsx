import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { ProductDetailSheet } from '../parts/ProductDetailSheet'

vi.mock('@/lib/queries/user-products', async () => {
  const actual = (await vi.importActual('@/lib/queries/user-products')) as any
  return {
    ...actual,
    useUpdateUserProduct: vi.fn(() => ({ mutate: vi.fn() })),
    useDeleteUserProduct: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
    useUpsertUserProductReview: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

vi.mock('@/lib/queries/purchases', () => ({
  useOpenPurchase: vi.fn(() => ({ mutate: vi.fn() })),
  useFinishPurchase: vi.fn(() => ({ mutate: vi.fn() })),
  useAddPurchase: vi.fn(() => ({ mutate: vi.fn() })),
}))

vi.mock('@/hooks/useScrollLock', () => ({
  useScrollLock: vi.fn(),
}))

describe('ProductDetailSheet', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    p: makeUserProduct(),
    prefs: undefined,
    activeTooltip: null,
    setActiveTooltip: vi.fn(),
    onClose: vi.fn(),
  }

  it('affiche le nom et la marque dans le header', () => {
    renderWithProviders(<ProductDetailSheet {...defaultProps} />)
    expect(screen.getByText('CeraVe Hydrating Cleanser')).toBeInTheDocument()
    expect(screen.getByText('CeraVe')).toBeInTheDocument()
  })

  it('affiche les sections de détail', () => {
    renderWithProviders(<ProductDetailSheet {...defaultProps} />)
    expect(screen.getByText('RESSENTI RAPIDE')).toBeInTheDocument()
    expect(screen.getByText('ÉVALUATION DÉTAILLÉE')).toBeInTheDocument()
    expect(screen.getByText('CYCLE DE VIE')).toBeInTheDocument()
  })

  it('appelle onClose au clic sur le bouton X', async () => {
    const onClose = vi.fn()
    renderWithProviders(<ProductDetailSheet {...defaultProps} onClose={onClose} />)
    await userEvent.click(screen.getByLabelText('Fermer le détail'))
    expect(onClose).toHaveBeenCalled()
  })

  it('appelle onClose au clic sur le backdrop', async () => {
    const onClose = vi.fn()
    renderWithProviders(<ProductDetailSheet {...defaultProps} onClose={onClose} />)
    await userEvent.click(screen.getByLabelText('Fermer le panneau'))
    expect(onClose).toHaveBeenCalled()
  })

  it('appelle onClose sur la touche Escape', async () => {
    const onClose = vi.fn()
    renderWithProviders(<ProductDetailSheet {...defaultProps} onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
