import { DndContext } from '@dnd-kit/core'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ShelfSection } from '../ShelfSection'

function renderWithDnd(ui: React.ReactElement) {
  return render(<DndContext>{ui}</DndContext>)
}

describe('ShelfSection', () => {
  it('renders header with status label and count', () => {
    renderWithDnd(
      <ShelfSection status="in_stock" count={2}>
        <div>Children</div>
      </ShelfSection>
    )
    expect(screen.getByText('En stock')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders children', () => {
    renderWithDnd(
      <ShelfSection status="in_stock" count={1}>
        <div data-testid="child">Child</div>
      </ShelfSection>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('returns null when count is 0', () => {
    renderWithDnd(
      <ShelfSection status="in_stock" count={0}>
        <div>Children</div>
      </ShelfSection>
    )
    expect(screen.queryByText('En stock')).toBeNull()
  })
})
