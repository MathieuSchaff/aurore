import { fireEvent, screen, within } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUpdateDermoProfile } from '@/lib/queries/profile'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { DermoProfileForm, OTHER_CONCERNS_TITLE } from '../DermoProfileForm'

vi.mock('@/lib/queries/profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/profile')>()
  return { ...actual, useUpdateDermoProfile: vi.fn() }
})

function serveDermo(dermo: {
  skinTypes?: string[]
  fitzpatrickType?: number | null
  skinConcerns?: string[]
  privateNotes?: string | null
}) {
  server.use(
    http.get('*/api/profile/dermo', () =>
      HttpResponse.json({
        success: true,
        data: {
          skinTypes: dermo.skinTypes ?? [],
          fitzpatrickType: dermo.fitzpatrickType ?? null,
          skinConcerns: dermo.skinConcerns ?? [],
          privateNotes: dermo.privateNotes ?? null,
        },
      })
    )
  )
}

function setMutation(overrides: Partial<ReturnType<typeof useUpdateDermoProfile>> = {}) {
  const mutate = vi.fn()
  vi.mocked(useUpdateDermoProfile).mockReturnValue({
    mutate,
    isPending: false,
    isError: false,
    isSuccess: false,
    ...overrides,
  } as unknown as ReturnType<typeof useUpdateDermoProfile>)
  return mutate
}

describe('DermoProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    serveDermo({})
    setMutation()
  })

  it('keeps submit disabled until a field becomes dirty', async () => {
    renderWithProviders(<DermoProfileForm />)
    expect(await screen.findByRole('button', { name: 'Enregistrer' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Mixte' }))

    expect(screen.getByRole('button', { name: 'Enregistrer' })).not.toBeDisabled()
  })

  it('submits the form with current skinTypes / fitz / concerns / notes', async () => {
    const mutate = setMutation()
    serveDermo({ skinTypes: ['peau-mixte'], fitzpatrickType: 3 })
    renderWithProviders(<DermoProfileForm />)

    // Dirty up: pick a concern chip.
    fireEvent.click(await screen.findByRole('button', { name: 'Acné' }))

    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate.mock.calls[0][0]).toMatchObject({
      skinTypes: ['peau-mixte'],
      fitzpatrickType: 3,
      skinConcerns: ['anti-acne'],
      privateNotes: null,
    })
  })

  it('coerces empty privateNotes to null so the DB row stores SQL NULL, not ""', async () => {
    const mutate = setMutation()
    renderWithProviders(<DermoProfileForm />)

    fireEvent.click(await screen.findByRole('button', { name: 'Sensible' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(mutate.mock.calls[0][0].privateNotes).toBeNull()
  })

  it('surfaces the error banner when the update fails', async () => {
    setMutation({ isError: true })
    renderWithProviders(<DermoProfileForm />)
    expect(
      await screen.findByText('Une erreur est survenue lors de la sauvegarde.')
    ).toBeInTheDocument()
  })

  it('groups the concerns under the product tag they feed', async () => {
    renderWithProviders(<DermoProfileForm />)

    const rougeurs = await screen.findByRole('group', { name: 'Rougeurs' })
    expect(within(rougeurs).getByRole('button', { name: 'Rosacée' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('group', { name: OTHER_CONCERNS_TITLE })).getByRole('button', {
        name: 'Eczéma',
      })
    ).toBeInTheDocument()
  })

  // Each family edits its own subset
  // The saved list must still carry the others
  it('keeps the other families when a nuance is toggled', async () => {
    const mutate = setMutation()
    serveDermo({ skinConcerns: ['anti-acne'] })
    renderWithProviders(<DermoProfileForm />)

    fireEvent.click(await screen.findByRole('button', { name: 'Rosacée' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(mutate.mock.calls[0][0].skinConcerns).toEqual(['rosacee', 'anti-acne'])
  })

  it('associates section descriptions and the character hint with their controls', async () => {
    renderWithProviders(<DermoProfileForm />)

    expect(await screen.findByRole('group', { name: 'Type de peau' })).toHaveAccessibleDescription(
      "Sélectionnez jusqu'à 3 types."
    )
    expect(screen.getByRole('textbox', { name: 'Notes privées' })).toHaveAccessibleDescription(
      /Aucun calcul ne s'en sert.*0\/2000/
    )
  })
})
