import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewForm } from '../review/ReviewForm'

describe('ReviewForm', () => {
  it('affiche les 6 critères avec leurs labels', () => {
    render(<ReviewForm onSubmit={() => {}} />)
    expect(screen.getByLabelText('Tolérance')).toBeInTheDocument()
    expect(screen.getByLabelText('Efficacité')).toBeInTheDocument()
    expect(screen.getByLabelText('Sensorialité')).toBeInTheDocument()
    expect(screen.getByLabelText('Stabilité')).toBeInTheDocument()
    expect(screen.getByLabelText('Mixabilité')).toBeInTheDocument()
    expect(screen.getByLabelText('Rapport Q/P')).toBeInTheDocument()
  })

  it('affiche 5 étoiles par critère (30 boutons étoile au total)', () => {
    render(<ReviewForm onSubmit={() => {}} />)
    const starButtons = screen.getAllByRole('button', { name: /étoile/ })
    expect(starButtons).toHaveLength(30)
  })

  it('ne montre pas la note calculée si aucun critère renseigné', () => {
    render(<ReviewForm onSubmit={() => {}} />)
    expect(screen.queryByLabelText(/Note calculée/)).not.toBeInTheDocument()
  })

  it('met à jour la note calculée quand un critère change', async () => {
    render(<ReviewForm onSubmit={() => {}} />)
    await userEvent.click(screen.getByLabelText('Tolérance : 4 étoiles'))
    expect(screen.getByLabelText(/Note calculée/)).toBeInTheDocument()
  })

  it('soumission avec tous les critères renseignés → payload correct', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByLabelText('Tolérance : 5 étoiles'))
    await userEvent.click(screen.getByLabelText('Efficacité : 4 étoiles'))
    await userEvent.click(screen.getByLabelText('Sensorialité : 3 étoiles'))
    await userEvent.click(screen.getByLabelText('Stabilité : 3 étoiles'))
    await userEvent.click(screen.getByLabelText('Mixabilité : 3 étoiles'))
    await userEvent.click(screen.getByLabelText('Rapport Q/P : 4 étoiles'))
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        tolerance: 5,
        efficacy: 4,
        sensoriality: 3,
        stability: 3,
        mixability: 3,
        valueForMoney: 4,
      })
    )
  })

  it('soumission avec certains critères vides → null préservés dans le payload', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByLabelText('Tolérance : 5 étoiles'))
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        tolerance: 5,
        efficacy: null,
        sensoriality: null,
        stability: null,
        mixability: null,
        valueForMoney: null,
      })
    )
  })

  it('le commentaire est optionnel — soumission sans commentaire est valide', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect(onSubmit).toHaveBeenCalled()
  })
})
