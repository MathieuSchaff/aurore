import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { ProductFormulaSummary } from '../ProductFormulaSummary'

const base = PRODUCT_DETAILS[0]
if (!base) throw new Error('product fixture missing')
const ingredient = {
  productId: base.id,
  ingredientId: 'ingredient-1',
  ingredientSlug: 'retinal',
  ingredientName: 'Rétinal',
  ingredientCanonicalKey: 'Retinal',
  ingredientCategory: 'actif',
  ingredientDescription: '',
  concentrationValue: null,
  concentrationUnit: null,
  concentrationPer: null,
  notes: null,
}

describe('ProductFormulaSummary', () => {
  it('identifies the ingredient named by the product and states its unknown dose', () => {
    render(
      <ProductFormulaSummary
        assessment={null}
        product={{
          ...base,
          name: 'Sérum Rétinal',
          inci: 'Aqua, Retinal',
          ingredients: [ingredient],
        }}
      />
    )
    expect(screen.getByText(/La formule contient Rétinal/)).toBeInTheDocument()
    expect(screen.getByText(/concentration de Rétinal n’est pas renseignée/)).toBeInTheDocument()
  })

  it('keeps a declared concentration out of the unknown state', () => {
    render(
      <ProductFormulaSummary
        assessment={null}
        product={{
          ...base,
          name: 'Sérum Rétinal',
          inci: 'Aqua, Retinal',
          ingredients: [{ ...ingredient, concentrationValue: '0.1', concentrationUnit: '%' }],
        }}
      />
    )
    expect(screen.getByText(/La formule contient Rétinal/)).toBeInTheDocument()
    expect(screen.queryByText(/n’est pas renseignée/)).not.toBeInTheDocument()
  })

  it('does not derive a formula from linked sheets when the declared INCI is missing', () => {
    render(
      <ProductFormulaSummary
        assessment={null}
        product={{ ...base, name: 'Sérum Rétinal', inci: null, ingredients: [ingredient] }}
      />
    )
    expect(screen.getByText(/composition.*pas encore renseignée/)).toBeInTheDocument()
    expect(screen.queryByText(/La formule contient/)).not.toBeInTheDocument()
  })
})
