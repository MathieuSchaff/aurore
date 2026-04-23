import { TAG_SLUGS } from '../../../tags'
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
      'https://assets.atida.com/transform/d49857b5-5956-487d-8f2f-205b4d26697b/Cystiphane-Lotion-Antichute-100ml-Resistance-et-croissance-des-cheveux?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SERUM_CHEVEUX],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'arginine-hair' },
      { slug: 'piroctone-olamine' },
      { slug: 'butylene-glycol-hair' },
    ],
  },
]
