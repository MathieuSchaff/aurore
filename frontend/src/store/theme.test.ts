import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock window.matchMedia (not available in jsdom)
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('lightVariant — initialization', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-light-variant')
    mockMatchMedia(false)
    vi.resetModules()
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-light-variant')
  })

  it('defaults to null when localStorage is empty', async () => {
    const { useThemeStore } = await import('./theme')
    expect(useThemeStore.getState().lightVariant).toBeNull()
    expect(document.documentElement.getAttribute('data-light-variant')).toBeNull()
  })

  it('restores saved variant from localStorage on init', async () => {
    localStorage.setItem('light-variant', 'foret')
    const { useThemeStore } = await import('./theme')
    expect(useThemeStore.getState().lightVariant).toBe('foret')
    expect(document.documentElement.getAttribute('data-light-variant')).toBe('foret')
  })

  it('ignores invalid localStorage values', async () => {
    localStorage.setItem('light-variant', 'invalid-value')
    const { useThemeStore } = await import('./theme')
    expect(useThemeStore.getState().lightVariant).toBeNull()
    expect(document.documentElement.getAttribute('data-light-variant')).toBeNull()
  })
})

describe('setLightVariant', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-light-variant')
    mockMatchMedia(false)
    vi.resetModules()
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-light-variant')
  })

  it('sets the variant, saves to localStorage, and applies the attribute', async () => {
    const { useThemeStore } = await import('./theme')
    useThemeStore.getState().setLightVariant('ardoise')

    expect(useThemeStore.getState().lightVariant).toBe('ardoise')
    expect(localStorage.getItem('light-variant')).toBe('ardoise')
    expect(document.documentElement.getAttribute('data-light-variant')).toBe('ardoise')
  })

  it('removes variant, clears localStorage, and removes the attribute when called with null', async () => {
    localStorage.setItem('light-variant', 'foret')
    document.documentElement.setAttribute('data-light-variant', 'foret')
    const { useThemeStore } = await import('./theme')
    useThemeStore.getState().setLightVariant(null)

    expect(useThemeStore.getState().lightVariant).toBeNull()
    expect(localStorage.getItem('light-variant')).toBeNull()
    expect(document.documentElement.getAttribute('data-light-variant')).toBeNull()
  })

  it('switching variant updates attribute in place', async () => {
    const { useThemeStore } = await import('./theme')
    useThemeStore.getState().setLightVariant('foret')
    useThemeStore.getState().setLightVariant('ardoise')

    expect(useThemeStore.getState().lightVariant).toBe('ardoise')
    expect(document.documentElement.getAttribute('data-light-variant')).toBe('ardoise')
  })

  it('does not affect the existing theme field', async () => {
    const { useThemeStore } = await import('./theme')
    const themeBefore = useThemeStore.getState().theme
    useThemeStore.getState().setLightVariant('ardoise')
    expect(useThemeStore.getState().theme).toBe(themeBefore)
  })
})
