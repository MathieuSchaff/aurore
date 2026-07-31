// Plain-language group phrases for the product summary.
// Maps an ingredient's functional `category` to a calm noun phrase: no claim, no score.
// An ingredient of any domain can be linked to any product, and a category missing from this
// map is dropped from the summary without a trace. A few values of the category CHECK in
// backend/src/db/schema/ingredients/ingredients.ts are left unlabelled on purpose; add one
// when a product starts carrying it.

const INGREDIENT_GROUP_LABELS: Record<string, string> = {
  actif: 'actifs',
  'acide-amine': 'acides aminés',
  vitamine: 'vitamines',
  mineral: 'minéraux',
  'acide-gras': 'acides gras',
  antioxydant: 'antioxydants',
  carotenoide: 'caroténoïdes',
  plante: 'plantes',
  prebiotique: 'prébiotiques',
  neuroactif: 'composés neuroactifs',
  humectant: 'agents hydratants',
  emollient: 'agents adoucissants',
  'filtre-uv': 'filtres UV',
  tensioactif: 'agents lavants',
  conditionneur: 'agents conditionneurs',
  abrasif: 'agents abrasifs',
  autre: 'autres ingrédients',
  excipient: 'excipients de formulation',
}

// Reading order is intentional: actives first, base ingredients last.
const INGREDIENT_GROUP_ORDER = [
  'actif',
  'acide-amine',
  'vitamine',
  'mineral',
  'acide-gras',
  'antioxydant',
  'carotenoide',
  'plante',
  'prebiotique',
  'neuroactif',
  'humectant',
  'emollient',
  'filtre-uv',
  'tensioactif',
  'conditionneur',
  'abrasif',
  'autre',
  'excipient',
] as const

export function summarizeIngredientGroups(
  categories: Iterable<string | null | undefined>
): string[] {
  const present = new Set<string>()
  for (const c of categories) if (c) present.add(c)
  return INGREDIENT_GROUP_ORDER.filter((c) => present.has(c)).map((c) => INGREDIENT_GROUP_LABELS[c])
}
