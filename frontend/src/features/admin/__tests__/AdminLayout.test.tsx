import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  Outlet: () => null,
}))

vi.mock('@/store/auth', () => ({ useAuthStore: vi.fn() }))

import { setAuthRole } from '@/test/mocks/auth-store'
import { AdminLayout } from '../components/AdminLayout'

describe('AdminLayout nav visibility (ADR-0006 S1)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows all three nav items to an admin', () => {
    setAuthRole('admin')
    render(<AdminLayout />)

    expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
    expect(screen.getByText('Utilisateurs')).toBeInTheDocument()
    expect(screen.getByText('Signalements')).toBeInTheDocument()
    expect(screen.getByText('Demandes modérateur')).toBeInTheDocument()
  })

  it('shows only Signalements to a contributor (dashboard + users stay admin-only)', () => {
    setAuthRole('contributor')
    render(<AdminLayout />)

    expect(screen.getByText('Signalements')).toBeInTheDocument()
    expect(screen.queryByText('Tableau de bord')).not.toBeInTheDocument()
    expect(screen.queryByText('Utilisateurs')).not.toBeInTheDocument()
    expect(screen.queryByText('Demandes modérateur')).not.toBeInTheDocument()
  })
})
