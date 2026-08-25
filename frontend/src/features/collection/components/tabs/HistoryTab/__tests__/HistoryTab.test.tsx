import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { HistoryTab } from '../HistoryTab'

describe('HistoryTab', () => {
  it('displays a zero purchase price', () => {
    const userProduct = makeUserProduct({
      purchases: [
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

    renderWithProviders(<HistoryTab userProducts={[userProduct]} />)

    expect(screen.getByText('0.00€')).toBeInTheDocument()
  })
})
