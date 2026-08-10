import { describe, expect, it } from 'bun:test'

import { analyzeINCI } from 'algo-derm'

import { benefitDriversWithHumanEvidence } from './algo-derm-benefit-evidence'

const labels = (inci: string) =>
  benefitDriversWithHumanEvidence(analyzeINCI(inci, { context: { leaveOn: true } })).map(
    (d) => d.label
  )

describe('benefitDriversWithHumanEvidence', () => {
  it('keeps drivers whose sheet rests on human data', () => {
    expect(labels('Aqua, Glycerin, Alpha-Arbutin, Niacinamide')).toContain('Glycerin')
  })

  // The mulberry sheet is graded C (in vitro) yet carries brightening 4, so it used to
  // outrank molecules measured on the human enzyme. Same shape for every C/D sheet:
  // the axis score is curation, the grade is what the evidence actually supports.
  it('drops an in vitro extract from the benefit drivers', () => {
    const inci = 'Aqua, Morus Nigra Root Extract, Glycerin'
    const assessment = analyzeINCI(inci, { context: { leaveOn: true } })

    expect(assessment.explanation.topBenefitDrivers.map((d) => d.label)).toContain(
      'Morus Nigra Root Extract'
    )
    expect(labels(inci)).not.toContain('Morus Nigra Root Extract')
  })

  // Upstream v36 stopped the fruit name inheriting the root sheet, so this one never
  // reaches the filter: it is dropped a layer earlier, as an unmatched ingredient.
  it('never sees an organ the upstream sheet does not cover', () => {
    const assessment = analyzeINCI('Aqua, Morus Nigra Fruit Extract, Glycerin', {
      context: { leaveOn: true },
    })

    expect(assessment.unmatchedIngredients).toContain('Morus Nigra Fruit Extract')
    expect(labels('Aqua, Morus Nigra Fruit Extract, Glycerin')).not.toContain(
      'Morus Nigra Fruit Extract'
    )
  })

  it('drops a driver whose INCI carries no matched evidence', () => {
    const assessment = analyzeINCI('Aqua, Glycerin', { context: { leaveOn: true } })
    const orphan = {
      ...assessment,
      explanation: {
        ...assessment.explanation,
        topBenefitDrivers: [
          {
            label: 'Unknown Actif',
            inci: 'Unknown Actif',
            axes: ['brightening' as const],
            contribution: 1,
          },
        ],
      },
    }

    expect(benefitDriversWithHumanEvidence(orphan)).toEqual([])
  })
})
