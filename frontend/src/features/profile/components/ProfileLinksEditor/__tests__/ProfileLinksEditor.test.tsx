import { act, fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProfileLinksEditor } from '../ProfileLinksEditor'

describe('ProfileLinksEditor announcements', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('cancels the pending announcement reset when unmounted', () => {
    const { unmount } = render(
      <StrictMode>
        <ProfileLinksEditor links={[]} onChange={vi.fn()} />
      </StrictMode>
    )

    fireEvent.click(screen.getByRole('button', { name: /ajouter un lien/i }))
    expect(screen.getByText('Lien 1 ajouté')).toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
    act(() => vi.advanceTimersByTime(1000))
  })

  it('clears the announcement after one second while mounted', () => {
    render(<ProfileLinksEditor links={[]} onChange={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /ajouter un lien/i }))
    act(() => vi.advanceTimersByTime(999))
    expect(screen.getByText('Lien 1 ajouté')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByText('Lien 1 ajouté')).not.toBeInTheDocument()
  })
})
