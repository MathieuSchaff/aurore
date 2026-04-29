import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const KERANOVE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'keranove-blond-vacances-shampoing-eclaircissant',
    name: 'Blond Vacances Shampoing Eclaircissant',
    brand: 'Kéranove',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 454,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM LAURETH SULFATE, COCAMIDOPROPYL BETAINE, SODIUM TRIDECETH SULFATE, POLYSORBATE 80, GLYCOL DISTEARATE, PEG/PPG-120/10 TRIMETHYLOLPROPANE TRIOLEATE, SODIUM LAUROAMPHOACETATE,GLYCERIN, SODIUM CHLORIDE,PARFUM, LAURETH-2, LAURETH-4, COCAMIDE MEA,COCOS NUCIFERA OIL, CETRIMONIUM CHLORIDE, POLYACRYLATE-1 CROSSPOLYMER, HYDROXYPROPYL GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, DMDM HYDANTOIN, LACTIC ACID, CHAMOMILLA RECUTITA FLOWER EXTRACT, CROCUS SATIVUS FLOWER EXTRACT, SODIUM BENZOATE, POTASSIUM SORBATE, LINALOOL, TOCOPHEROL , GLYCINE SOJA OIL,CITRIC ACID, CURCUMA LONGA ROOT EXTRACT, FORMIC ACID,GARDENIA TAITENSIS FLOWER EXTRACT',
    url: 'https://www.atida.fr/keranove-blond-vacances-shampoing-eclaircissant-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/ff7f22ed-3f26-4196-a52c-00c8cabd6c65/Keranove-Blond-Vacances-Shampoing-Eclaircissant-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.GLYCOL_DISTEARATE },
      { slug: INGREDIENT_SLUGS.HUILE_DE_COCO },
      { slug: INGREDIENT_SLUGS.CETRIMONIUM_CHLORIDE },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT },
    ],
  },
]
