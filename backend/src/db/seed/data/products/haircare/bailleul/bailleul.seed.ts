import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const BAILLEUL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cystiphane-lotion-antichute-100ml-resistance-et-croissance-des-cheveux-233638',
    name: 'Cystiphane + Lotion Antichute 100ml Résistance et croissance des cheveux',
    brand: 'Bailleul',
    kind: 'hair-serum',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 3069,
    description: '',
    notes: '',
    inci: 'aqua, alcohol denat., methylsilanol mannuronate, butylene glycol, methylpropane-diol, arginine, vitis vinifera vine extract, piroctone olamine, citric acid, acetyl cysteine.',
    url: 'https://www.atida.fr/cystiphane-lotion-antichute-100ml-resistance-et-croissance-des-cheveux.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/cystiphane-lotion-antichute-100ml-resistance-et-croissance-des-cheveux-233638.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SERUM_CAPILLAIRE],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CHUTE,
        HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'arginine-hair' },
      { slug: 'piroctone-olamine' },
      { slug: 'butylene-glycol-hair' },
    ],
  },
]
