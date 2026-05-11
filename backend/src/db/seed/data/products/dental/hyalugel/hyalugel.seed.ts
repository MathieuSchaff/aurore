import { DENTAL_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const HYALUGEL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'hyalugel-bain-de-bouche-aphtes-petites-plaies-offert',
    name: 'Bain de Bouche Aphtes Petites Plaies',
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
      'https://aurore-cdn.b-cdn.net/products/hyalugel-bain-de-bouche-aphtes-petites-plaies-offert.webp',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.XYLITOL }],
  },
  {
    slug: 'hyalugel-gel-buccal-aphtes-petites-plaies-20ml-258888',
    name: 'Hyalugel Gel Buccal Aphtes Petites Plaies 20ml',
    brand: 'Hyalugel',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 969,
    description: '',
    notes: '',
    inci: "Composant principal : hyaluronate de sodium. Autres composants : eau, xylitol, carboxyméthylcellulose sodique, alcool, huile de ricin hydrogénée PEG40, alcool polyvinylique, carbomère (polycarbophile), alcool dichlorobenzylique, arôme, hydroxyde de sodium, acid blue 9 (CI 42090). Peut contenir de l'acide citrique.",
    url: 'https://www.atida.fr/hyalugel-gel-buccal-20ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/hyalugel-gel-buccal-aphtes-petites-plaies-20ml-258888.webp',
    tags: {
      primary: [DENTAL_PRODUCT_TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'xylitol-dental' }],
  },
]
