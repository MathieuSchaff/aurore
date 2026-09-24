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
