import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/utils'
import { BlogListPage } from './BlogListPage'

const refetchMock = vi.fn()

vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: true,
    isPlaceholderData: false,
    refetch: refetchMock,
  })),
}))

describe('BlogListPage — error state', () => {
  afterEach(() => {
    cleanup()
    refetchMock.mockClear()
  })

  it('renders the retry EmptyState when the list query fails', () => {
    renderWithProviders(<BlogListPage page={1} onPageChange={vi.fn()} onSearchChange={vi.fn()} />)
    expect(screen.getByText('Chargement impossible')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Réessayer/i })).toBeInTheDocument()
  })

  it('calls refetch when the user clicks Réessayer', async () => {
    renderWithProviders(<BlogListPage page={1} onPageChange={vi.fn()} onSearchChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /Réessayer/i }))
    expect(refetchMock).toHaveBeenCalledOnce()
  })
})
