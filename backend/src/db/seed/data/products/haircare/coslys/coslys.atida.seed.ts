import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const COSLYS_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'coslys-shampoing-anti-jaunissement-bio',
    name: 'Shampoing Anti-jaunissement Bio',
    brand: 'Coslys',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1260,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), SPIRAEA ULMARIA FLOWER WATER*, SODIUM COCO-SULFATE, COCAMIDOPROPYL BETAINE, DECYL GLUCOSIDE, SODIUM CHLORIDE, COCO-GLUCOSIDE, GLYCERYL OLEATE, ALOE BARBADENSIS LEAF JUICE POWDER*, CENTAUREA CYANUS FLOWER EXTRACT*, HYDROLYZED ADANSONIA DIGITATA SEED EXTRACT, PARFUM (FRAGRANCE), GLYCERIN, COCONUT ALCOHOL, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, SODIUM SULFATE, POTASSIUM HYDROXIDE, CITRIC ACID, DEHYDROACETIC ACID, BENZYL ALCOHOL, SODIUM BENZOATE, POTASSIUM SORBATE, LINALOOL, LIMONENE, CITRONELLOL',
    url: 'https://www.atida.fr/coslys-shampoing-anti-jaunissement-bio-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/14d11ff6-321f-4713-8947-c68aab3cbc5a/Coslys-Shampoing-Anti-Jaunissement-Bio-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_COCO_SULFATE },
      { slug: INGREDIENT_SLUGS.POTASSIUM_HYDROXIDE },
    ],
  },
  {
    slug: 'coslys-shampoing-ultra-doux-bio',
    name: 'Shampoing Ultra-doux Bio',
    brand: 'Coslys',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1318,
    description: '',
    notes: '',
    inci: "AQUA (WATER), SPIRAEA ULMARIA FLOWER WATER*, SODIUM COCO-SULFATE, COCAMIDOPROPYL BETAINE, DECYL GLUCOSIDE, SODIUM CHLORIDE, COCO-GLUCOSIDE, GLYCERYL OLEATE, ALOE BARBADENSIS LEAF JUICE POWDER*, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL*, HYDROLYZED WHEAT PROTEIN, PARFUM (FRAGRANCE), COCONUT ALCOHOL, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, SODIUM SULFATE, DEHYDROACETIC ACID, SODIUM BENZOATE, CITRIC ACID, BENZYL ALCOHOL, POTASSIUM HYDROXIDE, LINALOOL, LIMONENE, GERANIOL *INGRÉDIENTS ISSU DE L'AGRICULTURE BIOLOGIQUE",
    url: 'https://www.atida.fr/coslys-shampoing-ultra-doux-bio-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/3541398e-7cc8-4f4a-a990-cabf14eed443/Coslys-Shampoing-Ultra-Doux-Bio-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_COCO_SULFATE },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_WHEAT_PROTEIN },
      { slug: INGREDIENT_SLUGS.POTASSIUM_HYDROXIDE },
    ],
  },
]
