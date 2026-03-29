import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { ProductCardDetailed } from '../ProductCardDetailed'

// Mock des hooks de mutation
vi.mock('@/lib/queries/user-products', async () => {
  const actual = (await vi.importActual('@/lib/queries/user-products')) as any
  return {
    ...actual,
    useUpdateUserProduct: vi.fn(() => ({ mutate: vi.fn() })),
    useDeleteUserProduct: vi.fn(() => ({ mutate: vi.fn() })),
    useUpsertUserProductReview: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

vi.mock('@/lib/queries/purchases', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/purchases')>()
  return {
    ...actual,
    useOpenPurchase: vi.fn(() => ({ mutate: vi.fn() })),
    useFinishPurchase: vi.fn(() => ({ mutate: vi.fn() })),
    useAddPurchase: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

describe('ProductCardDetailed', () => {
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
  }

  it('affiche les informations de base (nom, marque)', () => {
    renderWithProviders(<ProductCardDetailed {...defaultProps} />)
    expect(screen.getByText('CeraVe Hydrating Cleanser')).toBeInTheDocument()
    expect(screen.getByText('CeraVe')).toBeInTheDocument()
  })

  it('affiche le statut', () => {
    renderWithProviders(<ProductCardDetailed {...defaultProps} />)
    expect(screen.getByText('En stock')).toBeInTheDocument()
  })

  it('appelle onToggleExpand au clic sur le header', async () => {
    renderWithProviders(<ProductCardDetailed {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: /CeraVe Hydrating Cleanser/ }))
    expect(defaultProps.onToggleExpand).toHaveBeenCalled()
  })

  it('affiche les détails quand isExpanded est true', () => {
    renderWithProviders(<ProductCardDetailed {...defaultProps} isExpanded={true} />)
    expect(screen.getByText('Mon avis')).toBeInTheDocument()
    expect(screen.getByText('Rachat')).toBeInTheDocument()
    expect(screen.getByText('Infos produit')).toBeInTheDocument()
  })

  it('clic sur un emoji de sentiment appelle updateMutation', async () => {
    const { useUpdateUserProduct } = await import('@/lib/queries/user-products')
    const mutate = vi.fn()
    vi.mocked(useUpdateUserProduct).mockReturnValue({ mutate } as any)

    renderWithProviders(<ProductCardDetailed {...defaultProps} isExpanded={true} />)
    await userEvent.click(screen.getByText('😍'))

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: defaultProps.p.id,
        input: { sentiment: 5 },
      })
    )
  })

  it('clic sur un bouton de rachat appelle updateMutation', async () => {
    const { useUpdateUserProduct } = await import('@/lib/queries/user-products')
    const mutate = vi.fn()
    vi.mocked(useUpdateUserProduct).mockReturnValue({ mutate } as any)

    renderWithProviders(<ProductCardDetailed {...defaultProps} isExpanded={true} />)
    await userEvent.click(screen.getByText('Oui'))

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { wouldRepurchase: 'yes' },
      })
    )
  })

  it('modification du commentaire appelle updateMutation onBlur', async () => {
    const { useUpdateUserProduct } = await import('@/lib/queries/user-products')
    const mutate = vi.fn()
    vi.mocked(useUpdateUserProduct).mockReturnValue({ mutate } as any)

    renderWithProviders(<ProductCardDetailed {...defaultProps} isExpanded={true} />)
    const textarea = screen.getByPlaceholderText(/Ajouter un commentaire.../)
    await userEvent.type(textarea, 'Super produit')
    textarea.blur()

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { comment: 'Super produit' },
      })
    )
  })
})
