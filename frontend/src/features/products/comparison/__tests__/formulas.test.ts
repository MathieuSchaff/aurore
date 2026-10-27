import type { EnrichedComparisonProduct } from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import { formulaRows, sharedInciKeys } from '../helpers/formulas'

const withInci = (id: string, keys: string[] | null) =>
  ({
    id,
    inciTokens: keys?.map((key) => ({ label: key, key })) ?? null,
  }) as EnrichedComparisonProduct

describe('sharedInciKeys', () => {
  it('keeps only what every product declares', () => {
    const shared = sharedInciKeys([
      withInci('a', ['aqua', 'glycerin', 'squalane']),
      withInci('b', ['aqua', 'glycerin']),
      withInci('c', ['aqua', 'niacinamide']),
    ])
    expect(shared).toEqual(new Set(['aqua']))
  })

  it('is null as soon as one list is missing', () => {
    expect(sharedInciKeys([withInci('a', ['aqua']), withInci('b', null)])).toBeNull()
  })
})

describe('formulaRows', () => {
  it('pads the shorter list instead of shifting it', () => {
    const products = [withInci('a', ['aqua', 'glycerin']), withInci('b', ['aqua'])]
    const rows = formulaRows(products, sharedInciKeys(products), 'all')
    expect(rows.map((row) => row.cells.map((cell) => cell?.key ?? null))).toEqual([
      ['aqua', 'aqua'],
      ['glycerin', null],
    ])
  })

  it('ignores the filter when nothing can be called shared', () => {
    const products = [withInci('a', ['aqua']), withInci('b', null)]
    expect(formulaRows(products, null, 'common')).toHaveLength(1)
  })
})
