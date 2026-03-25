import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { makeUserProduct } from '../../../../../test/utils'
import { CriteriaList } from '../CriteriaList'

describe('CriteriaList', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    p: makeUserProduct(),
    activeTooltip: null,
    setActiveTooltip: vi.fn(),
    handleReview: vi.fn(),
  }

  it('affiche les 6 critères avec leurs labels', () => {
    render(<CriteriaList {...defaultProps} />)
    expect(screen.getByText('Tolérance')).toBeInTheDocument()
    expect(screen.getByText('Efficacité')).toBeInTheDocument()
    expect(screen.getByText('Sensorialité')).toBeInTheDocument()
    expect(screen.getByText('Stabilité')).toBeInTheDocument()
    expect(screen.getByText('Mixabilité')).toBeInTheDocument()
    expect(screen.getByText('Rapport Q/P')).toBeInTheDocument()
  })

  it('affiche 5 étoiles par critère', () => {
    render(<CriteriaList {...defaultProps} />)
    const starButtons = screen.getAllByRole('button', { name: /étoiles/i })
    expect(starButtons).toHaveLength(30)
  })

  it('clic sur une étoile appelle handleReview avec la bonne valeur', async () => {
    const handleReview = vi.fn()
    render(<CriteriaList {...defaultProps} handleReview={handleReview} />)

    await userEvent.click(screen.getByLabelText('Tolérance : 4 étoiles'))
    expect(handleReview).toHaveBeenCalledWith(defaultProps.p.id, { tolerance: 4 })
  })

  it('affiche les étoiles remplies selon la review', () => {
    const p = makeUserProduct({
      review: {
        id: 'test-review-1',
        userProductId: 'test-id-1',
        tolerance: 3,
        efficacy: null,
        sensoriality: null,
        stability: null,
        mixability: null,
        valueForMoney: null,
        comment: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    render(<CriteriaList {...defaultProps} p={p} />)

    const star1 = screen.getByLabelText('Tolérance : 1 étoiles').querySelector('svg')
    const star3 = screen.getByLabelText('Tolérance : 3 étoiles').querySelector('svg')
    const star4 = screen.getByLabelText('Tolérance : 4 étoiles').querySelector('svg')

    expect(star1).toHaveClass('filled')
    expect(star3).toHaveClass('filled')
    expect(star4).not.toHaveClass('filled')
  })

  it("affiche l'infobulle quand on clique sur le bouton info", async () => {
    const setActiveTooltip = vi.fn()
    render(<CriteriaList {...defaultProps} setActiveTooltip={setActiveTooltip} />)

    const infoBtn = screen.getByLabelText('Informations sur Tolérance')
    await userEvent.click(infoBtn)

    expect(setActiveTooltip).toHaveBeenCalledWith('tolerance')
  })

  it("affiche le contenu de l'infobulle si activeTooltip correspond", () => {
    render(<CriteriaList {...defaultProps} activeTooltip="tolerance" />)
    expect(screen.getByText(/Réaction de la peau/)).toBeInTheDocument()
  })
})
