import { cleanup, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useFinishPurchase, useOpenPurchase } from '@/lib/queries/purchases'
import { server } from '@/test/msw/server'
import { makeIdleMutationResult, makePendingMutationResult } from '@/test/mutation'
import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { LifecycleSection } from '../LifecycleSection'

vi.mock('@/lib/queries/purchases', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/purchases')>()
  return {
    ...actual,
    useOpenPurchase: vi.fn(),
    useFinishPurchase: vi.fn(),
  }
})

describe('LifecycleSection', () => {
  beforeEach(() => {
    const open = vi.fn<ReturnType<typeof useOpenPurchase>['mutate']>()
    const finish = vi.fn<ReturnType<typeof useFinishPurchase>['mutate']>()
    vi.mocked(useOpenPurchase).mockReturnValue(makeIdleMutationResult(open))
    vi.mocked(useFinishPurchase).mockReturnValue(makeIdleMutationResult(finish))
  })

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

  it('disables the open action while it is pending', async () => {
    const mutate = vi.fn<ReturnType<typeof useOpenPurchase>['mutate']>()
    vi.mocked(useOpenPurchase).mockReturnValue(
      makePendingMutationResult(mutate, {
        userProductId: 'up1',
        purchaseId: '11111111-1111-4111-8111-111111111111',
        input: { openedAt: '2026-08-21T09:00:00.000Z' },
      })
    )
    server.use(
      http.get('*/api/user-products/:id/purchases', () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              userProductId: '22222222-2222-4222-8222-222222222222',
              purchasedAt: '2026-08-21T08:00:00.000Z',
              pricePaidCents: null,
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

    await screen.findByText('Non entamé')
    expect(screen.getByRole('button', { name: 'Chargement' })).toBeDisabled()
  })

  it('disables the finish action while it is pending', async () => {
    const mutate = vi.fn<ReturnType<typeof useFinishPurchase>['mutate']>()
    vi.mocked(useFinishPurchase).mockReturnValue(
      makePendingMutationResult(mutate, {
        userProductId: 'up1',
        input: { finishedAt: '2026-08-21T10:00:00.000Z' },
      })
    )
    server.use(
      http.get('*/api/user-products/:id/purchases', () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              userProductId: '22222222-2222-4222-8222-222222222222',
              purchasedAt: '2026-08-21T08:00:00.000Z',
              pricePaidCents: null,
              openedAt: '2026-08-21T09:00:00.000Z',
              finishedAt: null,
              expiresAt: null,
              createdAt: '2026-08-21T08:00:00.000Z',
            },
          ],
        })
      )
    )

    renderWithProviders(<LifecycleSection {...defaultProps} />)

    await screen.findByText('En cours')
    expect(screen.getByRole('button', { name: 'Chargement' })).toBeDisabled()
  })
})
