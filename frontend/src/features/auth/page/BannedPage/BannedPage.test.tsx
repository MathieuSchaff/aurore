import { QueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { recordBan } from '@/lib/auth/session'
import { resetTestAuthStore } from '@/test/authSession'

vi.mock('../../../../lib/queries/auth', () => ({
  useLogout: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

import { BannedPage } from './BannedPage'

describe('BannedPage', () => {
  beforeEach(() => {
    resetTestAuthStore()
  })

  it('shows a generic message when no ban notice is present', () => {
    render(<BannedPage />)

    expect(screen.getByText('Votre compte est suspendu.')).toBeInTheDocument()
    expect(screen.getByText(/contactez le support/i)).toBeInTheDocument()
  })

  it('shows formatted expiry and reason from the current ban notice', () => {
    recordBan(new QueryClient(), {
      reason: 'Comportement abusif',
      expiresAt: '2026-06-01T00:00:00.000Z',
      scope: 'global',
    })

    render(<BannedPage />)

    expect(screen.getByText(/suspendu jusqu'au/i)).toBeInTheDocument()
    expect(screen.getByText('Comportement abusif')).toBeInTheDocument()
    expect(screen.queryByText(/contactez le support/i)).not.toBeInTheDocument()
  })
})
