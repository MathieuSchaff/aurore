import type { UserPublic } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { readClientSession } from '@/lib/auth/session'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { DemoBanner, demoBannerLabels } from '../DemoBanner'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  useNavigate: () => navigateMock,
}))

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@example.test',
  createdAt: '2026-10-22T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: true,
} satisfies UserPublic

describe('DemoBanner', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    resetTestAuthStore(presentTestSession(DEMO_USER))
  })

  it('keeps the demo session when leaving it fails', async () => {
    let logoutCalls = 0
    server.use(
      http.post('*/api/auth/logout', () => {
        logoutCalls++
        return HttpResponse.json({ success: false, error: 'server_error' }, { status: 503 })
      })
    )
    renderWithProviders(<DemoBanner />)

    expect(screen.getByRole('status')).toHaveTextContent(demoBannerLabels.notice)
    await userEvent.click(screen.getByRole('button', { name: demoBannerLabels.signup }))

    await waitFor(() => expect(logoutCalls).toBe(1))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: demoBannerLabels.signup })).toBeEnabled()
    )
    expect(readClientSession()).toMatchObject({ status: 'authenticated', user: DEMO_USER })
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
