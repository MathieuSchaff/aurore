import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { makeUserProduct, renderWithProviders } from '../../../../../test/utils'
import { CollectionProductCard } from '../CollectionProductCard'

// Mock des hooks de mutation
vi.mock('../../../../../lib/queries/user-products', async () => {
  const actual = (await vi.importActual('../../../../../lib/queries/user-products')) as any
  return {
    ...actual,
    useUpdateUserProduct: vi.fn(() => ({ mutate: vi.fn() })),
    useDeleteUserProduct: vi.fn(() => ({ mutate: vi.fn() })),
    useUpsertUserProductReview: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

vi.mock('../../../../../lib/queries/purchases', () => ({
  useOpenPurchase: vi.fn(() => ({ mutate: vi.fn() })),
  useFinishPurchase: vi.fn(() => ({ mutate: vi.fn() })),
  useAddPurchase: vi.fn(() => ({ mutate: vi.fn() })),
}))

describe('CollectionProductCard', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    p: makeUserProduct(),
    prefs: {
      criteriaWeights: {
        tolerance: 1,
        efficacy: 1,
        sensoriality: 1,
        stability: 1,
        mixability: 1,
        valueForMoney: 1,
      },
      displayScale: 'out_of_20' as const,
      updatedAt: new Date().toISOString(),
    },
    isExpanded: false,
    onToggleExpand: vi.fn(),
    activeTooltip: null,
    setActiveTooltip: vi.fn(),
  }

  it('affiche les informations de base (nom, marque)', () => {
    renderWithProviders(<CollectionProductCard {...defaultProps} />)
    expect(screen.getByText('CeraVe Hydrating Cleanser')).toBeInTheDocument()
    expect(screen.getByText('CeraVe')).toBeInTheDocument()
  })

  it('affiche le statut', () => {
    renderWithProviders(<CollectionProductCard {...defaultProps} />)
    expect(screen.getByText('En stock')).toBeInTheDocument()
  })

  it('appelle onToggleExpand au clic sur le header', async () => {
    renderWithProviders(<CollectionProductCard {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: /CeraVe Hydrating Cleanser/ }))
    expect(defaultProps.onToggleExpand).toHaveBeenCalled()
  })

  it('affiche les détails quand isExpanded est true', () => {
    renderWithProviders(<CollectionProductCard {...defaultProps} isExpanded={true} />)
    expect(screen.getByText('RESSENTI RAPIDE')).toBeInTheDocument()
    expect(screen.getByText('ÉVALUATION DÉTAILLÉE')).toBeInTheDocument()
    expect(screen.getByText('CYCLE DE VIE')).toBeInTheDocument()
  })

  it('clic sur un emoji de sentiment appelle updateMutation', async () => {
    const { useUpdateUserProduct } = await import('../../../../../lib/queries/user-products')
    const mutate = vi.fn()
    vi.mocked(useUpdateUserProduct).mockReturnValue({ mutate } as any)

    renderWithProviders(<CollectionProductCard {...defaultProps} isExpanded={true} />)
    await userEvent.click(screen.getByText('😍'))

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: defaultProps.p.id,
        input: { sentiment: 5 },
      }),
      expect.anything()
    )
  })

  it('clic sur un bouton de rachat appelle updateMutation', async () => {
    const { useUpdateUserProduct } = await import('../../../../../lib/queries/user-products')
    const mutate = vi.fn()
    vi.mocked(useUpdateUserProduct).mockReturnValue({ mutate } as any)

    renderWithProviders(<CollectionProductCard {...defaultProps} isExpanded={true} />)
    await userEvent.click(screen.getByText('Oui'))

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { wouldRepurchase: 'yes' },
      }),
      expect.anything()
    )
  })

  it('modification du commentaire appelle updateMutation onBlur', async () => {
    const { useUpdateUserProduct } = await import('../../../../../lib/queries/user-products')
    const mutate = vi.fn()
    vi.mocked(useUpdateUserProduct).mockReturnValue({ mutate } as any)

    renderWithProviders(<CollectionProductCard {...defaultProps} isExpanded={true} />)
    const textarea = screen.getByPlaceholderText(/Un petit mot/)
    await userEvent.type(textarea, 'Super produit')
    textarea.blur()

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { comment: 'Super produit' },
      }),
      expect.anything()
    )
  })
})
