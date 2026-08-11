import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { BlogListPage } from './BlogListPage'

let listHits = 0

function serveFailingList() {
  listHits = 0
  server.use(
    http.get('*/api/articles', () => {
      listHits += 1
      return new HttpResponse(null, { status: 500 })
    })
  )
}

describe('BlogListPage: error state', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the retry EmptyState when the list query fails', async () => {
    serveFailingList()
    renderWithProviders(<BlogListPage page={1} onPageChange={vi.fn()} onSearchChange={vi.fn()} />)

    expect(await screen.findByText('Chargement impossible')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Réessayer/i })).toBeInTheDocument()
  })

  it('refetches when the user clicks Réessayer', async () => {
    serveFailingList()
    renderWithProviders(<BlogListPage page={1} onPageChange={vi.fn()} onSearchChange={vi.fn()} />)

    await userEvent.click(await screen.findByRole('button', { name: /Réessayer/i }))

    await vi.waitFor(() => expect(listHits).toBe(2))
  })
})
