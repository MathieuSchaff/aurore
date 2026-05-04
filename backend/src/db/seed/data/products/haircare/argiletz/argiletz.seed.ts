import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const ARGILETZ_SEED: UnifiedProductSeed[] = [
  {
    slug: 'argiletz-pate-argile-ghassoul-prete-a-l-emploi-150g-253533',
    name: "Argiletz Pâte Argile Ghassoul Prête à l'Emploi 150g",
    brand: 'Argiletz',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'g',
    priceCents: 513,
    description: '',
    notes: '',
    inci: 'Arcilla de Ghassoul (Tierra marroquí) y agua.',
    url: 'https://www.atida.fr/argiletz-argile-de-couleur-tube-argile-ghassoul-prete-a-l-emploi-150-g.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/argiletz-pate-argile-ghassoul-prete-a-l-emploi-150g-253533.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING_CLARIFIANT,
        HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_TOUS_TYPES,
        HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE,
        HAIRCARE_PRODUCT_TAG_SLUGS.CUIR_CHEVELU_SENSIBLE,
        HAIRCARE_PRODUCT_TAG_SLUGS.SANS_SULFATES,
      ],
      avoid: [],
    },
    keyIngredients: [],
  },
]
