import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '../../../../test/utils'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  useNavigate: () => navigateMock,
}))

const demoMutateAsync = vi.fn()
let demoIsPending = false

vi.mock('../../../../lib/queries/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../lib/queries/auth')>()
  return {
    ...actual,
    useDemo: () => ({ mutateAsync: demoMutateAsync, isPending: demoIsPending }),
  }
})

import { DemoCallout } from './DemoCallout'

describe('DemoCallout', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    demoMutateAsync.mockReset()
    demoIsPending = false
  })

  it('navigates to /collection on success', async () => {
    demoMutateAsync.mockResolvedValue(undefined)
    renderWithProviders(<DemoCallout />)

    await userEvent.setup().click(screen.getByRole('button', { name: /Essayer la démo/ }))

    expect(demoMutateAsync).toHaveBeenCalledOnce()
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: '/collection' }))
  })

  it('does not navigate and re-enables the button when the mutation fails', async () => {
    demoMutateAsync.mockRejectedValue(new Error('server_error'))
    renderWithProviders(<DemoCallout />)

    await userEvent.setup().click(screen.getByRole('button', { name: /Essayer la démo/ }))

    expect(demoMutateAsync).toHaveBeenCalledOnce()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Essayer la démo/ })).not.toBeDisabled()
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('disables the button while pending', () => {
    demoIsPending = true
    renderWithProviders(<DemoCallout />)

    // The Button swaps its label for a loading spinner, so query the sole button.
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
