import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AdminFilterTabs } from '../components/AdminFilterTabs'

describe('AdminFilterTabs', () => {
  it('renders a named pressed-button group and changes the filter', async () => {
    const onChange = vi.fn()
    render(
      <AdminFilterTabs
        label="Statut des demandes"
        tabs={[
          { value: 'pending', label: 'En attente' },
          { value: 'approved', label: 'Acceptées' },
        ]}
        value="pending"
        onChange={onChange}
      />
    )

    const group = screen.getByRole('group', { name: 'Statut des demandes' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'En attente' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Acceptées' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )

    await userEvent.click(screen.getByRole('button', { name: 'Acceptées' }))

    expect(onChange).toHaveBeenCalledWith('approved')
  })
})
