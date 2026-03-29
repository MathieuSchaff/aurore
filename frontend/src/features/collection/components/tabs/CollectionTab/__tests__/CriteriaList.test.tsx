import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CriteriaList } from '../parts/CriteriaList'

// Mock the hook
vi.mock('@/lib/queries/user-products', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/user-products')>()
  return {
    ...actual,
    useUpsertUserProductReview: vi.fn(() => ({
      mutate: vi.fn(),
    })),
  }
})

describe('CriteriaList', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    userProductId: 'up1',
    review: {
      tolerance: 3,
      efficacy: null,
      sensoriality: null,
      stability: null,
      mixability: null,
      valueForMoney: null,
    },
    activeTooltip: null,
    setActiveTooltip: vi.fn(),
  }

  it('affiche les labels des critères', () => {
    render(<CriteriaList {...defaultProps} />)
    expect(screen.getByText('Tolérance')).toBeInTheDocument()
    expect(screen.getByText('Efficacité')).toBeInTheDocument()
  })

  it('affiche 5 étoiles par critère', () => {
    render(<CriteriaList {...defaultProps} />)
    const starButtons = screen.getAllByRole('button', { name: /Noter \d sur 5/i })
    expect(starButtons).toHaveLength(30)
  })

  it("affiche l'infobulle quand on clique sur le bouton info", async () => {
    const setActiveTooltip = vi.fn()
    render(<CriteriaList {...defaultProps} setActiveTooltip={setActiveTooltip} />)

    const infoBtn = screen.getByLabelText('Aide pour Tolérance')
    fireEvent.click(infoBtn)

    expect(setActiveTooltip).toHaveBeenCalled()
  })

  it("affiche le contenu de l'infobulle si activeTooltip correspond", () => {
    render(<CriteriaList {...defaultProps} activeTooltip="tolerance" />)
    expect(screen.getByText(/Réaction de la peau/)).toBeInTheDocument()
  })
})
