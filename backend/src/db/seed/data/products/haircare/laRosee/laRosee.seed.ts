import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const LA_ROS_E_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-rosee-huile-de-soin-nourrissante-aux-huiles-vegetales-bio-100ml-235183',
    name: 'La Rosée Huile de Soin Nourrissante aux Huiles Végétales Bio 100ml',
    brand: 'La Rosée',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 2034,
    description: '',
    notes: '',
    inci: 'Helianthus annus seed oil, ethylexyl stearate, squalane, borago officinalis seed oil, parfum, calendula officinalis flower extract, tocopherol, hippophae rhamnoides fruit oil.',
    url: 'https://www.atida.fr/la-rosee-huile-de-soin-nourrissante-aux-huiles-vegetales-bio-100ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/la-rosee-huile-de-soin-nourrissante-aux-huiles-vegetales-bio-100ml-235183.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.HUILE_CAPILLAIRE],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_SECS,
        HAIRCARE_PRODUCT_TAG_SLUGS.POINTES_SECHES,
        HAIRCARE_PRODUCT_TAG_SLUGS.NUTRITION,
        HAIRCARE_PRODUCT_TAG_SLUGS.HYDRATATION,
        HAIRCARE_PRODUCT_TAG_SLUGS.SOIN_SANS_RINCAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sunflower-oil-hair' },
      { slug: 'squalane-hair' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
