import type { UserPublic } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BannedPage } from '@/features/auth/page/BannedPage/BannedPage'
import { readClientSession } from '@/lib/auth/session'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => navigateMock,
}))

const USER = {
  id: 'banned-user',
  email: 'banned@example.test',
  createdAt: '2026-08-27T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

describe('BannedPage logout', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    resetTestAuthStore(presentTestSession(USER, 'banned-token'))
  })

  it('ends the session and returns to login', async () => {
    let authorization: string | null = null
    server.use(
      http.post('*/api/auth/logout', ({ request }) => {
        authorization = request.headers.get('authorization')
        return HttpResponse.json({ success: true, data: null })
      })
    )
    renderWithProviders(<BannedPage />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Se déconnecter' }))

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/auth/login',
        search: { redirect: undefined },
      })
    })
    expect(authorization).toBe('Bearer banned-token')
    expect(readClientSession()).toEqual({ status: 'anonymous' })
  })
})
