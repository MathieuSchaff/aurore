import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const DR_THEISS_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'dr-theiss-shampoing-a-la-silice',
    name: 'Shampoing À La Silice',
    brand: 'Dr Theiss',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 786,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM LAURETH SULFATE, DISODIUM LAURETH SULFOSUCCINATE, PEG-3, DISTEARAT, COCAMIDOPROPYL BETAINE, SODIUM CHLORIDE, EQUISETUM ARVENSE, ALCOHOL DENAT., PARFUM, POLYQUATERNIUM-10, BENZOIC ACID, CITRIC ACID, SODIUM HYDROXIDE, POTASSIUM SORBATE, DIETHYL PHTALATE',
    url: 'https://www.atida.fr/dr-theiss-shampooing-a-la-silice-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/36973dfe-c37e-4421-98a4-4edb909380eb/Dr-Theiss-Shampoing-a-La-Silice-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.DISODIUM_LAURETH_SULFOSUCCINATE },
    ],
  },
]
