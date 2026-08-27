import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/utils'

const { demoMutate, navigateMock } = vi.hoisted(() => ({
  demoMutate: vi.fn(),
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
  useDemo: () => ({ mutate: demoMutate, isPending: false }),
}))

import { HomeMarketing } from '../HomeMarketing'

describe('HomeMarketing', () => {
  beforeEach(() => {
    demoMutate.mockReset()
    navigateMock.mockReset()
  })

  it('keeps both demo calls pending through the collection navigation', async () => {
    demoMutate.mockImplementation((_input: undefined, options: { onSuccess?: () => void }) =>
      options.onSuccess?.()
    )
    renderWithProviders(<HomeMarketing />)
    const user = userEvent.setup()
    const [firstDemoButton] = screen.getAllByRole('button', {
      name: 'Créer un compte de démo',
    })

    expect(firstDemoButton).toBeDefined()
    if (!firstDemoButton) return

    await user.click(firstDemoButton)

    expect(demoMutate).toHaveBeenCalledOnce()
    expect(navigateMock).toHaveBeenCalledWith({ to: '/collection' })
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled()
    }
  })
})
