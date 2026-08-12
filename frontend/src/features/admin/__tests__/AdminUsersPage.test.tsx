import type { AdminUserListItem } from '@aurore/shared'

import { fireEvent, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: ({ children, ...rest }: { children: React.ReactNode }) => (
    <a {...(rest as object)}>{children}</a>
  ),
}))

import { AdminUsersPage } from '../components/AdminUsersPage'
import { adminLabels } from '../constants'

const baseUsers: AdminUserListItem[] = [
  {
    id: '019d0000-0000-7000-8000-00000000aaaa',
    email: 'alice@seed.local',
    role: 'user' as const,
    emailVerifiedAt: '2026-01-01T00:00:00Z',
    createdAt: '2026-05-10T00:00:00Z',
    forcedPrivateByAdmin: false,
  },
  {
    id: '019d0000-0000-7000-8000-00000000bbbb',
    email: 'bob@seed.local',
    role: 'admin' as const,
    emailVerifiedAt: null,
    createdAt: '2026-05-09T00:00:00Z',
    forcedPrivateByAdmin: true,
  },
]

function serveUsers(items: AdminUserListItem[]) {
  server.use(
    http.get('*/api/admin/users', () => HttpResponse.json({ success: true, data: { items } }))
  )
}

describe('AdminUsersPage', () => {
  it('renders all users when search is empty', async () => {
    serveUsers(baseUsers)
    renderWithProviders(<AdminUsersPage />)

    expect(await screen.findByText('alice@seed.local')).toBeInTheDocument()
    expect(screen.getByText('bob@seed.local')).toBeInTheDocument()
    expect(screen.getByText(/2 compte\(s\)/)).toBeInTheDocument()
  })

  it('filters the table when typing in the search input (case-insensitive)', async () => {
    serveUsers(baseUsers)
    renderWithProviders(<AdminUsersPage />)

    const search = await screen.findByLabelText(/Rechercher par email/i)
    fireEvent.change(search, { target: { value: 'ALICE' } })

    expect(screen.getByText('alice@seed.local')).toBeInTheDocument()
    expect(screen.queryByText('bob@seed.local')).not.toBeInTheDocument()
    expect(screen.getByText(/1 filtré/)).toBeInTheDocument()
  })

  it('shows the contextual empty state when search has no match', async () => {
    serveUsers(baseUsers)
    renderWithProviders(<AdminUsersPage />)

    fireEvent.change(await screen.findByLabelText(/Rechercher par email/i), {
      target: { value: 'nope' },
    })
    expect(screen.getByText(adminLabels.emptyUsersFiltered)).toBeInTheDocument()
  })

  it('renders the "Forcé" pill only for users with forcedPrivateByAdmin', async () => {
    serveUsers(baseUsers)
    renderWithProviders(<AdminUsersPage />)

    // bob has forcedPrivateByAdmin = true; one pill must appear.
    expect(await screen.findAllByText('Forcé')).toHaveLength(1)
  })

  it('shows the no-users empty state when the list is empty', async () => {
    serveUsers([])
    renderWithProviders(<AdminUsersPage />)
    expect(await screen.findByText(adminLabels.emptyUsers)).toBeInTheDocument()
  })
})
