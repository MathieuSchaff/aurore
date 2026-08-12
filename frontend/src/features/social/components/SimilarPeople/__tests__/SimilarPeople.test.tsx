import { fireEvent, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createLinkStub, LinkStub } from '@/test/mocks/router'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', () => ({ createLink: createLinkStub, Link: LinkStub }))

import { SimilarPeople } from '../SimilarPeople'

// Picking a concern must switch endpoint, not just render again: the search URL is
// recorded so the switch is asserted on the request the component actually sent.
let lastSearchConcern: string | null = null

describe('SimilarPeople', () => {
  beforeEach(() => {
    lastSearchConcern = null
    server.use(
      http.get('*/api/social/similar', () =>
        HttpResponse.json({
          success: true,
          data: { profiles: [{ username: 'lea', band: 'tres-proche' }] },
        })
      ),
      http.get('*/api/social/profiles/search', ({ request }) => {
        lastSearchConcern = new URL(request.url).searchParams.get('concern')
        return HttpResponse.json({
          success: true,
          data: { profiles: [{ username: 'lea', band: 'tres-proche' }] },
        })
      })
    )
  })

  it('shows the passive similar list by default', async () => {
    renderWithProviders(<SimilarPeople />)

    expect(await screen.findByRole('link', { name: 'lea' })).toBeInTheDocument()
    expect(lastSearchConcern).toBeNull()
  })

  it('switches to concern search when a concern is picked', async () => {
    renderWithProviders(<SimilarPeople />)

    fireEvent.click(await screen.findByRole('radio', { name: 'Rosacée' }))

    await vi.waitFor(() => expect(lastSearchConcern).toBe('rosacee'))
  })
})
