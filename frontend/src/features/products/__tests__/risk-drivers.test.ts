import { describe, expect, it } from 'vitest'

import { filterRiskDriversAtDose } from '../components/FormulaReading/riskDrivers'

const DRIVER = { label: 'Acide lactique', inci: 'Lactic Acid', axes: ['irritation'] }

describe('filterRiskDriversAtDose', () => {
  it('hides a driver when the dose verdict confidently places it as an excipient', () => {
    expect(
      filterRiskDriversAtDose(
        [DRIVER],
        [{ inci: 'Lactic Acid', roleAtDose: { doseFactor: 0.3, confidence: 0.6 } }]
      )
    ).toEqual([])
  })

  it.each([
    ['dose remains ambiguous', { doseFactor: 0.31, confidence: 0.9 }],
    ['confidence remains ambiguous', { doseFactor: 0.1, confidence: 0.59 }],
  ])('keeps the driver when %s', (_case, roleAtDose) => {
    expect(filterRiskDriversAtDose([DRIVER], [{ inci: 'Lactic Acid', roleAtDose }])).toEqual([
      DRIVER,
    ])
  })

  it('keeps a repeated ingredient unless every occurrence is a confident excipient', () => {
    expect(
      filterRiskDriversAtDose(
        [DRIVER],
        [
          { inci: 'Lactic Acid', roleAtDose: { doseFactor: 0.1, confidence: 0.9 } },
          { inci: 'Lactic Acid', roleAtDose: { doseFactor: 0.8, confidence: 0.9 } },
        ]
      )
    ).toEqual([DRIVER])
  })

  it('keeps drivers without a matching dose curve', () => {
    const glycerin = { label: 'Glycérine', inci: 'Glycerin', axes: ['comedogenicity'] }

    expect(filterRiskDriversAtDose([DRIVER, glycerin], [])).toEqual([DRIVER, glycerin])
  })
})
