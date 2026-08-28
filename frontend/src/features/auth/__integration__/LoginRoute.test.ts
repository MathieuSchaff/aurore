import type { UserPublic } from '@aurore/shared'

import { isRedirect } from '@tanstack/react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { Route } from '@/routes/auth/login'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'

const USER = {
  id: 'user-1',
  email: 'user@example.com',
  createdAt: '2026-08-27T08:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

describe('login route', () => {
  afterEach(() => {
    resetTestAuthStore()
  })

  it('redirects an authenticated visitor to the collection by default', async () => {
    resetTestAuthStore(presentTestSession(USER))
    const beforeLoad = Route.options.beforeLoad

    expect(beforeLoad).toBeTypeOf('function')
    if (!beforeLoad) return

    let thrown: unknown
    try {
      // TanStack builds the full context; this route reads only search
      await beforeLoad({ search: {} } as never)
    } catch (error) {
      thrown = error
    }

    expect(isRedirect(thrown)).toBe(true)
    if (!isRedirect(thrown)) return
    expect(thrown.options.to).toBe('/collection')
  })
})
