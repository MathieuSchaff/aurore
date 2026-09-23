import type { UpdateUserProductInput } from '@aurore/shared'

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import type { UserProductEntry } from '@/lib/queries/user-products'
import { server } from '@/test/msw/server'
import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { CollectionPage } from '../page/CollectionPage'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => vi.fn(),
  useRouter: () => ({ state: { location: { pathname: '/collection' } } }),
  createLink:
    () =>
    ({ children }: { children: React.ReactNode }) => <a href="/collection/achats">{children}</a>,
  getRouteApi: () => ({
    useNavigate: () => vi.fn(),
    useSearch: () => ({
      sort: 'name',
      brand: 'all',
      productType: 'all',
      sentiment: 'all',
      repurchase: 'all',
      minNote: 0,
      maxPrice: '',
    }),
  }),
}))

describe('personal memory without a catalogue row', () => {
  it.each([false, true])(
    'keeps notes and status editable with another visible entry: %s',
    async (includeVisible) => {
      const hidden: UserProductEntry = {
        ...makeUserProduct(),
        product: null,
        comment: 'Personal memory marker',
      }
      const visible = makeUserProduct({ id: 'other-entry', productId: 'other-product' })
      let entries: UserProductEntry[] = includeVisible ? [hidden, visible] : [hidden]
      const writes: { id: string; input: UpdateUserProductInput }[] = []
      server.use(
        http.get('*/api/user-products', () => HttpResponse.json({ success: true, data: entries })),
        http.patch('*/api/user-products/:id', async ({ request, params }) => {
          const input = (await request.json()) as UpdateUserProductInput
          writes.push({ id: String(params.id), input })
          entries = entries.map((entry) =>
            entry.id === params.id ? { ...entry, ...input } : entry
          )
          return HttpResponse.json({
            success: true,
            data: entries.find((entry) => entry.id === params.id),
          })
        }),
        http.delete('*/api/user-products/:id', ({ params }) => {
          entries = entries.filter((entry) => entry.id !== params.id)
          return HttpResponse.json({ success: true, data: null })
        }),
        http.get('*/api/profile/preferences', () =>
          HttpResponse.json({ success: true, data: null })
        )
      )
      renderWithProviders(<CollectionPage />)
      const region = within(await screen.findByRole('region', { name: 'Produit indisponible' }))
      if (includeVisible) expect(await screen.findByText(visible.product.name)).toBeInTheDocument()
      const notes = region.getByRole('textbox', { name: 'Notes personnelles' })
      expect(notes).toHaveValue(hidden.comment)
      await userEvent.clear(notes)
      await userEvent.type(notes, 'Updated private memory')
      await userEvent.tab()
      await waitFor(() =>
        expect(writes).toContainEqual({
          id: hidden.id,
          input: { comment: 'Updated private memory' },
        })
      )
      await userEvent.selectOptions(region.getByRole('combobox', { name: 'Statut' }), 'avoided')
      await waitFor(() =>
        expect(writes).toContainEqual({ id: hidden.id, input: { status: 'avoided' } })
      )
      expect(region.getByRole('textbox', { name: 'Notes personnelles' })).toHaveValue(
        'Updated private memory'
      )
      await userEvent.click(region.getByRole('button', { name: 'Retirer de ma collection' }))
      await userEvent.click(
        within(await screen.findByRole('alertdialog')).getByRole('button', { name: /^Retirer$/ })
      )
      await waitFor(() =>
        expect(
          screen.queryByRole('region', { name: 'Produit indisponible' })
        ).not.toBeInTheDocument()
      )
      expect(entries.map((entry) => entry.id)).toEqual(includeVisible ? [visible.id] : [])
    }
  )
})
