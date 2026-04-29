import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const STIEFEL_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'stiproxal-shampoing-antipelliculaire',
    name: 'Stiproxal Shampoing Antipelliculaire',
    brand: 'Stiefel',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1309,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM LAURETH SULFATE, COCAMIDE DEA, POLYSORBATE 80, PEG-120 METHYL GLUCOSE DIOLEATE, SALICYLIC ACID, CICLOPIROX OLAMINE, DISODIUM COCOAMPHODIACETATE, SODIUM COCOAMPHOACETATE, OLEYL ALCOHOL, PROPYLENE GLYCOL, SODIUM HYDROXIDE, GLYCERIN, SODIUM HYDROXIDE, CITRIC ACID, MENTHOL, PANTHENOL, TOCOPHEROL',
    url: 'https://www.atida.fr/stiproxal-shampooing-antipelliculaire-100ml.html',
    imageUrl:
      'https://assets.atida.com/transform/e9c54ef2-d01b-4510-8d54-2843ca3f0e77/Stiproxal-Shampoing-Antipelliculaire-100ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.PEG_120_METHYL_GLUCOSE_DIOLEATE },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
    ],
  },
  {
    slug: 'stiprox-1-5-shampoing-antipelliculaire',
    name: 'Stiprox 1.5% Shampoing Antipelliculaire',
    brand: 'Stiefel',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1212,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM LAURETH SULFATE, COCAMIDOPROPYL BETAINE, POLYSORBATE 80, COCAMIDE DEA, HEXYLENE GLYCOL, CICLOPIROXOLAMINE 1,5 %, OLEYL ALCOHOL, CITRIC ACID, DISODIUM PHOSPHATE, POLYQUATERNIUM-10, FRAGANCE, SODIUM HYDROXIDE SHAMPOOING LIQUIDE 1,5% FLACON PLASTIQUE 100ML',
    url: 'https://www.atida.fr/stiprox-1-5-shampooing-antipelliculaire-100ml.html',
    imageUrl:
      'https://assets.atida.com/transform/3d5a06a6-6b3e-46e5-8382-f0ff8c4884e6/Stiprox-1-5-Shampoing-Antipelliculaire-100ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.SLES_HAIR }],
  },
]
