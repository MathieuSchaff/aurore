import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LUXEOL_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'luxeol-shampooing-croissance',
    name: 'Shampooing Croissance',
    brand: 'Luxéol',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 1458,
    description: '',
    notes: '',
    inci: 'AQUA, PROPANEDIOL, COCAMIDOPROPYL BETAINE, SODIUM LAUROYL METHYL ISETHIONATE, SODIUM CHLORIDE, BETAINE, SODIUM METHYL COCOYL TAURATE, COCO-GLUCOSIDE, RICINUS COMMUNIS SEED OIL, PHYLLANTHUS EMBLICA FRUIT EXTRACT, PANAX GINSENG ROOT EXTRACT, BIOTIN, ARGININE, PANTHENOL, GLYCERIN, PARFUM, XANTHAN GUM, LAUROYL LYSINE, CITRIC ACID, LEVULINIC ACID, MALTODEXTRIN, LIMONENE, LINALOOL, SODIUM BENZOATE, SODIUM LEVULINATE',
    url: 'https://www.atida.fr/luxeol-shampooing-croissance-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/f4269e71-677f-442b-b019-d4950109763a/Generated-image?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PROPANEDIOL },
      { slug: INGREDIENT_SLUGS.SODIUM_LAUROYL_METHYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.BETAINE },
      { slug: INGREDIENT_SLUGS.HUILE_DE_RICIN },
      { slug: INGREDIENT_SLUGS.PANAX_GINSENG },
      { slug: INGREDIENT_SLUGS.BIOTIN },
      { slug: INGREDIENT_SLUGS.ARGININE },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
    ],
  },
]
