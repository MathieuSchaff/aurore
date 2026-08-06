import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createLinkStub, LinkStub } from '@/test/mocks/router'

vi.mock('@tanstack/react-router', () => ({ createLink: createLinkStub, Link: LinkStub }))

const useQueryMock = vi.fn()
vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQuery: (opts: unknown) => useQueryMock(opts),
}))

import { SimilarPeople } from '../SimilarPeople'

describe('SimilarPeople', () => {
  beforeEach(() => {
    useQueryMock.mockReset()
    useQueryMock.mockReturnValue({
      data: { profiles: [{ username: 'lea', band: 'tres-proche' }] },
      isLoading: false,
    })
  })

  function lastQueryKey() {
    const last = useQueryMock.mock.calls.at(-1)
    if (!last) throw new Error('useQuery was never called')
    return (last[0] as { queryKey: unknown[] }).queryKey
  }

  it('shows the passive similar list by default', () => {
    render(<SimilarPeople />)

    expect(screen.getByRole('link', { name: 'lea' })).toBeInTheDocument()
    expect(lastQueryKey()).toEqual(['social', 'similar'])
  })

  it('switches to concern search when a concern is picked', () => {
    render(<SimilarPeople />)

    fireEvent.click(screen.getByRole('radio', { name: 'Rosacée' }))

    expect(lastQueryKey()).toEqual(['social', 'profiles', 'search', 'rosacee'])
  })
})
