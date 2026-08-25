import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  Outlet: () => null,
}))

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

import { AdminLayout } from '../components/AdminLayout'

function setSessionRole(role: 'admin' | 'contributor') {
  useSessionMock.mockReturnValue({
    status: 'authenticated',
    credential: 'present',
    user: {
      id: `${role}-id`,
      email: `${role}@example.test`,
      createdAt: '2026-01-01T00:00:00.000Z',
      role,
      emailVerified: true,
      isDemo: false,
    },
  })
}

describe('AdminLayout nav visibility (ADR-0006)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows all seven navigation destinations to an admin', () => {
    setSessionRole('admin')
    render(<AdminLayout />)

    const destinations = {
      'Tableau de bord': '/admin',
      Utilisateurs: '/admin/users',
      'Demandes modérateur': '/admin/role-requests',
      Sécurité: '/admin/security-events',
      Signalements: '/admin/reports',
      Catalogue: '/admin/catalog',
      Corrections: '/admin/suggested-edits',
    }
    for (const [name, href] of Object.entries(destinations)) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('shows only content moderation destinations to a contributor', () => {
    setSessionRole('contributor')
    render(<AdminLayout />)

    const allowed = {
      Signalements: '/admin/reports',
      Catalogue: '/admin/catalog',
      Corrections: '/admin/suggested-edits',
    }
    for (const [name, href] of Object.entries(allowed)) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
    for (const name of ['Tableau de bord', 'Utilisateurs', 'Demandes modérateur', 'Sécurité']) {
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
    }
  })
})
