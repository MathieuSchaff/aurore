import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ITEM_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'item-alphacade-pso-shampoing',
    name: 'Alphacade PSO Shampoing',
    brand: 'Item',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 812,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), SODIUM LAURETH SULFATE, LAURYL GLUCOSIDE, CAPRYLYL/CAPRYL GLUCOSIDE, COCAMIDOPROPYL BETAINE, SALICYLIC ACID, PROPYLENE GLYCOL, CITRIC ACID, CITRUS GRANDIS (GRAPEFRUIT) FRUIT EXTRACT, PEG-150 PENTAERYTHRITYL TETRASTEARATE, SODIUM HYDROXIDE, JUNIPERUS MEXICANA WOOD OIL, PEG-15 COCOPOLYAMINE, PPG-2 HYDROXYETHYL COCAMIDE, JUNIPERUS OXYCEDRUS WOOD OIL, SODIUM CITRATE',
    url: 'https://www.atida.fr/item-alphacade-pso-shampooing-200ml-2254763.html',
    imageUrl:
      'https://assets.atida.com/transform/c87a0584-d88a-4785-a44f-b9c87de07499/Item-Alphacade-PSO-Shampoing-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.SODIUM_CITRATE },
    ],
  },
]
