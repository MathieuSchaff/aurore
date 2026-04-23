import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const CATTIER_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cattier-beurre-de-karite-100-bio-100g-278308',
    name: 'Cattier Beurre de Karité 100% Bio 100g',
    brand: 'Cattier',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'g',
    priceCents: 812,
    description: '',
    notes: '',
    inci: "Butyrospermum Parkii Butter*. *Ingrédient issu de l'agriculture biologique.100% du total des ingrédients sont issus de l'agriculture biologique.",
    url: 'https://www.atida.fr/cattier-beurre-de-karite-100-bio-100g.html',
    imageUrl:
      'https://assets.atida.com/transform/4bc1271d-b3ef-45dc-b854-2698a9ab39bc/Cattier-Beurre-de-Karite-100-Bio-100g?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'shea-butter-hair' }],
  },
  {
    slug: 'cattier-shampoing-extra-doux-lait-d-avoine-bio-1l-257467',
    name: "Cattier Shampoing Extra-Doux Lait d'Avoine Bio 1L",
    brand: 'Cattier',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1379,
    description: '',
    notes: '',
    inci: 'Ingrédients : Aqua, ammonium lauryl sulfate, erythritol, sodium cocoamphoacetate, sodium benzoate, acetum, aloe barbadensis leaf extract*, ascorbyl palmitate, avena sativa kernel extract*, benzyl alcohol, citric acid, coco-glucoside, glycerin, glyceryl oleate, hydrogenated palm glycerides citrate, lactic acid, lavandula angustifolia flower extract, lecithin, parfum, phytic acid, potassium sorbate, rosmarinus officinalis leaf extract, salvia officinalis leaf extract, sodium chloride, thymus vulgaris flower/leaf extract, tocopherol, xanthan gum, limonene.',
    url: 'https://www.atida.fr/cattier-shampooing-extra-doux-usage-quotidien-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/6dc62350-80d3-4f71-adf3-1e3d70fbdf03/Cattier-Shampoing-Extra-Doux-Lait-d-Avoine-Bio-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'ammonium-lauryl-sulfate' },
      { slug: 'sodium-cocoamphoacetate' },
      { slug: 'aloe-vera-hair' },
      { slug: 'coco-glucoside' },
      { slug: 'glycerin-hair' },
      { slug: 'phytic-acid-hair' },
      { slug: 'romarin-extract-hair' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
