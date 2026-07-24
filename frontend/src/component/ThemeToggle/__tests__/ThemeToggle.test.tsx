import { useHydrated } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useThemeStore } from '@/store/theme'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useHydrated: vi.fn(),
}))

import { ThemeToggle } from '../ThemeToggle'

const mockUseHydrated = vi.mocked(useHydrated)

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockUseHydrated.mockReset()
    useThemeStore.setState({ theme: 'dark', variant: 'foret', isUserChoice: true })
  })

  afterEach(() => {
    useThemeStore.setState({ theme: 'light', variant: 'terracota', isUserChoice: false })
  })

  it('renders server defaults first, then reveals the stored theme and variant', () => {
    mockUseHydrated.mockReturnValue(false)

    const { rerender } = render(<ThemeToggle />)
    const light = screen.getByText('Clair').closest('button')
    const dark = screen.getByText('Sombre').closest('button')
    const terra = screen.getByText('Terra').closest('button')
    const forest = screen.getByText('Forêt').closest('button')

    expect(light).toHaveAttribute('aria-pressed', 'true')
    expect(dark).toHaveAttribute('aria-pressed', 'false')
    expect(terra).toHaveAttribute('aria-pressed', 'true')
    expect(forest).toHaveAttribute('aria-pressed', 'false')

    mockUseHydrated.mockReturnValue(true)
    rerender(<ThemeToggle />)

    expect(light).toHaveAttribute('aria-pressed', 'false')
    expect(dark).toHaveAttribute('aria-pressed', 'true')
    expect(terra).toHaveAttribute('aria-pressed', 'false')
    expect(forest).toHaveAttribute('aria-pressed', 'true')
  })
})
