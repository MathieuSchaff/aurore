import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductsProfileFilter } from '../hooks/useProductsProfileFilter'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

const USER_ID = 'user-1'
const OFF_KEY = `products-profile-filter-off:${USER_ID}`

function setup(viewerId: string | null = USER_ID) {
  return renderHook(() => useProductsProfileFilter({ viewerId }))
}

describe('useProductsProfileFilter: explicit choice writer', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    window.localStorage.clear()
  })

  it('turning off stores the device opt-out and drops show_hidden', () => {
    const { result } = setup()
    result.current.setProfileFilter(false)

    expect(window.localStorage.getItem(OFF_KEY)).toBe('1')
    const searchFn = navigateMock.mock.calls[0][0].search
    expect(searchFn({ page: 4, show_hidden: true, q: 'test' })).toEqual({
      page: 1,
      q: 'test',
      profile_filter: false,
      show_hidden: false,
    })
  })

  it('turning on clears the device opt-out and keeps show_hidden as is', () => {
    window.localStorage.setItem(OFF_KEY, '1')
    const { result } = setup()
    result.current.setProfileFilter(true)

    expect(window.localStorage.getItem(OFF_KEY)).toBeNull()
    const searchFn = navigateMock.mock.calls[0][0].search
    expect(searchFn({ page: 4 })).toEqual({ page: 1, profile_filter: true })
  })

  it('never touches storage for an anonymous visitor', () => {
    const { result } = setup(null)
    result.current.setProfileFilter(false)

    expect(window.localStorage.length).toBe(0)
    expect(navigateMock).toHaveBeenCalledTimes(1)
  })
})
