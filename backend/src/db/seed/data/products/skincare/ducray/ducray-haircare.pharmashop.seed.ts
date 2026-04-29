import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const DUCRAY_HAIRCARE_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'ducray-shampooing-extra-doux',
    name: 'Shampooing Extra DOUX',
    brand: 'Ducray',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 692,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM LAURETH SULFATE, SODIUM CHLORIDE, COCAMIDOPROPYL BETAINE, COCO-GLUCOSIDE, CITRIC ACID, FRAGRANCE (PARFUM), GLYCERYL OLEATE, HYDROGENATED VEGETABLE GLYCERIDES CITRATE, SODIUM BENZOATE, TOCOPHEROL',
    url: 'https://www.pharmashopdiscount.com/fr/visage-et-corps/cheveux/ducray-shampooing-extra-doux-400ml.html',
    imageUrl: '',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.SLES_HAIR }],
  },
]
