import type { DiscussionThreadWithReplies } from '@aurore/shared'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

const navigateSpy = vi.hoisted(() => vi.fn())
vi.mock('@tanstack/react-router', () => ({
  // Button.tsx calls createLink at module load; stub so the import doesn't throw.
  createLink: vi.fn(() => vi.fn(({ children }: { children: React.ReactNode }) => children)),
  Link: ({ children }: { children: React.ReactNode }) => children,
  useNavigate: () => navigateSpy,
}))

// Spy on the reactable wiring without pulling in the row's own queries.
const reactionRowSpy = vi.hoisted(() => vi.fn())
vi.mock('@/features/social/components/ReactionRow/ReactionRow', () => ({
  ReactionRow: (props: { reactableType: string; reactableId: string }) => {
    reactionRowSpy(props)
    return null
  },
}))

// ThreadDetail/ReplyItem call these hooks unconditionally, so stub them to inert
// The thread delete resolves so navigation after deletion can be observed
vi.mock('@/lib/queries/discussions', () => ({
  useDeleteReply: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteThread: (_entityType: string, _slug: string, leaveThreadPage: () => Promise<void>) => ({
    mutate: () => leaveThreadPage(),
    isPending: false,
  }),
}))
vi.mock('@/hooks/useAnnounce', () => ({ useAnnounce: () => vi.fn() }))
vi.mock('../AuthorLine', () => ({ AuthorLine: () => null }))
vi.mock('../ReplyForm', () => ({ ReplyForm: () => null }))
vi.mock('../ReportContentButton', () => ({ ReportContentButton: () => null }))

import { ThreadDetail } from '../ThreadDetail'

function thread(): DiscussionThreadWithReplies {
  return {
    id: 'thread-1',
    productId: 'prod-1',
    ingredientId: null,
    authorId: 'a1',
    authorName: 'lea',
    title: 'Sujet',
    content: 'Contenu',
    replyCount: 1,
    createdAt: '2026-06-25T00:00:00.000Z',
    replies: [
      {
        id: 'reply-9',
        threadId: 'thread-1',
        authorId: 'a2',
        authorName: 'theo',
        content: 'Réponse',
        createdAt: '2026-06-25T01:00:00.000Z',
      },
    ],
  }
}

describe('ThreadDetail reaction wiring', () => {
  afterEach(() => reactionRowSpy.mockClear())

  it('binds the opening to thread and the reply to thread_reply, each with its own id', () => {
    render(
      <ThreadDetail thread={thread()} entityType="product" slug="creme-x" currentUserId={null} />
    )
    expect(reactionRowSpy).toHaveBeenCalledWith({
      reactableType: 'thread',
      reactableId: 'thread-1',
    })
    expect(reactionRowSpy).toHaveBeenCalledWith({
      reactableType: 'thread_reply',
      reactableId: 'reply-9',
    })
  })
})

describe('deleting the opening thread', () => {
  afterEach(() => navigateSpy.mockClear())

  it('leaves the thread page for its list, which no longer holds the thread', async () => {
    render(
      <ThreadDetail thread={thread()} entityType="product" slug="creme-x" currentUserId="a1" />
    )

    await userEvent.click(screen.getByRole('button', { name: /supprimer.*discussion/i }))

    expect(navigateSpy).toHaveBeenCalledWith({
      to: '/products/$slug/discussions',
      params: { slug: 'creme-x' },
    })
  })
})
