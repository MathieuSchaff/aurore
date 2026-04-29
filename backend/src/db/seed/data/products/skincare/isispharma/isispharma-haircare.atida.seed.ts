import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ISISPHARMA_HAIRCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'isispharma-ilcapil-kr-shampoing-anti-pelliculaire',
    name: 'Ilcapil KR Shampoing Anti-pelliculaire',
    brand: 'Isispharma',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 990,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), SODIUM LAURETH SULFATE, PROPYLENE GLYCOL, COCAMIDOPROPYL BETAINE, LAURYL GLUCOSIDE, CAPRYLYL GLYCOL, PEG-90 GLYCERYL ISOSTEARATE, PEG-35 CASTOR OIL, PIROCTONE OLAMINE, SODIUM BENZOATE, ZINC PCA, COCO-GLUCOSIDE, GLYCERYL OLEATE, XANTHAN GUM, PANTHENOL, SALICYLIC ACID, CAPRYLHYDROXAMIC ACID, GLYCERIN, LAURETH-2, CITRIC ACID, BISABOLOL, NIACINAMIDE, SODIUM SHALE OIL SULFONATE, TOCOPHEROL, HYDROGENATED PALM GLYCERIDES CITRATE',
    url: 'https://www.atida.fr/isispharma-ilcapil-kr-shampoing-anti-pelliculaire-150ml.html',
    imageUrl:
      'https://assets.atida.com/transform/5ac6f91b-9c05-4d49-8436-d750bd01e9c2/Isispharma-Ilcapil-KR-Shampoing-Anti-Pelliculaire-150ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE },
      { slug: INGREDIENT_SLUGS.ZINC_PCA },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.BISABOLOL },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE },
    ],
  },
]
