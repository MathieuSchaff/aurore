import { cleanup, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { server } from '@/test/msw/server'
import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { LifecycleSection } from '../LifecycleSection'

vi.mock('@/lib/queries/purchases', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/purchases')>()
  return {
    ...actual,
    useOpenPurchase: vi.fn(() => ({ mutate: vi.fn() })),
    useFinishPurchase: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

describe('LifecycleSection', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    p: makeUserProduct({ id: 'up1' }),
    onAddPurchase: vi.fn(),
  }

  it('affiche un message si aucun achat disponible', async () => {
    renderWithProviders(<LifecycleSection {...defaultProps} />)
    expect(await screen.findByText(/Aucun achat enregistré/)).toBeInTheDocument()
  })

  it('displays a zero purchase price', async () => {
    server.use(
      http.get('*/api/user-products/:id/purchases', () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              userProductId: '22222222-2222-4222-8222-222222222222',
              purchasedAt: '2026-08-21T08:00:00.000Z',
              pricePaidCents: 0,
              openedAt: null,
              finishedAt: null,
              expiresAt: null,
              createdAt: '2026-08-21T08:00:00.000Z',
            },
          ],
        })
      )
    )

    renderWithProviders(<LifecycleSection {...defaultProps} />)

    expect(await screen.findByText('0.00€')).toBeInTheDocument()
  })
})
