import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const BEAUTERRA_HAIRCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'beauterra-shampoing-solide-cheveux-normaux',
    name: 'Shampoing Solide Cheveux Normaux',
    brand: 'BeauTerra',
    kind: 'shampoo',
    unit: 'bar',
    totalAmount: 75,
    amountUnit: 'g',
    priceCents: 672,
    description: '',
    notes: '',
    inci: 'SODIUM COCOYL ISETHIONATE, HYDROGENATED VEGETABLE OIL, AQUA (WATER), POLYGLYCERYL-4 LAURATE, ERYTHRITOL, GLYCERIN, PARFUM (FRAGRANCE), PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, DECYL GLUCOSIDE, TETRASODIUM GLUTAMATE DIACETATE, AMYL CINNAMAL, LIMONENE',
    url: 'https://www.atida.fr/beauterra-shampoing-solide-cheveux-normaux-75g.html',
    imageUrl:
      'https://assets.atida.com/transform/27d1db44-613e-4267-8664-d6e6fd3afd91/Beauterra-Shampoing-Solide-Cheveux-Normaux-75g?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL },
    ],
  },
  {
    slug: 'beauterra-shampooing-sec-extra-doux',
    name: 'Shampooing Sec Extra-doux',
    brand: 'BeauTerra',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 50,
    amountUnit: 'g',
    priceCents: 503,
    description: '',
    notes: '',
    inci: 'ORYZA SATIVA (RICE) STARCH, KAOLIN, ZEA MAYS (CORN) STARCH, PARFUM (FRAGRANCE), PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) SHELL POWDER',
    url: 'https://www.atida.fr/beauterra-shampooing-sec-extra-doux-50g.html',
    imageUrl:
      'https://assets.atida.com/transform/a56d3247-cf40-4941-bb48-b345697e324b/EAN_IMG_FR_3770008167865_1?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ORYZA_SATIVA },
      { slug: INGREDIENT_SLUGS.KAOLIN },
      { slug: INGREDIENT_SLUGS.ZEA_MAYS_STARCH },
    ],
  },
]
