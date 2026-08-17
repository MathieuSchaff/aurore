import type { UserPublic } from '@aurore/shared'

import { screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { useAuthStore } from '@/store/auth'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouterState: ({ select }: { select: (state: { location: { pathname: string } }) => string }) =>
    select({ location: { pathname: '/products' } }),
}))

import { NavSideList } from '../NavItem'

it('keeps authenticated links while the seeded identity waits for its token', () => {
  const user = {
    id: 'u1',
    email: 'user@example.com',
    emailVerified: true,
    role: 'user',
    isDemo: false,
  } as UserPublic
  useAuthStore.setState({
    accessToken: null,
    user,
    bootRefreshAttempted: true,
    bootRefreshPending: false,
  })
  const queryClient = createTestQueryClient()
  queryClient.setQueryData(['session'], {
    authenticated: true,
    userId: user.id,
    user,
    role: user.role,
  })

  renderWithProviders(<NavSideList />, { queryClient })

  expect(screen.getByText('Collection')).toBeVisible()
  expect(screen.queryByText('Accueil')).not.toBeInTheDocument()
})
