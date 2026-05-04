import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const CUT_BY_FRED_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cut-by-fred-vegan-hydratation-mask-400ml-299588',
    name: 'Cut By Fred Vegan Hydratation mask 400ml',
    brand: 'Cut By Fred',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 3579,
    description: '',
    notes: '',
    inci: "Aqua (water), Brassica Alcohol, Simmondsia chinensis (jojoba) seed oil, Prunus amygdalus dulcis (sweet almond) oil, Cocos nucifera (coconut) oil, Glycerin, Brassicamidopropyl Dimethylamine, Ricinus communis (castor) seed oil, Benzyl alcohol, Lactic acid, Prunus Amygdalus Amara (Bitter Almond) kernel oil, Hydrogenated castor oil, Aloe Barbadensis leaf juice powder 98% d'ingrédients d'origine naturelle",
    url: 'https://www.atida.fr/cut-by-fred-vegan-hydratation-mask-400ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/cut-by-fred-vegan-hydratation-mask-400ml-299588.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.MASQUE_CAPILLAIRE],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.BOUCLES,
        HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_SECS,
        HAIRCARE_PRODUCT_TAG_SLUGS.HYDRATATION,
        HAIRCARE_PRODUCT_TAG_SLUGS.NUTRITION,
        HAIRCARE_PRODUCT_TAG_SLUGS.MASQUE_HEBDO_CHEVEUX,
        HAIRCARE_PRODUCT_TAG_SLUGS.CGM_FRIENDLY,
        HAIRCARE_PRODUCT_TAG_SLUGS.SANS_SULFATES,
        HAIRCARE_PRODUCT_TAG_SLUGS.SANS_SILICONES,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'jojoba-oil-hair' },
      { slug: 'almond-oil-hair' },
      { slug: 'coconut-oil-hair' },
      { slug: 'glycerin-hair' },
      { slug: 'castor-oil-hair' },
      { slug: 'aloe-vera-hair' },
    ],
  },
]
