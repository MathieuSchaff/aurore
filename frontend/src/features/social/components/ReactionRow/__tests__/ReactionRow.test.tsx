import { cleanup, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import type { ReactionList } from '@/lib/queries/social'
import { socialKeys } from '@/lib/queries/social'
import { createLinkStub, LinkStub } from '@/test/mocks/router'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@tanstack/react-router', () => ({ createLink: createLinkStub, Link: LinkStub }))
vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

import { ReactionRow } from '../ReactionRow'

const TYPE = 'post' as const
const ID = 'post-1'

function emptyList(): ReactionList {
  return {
    reactableType: TYPE,
    reactableId: ID,
    reactions: { merci: [], 'moi-aussi': [], soutien: [] },
    viewerKinds: [],
  }
}

function seed(list: ReactionList, userId: string | null) {
  const qc = createTestQueryClient()
  qc.setQueryData(socialKeys.reactions(TYPE, ID, userId), list)
  return qc
}

function authenticate(id = 'viewer-id') {
  useSessionMock.mockReturnValue({
    status: 'authenticated',
    credential: 'present',
    user: {
      id,
      email: 'viewer@example.test',
      createdAt: '2026-01-01T00:00:00.000Z',
      role: 'user',
      emailVerified: true,
      isDemo: false,
    },
  })
}

describe('ReactionRow', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({ status: 'anonymous' })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the three entraide buttons, the signed reactors, and never a count', () => {
    authenticate()
    const list: ReactionList = {
      ...emptyList(),
      reactions: {
        merci: [{ username: 'lea', profilePublic: true }],
        'moi-aussi': [],
        soutien: [],
      },
      viewerKinds: ['merci'],
    }
    const { container } = renderWithProviders(
      <ReactionRow reactableType={TYPE} reactableId={ID} />,
      {
        queryClient: seed(list, 'viewer-id'),
      }
    )

    expect(screen.getByRole('button', { name: 'Merci' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Merci' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Moi aussi' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
    expect(screen.getByRole('button', { name: 'Soutien' })).toBeInTheDocument()
    // The reactor is shown by name, never as a tally.
    expect(screen.getByText('lea')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/\d/)
  })

  it('renders nothing for an anonymous reader when there are no reactions (calme)', () => {
    const { container } = renderWithProviders(
      <ReactionRow reactableType={TYPE} reactableId={ID} />,
      {
        queryClient: seed(emptyList(), null),
      }
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows existing reactors to an anonymous reader but disables the toggle buttons', () => {
    const list: ReactionList = {
      ...emptyList(),
      reactions: {
        merci: [{ username: 'lea', profilePublic: false }],
        'moi-aussi': [],
        soutien: [],
      },
    }
    renderWithProviders(<ReactionRow reactableType={TYPE} reactableId={ID} />, {
      queryClient: seed(list, null),
    })
    expect(screen.getByText('lea')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Merci' })).toBeDisabled()
  })

  it("keeps one reader's viewerKinds out of the next reader's row", async () => {
    const readerA: ReactionList = {
      ...emptyList(),
      reactions: {
        merci: [{ username: 'lea', profilePublic: true }],
        'moi-aussi': [],
        soutien: [],
      },
      viewerKinds: ['merci'],
    }
    const qc = createTestQueryClient()
    qc.setQueryData(socialKeys.reactions(TYPE, ID, 'viewer-a'), readerA)
    server.use(
      http.get('*/api/social/reactions', () =>
        HttpResponse.json({ success: true, data: { ...readerA, viewerKinds: [] } })
      )
    )
    authenticate('viewer-b')

    renderWithProviders(<ReactionRow reactableType={TYPE} reactableId={ID} />, {
      queryClient: qc,
    })

    // Dry expect on purpose: reader B must not inherit A's pressed state, not even
    // for the first paint before its own read lands
    expect(screen.getByRole('button', { name: 'Merci' })).toHaveAttribute('aria-pressed', 'false')
    expect(await screen.findByText('lea')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Merci' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders nothing while the session is pending and there are no reactions', () => {
    useSessionMock.mockReturnValue({ status: 'pending' })

    const { container } = renderWithProviders(
      <ReactionRow reactableType={TYPE} reactableId={ID} />,
      { queryClient: seed(emptyList(), null) }
    )

    expect(container).toBeEmptyDOMElement()
  })
})
