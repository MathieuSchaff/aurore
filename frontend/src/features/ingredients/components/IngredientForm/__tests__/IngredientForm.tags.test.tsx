import { err, ok, type ReplaceIngredientTagsInput } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { describe, expect, it, vi } from 'vitest'

import type { BaseIngredient } from '@/features/ingredients/hooks/useIngredientFormSubmit'
import type { ApiData, api } from '@/lib/api'
import type { SessionView } from '@/lib/auth/session'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { IngredientForm } from '../IngredientForm'

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: (): SessionView => ({
    status: 'authenticated',
    credential: 'present',
    user: {
      id: 'user-id',
      email: 'user@example.test',
      createdAt: '2026-01-01T00:00:00.000Z',
      role: 'admin',
      emailVerified: true,
      isDemo: false,
    },
  }),
}))

type IngredientTagRow = ApiData<(typeof api)['ingredient-tags']['$get']>[number]
type IngredientTags = ApiData<(typeof api.ingredients)[':ingredientId']['tags']['$get']>

function tagRow(id: string, label: string, tagType: string): IngredientTagRow {
  return {
    id,
    slug: label.toLowerCase(),
    label,
    tagType,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

// The PUT behind the picker links ingredient_tag_types rows: a product tag id
// offered here would fail the foreign key on save
describe('IngredientForm tag picker', () => {
  it('reloads the other editor tags before saving again after a conflict', async () => {
    const ingredient = {
      id: 'ingredient-1',
      slug: 'retinol',
      name: 'Retinol',
      type: 'skincare',
      category: null,
      description: 'Initial description',
      content: '',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } satisfies BaseIngredient
    const fresh = {
      ...ingredient,
      description: 'Other editor description',
      updatedAt: '2026-01-02T00:00:00.000Z',
    }
    const freshTags: IngredientTags = [
      {
        ingredientId: ingredient.id,
        ingredientTagId: 'it2',
        tagName: 'Apaisant',
        tagSlug: 'apaisant',
        tagCategory: 'skin_effect',
        relevance: 'primary',
      },
    ]
    const tagsStarted = Promise.withResolvers<void>()
    const releaseTags = Promise.withResolvers<void>()
    const writes: ReplaceIngredientTagsInput[] = []
    let patches = 0
    const onSuccess = vi.fn()
    server.use(
      http.get('*/api/ingredient-tags', () =>
        HttpResponse.json(
          ok([tagRow('it1', 'Hydratant', 'skin_effect'), tagRow('it2', 'Apaisant', 'skin_effect')])
        )
      ),
      http.get('*/api/ingredients/retinol', () => HttpResponse.json(ok(fresh))),
      http.get('*/api/ingredients/ingredient-1/tags', async () => {
        tagsStarted.resolve()
        await releaseTags.promise
        return HttpResponse.json(ok(freshTags))
      }),
      http.patch('*/api/ingredients/ingredient-1', () => {
        patches++
        return patches === 1
          ? HttpResponse.json(err('ingredient_update_conflict'), { status: 409 })
          : HttpResponse.json(ok({ ...fresh, updatedAt: '2026-01-03T00:00:00.000Z' }))
      }),
      http.put('*/api/ingredients/ingredient-1/tags', async ({ request }) => {
        writes.push((await request.json()) as ReplaceIngredientTagsInput)
        return HttpResponse.json(ok(freshTags))
      })
    )
    const qc = createTestQueryClient()
    // A fresh tag read is required even when a previous loader populated the cache
    qc.setQueryData(ingredientQueries.tags(ingredient.id).queryKey, [
      {
        ingredientId: ingredient.id,
        ingredientTagId: 'it1',
        tagName: 'Hydratant',
        tagSlug: 'hydratant',
        tagCategory: 'skin_effect',
        relevance: 'primary',
      },
    ])
    const view = renderWithProviders(
      <IngredientForm
        mode="edit"
        ingredient={ingredient}
        initialTags={[{ tagId: 'it1', tagName: 'Hydratant', relevance: 'primary' }]}
        onSuccess={onSuccess}
      />,
      { queryClient: qc }
    )
    const user = userEvent.setup()
    try {
      await user.selectOptions(
        screen.getByRole('combobox', { name: 'Pertinence du tag Hydratant' }),
        'avoid'
      )
      await user.type(screen.getByRole('textbox', { name: 'Description' }), ' Local draft')
      await user.click(screen.getByRole('button', { name: /Enregistrer/i }))

      await tagsStarted.promise
      expect(screen.getByRole('button', { name: /Enregistr|Chargement/i })).toBeDisabled()
      releaseTags.resolve()
      // Retrying a text edit must not silently restore tags from before the other editor's save
      expect(
        await screen.findByRole('combobox', { name: 'Pertinence du tag Apaisant' })
      ).toHaveValue('primary')
      expect(
        screen.queryByRole('combobox', { name: 'Pertinence du tag Hydratant' })
      ).not.toBeInTheDocument()
      await user.type(screen.getByRole('textbox', { name: 'Description' }), ' More text')
      await user.click(screen.getByRole('button', { name: /Enregistrer/i }))
      await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('retinol'))
      expect(writes).toEqual([])

      await user.selectOptions(
        screen.getByRole('combobox', { name: 'Pertinence du tag Apaisant' }),
        'avoid'
      )
      await user.click(screen.getByRole('button', { name: /Enregistrer/i }))
      await waitFor(() =>
        expect(writes).toEqual([
          {
            expectedUpdatedAt: '2026-01-03T00:00:00.000Z',
            tags: [{ tagId: 'it2', relevance: 'avoid' }],
          },
        ])
      )
    } finally {
      releaseTags.resolve()
      view.unmount()
      qc.clear()
    }
  })

  it('keeps the draft and shows an error when the conflict tag reload fails', async () => {
    const ingredient = {
      id: 'ingredient-1',
      slug: 'retinol',
      name: 'Retinol',
      type: 'skincare',
      category: null,
      description: 'Initial description',
      content: '',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } satisfies BaseIngredient
    const onSuccess = vi.fn()
    server.use(
      http.get('*/api/ingredient-tags', () => HttpResponse.json(ok([]))),
      http.patch('*/api/ingredients/ingredient-1', () =>
        HttpResponse.json(err('ingredient_update_conflict'), { status: 409 })
      ),
      http.get('*/api/ingredients/retinol', () =>
        HttpResponse.json(ok({ ...ingredient, description: 'Other editor description' }))
      ),
      http.get('*/api/ingredients/ingredient-1/tags', () =>
        HttpResponse.json(err('server_error'), { status: 503 })
      )
    )
    renderWithProviders(
      <IngredientForm mode="edit" ingredient={ingredient} onSuccess={onSuccess} />
    )
    const user = userEvent.setup()
    const description = screen.getByRole('textbox', { name: 'Description' })
    await user.clear(description)
    await user.type(description, 'Local draft')
    await user.click(screen.getByRole('button', { name: /Enregistrer/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(description).toHaveValue('Local draft')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('offers the ingredient tag definitions, not the product ones', async () => {
    server.use(
      http.get('*/api/ingredient-tags', () =>
        HttpResponse.json({ success: true, data: [tagRow('it1', 'Apaisant', 'skin_effect')] })
      ),
      http.get('*/api/product-tags', () =>
        HttpResponse.json({ success: true, data: [tagRow('pt1', 'Vegan', 'claim')] })
      )
    )

    renderWithProviders(<IngredientForm mode="create" onSuccess={vi.fn()} />)

    expect(await screen.findByRole('option', { name: /Apaisant/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Vegan/ })).not.toBeInTheDocument()
  })

  it('requests all tag definitions for the picker', async () => {
    server.use(
      http.get('*/api/ingredient-tags', ({ request }) => {
        const limit = new URL(request.url).searchParams.get('limit')
        const data = limit === '500' ? [tagRow('it101', 'Définition 101', 'skin_effect')] : []
        return HttpResponse.json({ success: true, data })
      })
    )

    renderWithProviders(<IngredientForm mode="create" onSuccess={vi.fn()} />)

    expect(await screen.findByRole('option', { name: /définition 101/i })).toBeInTheDocument()
  })
})
