import type {
  DentalIngredientCategory,
  HaircareIngredientCategory,
  SkincareIngredientCategory,
  SupplementCategory,
} from '@aurore/shared'

// Plain-language group phrases for the product summary.
// Maps an ingredient's functional `category` to a calm noun phrase: no claim, no score.
// An ingredient of any domain can be linked to any product, and a category missing from this map
// is dropped from the summary without a trace. The Record below is what makes that impossible:
// a category added to shared fails the build here until it has a phrase.
export type IngredientCategory =
  | SkincareIngredientCategory
  | HaircareIngredientCategory
  | DentalIngredientCategory
  | SupplementCategory

// Key order is the reading order: actives first, base ingredients last
const INGREDIENT_GROUP_LABELS: Record<IngredientCategory, string> = {
  actif: 'actifs',
  'acide-amine': 'acides aminés',
  vitamine: 'vitamines',
  mineral: 'minéraux',
  'acide-gras': 'acides gras',
  antioxydant: 'antioxydants',
  carotenoide: 'caroténoïdes',
  polyphenol: 'polyphénols',
  peptide: 'peptides',
  collagene: 'collagène',
  enzyme: 'enzymes',
  plante: 'plantes',
  adaptogene: 'plantes adaptogènes',
  champignon: 'champignons',
  probiotique: 'probiotiques',
  prebiotique: 'prébiotiques',
  neuroactif: 'composés neuroactifs',
  longevite: 'composés longévité',
  humectant: 'agents hydratants',
  emollient: 'agents adoucissants',
  'filtre-uv': 'filtres UV',
  tensioactif: 'agents lavants',
  conditionneur: 'agents conditionneurs',
  filmogene: 'agents filmogènes',
  abrasif: 'agents abrasifs',
  aromatisant: 'agents aromatisants',
  autre: 'autres ingrédients',
  excipient: 'excipients de formulation',
}

export function summarizeIngredientGroups(
  categories: Iterable<string | null | undefined>
): string[] {
  const present = new Set<string>()
  for (const c of categories) if (c) present.add(c)
  return Object.entries(INGREDIENT_GROUP_LABELS)
    .filter(([category]) => present.has(category))
    .map(([, label]) => label)
}
