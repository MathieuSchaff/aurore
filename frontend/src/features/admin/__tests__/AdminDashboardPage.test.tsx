import type { AdminDashboard } from '@aurore/shared'

import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: ({ children, to, ...rest }: { children: React.ReactNode; to: string }) => (
    <a href={to} {...(rest as object)}>
      {children}
    </a>
  ),
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
      hiddenThreads: 4,
      hiddenReplies: 9,
      forcedPrivateProfiles: 0,
      pendingRoleRequests: 0,
    })
    renderWithProviders(<AdminDashboardPage />)

    expect(await screen.findByText(/12 review · 4 thread · 9 reply/)).toBeInTheDocument()
  })

  it('renders all stat cards as links to deep-link admin pages', async () => {
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
    const links = screen.getAllByRole('link')
    // 5 stat cards = 5 links: /admin/reports (x2) + /admin/users (x2) + /admin/role-requests (x1).
    expect(links).toHaveLength(5)
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs.filter((h) => h === '/admin/reports')).toHaveLength(2)
    expect(hrefs.filter((h) => h === '/admin/users')).toHaveLength(2)
    expect(hrefs.filter((h) => h === '/admin/role-requests')).toHaveLength(1)
  })
})
