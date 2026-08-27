import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import { renderWithProviders } from '@/test/utils'

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouterState: ({ select }: { select: (state: { location: { pathname: string } }) => string }) =>
    select({ location: { pathname: '/products' } }),
}))

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

import { NavSideList } from '../NavItem'

describe('NavSideList session visibility', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({ status: 'anonymous' })
  })

  it('treats a pending session as connected to avoid an anonymous flash', () => {
    useSessionMock.mockReturnValue({ status: 'pending' })

    renderWithProviders(<NavSideList />)

    expect(screen.getByText('Collection')).toBeVisible()
    expect(screen.queryByText('Accueil')).not.toBeInTheDocument()
  })

  it('shows anonymous links only after the session resolves anonymous', () => {
    renderWithProviders(<NavSideList />)

    expect(screen.getByText('Accueil')).toBeVisible()
    expect(screen.queryByText('Collection')).not.toBeInTheDocument()
  })
})
