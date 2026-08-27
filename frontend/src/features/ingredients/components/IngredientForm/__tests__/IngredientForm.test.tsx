import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import { ApiError } from '@/lib/helpers/apiError'
import {
  useCreateIngredient,
  useUpdateIngredient,
  useUpdateIngredientTags,
} from '@/lib/queries/ingredients'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ingredientLabels } from '../../../constants'
import { IngredientForm } from '../IngredientForm'

function renderForm(ui: ReactElement, queryClient: ReturnType<typeof createTestQueryClient>) {
  return renderWithProviders(ui, { queryClient })
}

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

vi.mock('@/lib/queries/ingredients', () => ({
  useCreateIngredient: vi.fn(),
  useUpdateIngredient: vi.fn(),
  useUpdateIngredientTags: vi.fn(),
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

vi.mock('@/lib/queries/product-tags', () => ({
  productTagQueries: {
    list: vi.fn(() => ({
      queryKey: ['product-tags', 'list'],
      queryFn: vi.fn().mockResolvedValue([]),
      data: [],
    })),
  },
}))

// Expose ButtonLink's destination (the global setup stub renders children only); keep the real Button.
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

function setSessionRole(role: 'user' | 'admin') {
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

describe('IngredientForm - Conflict Resolution', () => {
  it('handles a 409 conflict during update and allows field restoration', async () => {
    setSessionRole('user')
    const queryClient = createTestQueryClient()
    const mockOnSuccess = vi.fn()
    const mockMutateAsync = vi.fn()

    ;(useUpdateIngredient as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
    ;(useCreateIngredient as any).mockReturnValue({ isPending: false })
    ;(useUpdateIngredientTags as any).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue([]),
      isPending: false,
    })

    const conflictError = new ApiError('ingredient_update_conflict', 409)
    mockMutateAsync.mockRejectedValueOnce(conflictError)

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
    fireEvent.change(descriptionField, { target: { value: 'My local draft' } })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(ingredientLabels.conflictDetected)).toBeInTheDocument()
    })

    expect(descriptionField).toHaveValue('Server edited description')

    // Banner description also contains "Ton brouillon". Match by count, not unique.
    const draftHints = screen.getAllByText(/Ton brouillon/i)
    expect(draftHints.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('My local draft')).toBeInTheDocument()

    const restoreButton = screen.getByRole('button', { name: /Restaurer/i })
    fireEvent.click(restoreButton)

    expect(descriptionField).toHaveValue('My local draft')

    mockMutateAsync.mockResolvedValueOnce({ ...mockIngredient, slug: 'retinol' })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: 'My local draft',
          }),
        })
      )
      const lastCall = mockMutateAsync.mock.calls[mockMutateAsync.mock.calls.length - 1][0]
      expect(new Date(lastCall.data.expectedUpdatedAt).toISOString()).toBe(
        new Date('2024-01-01T10:05:00Z').toISOString()
      )
    })

    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it('shows the slug field only to an admin', () => {
    const queryClient = createTestQueryClient()
    ;(useUpdateIngredientTags as any).mockReturnValue({ isPending: false })
    ;(useCreateIngredient as any).mockReturnValue({ isPending: false })
    ;(useUpdateIngredient as any).mockReturnValue({ isPending: false })

    setSessionRole('user')
    const { rerender } = renderForm(
      <IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={vi.fn()} />,
      queryClient
    )
    expect(screen.queryByLabelText(/Slug/)).not.toBeInTheDocument()

    setSessionRole('admin')
    rerender(<IngredientForm mode="edit" ingredient={mockIngredient} onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/Slug/)).toBeInTheDocument()
  })
})

describe('IngredientForm - cancel link', () => {
  const setupHooks = () => {
    setSessionRole('user')
    ;(useCreateIngredient as any).mockReturnValue({ isPending: false })
    ;(useUpdateIngredient as any).mockReturnValue({ isPending: false })
    ;(useUpdateIngredientTags as any).mockReturnValue({ isPending: false })
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

  // Strict ButtonLink params exposed a latent bug: edit with no slug used to build /ingredients/undefined (hidden by the old cast).
  it('falls the edit cancel link back to the list when the slug is missing', () => {
    setupHooks()
    const queryClient = createTestQueryClient()
    const noSlug = { ...mockIngredient, slug: undefined } as unknown as typeof mockIngredient

    renderForm(<IngredientForm mode="edit" ingredient={noSlug} onSuccess={vi.fn()} />, queryClient)

    expect(screen.getByRole('link', { name: /Annuler/ })).toHaveAttribute('href', '/ingredients')
  })
})
