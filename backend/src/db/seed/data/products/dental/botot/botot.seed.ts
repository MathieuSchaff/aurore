import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const BOTOT_SEED: UnifiedProductSeed[] = [
  {
    slug: 'botot-eau-de-bouche-concentree-150ml-272268',
    name: 'Botot Eau de Bouche Concentrée 150ml',
    brand: 'Botot',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 1161,
    description: '',
    notes: '',
    inci: 'Alcohol, aqua, arome, sodium saccharin, cl 42051, cl 16255, cl 19140, benzyl benzoate, benzyl cinnamate, cinnamal, eugenol, limonene.',
    url: 'https://www.atida.fr/eau-de-botot-bain-de-bouche-flacon-150ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/botot-eau-de-bouche-concentree-150ml-272268.webp',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'clove-oil-eugenol' }],
  },
]
