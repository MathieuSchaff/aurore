import type { UserPublic } from '@aurore/shared'

import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/store/auth'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { HomePage } from '../HomePage'

// The three branches are unit-tested at the seam: HomePage's only job is to pick
// the right surface by auth state (ADR 0011). Children are stubbed so the test
// asserts routing, not their internals.
vi.mock('../HomeHub', () => ({ HomeHub: () => <div>hub-surface</div> }))
vi.mock('../HomeMarketing', () => ({ HomeMarketing: () => <div>marketing-surface</div> }))
vi.mock('../HomeSkeleton', () => ({ HomeSkeleton: () => <div>boot-skeleton</div> }))

const fakeUser = { id: 'u1', username: 'lea' } as unknown as UserPublic

afterEach(() => {
  useAuthStore.setState({
    accessToken: null,
    user: null,
    bootRefreshAttempted: false,
    bootRefreshPending: false,
  })
})

describe('HomePage (dual-audience routing)', () => {
  it('shows the marketing surface for anonymous visitors', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(['session'], { authenticated: false })
    useAuthStore.setState({ user: null, bootRefreshAttempted: false, bootRefreshPending: false })

    renderWithProviders(<HomePage />, { queryClient })

    expect(screen.getByText('marketing-surface')).toBeInTheDocument()
    expect(screen.queryByText('hub-surface')).not.toBeInTheDocument()
  })

  it('shows the personal hub for signed-in users', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(['session'], { authenticated: true, userId: fakeUser.id })
    useAuthStore.setState({
      user: fakeUser,
      bootRefreshAttempted: true,
      bootRefreshPending: false,
    })

    renderWithProviders(<HomePage />, { queryClient })

    expect(screen.getByText('hub-surface')).toBeInTheDocument()
    expect(screen.queryByText('marketing-surface')).not.toBeInTheDocument()
  })

  it('shows the neutral skeleton while the boot session probe is pending', () => {
    useAuthStore.setState({
      user: null,
      bootRefreshAttempted: true,
      bootRefreshPending: true,
    })

    renderWithProviders(<HomePage />)

    expect(screen.getByText('boot-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('marketing-surface')).not.toBeInTheDocument()
  })
})
