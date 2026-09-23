// @vitest-environment jsdom
// happy-dom misclassifies decimal purchase prices as step mismatches and blocks form submission
import type { Purchase, UpdatePurchaseInput } from '@aurore/shared'

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { CollectionAchatsPage } from '@/features/collection/page/CollectionAchatsPage'
import type { UserProductEntry } from '@/lib/queries/user-products'
import { server } from '@/test/msw/server'
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

  it('edits and deletes an unavailable product purchase by its personal identifiers', async () => {
    const purchase = {
      id: '11111111-1111-4111-8111-111111111111',
      userProductId: '22222222-2222-4222-8222-222222222222',
      purchasedAt: '2026-08-21T00:00:00.000Z',
      pricePaidCents: 500,
      openedAt: null,
      finishedAt: null,
      expiresAt: null,
      createdAt: '2026-08-21T08:00:00.000Z',
    } satisfies Purchase
    const unavailable = {
      ...makeUserProduct({ id: purchase.userProductId, purchases: [purchase] }),
      product: null,
    } satisfies UserProductEntry
    let entries: UserProductEntry[] = [unavailable]
    const updates: { userProductId: string; purchaseId: string; input: UpdatePurchaseInput }[] = []
    const deletes: { userProductId: string; purchaseId: string }[] = []
    server.use(
      http.get('*/api/user-products', () => HttpResponse.json({ success: true, data: entries })),
      http.patch(
        '*/api/user-products/:userProductId/purchases/:purchaseId',
        async ({ params, request }) => {
          const input = (await request.json()) as UpdatePurchaseInput
          updates.push({
            userProductId: String(params.userProductId),
            purchaseId: String(params.purchaseId),
            input,
          })
          const updated = { ...purchase, ...input }
          entries = [{ ...unavailable, purchases: [updated] }]
          return HttpResponse.json({ success: true, data: updated })
        }
      ),
      http.delete('*/api/user-products/:userProductId/purchases/:purchaseId', ({ params }) => {
        deletes.push({
          userProductId: String(params.userProductId),
          purchaseId: String(params.purchaseId),
        })
        entries = [{ ...unavailable, purchases: [] }]
        return new HttpResponse(null, { status: 204 })
      })
    )
    const user = userEvent.setup()
    renderWithProviders(<CollectionAchatsPage />)

    expect(await screen.findByText('Produit indisponible')).toBeVisible()
    expect(screen.getByText('5.00€')).toBeVisible()
    expect(screen.queryByText('CeraVe Hydrating Cleanser')).not.toBeInTheDocument()
    expect(screen.queryByText('CeraVe')).not.toBeInTheDocument()

    const menuName = "Options pour l'achat de Produit indisponible"
    await user.click(screen.getByRole('button', { name: menuName }))
    await user.click(screen.getByRole('menuitem', { name: 'Modifier' }))
    const editDialog = await screen.findByRole('dialog')
    const price = within(editDialog).getByRole('spinbutton', { name: 'Prix payé (€)' })
    expect(price).toHaveValue(5)
    await user.clear(price)
    await user.type(price, '12.50')
    await user.click(within(editDialog).getByRole('button', { name: 'Valider' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(await screen.findByText('12.50€')).toBeVisible()
    expect(updates).toEqual([
      {
        userProductId: purchase.userProductId,
        purchaseId: purchase.id,
        input: { purchasedAt: '2026-08-21T00:00:00.000Z', pricePaidCents: 1250 },
      },
    ])

    await user.click(screen.getByRole('button', { name: menuName }))
    await user.click(screen.getByRole('menuitem', { name: 'Supprimer' }))
    const confirmation = await screen.findByRole('alertdialog')
    expect(within(confirmation).getByText(/cet achat de Produit indisponible/)).toBeVisible()
    await user.click(within(confirmation).getByRole('button', { name: 'Supprimer' }))

    expect(await screen.findByText('Aucun achat enregistré')).toBeVisible()
    expect(deletes).toEqual([{ userProductId: purchase.userProductId, purchaseId: purchase.id }])
  })
})
