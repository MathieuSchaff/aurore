import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DomainTabs } from '../DomainTabs'

describe('DomainTabs', () => {
  it('renders the 4 tabs in order', () => {
    render(<DomainTabs value="skincare" onChange={() => {}} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((t) => t.textContent)).toEqual([
      'Skincare',
      'Cheveux',
      'Dents',
      'Compléments',
    ])
  })

  it('marks the active tab with aria-selected', () => {
    render(<DomainTabs value="dental" onChange={() => {}} />)
    const active = screen.getByRole('tab', { name: 'Dents' })
    expect(active.getAttribute('aria-selected')).toBe('true')
    const other = screen.getByRole('tab', { name: 'Cheveux' })
    expect(other.getAttribute('aria-selected')).toBe('false')
  })

  it('fires onChange with the tab id when clicked', () => {
    const onChange = vi.fn()
    render(<DomainTabs value="skincare" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Compléments' }))
    expect(onChange).toHaveBeenCalledWith('complement')
  })

  it('rotates focus with ArrowRight / ArrowLeft keys', () => {
    render(<DomainTabs value="skincare" onChange={() => {}} />)
    const [skincare, haircare, dental, complement] = screen.getAllByRole('tab') as HTMLElement[]

    skincare.focus()
    fireEvent.keyDown(skincare, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(haircare)

    fireEvent.keyDown(haircare, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(dental)

    fireEvent.keyDown(dental, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(complement)

    fireEvent.keyDown(complement, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(skincare)

    fireEvent.keyDown(skincare, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(complement)
  })
})
