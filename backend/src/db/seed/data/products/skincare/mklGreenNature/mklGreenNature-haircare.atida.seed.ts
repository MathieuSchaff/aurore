import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const MKL_GREEN_NATURE_HAIRCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'mkl-shampoing-solide-ortie-et-charbon-cheveux-gras',
    name: 'MKL Shampoing Solide Ortie Et Charbon Cheveux Gras',
    brand: 'MKL Green Nature',
    kind: 'shampoo',
    unit: 'bar',
    totalAmount: 65,
    amountUnit: 'g',
    priceCents: 405,
    description: '',
    notes: '',
    inci: 'SODIUM COCOYL ISETHIONATE, HYDROGENATED VEGETABLE OIL, AQUA, POLYGLYCERYL-4-LAURATE, GLYCERIN, PARFUM, LAMIUM ALBUM FLOWER EXTRACT, CHARCOAL POWDER, CITRIC ACID, TETRASODIUM GLUTAMATE DIACETATE, HEXYL CINNAMAL, LINALOOL, GERANIOL, BENZYL SALICYLATE',
    url: 'https://www.atida.fr/mkl-shampooing-solide-ortie-et-charbon-cheveux-gras-65g.html',
    imageUrl:
      'https://assets.atida.com/transform/f03e141f-00f9-4ac7-85be-3994852bed4a/MKL-Shampoing-Solide-Ortie-et-Charbon-Cheveux-Gras-65g?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.ACTIVATED_CHARCOAL_HAIR },
    ],
  },
]
