import { useHydrated, useRouterState } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useHydrated: vi.fn(),
  useRouterState: vi.fn(),
}))

import { NavigationProgress } from '../NavigationProgress'

const mockUseHydrated = vi.mocked(useHydrated)
const mockUseRouterState = vi.mocked(useRouterState)

describe('NavigationProgress', () => {
  beforeEach(() => {
    mockUseHydrated.mockReset()
    mockUseRouterState.mockReset()
  })

  it('keeps a pending navigation hidden until hydration completes', () => {
    mockUseHydrated.mockReturnValue(false)
    mockUseRouterState.mockReturnValue(true as never)

    const { rerender } = render(<NavigationProgress />)

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

    mockUseHydrated.mockReturnValue(true)
    rerender(<NavigationProgress />)

    expect(screen.getByRole('progressbar', { name: 'Chargement de la page' })).toBeInTheDocument()
  })
})
