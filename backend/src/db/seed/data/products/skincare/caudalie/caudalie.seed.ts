import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const CAUDALIE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'caudalie-the-des-vignes-gel-douche-lot-de-3-x-200ml-301110',
    name: 'Caudalie Thé des Vignes Gel Douche Lot de 3 x 200ml',
    brand: 'Caudalie',
    kind: 'body-wash',
    unit: 'pack',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 1593,
    description: '',
    notes: '',
    inci: '',
    url: 'https://www.atida.fr/caudalie-the-des-vignes-gel-douche-lot-de-3-x-200ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/caudalie-the-des-vignes-gel-douche-lot-de-3-x-200ml-301110.webp',
    tags: {
      primary: [],
      secondary: [TAG_SLUGS.TYPE_NETTOYANT, TAG_SLUGS.ZONE_CORPS, TAG_SLUGS.ZONE_CORPS],
      avoid: [],
    },
    keyIngredients: [],
  },
]
