import type { MutationFunctionContext } from '@tanstack/react-query'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ArticleData } from '@/features/blog/hooks/useArticleFormSubmit'
import { ApiError } from '@/lib/helpers/apiError'
import { useCreateArticle, useUpdateArticle } from '@/lib/queries/articles'
import { makeIdleMutationResult } from '@/test/mutation'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ArticleEditorForm } from '../ArticleEditorForm'
import { ARTICLE_FORM_ERRORS } from '../ArticleEditorForm.constants'

vi.mock('@/lib/queries/articles', () => ({
  useCreateArticle: vi.fn(),
  useUpdateArticle: vi.fn(),
}))

// Preview is outside this suite, so markdown dependencies can stay unloaded
vi.mock('react-markdown', () => ({ default: () => null }))
vi.mock('remark-gfm', () => ({ default: () => null }))

const mockArticle = {
  title: 'Existing Title',
  slug: 'existing-title',
  excerpt: 'Hook line.',
  content: 'Original content.',
  category: 'science',
  coverImageUrl: 'https://example.com/cover.png',
  publishedAt: null,
} satisfies ArticleData

const MUTATION_CONTEXT = {
  client: createTestQueryClient(),
  meta: undefined,
} satisfies MutationFunctionContext

function renderForm(mode: 'create' | 'edit') {
  const onSuccess = vi.fn()
  const onCancel = vi.fn()
  const ui =
    mode === 'create' ? (
      <ArticleEditorForm mode="create" onSuccess={onSuccess} onCancel={onCancel} />
    ) : (
      <ArticleEditorForm
        mode="edit"
        article={mockArticle}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    )
  return {
    onSuccess,
    onCancel,
    ...renderWithProviders(ui),
  }
}

describe('ArticleEditorForm', () => {
  const mockCreateMutate = vi.fn<ReturnType<typeof useCreateArticle>['mutate']>()
  const mockUpdateMutate = vi.fn<ReturnType<typeof useUpdateArticle>['mutate']>()

  beforeEach(() => {
    mockCreateMutate.mockReset()
    mockUpdateMutate.mockReset()
    vi.mocked(useCreateArticle).mockReturnValue(makeIdleMutationResult(mockCreateMutate))
    vi.mocked(useUpdateArticle).mockReturnValue(makeIdleMutationResult(mockUpdateMutate))
  })

  it('submits the create form and omits empty optional fields', async () => {
    renderForm('create')

    await userEvent.type(screen.getByRole('textbox', { name: /^Titre/ }), 'Nouveau Guide')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /^Catégorie/ }), 'science')
    await userEvent.type(screen.getByRole('textbox', { name: /Contenu/ }), '# Body')

    await userEvent.click(screen.getByRole('button', { name: /Créer l'article/ }))

    expect(mockCreateMutate).toHaveBeenCalledTimes(1)
    expect(mockCreateMutate.mock.calls[0][0]).toMatchObject({
      title: 'Nouveau Guide',
      category: 'science',
      content: '# Body',
    })
    expect(mockCreateMutate.mock.calls[0][0].excerpt).toBeUndefined()
    expect(mockCreateMutate.mock.calls[0][0].coverImageUrl).toBeUndefined()
  })

  it('blocks submit and surfaces field errors when required fields are empty', async () => {
    renderForm('create')

    await userEvent.click(screen.getByRole('button', { name: /Créer l'article/ }))

    expect(mockCreateMutate).not.toHaveBeenCalled()
    expect(screen.getByText(ARTICLE_FORM_ERRORS.title)).toBeInTheDocument()
    expect(screen.getByText(ARTICLE_FORM_ERRORS.category)).toBeInTheDocument()
    expect(screen.getByText(ARTICLE_FORM_ERRORS.content)).toBeInTheDocument()
  })

  it('maps a slug conflict to the slug field', async () => {
    renderForm('create')

    await userEvent.type(screen.getByRole('textbox', { name: /^Titre/ }), 'Nouveau Guide')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /^Catégorie/ }), 'science')
    await userEvent.type(screen.getByRole('textbox', { name: /Contenu/ }), '# Body')
    await userEvent.click(screen.getByRole('button', { name: /Créer l'article/ }))

    const [variables, options] = mockCreateMutate.mock.calls[0]
    act(() => {
      options?.onError?.(
        new ApiError('slug_already_exists', 409),
        variables,
        undefined,
        MUTATION_CONTEXT
      )
    })

    expect(screen.getByText('Ce slug est déjà utilisé')).toBeInTheDocument()
  })

  it('submits the edit form with the article slug after a field is modified', async () => {
    renderForm('edit')

    await userEvent.clear(screen.getByRole('textbox', { name: /^Titre/ }))
    await userEvent.type(screen.getByRole('textbox', { name: /^Titre/ }), 'Revised Title')

    await userEvent.click(screen.getByRole('button', { name: /Enregistrer/ }))

    expect(mockUpdateMutate).toHaveBeenCalledTimes(1)
    expect(mockUpdateMutate.mock.calls[0][0]).toMatchObject({
      slug: mockArticle.slug,
      data: expect.objectContaining({
        title: 'Revised Title',
        excerpt: mockArticle.excerpt,
        coverImageUrl: mockArticle.coverImageUrl,
      }),
    })
  })

  it('clears the existing excerpt and cover when their fields are emptied', async () => {
    renderForm('edit')

    await userEvent.clear(screen.getByRole('textbox', { name: /^Extrait/ }))
    await userEvent.clear(screen.getByRole('textbox', { name: /Image de couverture/ }))
    await userEvent.click(screen.getByRole('button', { name: /Enregistrer/ }))

    // Undefined disappears from PATCH JSON and preserves the old values
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      {
        slug: mockArticle.slug,
        data: expect.objectContaining({ excerpt: null, coverImageUrl: null }),
      },
      expect.any(Object)
    )
  })
})
