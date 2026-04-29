import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const BOTOT_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'botot-eau-de-bouche-concentree',
    name: 'Eau De Bouche Concentrée',
    brand: 'Botot',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 1161,
    description: '',
    notes: '',
    inci: 'ALCOHOL, AQUA, AROME, SODIUM SACCHARIN, CL 42051, CL 16255, CL 19140, BENZYL BENZOATE, BENZYL CINNAMATE, CINNAMAL, EUGENOL, LIMONENE',
    url: 'https://www.atida.fr/eau-de-botot-bain-de-bouche-flacon-150ml.html',
    imageUrl:
      'https://assets.atida.com/transform/13cdb608-c540-4b51-b5eb-17ee22c8ffb0/Botot-Eau-de-Bouche-Concentree-150ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.CLOVE_OIL_EUGENOL }],
  },
]
