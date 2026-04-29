import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ELGYDIUM_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'elgydium-blancheur-dentifrice',
    name: 'Blancheur Dentifrice',
    brand: 'Elgydium',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 805,
    description: '',
    notes: '',
    inci: 'AQUA, GLYCERIN, SILICA, SODIUM BICARBONATE, SODIUM LAURYLSULFATE, CHONDRUS CRISPUS, AROMA, CI 77891, TRIETHANOLAMINE, CHLORHEXIDINE DIGLUCONATE, YDROXYÉTHYLCELLULOSE, MENTHA PIPERITA, SODIUM SACCHARIN',
    url: 'https://www.atida.fr/elgydium-dentifrice-blancheur-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/6f94da4b-b86d-4179-a08e-f04dff27f88c/Elgydium-Blancheur-Dentifrice-Lot-de-2-x-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SILICA },
      { slug: INGREDIENT_SLUGS.SODIUM_BICARBONATE_DENTAL },
      { slug: INGREDIENT_SLUGS.CHLORHEXIDINE },
    ],
  },
]
