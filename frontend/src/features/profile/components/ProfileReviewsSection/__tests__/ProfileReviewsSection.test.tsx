import { screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { createLinkStub, LinkStub } from '@/test/mocks/router'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', () => ({ createLink: createLinkStub, Link: LinkStub }))

import { ProfileReviewsSection } from '../ProfileReviewsSection'

function serveReviews(reviews: unknown[]) {
  server.use(
    http.get('*/api/profiles/:username/reviews', () =>
      HttpResponse.json({ success: true, data: { reviews } })
    )
  )
}

describe('ProfileReviewsSection', () => {
  it('renders recent reviews with the explicit product linked to its page', async () => {
    serveReviews([
      {
        id: '1',
        comment: 'Super apaisant.',
        product: { slug: 'serum-x', name: 'Sérum X' },
        reviewer: { username: 'lea' },
      },
    ])

    renderWithProviders(<ProfileReviewsSection username="lea" />)

    expect(await screen.findByRole('link', { name: 'Sérum X' })).toHaveAttribute(
      'href',
      '/products/serum-x'
    )
    expect(screen.getByText('Super apaisant.')).toBeInTheDocument()
  })

  it('renders nothing when there are no reviews (clean absence)', async () => {
    serveReviews([])
    // An empty section renders nothing either way, so wait for the fetch to settle
    // before asserting, otherwise the assertion only proves the loading state.
    const queryClient = createTestQueryClient()
    const { container } = renderWithProviders(<ProfileReviewsSection username="lea" />, {
      queryClient,
    })

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    expect(container).toBeEmptyDOMElement()
  })
})
