import type { UserPublic } from '@aurore/shared'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'

import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { renderWithProviders } from '@/test/utils'
import { ComparisonBuilderPage } from '../pages/ComparisonBuilderPage'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  const { LinkStub, createLinkStub } = await import('@/test/mocks/router')
  return {
    ...actual,
    Link: LinkStub,
    createLink: createLinkStub,
    useLocation: () => 'draft-entry',
    useNavigate: () => vi.fn(),
  }
})

const USER = {
  id: 'draft-owner',
  email: 'draft@example.com',
  createdAt: '2026-10-23T12:00:00.000Z',
  emailVerified: false,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

afterEach(() => {
  resetTestAuthStore()
  vi.restoreAllMocks()
})

it('protects an unsaved name from document exit until the draft is cancelled', async () => {
  resetTestAuthStore(presentTestSession(USER))
  renderWithProviders(<ComparisonBuilderPage mode="new" />)
  const cleanExit = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(cleanExit)
  expect(cleanExit.defaultPrevented).toBe(false)

  await userEvent.type(screen.getByRole('textbox', { name: /nom de la comparaison/i }), 'À garder')
  // Internal navigation keeps the draft, but a document reload would lose it
  const dirtyExit = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(dirtyExit)
  expect(dirtyExit.defaultPrevented).toBe(true)

  await userEvent.click(screen.getByRole('button', { name: /annuler/i }))
  const cancelledExit = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(cancelledExit)
  expect(cancelledExit.defaultPrevented).toBe(false)
})
