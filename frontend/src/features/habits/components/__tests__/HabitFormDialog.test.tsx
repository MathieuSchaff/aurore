import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '../../../../test/utils'
import { HabitFormDialog } from '../HabitFormDialog'

// Mocks pour les hooks de mutations et de requetes
const mockMutate = vi.fn()
vi.mock('../../../../lib/queries/habits', () => ({
  useCreateHabit: () => ({
    mutate: (payload: any, options: any) => {
      mockMutate(payload)
      if (options?.onSuccess) options.onSuccess()
    },
    isPending: false,
  }),
  useUpdateHabit: () => ({ isPending: false }),
  useUpdateFrequency: () => ({ isPending: false }),
  useSetTimings: () => ({ isPending: false }),
  useSetReminders: () => ({ isPending: false }),
  useSetProducts: () => ({ isPending: false }),
  useSetPeriod: () => ({ isPending: false }),
}))

vi.mock('../../../../lib/queries/products', () => ({
  useProducts: () => ({
    data: { items: [{ id: 'prod-1', name: 'Vitamin C', brand: 'The Ordinary' }] },
  }),
}))

describe('HabitFormDialog', () => {
  it('should enable submit button only when name and category are filled', () => {
    renderWithProviders(<HabitFormDialog onClose={() => {}} />)

    const submitBtn = screen.getByRole('button', { name: /Creer/i })
    expect(submitBtn).toBeDisabled()

    // Remplir le nom
    fireEvent.change(screen.getByPlaceholderText(/Ex : Meditation/i), {
      target: { value: 'Sport matin' },
    })
    expect(submitBtn).toBeDisabled()

    // Choisir une categorie
    fireEvent.click(screen.getByRole('button', { name: /Sport/i }))
    expect(submitBtn).not.toBeDisabled()
  })

  it('should handle complex frequency and timing selection', async () => {
    renderWithProviders(<HabitFormDialog onClose={() => {}} />)

    // 1. Infos de base
    const nameInput = screen.getByLabelText(/Nom \*/i)
    fireEvent.change(nameInput, { target: { value: 'Yoga hebdomadaire' } })

    const categoryBtn = screen.getByRole('button', { name: 'Meditation' })
    fireEvent.click(categoryBtn)

    // 2. Changer frequence en "Jours precis" (Weekly)
    fireEvent.click(screen.getByRole('button', { name: /Jours precis/i }))

    // Activer Dimanche (D)
    fireEvent.click(screen.getByRole('button', { name: 'D' }))

    // 3. Ajouter un horaire
    fireEvent.click(screen.getByRole('button', { name: /Horaires/i }))
    // Note: Le premier clic a deja ajoute un horaire car timings etait vide

    const timeInputs = screen.getAllByDisplayValue('08:00')
    fireEvent.change(timeInputs[0], { target: { value: '09:30' } })

    // 4. Soumettre
    const submitBtn = screen.getByRole('button', { name: /Creer/i })
    expect(submitBtn).not.toBeDisabled()

    // Utiliser la soumission du formulaire directement pour etre sur
    const form = screen
      .getByRole('heading', { name: /Nouvelle habitude/i })
      .closest('div')
      ?.parentElement?.querySelector('form')
    if (form) fireEvent.submit(form)
    else fireEvent.click(submitBtn)

    await waitFor(
      () => {
        expect(mockMutate).toHaveBeenCalled()
      },
      { timeout: 2000 }
    )

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Yoga hebdomadaire',
        category: 'Meditation',
        frequency: expect.objectContaining({
          type: 'weekly',
          daysOfWeek: expect.arrayContaining([1, 2, 3, 4, 5, 6]),
        }),
        timings: expect.arrayContaining([expect.objectContaining({ time: '09:30' })]),
      })
    )
  })

  it('should handle custom category', async () => {
    renderWithProviders(<HabitFormDialog onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText(/Nom \*/i), {
      target: { value: 'Lire 10 pages' },
    })

    fireEvent.click(screen.getByRole('button', { name: /\+ Autre/i }))
    const customInput = screen.getByPlaceholderText(/Ma categorie.../i)
    fireEvent.change(customInput, { target: { value: 'Lecture du soir' } })

    const submitBtn = screen.getByRole('button', { name: /Creer/i })
    expect(submitBtn).not.toBeDisabled()

    const form = screen
      .getByRole('heading', { name: /Nouvelle habitude/i })
      .closest('div')
      ?.parentElement?.querySelector('form')
    if (form) fireEvent.submit(form)
    else fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled()
    })

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Lire 10 pages',
        category: 'Lecture du soir',
      })
    )
  })

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn()
    renderWithProviders(<HabitFormDialog onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
