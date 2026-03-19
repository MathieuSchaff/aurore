import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SentimentWidget } from '../review/SentimentWidget'

describe('SentimentWidget', () => {
  it('affiche les 5 options', () => {
    render(<SentimentWidget value={null} onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('clic sur un emoji appelle onChange avec la bonne valeur', async () => {
    const onChange = vi.fn()
    render(<SentimentWidget value={null} onChange={onChange} />)
    await userEvent.click(screen.getByTitle('Bien'))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it("l'emoji sélectionné a aria-pressed=true", () => {
    render(<SentimentWidget value={3} onChange={() => {}} />)
    const selected = screen.getByTitle('Neutre')
    expect(selected).toHaveAttribute('aria-pressed', 'true')
  })

  it('les autres emojis ont aria-pressed=false', () => {
    render(<SentimentWidget value={3} onChange={() => {}} />)
    const notSelected = screen.getByTitle('Bien')
    expect(notSelected).toHaveAttribute('aria-pressed', 'false')
  })

  it('sans valeur sélectionnée → aucun aria-pressed=true', () => {
    render(<SentimentWidget value={null} onChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.every(b => b.getAttribute('aria-pressed') === 'false')).toBe(true)
  })

  it("clic sur l'emoji déjà sélectionné appelle onChange", async () => {
    const onChange = vi.fn()
    render(<SentimentWidget value={5} onChange={onChange} />)
    await userEvent.click(screen.getByTitle('Coup de cœur'))
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
