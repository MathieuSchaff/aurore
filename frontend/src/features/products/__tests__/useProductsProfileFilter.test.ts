import { useQuery } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductsProfileFilter } from '../hooks/useProductsProfileFilter'

const navigateMock = vi.fn()
let pathname = '/products'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
  useRouterState: ({ select }: { select: (s: unknown) => unknown }) =>
    select({ location: { pathname } }),
}))

vi.mock(import('@tanstack/react-query'), async (importOriginal) => ({
  ...(await importOriginal()),
  useQuery: vi.fn(),
}))

const USER_ID = 'user-1'

function mockProfileQueries({ portrait = true, settled = true } = {}) {
  vi.mocked(useQuery).mockImplementation((options: Parameters<typeof useQuery>[0]) => {
    const kind = options.queryKey?.[1]
    const data =
      kind === 'dermo'
        ? { skinTypes: portrait ? ['dry'] : [], skinConcerns: [] }
        : { ingredients: [], tags: [] }
    return {
      data: settled ? data : undefined,
      isSuccess: settled,
      isPending: !settled,
    } as unknown as ReturnType<typeof useQuery>
  })
}

function setup(urlValue: boolean | undefined = undefined, userId: string | null = USER_ID) {
  return renderHook(() => useProductsProfileFilter({ urlValue, userId }))
}

describe('useProductsProfileFilter — standing setting', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    window.localStorage.clear()
    pathname = '/products'
    mockProfileQueries()
  })

  it('turns the filter on once the portrait resolves', () => {
    setup()
    expect(navigateMock).toHaveBeenCalledWith({
      search: expect.any(Function),
      replace: true,
    })
    const searchFn = navigateMock.mock.calls[0][0].search
    expect(searchFn({ page: 4, q: 'test' })).toEqual({ page: 1, q: 'test', profile_filter: true })
  })

  it('stays quiet while the profile queries are still pending', () => {
    mockProfileQueries({ settled: false })
    setup()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('stays quiet for an anonymous visitor', () => {
    setup(undefined, null)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('stays quiet when the URL already states a value', () => {
    setup(false)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('stays quiet when this user opted out', () => {
    window.localStorage.setItem(`products-profile-filter-off:${USER_ID}`, '1')
    setup()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('honours another account opt-out without silencing this one', () => {
    window.localStorage.setItem('products-profile-filter-off:other-user', '1')
    setup()
    expect(navigateMock).toHaveBeenCalledTimes(1)
  })

  // A20b: the queries can land after a card click already pushed the product
  // location. Replacing then would commit over it and bounce the visitor back.
  it('does not replace once a card click has left the list', () => {
    pathname = '/products/cerave-hydrating-cleanser'
    setup()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})

describe('useProductsProfileFilter — unresolved', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    window.localStorage.clear()
    pathname = '/products'
    mockProfileQueries({ settled: false })
  })

  afterEach(() => vi.useRealTimers())

  it('holds while the standing choice is still unknown', () => {
    expect(setup().result.current.unresolved).toBe(true)
  })

  it('releases on settle when no replace is coming', () => {
    mockProfileQueries({ portrait: false })
    expect(setup().result.current.unresolved).toBe(false)
  })

  // A20c: the replace only commits on an effect, one render after the queries settle.
  // Releasing on settle flips the cache key with the URL still unstated and pays a
  // list fetch of the very filters the replace immediately discards.
  it('holds past the settle while a replace is still coming', () => {
    mockProfileQueries()
    expect(setup().result.current.unresolved).toBe(true)
  })

  it('releases when the replace outlasts the cap', () => {
    vi.useFakeTimers()
    mockProfileQueries()
    const { result } = setup()
    expect(result.current.unresolved).toBe(true)
    act(() => vi.advanceTimersByTime(700))
    expect(result.current.unresolved).toBe(false)
  })

  it('never holds for an anonymous visitor', () => {
    expect(setup(undefined, null).result.current.unresolved).toBe(false)
  })

  it('never holds when the URL already states a value', () => {
    expect(setup(true).result.current.unresolved).toBe(false)
  })

  it('never holds for a user who opted out', () => {
    window.localStorage.setItem(`products-profile-filter-off:${USER_ID}`, '1')
    expect(setup().result.current.unresolved).toBe(false)
  })

  it('releases when the profile queries outlast the cap', () => {
    vi.useFakeTimers()
    const { result } = setup()
    expect(result.current.unresolved).toBe(true)
    act(() => vi.advanceTimersByTime(700))
    expect(result.current.unresolved).toBe(false)
  })

  it('stays released once the replace has committed', () => {
    const { result, rerender } = renderHook(
      ({ urlValue }: { urlValue: boolean | undefined }) =>
        useProductsProfileFilter({ urlValue, userId: USER_ID }),
      { initialProps: { urlValue: undefined as boolean | undefined } }
    )
    expect(result.current.unresolved).toBe(true)
    // A background refetch keeps status 'success', so the hold cannot come back and
    // strand the page on the anonymous key after the list already swapped.
    mockProfileQueries()
    rerender({ urlValue: true })
    expect(result.current.unresolved).toBe(false)
  })
})
