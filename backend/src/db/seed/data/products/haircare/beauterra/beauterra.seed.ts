import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const BEAUTERRA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'beauterra-shampoing-solide-cheveux-normaux-75g-237979',
    name: 'Beauterra Shampoing Solide Cheveux Normaux 75g',
    brand: 'BeauTerra',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 75,
    amountUnit: 'g',
    priceCents: 672,
    description: '',
    notes: '',
    inci: 'SODIUM COCOYL ISETHIONATE, HYDROGENATED VEGETABLE OIL, AQUA (WATER), POLYGLYCERYL-4 LAURATE, ERYTHRITOL, GLYCERIN, PARFUM (FRAGRANCE), PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, DECYL GLUCOSIDE, TETRASODIUM GLUTAMATE DIACETATE, AMYL CINNAMAL, LIMONENE',
    url: 'https://www.atida.fr/beauterra-shampoing-solide-cheveux-normaux-75g.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/beauterra-shampoing-solide-cheveux-normaux-75g-237979.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sodium-cocoyl-isethionate' },
      { slug: 'glycerin-hair' },
      { slug: 'almond-oil-hair' },
      { slug: 'decyl-glucoside' },
    ],
  },
  {
    slug: 'beauterra-shampooing-sec-extra-doux-50g-255575',
    name: 'Beauterra Shampooing Sec Extra-Doux 50g',
    brand: 'BeauTerra',
    kind: 'shampoo',
    unit: 'aerosol',
    totalAmount: 50,
    amountUnit: 'g',
    priceCents: 503,
    description: '',
    notes: '',
    inci: 'ORYZA SATIVA (RICE) STARCH, KAOLIN, ZEA MAYS (CORN) STARCH, PARFUM (FRAGRANCE), PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) SHELL POWDER',
    url: 'https://www.atida.fr/beauterra-shampooing-sec-extra-doux-50g.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/beauterra-shampooing-sec-extra-doux-50g-255575.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'kaolin-hair' }],
  },
]
