import type { AdminDashboard } from '@aurore/shared'

import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { LinkStub } from '@/test/mocks/router'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: LinkStub,
}))

import { AdminDashboardPage } from '../components/AdminDashboardPage'
import { adminLabels } from '../constants'

function serveDashboard(data: AdminDashboard) {
  server.use(http.get('*/api/admin/dashboard', () => HttpResponse.json({ success: true, data })))
}

describe('AdminDashboardPage', () => {
  it('renders all five moderation stat cards with their counts', async () => {
    serveDashboard({
      openReports: 7,
      activeBans: 2,
      hiddenReviews: 3,
      hiddenThreads: 1,
      hiddenReplies: 4,
      forcedPrivateProfiles: 5,
      pendingRoleRequests: 6,
    })
    renderWithProviders(<AdminDashboardPage />)

    expect(await screen.findByText(adminLabels.statOpenReports)).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()

    expect(screen.getByText(adminLabels.statActiveBans)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    // Total hidden = 3 + 1 + 4 = 8
    expect(screen.getByText('8')).toBeInTheDocument()

    expect(screen.getByText(adminLabels.statForcedPrivate)).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()

    expect(screen.getByText(adminLabels.statPendingRoleRequests)).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('breaks down hidden content by kind in the third card', async () => {
    serveDashboard({
      openReports: 0,
      activeBans: 0,
      hiddenReviews: 12,
      hiddenThreads: 1,
      hiddenReplies: 2,
      forcedPrivateProfiles: 0,
      pendingRoleRequests: 0,
    })
    renderWithProviders(<AdminDashboardPage />)

    expect(await screen.findByText('12 avis · 1 discussion · 2 réponses')).toBeInTheDocument()
  })

  it('maps each actionable card to its own workload and leaves hidden content static', async () => {
    serveDashboard({
      openReports: 0,
      activeBans: 0,
      hiddenReviews: 0,
      hiddenThreads: 0,
      hiddenReplies: 0,
      forcedPrivateProfiles: 0,
      pendingRoleRequests: 0,
    })
    renderWithProviders(<AdminDashboardPage />)

    await screen.findByText(adminLabels.statOpenReports)
    expect(
      screen.getByRole('link', { name: (name) => name.includes(adminLabels.statOpenReports) })
    ).toHaveAttribute('href', '/admin/reports')
    expect(
      screen.getByRole('link', { name: (name) => name.includes(adminLabels.statActiveBans) })
    ).toHaveAttribute('href', '/admin/users')
    expect(
      screen.getByRole('link', { name: (name) => name.includes(adminLabels.statForcedPrivate) })
    ).toHaveAttribute('href', '/admin/users')
    expect(
      screen.getByRole('link', {
        name: (name) => name.includes(adminLabels.statPendingRoleRequests),
      })
    ).toHaveAttribute('href', '/admin/role-requests')
    expect(screen.getAllByRole('link')).toHaveLength(4)
    expect(
      screen.queryByRole('link', {
        name: (name) => name.includes(adminLabels.statHiddenContent),
      })
    ).not.toBeInTheDocument()
  })
})
