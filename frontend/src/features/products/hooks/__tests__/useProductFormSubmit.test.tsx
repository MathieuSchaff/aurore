import { fireEvent, screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { productToEditForm } from '@/features/products/components/ProductForm/ProductForm.schema'
import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { useProductFormSubmit } from '../useProductFormSubmit'

function Form({ args }: { args: Parameters<typeof useProductFormSubmit>[0] }) {
  const submit = useProductFormSubmit(args)
  return (
    <form aria-label="Save product" onSubmit={submit.handleSubmit}>
      <button type="submit">Save</button>
      {submit.error && <p role="alert">{submit.error}</p>}
    </form>
  )
}

const product = PRODUCT_DETAILS[0]
if (!product) throw new Error('missing product fixture')
const tag = { tagId: '33333333-3333-4333-8333-333333333334', relevance: 'primary' as const }

describe('product save permissions and tag provenance', () => {
  it.each(['notes', 'inci'] as const)(
    'saves only %s without rewriting unchanged tags',
    async (field) => {
      let tagsWritten = 0
      server.use(
        http.patch('*/api/products/:id', () => HttpResponse.json({ success: true, data: product })),
        http.put('*/api/products/:id/tags', () => {
          tagsWritten++
          return HttpResponse.json({ success: true, data: [] })
        })
      )
      const onSuccess = vi.fn()
      renderWithProviders(
        <Form
          args={{
            mode: 'edit',
            product,
            form: { ...productToEditForm(product), [field]: 'Aqua' },
            tags: [tag],
            isTagsDirty: false,
            canManageLinks: true,
            onSuccess,
          }}
        />
      )
      fireEvent.submit(screen.getByRole('form'))
      await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(product.slug))
      expect(tagsWritten).toBe(0)
    }
  )

  it('finishes the product patch before applying an explicit manual selection', async () => {
    const release = Promise.withResolvers<void>()
    const started = Promise.withResolvers<void>()
    let tagsWritten = 0
    server.use(
      http.patch('*/api/products/:id', async () => {
        started.resolve()
        await release.promise
        return HttpResponse.json({ success: true, data: product })
      }),
      http.put('*/api/products/:id/tags', () => {
        tagsWritten++
        return HttpResponse.json({ success: true, data: [] })
      })
    )
    const onSuccess = vi.fn()
    renderWithProviders(
      <Form
        args={{
          mode: 'edit',
          product,
          form: { ...productToEditForm(product), inci: 'Aqua' },
          tags: [tag],
          isTagsDirty: true,
          canManageLinks: true,
          onSuccess,
        }}
      />
    )
    fireEvent.submit(screen.getByRole('form'))
    await started.promise
    expect(tagsWritten).toBe(0)
    release.resolve()
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(product.slug))
    expect(tagsWritten).toBe(1)
  })

  it.each(['create', 'edit'] as const)(
    'completes %s for an ordinary owner without forbidden link writes',
    async (mode) => {
      let forbiddenWrites = 0
      server.use(
        http.post('*/api/products', () => HttpResponse.json({ success: true, data: product })),
        http.patch('*/api/products/:id', () => HttpResponse.json({ success: true, data: product })),
        http.put('*/api/products/:id/tags', () => {
          forbiddenWrites++
          return HttpResponse.json({ success: false, error: 'forbidden' }, { status: 403 })
        }),
        http.post('*/api/products/:id/ingredients', () => {
          forbiddenWrites++
          return HttpResponse.json({ success: false, error: 'forbidden' }, { status: 403 })
        })
      )
      const onSuccess = vi.fn()
      const common = {
        form: { ...productToEditForm(product), notes: 'An owner edit' },
        tags: [tag],
        isTagsDirty: true,
        canManageLinks: false,
        onSuccess,
      }
      renderWithProviders(
        <Form
          args={
            mode === 'create'
              ? { ...common, mode, pendingIngredients: [] }
              : { ...common, mode, product }
          }
        />
      )
      fireEvent.submit(screen.getByRole('form'))
      await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(product.slug))
      expect(forbiddenWrites).toBe(0)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    }
  )
})
