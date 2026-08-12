import { screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { createLinkStub, LinkStub } from '@/test/mocks/router'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', () => ({ createLink: createLinkStub, Link: LinkStub }))

// The reaction row is a smart child with its own queries; isolate the surface test
// from it (own suite) but spy on its props to pin the reactable wiring.
const reactionRowSpy = vi.hoisted(() => vi.fn())
vi.mock('@/features/social/components/ReactionRow/ReactionRow', () => ({
  ReactionRow: (props: { reactableType: string; reactableId: string }) => {
    reactionRowSpy(props)
    return null
  },
}))

import { ProfilePostsSection } from '../ProfilePostsSection'

function servePosts(posts: unknown[]) {
  server.use(
    http.get('*/api/profiles/:username/posts', () =>
      HttpResponse.json({ success: true, data: { posts } })
    )
  )
}

describe('ProfilePostsSection', () => {
  it('renders a post content, its tone label and the linked product anchor', async () => {
    servePosts([
      {
        id: '1',
        content: 'Cette crème calme tout.',
        tone: 'coup-de-gueule',
        concernSlug: null,
        productAnchor: { slug: 'creme-x', name: 'Crème X' },
        ingredientAnchor: null,
        createdAt: '2026-06-25T00:00:00.000Z',
        author: { username: 'lea', profilePublic: true },
      },
    ])

    renderWithProviders(<ProfilePostsSection username="lea" />)

    expect(await screen.findByText('Cette crème calme tout.')).toBeInTheDocument()
    expect(screen.getByText('Coup de gueule')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Crème X' })).toHaveAttribute(
      'href',
      '/products/creme-x'
    )
  })

  it('renders nothing when there are no posts (clean absence)', async () => {
    servePosts([])
    // An empty section renders nothing either way, so wait for the fetch to settle
    // before asserting, otherwise the assertion only proves the loading state.
    const queryClient = createTestQueryClient()
    const { container } = renderWithProviders(<ProfilePostsSection username="lea" />, {
      queryClient,
    })

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    expect(container).toBeEmptyDOMElement()
  })

  it('binds each ReactionRow to its post (reactableType=post, reactableId=post.id)', async () => {
    reactionRowSpy.mockClear()
    servePosts([
      {
        id: 'p-7',
        content: 'x',
        tone: 'principal',
        concernSlug: null,
        productAnchor: null,
        ingredientAnchor: null,
        createdAt: '2026-06-25T00:00:00.000Z',
        author: { username: 'lea', profilePublic: true },
      },
    ])
    renderWithProviders(<ProfilePostsSection username="lea" />)

    await waitFor(() =>
      expect(reactionRowSpy).toHaveBeenCalledWith({ reactableType: 'post', reactableId: 'p-7' })
    )
  })
})
