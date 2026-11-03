import type { MutationFunctionContext } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { type ProductFormulaPreview, usePreviewProductFormula } from '@/lib/queries/products'
import { makeIdleMutationResult } from '@/test/mutation'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { FormulaPreview } from '../FormulaPreview'

vi.mock('@/lib/queries/products', () => ({ usePreviewProductFormula: vi.fn() }))

const RESULT = {
  tokens: [],
  suggestedTags: [],
  autoTagEligible: true,
} satisfies ProductFormulaPreview

const MUTATION_CONTEXT = {
  client: createTestQueryClient(),
  meta: undefined,
} satisfies MutationFunctionContext

const PROPS = {
  canManageLinks: true,
  inci: 'Aqua, Glycerin',
  category: 'skincare',
  kind: 'serum',
  name: 'Calm serum',
  brand: 'Lab',
  texture: 'creme',
  description: 'Light serum',
  allTags: [],
  selectedTagIds: [],
  linkedIngredientIds: [],
  onApplyTag: vi.fn(),
  onAddIngredient: vi.fn(),
} satisfies ComponentProps<typeof FormulaPreview>

const CHANGES = [
  { inci: 'Aqua' },
  { category: 'bodycare' },
  { kind: 'moisturizer' },
  { name: 'Rich cream' },
  { brand: 'Another lab' },
  { texture: 'gel' },
  { description: 'Rich cream for dry skin' },
] satisfies Array<Partial<ComponentProps<typeof FormulaPreview>>>

describe('FormulaPreview input drift', () => {
  beforeEach(() => {
    const mutate = vi.fn<ReturnType<typeof usePreviewProductFormula>['mutate']>(
      (variables, options) => {
        options?.onSuccess?.(RESULT, variables, undefined, MUTATION_CONTEXT)
      }
    )
    vi.mocked(usePreviewProductFormula).mockReturnValue(makeIdleMutationResult(mutate))
  })

  it.each([false, true])(
    'shows formula results with mutation controls=%s',
    async (canManageLinks) => {
      const result = {
        tokens: ['Glycerin', 'Niacinamide'].map((name) => ({
          raw: name,
          normalized: name.toLowerCase(),
          canonicalKey: name.toLowerCase(),
          ingredient: { id: name, name, slug: name.toLowerCase() },
        })),
        suggestedTags: [{ tagSlug: 'hydrating', relevance: 'primary', source: 'auto' }],
        autoTagEligible: true,
      } satisfies ProductFormulaPreview
      vi.mocked(usePreviewProductFormula).mockReturnValue(
        makeIdleMutationResult(
          vi.fn((variables, options) => {
            options?.onSuccess?.(result, variables, undefined, MUTATION_CONTEXT)
          })
        )
      )
      renderWithProviders(
        <FormulaPreview
          {...PROPS}
          canManageLinks={canManageLinks}
          allTags={[{ id: 'tag', slug: 'hydrating', label: 'Hydratant' }]}
        />
      )

      await userEvent.click(screen.getByRole('button', { name: /Analyser la formule/ }))

      expect(screen.getByText('Glycerin', { exact: true })).toBeInTheDocument()
      expect(screen.getByText('Hydratant', { exact: true })).toBeInTheDocument()
      // Reading the preview must not grant ingredient or tag editing
      expect(screen.queryAllByRole('button', { name: /Ajouter|Tout ajouter/ })).toHaveLength(
        canManageLinks ? 4 : 0
      )
    }
  )

  it('adds each linked pigment once from a closed declaration', async () => {
    const raw = 'Iron Oxides (CI 77491, CI 77492, CI 77499)'
    const result = {
      ...RESULT,
      tokens: ['CI 77491', 'CI 77492', 'CI 77499'].map((canonicalKey) => ({
        raw,
        normalized: canonicalKey.toLowerCase(),
        canonicalKey,
        ingredient: { id: canonicalKey, name: canonicalKey, slug: canonicalKey.replace(' ', '-') },
      })),
    } satisfies ProductFormulaPreview
    vi.mocked(usePreviewProductFormula).mockReturnValue(
      makeIdleMutationResult(
        vi.fn((variables, options) => {
          options?.onSuccess?.(result, variables, undefined, MUTATION_CONTEXT)
        })
      )
    )
    const onAddIngredient = vi.fn()
    renderWithProviders(
      <FormulaPreview
        {...PROPS}
        onAddIngredient={onAddIngredient}
        linkedIngredientIds={['CI 77491']}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /Analyser la formule/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Tout ajouter' }))

    expect(onAddIngredient.mock.calls).toEqual([
      ['CI 77492', 'CI 77492'],
      ['CI 77499', 'CI 77499'],
    ])
  })

  it('shows each known pigment without a catalogue record and leaves an open group unresolved', async () => {
    const raw = 'Iron Oxides (CI 77491, CI 77492)'
    const open = 'Iron Oxides (CI 77491, CI 77499'
    const result = {
      ...RESULT,
      tokens: [
        ...['CI 77491', 'CI 77492'].map((canonicalKey) => ({
          raw,
          normalized: canonicalKey.toLowerCase(),
          canonicalKey,
          ingredient: null,
        })),
        { raw: open, normalized: open.toLowerCase(), canonicalKey: null, ingredient: null },
      ],
    } satisfies ProductFormulaPreview
    vi.mocked(usePreviewProductFormula).mockReturnValue(
      makeIdleMutationResult(
        vi.fn((variables, options) => {
          options?.onSuccess?.(result, variables, undefined, MUTATION_CONTEXT)
        })
      )
    )
    renderWithProviders(<FormulaPreview {...PROPS} />)

    await userEvent.click(screen.getByRole('button', { name: /Analyser la formule/ }))

    const known = screen.getByRole('list', { name: 'Ingrédients reconnus sans fiche' })
    expect(known).toHaveTextContent('CI 77491')
    expect(known).toHaveTextContent('CI 77492')
    expect(known).not.toHaveTextContent('Iron Oxides')
    expect(screen.getByRole('list', { name: 'Ingrédients non reconnus' })).toHaveTextContent(open)
    expect(screen.queryAllByRole('button', { name: /Ajouter|Tout ajouter/ })).toHaveLength(0)
  })

  it.each(CHANGES)('marks results stale after input changes: %j', async (changes) => {
    const { rerender } = renderWithProviders(<FormulaPreview {...PROPS} />)
    await userEvent.click(screen.getByRole('button', { name: /Analyser la formule/ }))
    expect(screen.queryByText(/Les champs ont changé/)).not.toBeInTheDocument()

    rerender(<FormulaPreview {...PROPS} {...changes} />)

    // Every field sent to analysis can change its suggested tags
    expect(screen.getByText(/Les champs ont changé/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Analyser la formule/ }))
    expect(screen.queryByText(/Les champs ont changé/)).not.toBeInTheDocument()
  })

  it('keeps results current when only trimmed whitespace changes', async () => {
    const { rerender } = renderWithProviders(<FormulaPreview {...PROPS} />)
    await userEvent.click(screen.getByRole('button', { name: /Analyser la formule/ }))

    rerender(
      <FormulaPreview
        {...PROPS}
        name={` ${PROPS.name} `}
        brand={` ${PROPS.brand} `}
        description={` ${PROPS.description} `}
      />
    )

    expect(screen.queryByText(/Les champs ont changé/)).not.toBeInTheDocument()
  })

  it('ignores texture changes when the category excludes texture from analysis', async () => {
    const props = { ...PROPS, category: 'haircare', kind: 'shampoo' } as const
    const { rerender } = renderWithProviders(<FormulaPreview {...props} />)
    await userEvent.click(screen.getByRole('button', { name: /Analyser la formule/ }))

    rerender(<FormulaPreview {...props} texture="gel" />)

    expect(screen.queryByText(/Les champs ont changé/)).not.toBeInTheDocument()
  })
})
