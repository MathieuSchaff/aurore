import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ShowMoreButton } from '../ShowMoreButton'

describe('ShowMoreButton', () => {
  it('renders nothing when no items are hidden', () => {
    const { container } = render(
      <ShowMoreButton hiddenCount={0} isExpanded={false} onToggle={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('pluralizes the collapsed label', () => {
    const { rerender } = render(
      <ShowMoreButton hiddenCount={1} isExpanded={false} onToggle={() => {}} />
    )
    expect(screen.getByRole('button')).toHaveTextContent('+ 1 autre')
    expect(screen.getByRole('button')).not.toHaveTextContent('autres')

    rerender(<ShowMoreButton hiddenCount={35} isExpanded={false} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('+ 35 autres')
  })

  it('exposes disclosure state and fires the toggle', async () => {
    const onToggle = vi.fn()
    render(
      <ShowMoreButton hiddenCount={4} isExpanded={true} onToggle={onToggle} controlsId="list-id" />
    )
    const button = screen.getByRole('button', { name: 'Voir moins' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-controls', 'list-id')

    await userEvent.click(button)
    expect(onToggle).toHaveBeenCalledOnce()
  })
})
