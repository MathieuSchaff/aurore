import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const CUT_BY_FRED_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cut-by-fred-vegan-hydratation-mask',
    name: 'Vegan Hydratation Mask',
    brand: 'Cut By Fred',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 3579,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), BRASSICA ALCOHOL, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, COCOS NUCIFERA (COCONUT) OIL, GLYCERIN, BRASSICAMIDOPROPYL DIMETHYLAMINE, RICINUS COMMUNIS (CASTOR) SEED OIL, BENZYL ALCOHOL, LACTIC ACID, PRUNUS AMYGDALUS AMARA (BITTER ALMOND) KERNEL OIL, HYDROGENATED CASTOR OIL, ALOE BARBADENSIS LEAF JUICE POWDER',
    url: 'https://www.atida.fr/cut-by-fred-vegan-hydratation-mask-400ml.html',
    imageUrl:
      'https://assets.atida.com/transform/24122404-e963-4d5f-afd7-c9803b26d5e8/Cut-By-Fred-Vegan-Hydratation-mask-400ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['hydratation', 'apaisant'],
      secondary: ['masque-hebdo', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA },
      { slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL },
      { slug: INGREDIENT_SLUGS.HUILE_DE_COCO },
      { slug: INGREDIENT_SLUGS.HUILE_DE_RICIN },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
    ],
  },
]
