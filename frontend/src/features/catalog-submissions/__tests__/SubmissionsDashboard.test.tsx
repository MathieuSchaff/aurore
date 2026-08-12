import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  const LinkMock = ({
    children,
    to,
    search,
    ...rest
  }: {
    children: React.ReactNode
    to: string
    search?: Record<string, string | undefined>
  }) => {
    const qs = search
      ? new URLSearchParams(
          Object.fromEntries(Object.entries(search).filter(([, v]) => v != null)) as Record<
            string,
            string
          >
        ).toString()
      : ''
    return (
      <a href={qs ? `${to}?${qs}` : to} {...(rest as object)}>
        {children}
      </a>
    )
  }
  // ButtonLink (Modifier/Resoumettre) is built with createLink; reuse LinkMock so
  // role=link + href assertions resolve the same way as <Link>.
  return { ...actual, Link: LinkMock, createLink: () => LinkMock }
})

import type { MySubmissionItem } from '@aurore/shared'

import { SubmissionsDashboard } from '../page/SubmissionsDashboard'

type Submission = MySubmissionItem

const BASE: Submission = {
  kind: 'product',
  id: 'prod-1',
  name: 'Crème test',
  brand: 'BrandX',
  slug: 'creme-test',
  catalogQuality: 'unverified',
  moderationStatus: 'visible',
  moderationReason: null,
  createdAt: '2026-05-30T10:00:00Z',
  updatedAt: '2026-05-30T10:00:00Z',
}

function serveItems(items: Submission[]) {
  server.use(
    http.get('*/api/me/submissions', () => HttpResponse.json({ success: true, data: { items } }))
  )
}

describe('SubmissionsDashboard', () => {
  it('renders a verified item with its badge and no action', async () => {
    serveItems([{ ...BASE, catalogQuality: 'verified' }])
    renderWithProviders(<SubmissionsDashboard />)

    expect(await screen.findByText('Vérifiée')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Modifier' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Resoumettre' })).not.toBeInTheDocument()
  })

  it('renders a pending item with « En lecture » and a Modifier link to the edit route', async () => {
    serveItems([BASE])
    renderWithProviders(<SubmissionsDashboard />)

    expect(await screen.findByText('En lecture')).toBeInTheDocument()
    const edit = screen.getByRole('link', { name: 'Modifier' })
    expect(edit).toHaveAttribute('href', '/products/$slug/edit')
  })

  it('renders a hidden item with its reason and a kind-aware Resoumettre link', async () => {
    serveItems([
      {
        ...BASE,
        kind: 'ingredient',
        id: 'ing-1',
        moderationStatus: 'hidden',
        moderationReason: 'Doublon d’une fiche existante.',
      },
    ])
    renderWithProviders(<SubmissionsDashboard />)

    expect(await screen.findByText('Masquée')).toBeInTheDocument()
    expect(screen.getByText('Doublon d’une fiche existante.')).toBeInTheDocument()
    const resubmit = screen.getByRole('link', { name: 'Resoumettre' })
    const url = new URL(resubmit.getAttribute('href') ?? '', 'http://t')
    expect(url.pathname).toBe('/ingredients/new')
    expect(url.searchParams.get('name')).toBe(BASE.name)
  })

  it('Resoumettre on a hidden product prefills name + brand on /products/new', async () => {
    serveItems([{ ...BASE, moderationStatus: 'hidden', moderationReason: 'Spam.' }])
    renderWithProviders(<SubmissionsDashboard />)

    const resubmit = await screen.findByRole('link', { name: 'Resoumettre' })
    const url = new URL(resubmit.getAttribute('href') ?? '', 'http://t')
    expect(url.pathname).toBe('/products/new')
    expect(url.searchParams.get('name')).toBe(BASE.name)
    expect(url.searchParams.get('brand')).toBe(BASE.brand)
  })

  it('renders the empty state when there are no submissions', async () => {
    serveItems([])
    renderWithProviders(<SubmissionsDashboard />)

    expect(await screen.findByText('Aucune soumission')).toBeInTheDocument()
  })
})
