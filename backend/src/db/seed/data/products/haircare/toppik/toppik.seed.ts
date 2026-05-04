import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const TOPPIK_SEED: UnifiedProductSeed[] = [
  {
    slug: 'toppik-fibre-chatain-fonce-12g-231947',
    name: 'Toppik Fibre Chatain Foncé 12g',
    brand: 'Toppik',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 12,
    amountUnit: 'g',
    priceCents: 3186,
    description: '',
    notes: '',
    inci: '',
    url: 'https://www.atida.fr/toppik-fibre-chatain-fonce-12g.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/toppik-fibre-chatain-fonce-12g-231947.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.ALOPECIE,
        HAIRCARE_PRODUCT_TAG_SLUGS.CHUTE,
        HAIRCARE_PRODUCT_TAG_SLUGS.COIFFAGE,
        HAIRCARE_PRODUCT_TAG_SLUGS.FINITION,
      ],
      avoid: [],
    },
    keyIngredients: [],
  },
]
