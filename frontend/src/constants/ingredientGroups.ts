// Plain-language group phrases for the product summary.
// Maps an ingredient's functional `category` to a calm noun phrase — no claim, no score.
// Skincare covers the six guaranteed categories; the rest are best-effort. `abrasif`,
// `acide-amine` and `carotenoide` belong to the dental and supplement category sets, but a
// dental or supplement ingredient can be linked to a skincare product, and an unmapped
// category drops the ingredient from the summary without a trace.

const INGREDIENT_GROUP_LABELS: Record<string, string> = {
  actif: 'actifs',
  'acide-amine': 'acides aminés',
  carotenoide: 'caroténoïdes',
  humectant: 'agents hydratants',
  emollient: 'agents adoucissants',
  'filtre-uv': 'filtres UV',
  tensioactif: 'agents lavants',
  conditionneur: 'agents conditionneurs',
  abrasif: 'agents abrasifs',
  excipient: 'excipients de formulation',
}

// Reading order is intentional: actives first, base ingredients last.
const INGREDIENT_GROUP_ORDER = [
  'actif',
  'acide-amine',
  'carotenoide',
  'humectant',
  'emollient',
  'filtre-uv',
  'tensioactif',
  'conditionneur',
  'abrasif',
  'excipient',
] as const

export function summarizeIngredientGroups(
  categories: Iterable<string | null | undefined>
): string[] {
  const present = new Set<string>()
  for (const c of categories) if (c) present.add(c)
  return INGREDIENT_GROUP_ORDER.filter((c) => present.has(c)).map((c) => INGREDIENT_GROUP_LABELS[c])
}
