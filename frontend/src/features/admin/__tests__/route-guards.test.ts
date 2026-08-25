import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { isRedirect } from '@tanstack/react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { installSession, readClientSession } from '@/lib/auth/session'
import { resetTestAuthStore } from '@/test/authSession'
import { requireAdminOrRedirect, requireModeratorOrRedirect } from '../route-guards'

const ADMIN = {
  id: 'admin-1',
  email: 'admin@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  emailVerified: true,
  role: 'admin',
  isDemo: false,
} satisfies UserPublic

const CONTRIBUTOR = {
  ...ADMIN,
  id: 'contributor-1',
  email: 'contributor@example.com',
  role: 'contributor',
} satisfies UserPublic

function installFreshCredential(queryClient: QueryClient, user: UserPublic) {
  const token = `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`
  installSession(queryClient, { accessToken: token, user })
}

async function captureRedirect(run: Promise<unknown>) {
  try {
    await run
  } catch (error) {
    if (isRedirect(error)) return error
    throw error
  }

  throw new Error('Expected a TanStack Router redirect')
}

describe('admin route guards', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    resetTestAuthStore()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('returns the authenticated session for an admin-only route', async () => {
    installFreshCredential(queryClient, ADMIN)

    await expect(
      requireAdminOrRedirect({
        context: { queryClient },
        location: { href: '/admin/users' },
      })
    ).resolves.toMatchObject({ session: { user: ADMIN } })
  })

  it('redirects a contributor from an admin-only route to reports', async () => {
    installFreshCredential(queryClient, CONTRIBUTOR)

    const refusal = await captureRedirect(
      requireAdminOrRedirect({
        context: { queryClient },
        location: { href: '/admin/users' },
      })
    )

    expect(refusal.options).toMatchObject({ to: '/admin/reports' })
    expect(readClientSession()).toMatchObject({
      status: 'authenticated',
      user: CONTRIBUTOR,
    })
  })

  it('returns the authenticated session for a contributor moderation route', async () => {
    installFreshCredential(queryClient, CONTRIBUTOR)

    await expect(
      requireModeratorOrRedirect({
        context: { queryClient },
        location: { href: '/admin/users/user-1' },
      })
    ).resolves.toMatchObject({ session: { user: CONTRIBUTOR } })
  })
})
