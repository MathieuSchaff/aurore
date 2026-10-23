import { ok, type ProductSearchPage, type ProductSearchResult } from '@aurore/shared'

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { ProductPicker } from '../components/ProductPicker'

const products: ProductSearchResult[] = ['a', 'b', 'c'].map((id) => ({
  id,
  slug: id,
  name: `Produit ${id}`,
  brand: 'Marque',
  kind: 'serum',
}))

beforeEach(() => {
  server.use(
    http.get('*/api/products/by-ids', ({ request }) => {
      const ids = new URL(request.url).searchParams.get('ids')?.split(',') ?? []
      return HttpResponse.json(ok(products.filter((product) => ids.includes(product.id))))
    }),
    http.get('*/api/products/search', () =>
      HttpResponse.json(
        ok({
          items: products,
          hasMore: false,
          nextOffset: 3,
        } satisfies ProductSearchPage)
      )
    )
  )
})

describe('ProductPicker', () => {
  it.each([
    { selectedIds: ['a', 'b'], saved: false },
    { selectedIds: ['a', 'b', 'c'], saved: true },
  ])(
    'keeps removal available for drafts and selections above the minimum (%#)',
    async ({ selectedIds, saved }) => {
      const onChange = vi.fn()
      const onReplace = vi.fn()
      renderWithProviders(
        <ProductPicker
          selectedIds={selectedIds}
          onChange={onChange}
          onReplace={saved ? onReplace : undefined}
        />
      )
      await userEvent.click(await screen.findByRole('button', { name: /retirer.*produit a/i }))
      expect(onChange).toHaveBeenCalledWith(selectedIds.slice(1))
      expect(onReplace).not.toHaveBeenCalled()
    }
  )

  it('preserves the pair and chosen replacement through a pending save and retry', async () => {
    const firstAttempt = Promise.withResolvers<void>()
    const onReplace = vi
      .fn()
      .mockReturnValueOnce(firstAttempt.promise)
      .mockResolvedValueOnce(undefined)
    const onChange = vi.fn()
    renderWithProviders(
      <ProductPicker selectedIds={['a', 'b']} onChange={onChange} onReplace={onReplace} />
    )
    await userEvent.click(await screen.findByRole('button', { name: /remplacer.*produit a/i }))
    const dialog = await screen.findByRole('dialog', { name: /remplacer un produit/i })
    const search = within(dialog).getByRole('combobox', { name: /produit de remplacement/i })
    await userEvent.type(search, 'Produit')
    const replacementOption = await within(dialog).findByRole('option', { name: /produit c/i })
    expect(within(dialog).queryByRole('option', { name: /produit [ab]/i })).toBeNull()
    await userEvent.click(replacementOption)
    await userEvent.click(within(dialog).getByRole('button', { name: 'Remplacer' }))
    expect(onReplace).toHaveBeenCalledExactlyOnceWith('a', 'c')
    expect(within(dialog).getByRole('button', { name: 'Annuler' })).toBeDisabled()
    expect(search).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
    firstAttempt.reject(new Error('test failure'))
    await within(dialog).findByText(/remplacement non enregistré/i)
    expect(within(dialog).getByText(/remplaçant choisi/i).textContent).toMatch(/produit c/i)
    expect(within(dialog).getByRole('button', { name: 'Annuler' })).toBeEnabled()
    expect(screen.getByRole('button', { name: /remplacer.*produit a/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /remplacer.*produit b/i })).toBeDefined()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Remplacer' }))
    expect(onReplace).toHaveBeenNthCalledWith(2, 'a', 'c')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(onChange).not.toHaveBeenCalled()
  })
})
