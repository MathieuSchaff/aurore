import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const HYALUGEL_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'hyalugel-bain-de-bouche-aphtes-petites-plaies-offert',
    name: 'Bain De Bouche Aphtes Petites Plaies',
    brand: 'Hyalugel',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1021,
    description: '',
    notes: '',
    inci: 'COMPOSANT PRINCIPAL : HYALURONATE DE SODIUM, AUTRES COMPOSANTS : EAU, XYLITOL, ALCOOL, POLYSORBATE-20, HUILE DE RICIN HYDROGÉNÉE PEG40, CARBOMÈRE (POLYCARBOPHILE), ALCOOL DICHLOROBENZYLIQUE, ARÔME, ACIDE CITRIQUE, HYDROXYDE DE SODIUM, ACID BLUE 9 (CI 42090)',
    url: 'https://www.atida.fr/hyalugel-bain-de-bouche-150ml-1000405.html',
    imageUrl:
      'https://assets.atida.com/transform/ba26066c-30ce-4d51-b9a2-65ac193d609b/Hyalugel-Bain-de-Bouche-Aphtes-Petites-Plaies-100ml-50ml-Offert?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.XYLITOL }],
  },
]
