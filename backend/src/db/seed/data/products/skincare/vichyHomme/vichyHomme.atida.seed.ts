import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const VICHY_HOMME_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'vichy-homme-gel-douche-corps-cheveux-hydra-mag-c',
    name: 'Gel Douche Corps & Cheveux Hydra Mag C',
    brand: 'Vichy Homme',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 846,
    description: '',
    notes: '',
    inci: 'AQUA / WATER, SODIUM LAURETH SULFATE, GLYCERIN, COCO-BETAINE, LAURETH-11 CARBOXYLIC ACID, PARFUM / FRAGRANCE, SODIUM CHLORIDE, ASCORBYL GLUCOSIDE, CI 14700 / RED 4, CI 19140 / YELLOW 5, CITRIC ACID, DISODIUM LAURETH SULFOSUCCINATEMAGNESIUM GLUCONATE, POLYQUATERNIUM-10, PPG-5-CETETH-20, SALICYLIC ACIDSODIUM BENZOATE, SODIUM HYDROXIDE (F.I.L, C35846/1)',
    url: 'https://www.atida.fr/vichy-homme-hydra-mag-c-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/ca1bbb20-e1b9-4b7a-a5b4-d22aa215f694/Vichy-Homme-Gel-Douche-Corps-Cheveux-Hydra-Mag-C-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['anti-acne', 'hydratation'],
      secondary: ['sebo-regulateur', 'nettoyant-corps', 'zone-corps'],
      avoid: ['peau-sensible', 'peau-reactive', 'peau-atopique'],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE }],
  },
]
