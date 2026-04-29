import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const PAROGENCYL_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'parogencyl-dentifrice-prevention-gencives-menthe',
    name: 'Dentifrice Prévention Gencives Menthe',
    brand: 'Parogencyl',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 812,
    description: '',
    notes: '',
    inci: 'AQUA, HYDROGENATED STARCH HYDROLYSATE, HYDRATED SILICA, ZINC CITRATE, SODIUM LAURYL SULFATE, AROMA, CELLULOSE GUM, SODIUM FLUORIDE, SODIUM SACCHARIN, TOCOPHERYL ACETATE, CI 77891',
    url: 'https://www.atida.fr/parogencyl-dentifrice-prevention-gencives-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/3c5d642c-4812-43e1-ad61-53ee3c81b841/Parogencyl-Dentifrice-Prevention-Gencives-Lot-de-2-x-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.ZINC_CITRATE },
      { slug: INGREDIENT_SLUGS.CELLULOSE_GUM_DENTAL },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
    ],
  },
]
