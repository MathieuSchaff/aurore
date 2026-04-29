import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LED_NOREVA_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'noreva-psoriane-shampoing-quotidien-apaisant',
    name: 'Noreva Psoriane Shampoing Quotidien Apaisant',
    brand: 'LED NOREVA',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 125,
    amountUnit: 'ml',
    priceCents: 1100,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), PROPYLENE GLYCOL, SODIUM LAURETH SULFATE, DECYL GLUCOSIDE, CETEARETH-60 MYRISTYL GLYCOL, SODIUM COCOAMPHOACETATE, GLYCOLIC ACID, SODIUM HYDROXIDE, SALICYLIC ACID, PEG/PPG-22/24 DIMETHICONE, SODIUM CHLORIDE, PIROCTONE OLAMINE, LAURETH-2, PARFUM (FRAGRANCE), OXIRANE, CITRIC ACID, DIPOTASSIUM GLYCYRRHIZATE, SODIUM SULFATE',
    url: 'https://www.atida.fr/noreva-psoriane-shampooing-apaisant-125ml.html',
    imageUrl:
      'https://assets.atida.com/transform/3c9e17ea-0e21-4846-9555-3dfbbc927ba0/Noreva-Psoriane-Shampoing-Quotidien-Apaisant-125ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.GLYCOLIC_ACID },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE },
      { slug: INGREDIENT_SLUGS.DIPOTASSIUM_GLYCYRRHIZATE },
    ],
  },
  {
    slug: 'noreva-psoriane-shampoing-intensif-apaisant',
    name: 'Noreva Psoriane Shampoing Intensif Apaisant',
    brand: 'LED NOREVA',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 125,
    amountUnit: 'ml',
    priceCents: 1454,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), SODIUM TRIDECETH SULFATE, VITIS VINIFERA (GRAPE) SEED OIL, SODIUM CHLORIDE, SODIUM LAUROAMPHOACETATE, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, MYRISTYL LACTATE, SALICYLIC ACID, COCAMIDE MEA, UNDECYLENAMIDOPROPYL BETAINE, CITRIC ACID, SODIUM HYDROXIDE, DI-PPG-2 MYRETH-10 ADIPATE, PARFUM (FRAGRANCE), HYDROXYPROPYL GUAR, DIPROPYLENE GLYCOL, OLEYL ALCOHOL, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, TETRASODIUM EDTA, ZANTHOXYLUM BUNGEANUM FRUIT EXTRACT, BOSWELLIA SERRATA GUM, TOCOPHERYL ACETATE, ALPHA-ISOMETHYL IONONE, LIMONENE, HYDROXYCITRONELLAL, SILANEDIOL SALICYLATE, LINALOOL, LIMONENE, TOCOPHEROL, METHYL EUGENOL',
    url: 'https://www.atida.fr/noreva-psoriane-shampooing-intensif-apaisant-125ml.html',
    imageUrl:
      'https://assets.atida.com/transform/fd7fbdd3-1e0a-4abd-8510-27486653b283/Noreva-Psoriane-Shampoing-Intensif-Apaisant-125ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_DE_PEPINS_DE_RAISIN },
      { slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.HYDROXYPROPYL_GUAR },
      { slug: INGREDIENT_SLUGS.ZANTHOXYLUM_BUNGEANUM },
      { slug: INGREDIENT_SLUGS.BOSWELLIA_SERRATA },
    ],
  },
]
