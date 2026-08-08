// Builds the algo-derm `knownConcentrations` map from product_ingredients rows. The solver
// does normalize(key) + an exact Map lookup, so each ingredient is keyed twice: name (FR->Latin)
// and slug with hyphens as spaces, binding actives whose French name misses the token (bind
// rate 64% to 73%). Only %-unit rows in (0, 100] are pinned; a 0%/negative claim breaks it.

export type ConcentrationRow = {
  name: string
  slug?: string
  concentrationValue: string | number | null
  concentrationUnit: string | null
}

export function buildKnownConcentrations(
  rows: readonly ConcentrationRow[]
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const row of rows) {
    if (row.concentrationUnit !== '%' || row.concentrationValue === null) continue
    const pct = Number(row.concentrationValue)
    if (!Number.isFinite(pct) || pct <= 0 || pct > 100) continue
    map[row.name] = pct
    if (row.slug) map[row.slug.replace(/-/g, ' ')] = pct
  }
  return map
}
