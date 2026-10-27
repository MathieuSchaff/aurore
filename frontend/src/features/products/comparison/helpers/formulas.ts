import type { EnrichedComparisonProduct, InciToken } from '@aurore/shared'

export type FormulaFilter = 'all' | 'differences' | 'common'

type FormulaRow = { rank: number; cells: Array<InciToken | null> }

// Null when a list is missing: an absent INCI says nothing about what the products share
export function sharedInciKeys(products: EnrichedComparisonProduct[]): Set<string> | null {
  const lists = products.map((p) => p.inciTokens)
  if (lists.length === 0 || !lists.every((list): list is InciToken[] => list !== null)) return null
  const [first = new Set<string>(), ...rest] = lists.map((list) => new Set(list.map((t) => t.key)))
  return new Set([...first].filter((key) => rest.every((keys) => keys.has(key))))
}

function passesFilter(filter: FormulaFilter, isShared: boolean): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'common':
      return isShared
    case 'differences':
      return !isShared
  }
}

// Row N holds the N-th ingredient of each label
// A filter blanks a cell and never moves one, so the row number stays the position on the pack
export function formulaRows(
  products: EnrichedComparisonProduct[],
  sharedKeys: Set<string> | null,
  filter: FormulaFilter
): FormulaRow[] {
  const length = Math.max(0, ...products.map((p) => p.inciTokens?.length ?? 0))
  const rows: FormulaRow[] = []
  for (let index = 0; index < length; index++) {
    const cells = products.map((p) => {
      const token = p.inciTokens?.[index] ?? null
      if (!token || !sharedKeys) return token
      return passesFilter(filter, sharedKeys.has(token.key)) ? token : null
    })
    if (cells.some(Boolean)) rows.push({ rank: index + 1, cells })
  }
  return rows
}
