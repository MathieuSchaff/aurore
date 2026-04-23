import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const PAROGENCYL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'parogencyl-dentifrice-prevention-gencives-menthe-lot-de-2-x-75ml-248643',
    name: 'Parogencyl Dentifrice Prévention Gencives menthe Lot de 2 x 75ml',
    brand: 'Parogencyl',
    kind: 'toothpaste',
    unit: 'pack',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 812,
    description: '',
    notes: '',
    inci: 'Aqua, hydrogenated starch hydrolysate, hydrated silica, zinc citrate, sodium lauryl sulfate, aroma, cellulose gum, sodium fluoride, sodium saccharin, tocopheryl acetate, ci 77891.',
    url: 'https://www.atida.fr/parogencyl-dentifrice-prevention-gencives-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/3c5d642c-4812-43e1-ad61-53ee3c81b841/Parogencyl-Dentifrice-Prevention-Gencives-Lot-de-2-x-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'zinc-citrate' }, { slug: 'sodium-fluoride' }],
  },
]
