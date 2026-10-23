import { type EnrichedComparisonProduct, ok } from '@aurore/shared'

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { ComparisonPreview } from '../components/ComparisonPreview'

const product = (id: string): EnrichedComparisonProduct => ({
  id,
  name: `Produit ${id}`,
  brand: 'Marque',
  slug: id,
  kind: 'serum',
  imageUrl: null,
  totalAmount: null,
  amountUnit: null,
  priceCents: null,
  pricePer: null,
  ingredients: [],
  tags: [],
})

const render = (productIds: string[]) =>
  renderWithProviders(<ComparisonPreview productIds={productIds} />)

beforeEach(() => {
  server.use(http.get('*/api/user-products', () => HttpResponse.json(ok([]))))
})

describe('ComparisonPreview', () => {
  it('distinguishes loading and failure from missing ingredient data, then retries', async () => {
    let attempts = 0
    server.use(
      http.get('*/api/product-comparisons/preview', () => {
        attempts += 1
        return attempts === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(ok([product('a'), product('b')]))
      })
    )
    render(['a', 'b'])
    expect(screen.getByRole('status').textContent).toMatch(/chargement du comparatif/i)
    await screen.findByText(/impossible de charger le comparatif/i)
    expect(screen.queryByText(/données insuffisantes/i)).toBeNull()
    expect(screen.queryByRole('region', { name: 'Produits comparés' })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }))
    await screen.findByRole('region', { name: 'Produits comparés' })
    expect(screen.getByText(/données insuffisantes/i)).toBeDefined()
    expect(screen.queryByText(/impossible de charger le comparatif/i)).toBeNull()
    expect(attempts).toBe(2)
  })

  it('hides the previous pair while loading a new selection and preserves selected order', async () => {
    const firstStarted = Promise.withResolvers<void>()
    const releaseFirst = Promise.withResolvers<void>()
    server.use(
      http.get('*/api/product-comparisons/preview', async ({ request }) => {
        const ids = new URL(request.url).searchParams.get('ids')?.split(',') ?? []
        if (ids.join(',') === 'b,c') {
          firstStarted.resolve()
          await releaseFirst.promise
        }
        return HttpResponse.json(ok(ids.map(product)))
      })
    )
    const { rerender } = render(['a', 'b'])
    await screen.findByRole('region', { name: 'Produits comparés' })
    rerender(<ComparisonPreview productIds={['b', 'c']} />)
    await firstStarted.promise
    expect(screen.getByRole('status').textContent).toMatch(/chargement du comparatif/i)
    expect(screen.queryByText('Produit a')).toBeNull()
    releaseFirst.resolve()
    const shelf = await screen.findByRole('region', { name: 'Produits comparés' })
    expect(
      within(shelf)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Produit b', 'Produit c'])
    rerender(<ComparisonPreview productIds={['c', 'b']} />)
    const reversed = await screen.findByRole('region', { name: 'Produits comparés' })
    expect(
      within(reversed)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Produit c', 'Produit b'])
    expect(screen.queryByText('Produit a')).toBeNull()
  })
})
