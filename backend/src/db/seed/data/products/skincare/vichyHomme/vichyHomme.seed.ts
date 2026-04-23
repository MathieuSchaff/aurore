import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const VICHY_HOMME_SEED: UnifiedProductSeed[] = [
  {
    slug: 'vichy-homme-gel-douche-corps-cheveux-hydra-mag-c-200ml-299448',
    name: 'Vichy Homme Gel Douche Corps & Cheveux Hydra Mag C 200ml',
    brand: 'Vichy Homme',
    kind: 'body-wash',
    unit: 'pump',
    totalAmount: 1,
    amountUnit: 'unité',
    priceCents: 846,
    description: '',
    notes: '',
    inci: 'Aqua / water, sodium laureth sulfate, glycerin, coco-betaine, laureth-11 carboxylic acid, parfum / fragrance, sodium chloride, ascorbyl glucoside, ci 14700 / red 4, ci 19140 / yellow 5, citric acid, disodium laureth sulfosuccinatemagnesium gluconate, polyquaternium-10, ppg-5-ceteth-20, salicylic acidsodium benzoate, sodium hydroxide (f.i.l. c35846/1).',
    url: 'https://www.atida.fr/vichy-homme-hydra-mag-c-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/ca1bbb20-e1b9-4b7a-a5b4-d22aa215f694/Vichy-Homme-Gel-Douche-Corps-Cheveux-Hydra-Mag-C-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.EXFOLIATION],
      secondary: [
        TAG_SLUGS.HUMECTANT,
        TAG_SLUGS.SEBO_REGULATEUR,
        TAG_SLUGS.KERATOLYTIQUE,
        TAG_SLUGS.NETTOYANT_CORPS,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
      ],
      avoid: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.PEAU_ATOPIQUE],
    },
    keyIngredients: [],
  },
]
