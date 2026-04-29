import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const CATTIER_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cattier-shampoing-extra-doux-lait-d-avoine-bio',
    name: "Shampoing Extra-doux Lait D'avoine Bio",
    brand: 'Cattier',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1379,
    description: '',
    notes: '',
    inci: 'AQUA, AMMONIUM LAURYL SULFATE, ERYTHRITOL, SODIUM COCOAMPHOACETATE, SODIUM BENZOATE, ACETUM, ALOE BARBADENSIS LEAF EXTRACT*, ASCORBYL PALMITATE, AVENA SATIVA KERNEL EXTRACT*, BENZYL ALCOHOL, CITRIC ACID, COCO-GLUCOSIDE, GLYCERIN, GLYCERYL OLEATE, HYDROGENATED PALM GLYCERIDES CITRATE, LACTIC ACID, LAVANDULA ANGUSTIFOLIA FLOWER EXTRACT, LECITHIN, PARFUM, PHYTIC ACID, POTASSIUM SORBATE, ROSMARINUS OFFICINALIS LEAF EXTRACT, SALVIA OFFICINALIS LEAF EXTRACT, SODIUM CHLORIDE, THYMUS VULGARIS FLOWER/LEAF EXTRACT, TOCOPHEROL, XANTHAN GUM, LIMONENE',
    url: 'https://www.atida.fr/cattier-shampooing-extra-doux-usage-quotidien-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/6dc62350-80d3-4f71-adf3-1e3d70fbdf03/Cattier-Shampoing-Extra-Doux-Lait-d-Avoine-Bio-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.AMMONIUM_LAURYL_SULFATE },
      { slug: INGREDIENT_SLUGS.ASCORBYL_PALMITATE },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.PHYTIC_ACID },
      { slug: INGREDIENT_SLUGS.ROMARIN },
    ],
  },
]
