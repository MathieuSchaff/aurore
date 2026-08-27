import type { UserPublic } from '@aurore/shared'

import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import { renderWithProviders } from '@/test/utils'
import { HomePage } from '../HomePage'

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn<() => SessionView>(),
}))

// The three branches are unit-tested at the seam: HomePage's only job is to pick
// the right surface by auth state (ADR 0011). Children are stubbed so the test
// asserts routing, not their internals.
vi.mock('../HomeHub', () => ({ HomeHub: () => <div>hub-surface</div> }))
vi.mock('../HomeMarketing', () => ({ HomeMarketing: () => <div>marketing-surface</div> }))
vi.mock('../HomeSkeleton', () => ({ HomeSkeleton: () => <div>boot-skeleton</div> }))
vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

const fakeUser = { id: 'u1', username: 'lea' } as unknown as UserPublic

beforeEach(() => {
  useSessionMock.mockReturnValue({ status: 'anonymous' })
})

describe('HomePage (dual-audience routing)', () => {
  it('shows the marketing surface for anonymous visitors', () => {
    renderWithProviders(<HomePage />)

    expect(screen.getByText('marketing-surface')).toBeInTheDocument()
    expect(screen.queryByText('hub-surface')).not.toBeInTheDocument()
  })

  it('shows the personal hub for signed-in users', () => {
    useSessionMock.mockReturnValue({
      status: 'authenticated',
      user: fakeUser,
      credential: 'present',
    })

    renderWithProviders(<HomePage />)

    expect(screen.getByText('hub-surface')).toBeInTheDocument()
    expect(screen.queryByText('marketing-surface')).not.toBeInTheDocument()
  })

  it('shows the neutral skeleton while the boot session probe is pending', () => {
    useSessionMock.mockReturnValue({ status: 'pending' })

    renderWithProviders(<HomePage />)

    expect(screen.getByText('boot-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('marketing-surface')).not.toBeInTheDocument()
  })

  it('shows the neutral skeleton for a seeded identity without a Bearer', () => {
    useSessionMock.mockReturnValue({
      status: 'authenticated',
      user: fakeUser,
      credential: 'restoring',
    })

    renderWithProviders(<HomePage />)

    expect(screen.getByText('boot-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('hub-surface')).not.toBeInTheDocument()
  })
})
