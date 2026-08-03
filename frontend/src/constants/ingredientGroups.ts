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
type IngredientCategory =
  | SkincareIngredientCategory
  | HaircareIngredientCategory
  | DentalIngredientCategory
  | SupplementCategory

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

// Reading order is intentional: actives first, base ingredients last. The Record above cannot
// prove this list is complete (a category with a phrase but no entry here still vanishes), so
// completeness is asserted in the test instead.
const INGREDIENT_GROUP_ORDER = [
  'actif',
  'acide-amine',
  'vitamine',
  'mineral',
  'acide-gras',
  'antioxydant',
  'carotenoide',
  'polyphenol',
  'peptide',
  'collagene',
  'enzyme',
  'plante',
  'adaptogene',
  'champignon',
  'probiotique',
  'prebiotique',
  'neuroactif',
  'longevite',
  'humectant',
  'emollient',
  'filtre-uv',
  'tensioactif',
  'conditionneur',
  'filmogene',
  'abrasif',
  'aromatisant',
  'autre',
  'excipient',
] as const satisfies readonly IngredientCategory[]

export function summarizeIngredientGroups(
  categories: Iterable<string | null | undefined>
): string[] {
  const present = new Set<string>()
  for (const c of categories) if (c) present.add(c)
  return INGREDIENT_GROUP_ORDER.filter((c) => present.has(c)).map((c) => INGREDIENT_GROUP_LABELS[c])
}
