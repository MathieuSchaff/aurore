import type {
  CreateIngredientInput,
  ReplaceIngredientTagsInput,
  UpdateIngredientRouteInput,
} from '@aurore/shared'
import { INGREDIENT_TYPE_LABELS, updateIngredientRouteSchema } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BaseIngredient } from '@/features/ingredients/hooks/useIngredientFormSubmit'
import type { SessionView } from '@/lib/auth/session'
import { ApiError } from '@/lib/helpers/apiError'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ingredientLabels } from '../../../constants'
import { IngredientForm } from '../IngredientForm'

function renderForm(ui: ReactElement, queryClient: ReturnType<typeof createTestQueryClient>) {
  return renderWithProviders(ui, { queryClient })
}

type CreatedIngredient = Pick<BaseIngredient, 'id' | 'slug' | 'updatedAt'>

const {
  createIngredientMutate,
  updateIngredientMutate,
  updateIngredientTagsMutate,
  useSessionMock,
} = vi.hoisted(() => ({
  createIngredientMutate: vi.fn<(input: CreateIngredientInput) => Promise<CreatedIngredient>>(),
  updateIngredientMutate:
    vi.fn<(input: { id: string; data: UpdateIngredientRouteInput }) => Promise<BaseIngredient>>(),
  updateIngredientTagsMutate:
    vi.fn<(input: { ingredientId: string } & ReplaceIngredientTagsInput) => Promise<unknown[]>>(),
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

vi.mock('@/lib/queries/ingredients', () => ({
  useCreateIngredient: () => ({ mutateAsync: createIngredientMutate, isPending: false }),
  useUpdateIngredient: () => ({ mutateAsync: updateIngredientMutate, isPending: false }),
  useUpdateIngredientTags: () => ({ mutateAsync: updateIngredientTagsMutate, isPending: false }),
  ingredientQueries: {
    bySlug: vi.fn((slug) => ({
      queryKey: ['ingredients', 'slug', slug],
      queryFn: vi.fn(),
    })),
    products: vi.fn((slug) => ({
      queryKey: ['ingredients', slug, 'products'],
      queryFn: vi.fn(),
    })),
    tags: vi.fn((id) => ({
      queryKey: ['ingredients', id, 'tags'],
      queryFn: vi.fn(),
    })),
  },
}))

vi.mock('@/lib/queries/ingredient-tags', () => ({
  ingredientTagQueries: {
    list: vi.fn(() => ({
      queryKey: ['ingredient-tags', 'list'],
      queryFn: vi.fn().mockResolvedValue([]),
    })),
  },
}))

// The global link stub hides destinations
// These tests need the href while keeping the real Button
vi.mock('@/component/Button/Button', async (importActual) => {
  const actual = await importActual<typeof import('@/component/Button/Button')>()
  return {
    ...actual,
    ButtonLink: ({ to, children }: { to: string; children: ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  }
})

const mockIngredient = {
  id: 'i1',
  slug: 'retinol',
  name: 'Retinol',
  type: 'skincare' as const,
  category: 'actif',
  description: 'Old description',
  content: 'Old content',
  updatedAt: '2024-01-01T10:00:00Z',
}

function setSessionRole(role: 'user' | 'contributor' | 'admin') {
  useSessionMock.mockReturnValue({
    status: 'authenticated',
    credential: 'present',
    user: {
      id: `${role}-id`,
      email: `${role}@example.test`,
      createdAt: '2026-01-01T00:00:00.000Z',
      role,
      emailVerified: true,
      isDemo: false,
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  createIngredientMutate.mockResolvedValue({
    id: mockIngredient.id,
    slug: mockIngredient.slug,
    updatedAt: mockIngredient.updatedAt,
  })
  updateIngredientMutate.mockResolvedValue(mockIngredient)
  updateIngredientTagsMutate.mockResolvedValue([])
})

describe('IngredientForm - submission payload', () => {
  it('keeps empty optional fields omitted when creating an ingredient', async () => {
    setSessionRole('user')
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    renderForm(<IngredientForm mode="create" onSuccess={onSuccess} />, createTestQueryClient())

    await user.type(screen.getByLabelText(/^nom/i), ' Retinol ')
    await user.click(screen.getByRole('button', { name: /créer l.ingrédient/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockIngredient.slug))
    expect(JSON.parse(JSON.stringify(createIngredientMutate.mock.calls[0]?.[0]))).toEqual({
      name: 'Retinol',
      type: 'skincare',
    })
  })

  it('submits a changed ingredient type with its compatible category', async () => {
    setSessionRole('admin')
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={onSuccess} />,
      createTestQueryClient()
    )

    await user.click(screen.getByRole('radio', { name: INGREDIENT_TYPE_LABELS.haircare }))
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockIngredient.slug))
    expect(
      updateIngredientRouteSchema.parse(updateIngredientMutate.mock.calls[0]?.[0].data)
    ).toMatchObject({
      type: 'haircare',
      category: 'actif',
    })
  })

  it('sends explicit clearing values for emptied edit fields', async () => {
    setSessionRole('admin')
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={onSuccess} />,
      createTestQueryClient()
    )

    await user.clear(screen.getByLabelText(/catégorie/i))
    await user.clear(screen.getByLabelText(/description/i))
    await user.clear(screen.getByLabelText(/^contenu$/i))
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockIngredient.slug))
    // Undefined disappears during JSON serialization and would preserve the old values
    expect(
      updateIngredientRouteSchema.parse(updateIngredientMutate.mock.calls[0]?.[0].data)
    ).toMatchObject({
      category: null,
      description: '',
      content: '',
    })
  })
})

describe('IngredientForm - Conflict Resolution', () => {
  it('handles a 409 conflict during update and allows field restoration', async () => {
    setSessionRole('user')
    const queryClient = createTestQueryClient()
    const mockOnSuccess = vi.fn()
    const user = userEvent.setup()

    const conflictError = new ApiError('ingredient_update_conflict', 409)
    updateIngredientMutate.mockRejectedValueOnce(conflictError)

    const freshIngredient = {
      ...mockIngredient,
      description: 'Server edited description',
      updatedAt: '2024-01-01T10:05:00Z',
    }

    vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(freshIngredient)

    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={mockOnSuccess} />,
      queryClient
    )

    const descriptionField = screen.getByLabelText(/Description/)
    await user.clear(descriptionField)
    await user.type(descriptionField, 'My local draft')

    const saveButton = screen.getByRole('button', { name: /Enregistrer/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(ingredientLabels.conflictDetected)).toBeInTheDocument()
    })

    expect(descriptionField).toHaveValue('Server edited description')

    // The banner repeats this hint for the saved draft
    const draftHints = screen.getAllByText(/Ton brouillon/i)
    expect(draftHints.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('My local draft')).toBeInTheDocument()

    const restoreButton = screen.getByRole('button', { name: /Restaurer/i })
    await user.click(restoreButton)

    expect(descriptionField).toHaveValue('My local draft')

    updateIngredientMutate.mockResolvedValueOnce({ ...mockIngredient, slug: 'retinol' })
    await user.click(saveButton)

    await waitFor(() => {
      expect(updateIngredientMutate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: 'My local draft',
          }),
        })
      )
      const lastCall = updateIngredientMutate.mock.calls.at(-1)?.[0]
      expect(lastCall).toBeDefined()
      expect(lastCall?.data.expectedUpdatedAt).toBe('2024-01-01T10:05:00Z')
    })

    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it('does not write the tags when the locked update is rejected', async () => {
    setSessionRole('user')
    const queryClient = createTestQueryClient()
    const user = userEvent.setup()

    updateIngredientMutate.mockRejectedValue(new ApiError('ingredient_update_conflict', 409))
    vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce({
      ...mockIngredient,
      updatedAt: '2024-01-01T10:05:00Z',
    })

    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={vi.fn()} />,
      queryClient
    )
    const descriptionField = screen.getByLabelText(/Description/)
    await user.clear(descriptionField)
    await user.type(descriptionField, 'My local draft')
    await user.click(screen.getByRole('button', { name: /Enregistrer/i }))

    await waitFor(() => {
      expect(screen.getByText(ingredientLabels.conflictDetected)).toBeInTheDocument()
    })
    expect(updateIngredientTagsMutate).not.toHaveBeenCalled()
  })

  it('shows the slug field to an admin on create only', () => {
    const queryClient = createTestQueryClient()

    setSessionRole('user')
    const { rerender } = renderForm(
      <IngredientForm mode="create" onSuccess={vi.fn()} />,
      queryClient
    )
    expect(screen.queryByLabelText(/Slug/)).not.toBeInTheDocument()

    setSessionRole('admin')
    rerender(<IngredientForm mode="create" onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/Slug/)).toBeInTheDocument()
  })

  // An edit slug only changes the form because the update contract rejects it
  it('hides the slug field on edit even for an admin', () => {
    const queryClient = createTestQueryClient()

    setSessionRole('admin')
    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={vi.fn()} />,
      queryClient
    )
    expect(screen.queryByLabelText(/Slug/)).not.toBeInTheDocument()
  })
})

describe('IngredientForm - tag writes', () => {
  it('hides tag controls from users and contributors', () => {
    const queryClient = createTestQueryClient()

    setSessionRole('user')
    const { rerender } = renderForm(
      <IngredientForm mode="create" onSuccess={vi.fn()} />,
      queryClient
    )
    expect(screen.queryByLabelText(/ajouter.*tag/i)).not.toBeInTheDocument()

    setSessionRole('contributor')
    rerender(<IngredientForm mode="create" onSuccess={vi.fn()} />)
    expect(screen.queryByLabelText(/ajouter.*tag/i)).not.toBeInTheDocument()
  })

  it('does not write tags for a non admin edit', async () => {
    setSessionRole('user')
    const user = userEvent.setup()
    const queryClient = createTestQueryClient()

    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={vi.fn()} />,
      queryClient
    )
    const descriptionField = screen.getByLabelText(/description/i)
    await user.clear(descriptionField)
    await user.type(descriptionField, 'Description utilisateur')
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => expect(updateIngredientMutate).toHaveBeenCalledTimes(1))
    expect(updateIngredientTagsMutate).not.toHaveBeenCalled()
  })

  it('does not write unchanged tags for an admin edit', async () => {
    setSessionRole('admin')
    const user = userEvent.setup()
    const queryClient = createTestQueryClient()

    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={vi.fn()} />,
      queryClient
    )
    const descriptionField = screen.getByLabelText(/description/i)
    await user.clear(descriptionField)
    await user.type(descriptionField, 'Description admin')
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => expect(updateIngredientMutate).toHaveBeenCalledTimes(1))
    expect(updateIngredientTagsMutate).not.toHaveBeenCalled()
  })

  it('uses the updated ingredient version for changed tags', async () => {
    setSessionRole('admin')
    const user = userEvent.setup()
    const queryClient = createTestQueryClient()
    const updatedAt = '2024-01-01T10:01:00Z'
    updateIngredientMutate.mockResolvedValueOnce({ ...mockIngredient, updatedAt })

    renderForm(
      <IngredientForm
        mode="edit"
        ingredient={mockIngredient}
        initialTags={[{ tagId: 'tag-1', tagName: 'Apaisant', relevance: 'secondary' }]}
        onSuccess={vi.fn()}
      />,
      queryClient
    )
    await user.click(screen.getByRole('button', { name: /retirer.*apaisant/i }))
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => {
      expect(updateIngredientTagsMutate).toHaveBeenCalledWith({
        ingredientId: mockIngredient.id,
        expectedUpdatedAt: updatedAt,
        tags: [],
      })
    })
  })
})

describe('IngredientForm - cancel link', () => {
  const setupHooks = () => {
    setSessionRole('user')
  }

  it('points the edit cancel link at the ingredient detail page', () => {
    setupHooks()
    const queryClient = createTestQueryClient()

    renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={vi.fn()} />,
      queryClient
    )

    expect(screen.getByRole('link', { name: /Annuler/ })).toHaveAttribute(
      'href',
      '/ingredients/$slug'
    )
  })

  // Strict ButtonLink params exposed the old /ingredients/undefined destination
  it('falls the edit cancel link back to the list when the slug is missing', () => {
    setupHooks()
    const queryClient = createTestQueryClient()
    const noSlug = { ...mockIngredient, slug: undefined } as unknown as typeof mockIngredient

    renderForm(<IngredientForm mode="edit" ingredient={noSlug} onSuccess={vi.fn()} />, queryClient)

    expect(screen.getByRole('link', { name: /Annuler/ })).toHaveAttribute('href', '/ingredients')
  })
})
