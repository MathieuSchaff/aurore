import { describe, expect, it } from 'vitest'

import { formatIngredientSignals } from '../components/FormulaReading/ingredientSignals'

describe('formatIngredientSignals', () => {
  it('groups ingredients by family and confidence with Aurore wording', () => {
    const lines = formatIngredientSignals([
      { ingredient: 'PTFE', kind: 'pfas', confidence: 'high' },
      { ingredient: 'Perfluorononyl Dimethicone', kind: 'pfas', confidence: 'high' },
      { ingredient: 'Trifluoroacetyl Tripeptide-2', kind: 'pfas', confidence: 'low' },
      { ingredient: 'Cyclopentasiloxane', kind: 'cyclic_siloxane', confidence: 'high' },
      { ingredient: 'Polyethylene', kind: 'synthetic_polymer', confidence: 'low' },
    ])

    expect(lines).toHaveLength(4)
    expect(lines[0]).toMatchObject({
      label: 'PTFE et Perfluorononyl Dimethicone',
      text: expect.stringMatching(/famille des PFAS/i),
    })
    expect(lines[1].text).toMatch(/fragment fluoré/i)
    expect(lines[2].text).toMatch(/silicone cyclique/i)
    expect(lines[3].text).toMatch(/particule solide/i)
  })

  it('keeps unknown upstream signals silent', () => {
    expect(
      formatIngredientSignals([
        { ingredient: 'Future ingredient', kind: 'future_kind', confidence: 'high' },
      ])
    ).toEqual([])
  })
})
