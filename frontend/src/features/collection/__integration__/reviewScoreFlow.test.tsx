import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, makeUserProduct } from '../../../test/utils'
import { CollectionCard } from '../components/CollectionCard'
import { ReviewForm } from '../components/ReviewForm'

describe('Flow : évaluation → note calculée', () => {
  it("card sans review n'affiche pas de note", () => {
    const item = makeUserProduct({ review: null })
    renderWithProviders(<CollectionCard item={item} />)
    expect(screen.queryByLabelText(/Note/)).not.toBeInTheDocument()
  })

  it('card avec review affiche la note calculée', () => {
    const item = makeUserProduct({
      review: {
        tolerance: 4, efficacy: 4, sensoriality: 4,
        stability: 4, mixability: 4, valueForMoney: 4,
      },
    })
    renderWithProviders(<CollectionCard item={item} />)
    expect(screen.getByLabelText(/Note : 16\.0/)).toBeInTheDocument()
  })

  it("le formulaire d'évaluation met à jour la note en temps réel", async () => {
    render(<ReviewForm onSubmit={vi.fn()} />)
    expect(screen.queryByLabelText(/Note calculée/)).not.toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Tolérance : 4 étoiles'))
    expect(screen.getByLabelText(/Note calculée/)).toBeInTheDocument()
  })

  it('la note calculée se met à jour quand on modifie un critère', async () => {
    render(<ReviewForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('Tolérance : 3 étoiles'))
    const noteAvant = screen.getByLabelText(/Note calculée/).textContent
    await userEvent.click(screen.getByLabelText('Tolérance : 5 étoiles'))
    const noteApres = screen.getByLabelText(/Note calculée/).textContent
    expect(noteApres).not.toBe(noteAvant)
  })

  it('soumission du formulaire retourne les valeurs correctes', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByLabelText('Tolérance : 5 étoiles'))
    await userEvent.click(screen.getByLabelText('Efficacité : 5 étoiles'))
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ tolerance: 5, efficacy: 5 })
    )
  })
})
