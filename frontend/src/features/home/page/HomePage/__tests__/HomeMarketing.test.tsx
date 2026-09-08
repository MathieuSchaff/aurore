import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/utils'

const { demoMutateAsync, navigateMock } = vi.hoisted(() => ({
  demoMutateAsync: vi.fn(),
  navigateMock: vi.fn(),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigateMock,
}))

vi.mock('@/lib/queries/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/queries/auth')>()),
  useDemo: () => ({ mutateAsync: demoMutateAsync, isPending: false }),
}))

import { HomeMarketing } from '../HomeMarketing'

function firstDemoButton() {
  const [button] = screen.getAllByRole('button', { name: 'Créer un compte de démo' })
  if (!button) throw new Error('no demo button rendered')
  return button
}

describe('HomeMarketing', () => {
  beforeEach(() => {
    demoMutateAsync.mockReset()
    navigateMock.mockReset()
  })

  it('keeps both demo calls pending through the collection navigation', async () => {
    demoMutateAsync.mockResolvedValue(undefined)
    renderWithProviders(<HomeMarketing />)

    await userEvent.setup().click(firstDemoButton())

    expect(demoMutateAsync).toHaveBeenCalledOnce()
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: '/collection' }))
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled()
    }
  })

  // The home swaps the marketing view for the hub as soon as the session installs,
  // so the redirect must survive this component unmounting mid-request.
  it('still navigates when the marketing view unmounts before the demo resolves', async () => {
    let settle: () => void = () => {}
    demoMutateAsync.mockReturnValue(
      new Promise<void>((resolve) => {
        settle = resolve
      })
    )
    const { unmount } = renderWithProviders(<HomeMarketing />)

    await userEvent.setup().click(firstDemoButton())
    unmount()
    settle()

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: '/collection' }))
  })
})
