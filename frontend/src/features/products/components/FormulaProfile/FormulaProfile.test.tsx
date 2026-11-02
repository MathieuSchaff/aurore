import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormulaProfile } from './FormulaProfile'

describe('FormulaProfile', () => {
  it('keeps manual sensitive skin tags without attributing a calculation', () => {
    render(
      <FormulaProfile
        tags={[
          {
            productId: 'product-1',
            productTagId: 'manual',
            tagSlug: 'peau-sensible',
            tagName: 'Peau sensible · signal calculé',
            tagCategory: 'skin_type',
            source: 'manual',
            relevance: 'primary',
          },
        ]}
      />
    )
    expect(screen.getByText('Peau sensible · ajout manuel')).toBeInTheDocument()
    expect(screen.queryByText(/Signal estimé depuis la formule/)).not.toBeInTheDocument()
    expect(screen.queryByText('Peau sensible · signal calculé')).not.toBeInTheDocument()
  })
  it('explains calculated provenance and individual tolerance while hiding pregnancy', () => {
    const tags = [
      {
        productId: 'product-1',
        productTagId: 'sensitive',
        tagSlug: 'peau-sensible',
        tagName: 'Peau sensible · signal calculé',
        tagCategory: 'skin_type',
        source: 'algo-derm' as const,
        relevance: 'primary' as const,
      },
      {
        productId: 'product-1',
        productTagId: 'pregnancy',
        tagSlug: 'grossesse-compatible',
        tagName: 'Grossesse compatible',
        tagCategory: 'skin_type',
        source: 'algo-derm' as const,
        relevance: 'primary' as const,
      },
    ]
    render(<FormulaProfile tags={tags} />)
    expect(screen.getByText('Peau sensible · signal calculé')).toBeInTheDocument()
    expect(
      screen.getByText('Signal estimé depuis la formule. La tolérance varie selon les personnes.')
    ).toBeInTheDocument()
    expect(screen.queryByText('Grossesse compatible')).not.toBeInTheDocument()
  })
})
