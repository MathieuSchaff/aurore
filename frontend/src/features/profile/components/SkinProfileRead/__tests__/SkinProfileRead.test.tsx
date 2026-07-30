import type { UserDermoProfile } from '@aurore/shared'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FITZPATRICK_ITEMS, SKIN_CONCERN_LABELS, SKIN_TYPE_LABELS } from '@/constants/skin'
import { SkinProfileRead } from '../SkinProfileRead'

function makeDermo(overrides: Partial<UserDermoProfile> = {}): UserDermoProfile {
  return {
    skinTypes: [],
    skinConcerns: [],
    fitzpatrickType: null,
    privateNotes: null,
    ...overrides,
  } as unknown as UserDermoProfile
}

describe('SkinProfileRead', () => {
  it('shows the empty message when no profile field is set', () => {
    render(<SkinProfileRead dermo={makeDermo()} />)
    expect(screen.getByText('Aucun profil peau renseigné.')).toBeInTheDocument()
  })

  it('renders mapped FR labels for skin types and concerns', () => {
    render(
      <SkinProfileRead
        dermo={makeDermo({
          skinTypes: ['peau-mixte', 'peau-sensible'],
          skinConcerns: ['rosacee', 'anti-acne'],
        })}
      />
    )

    expect(screen.getByText(SKIN_TYPE_LABELS['peau-mixte'])).toBeInTheDocument()
    expect(screen.getByText(SKIN_TYPE_LABELS['peau-sensible'])).toBeInTheDocument()
    expect(screen.getByText(SKIN_CONCERN_LABELS.rosacee)).toBeInTheDocument()
    expect(screen.getByText(SKIN_CONCERN_LABELS['anti-acne'])).toBeInTheDocument()
  })

  it('renders the fitzpatrick badge with its long-form description', () => {
    render(<SkinProfileRead dermo={makeDermo({ fitzpatrickType: 3 })} />)
    // Composite badge: "${label} — ${description}". Both pieces come from FITZPATRICK_ITEMS[2].
    const fitz3 = FITZPATRICK_ITEMS.find((f) => f.value === 3)
    expect(fitz3).toBeDefined()
    expect(
      screen.getByText(new RegExp(`${fitz3?.label} — ${fitz3?.description}`))
    ).toBeInTheDocument()
  })

  it('leaves a short note (≤150 chars) unclamped and without a toggle', () => {
    render(<SkinProfileRead dermo={makeDermo({ privateNotes: 'Short note.' })} />)

    // The fade mask is CSS-only: clamping without a toggle would show a cut-off
    // note the reader cannot unfold.
    expect(screen.getByText('Short note.').parentElement).not.toHaveClass(
      'skin-read__notes--collapsed'
    )
    expect(screen.queryByRole('button', { name: /Voir plus/ })).not.toBeInTheDocument()
  })

  it('toggles between collapsed and expanded states on long notes', () => {
    const longNote = 'a'.repeat(200)
    render(<SkinProfileRead dermo={makeDermo({ privateNotes: longNote })} />)

    const toggle = screen.getByRole('button', { name: /Voir plus/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(longNote).parentElement).toHaveClass('skin-read__notes--collapsed')

    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: /Voir moins/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    expect(screen.getByText(longNote).parentElement).not.toHaveClass('skin-read__notes--collapsed')
  })
})
