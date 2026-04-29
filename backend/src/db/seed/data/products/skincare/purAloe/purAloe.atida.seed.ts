import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const PUR_ALOE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'pur-aloe-gel-douche-aloe-vera-20-bio',
    name: 'Gel Douche Aloé Vera 20% Bio',
    brand: 'Pur Aloé',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1773,
    description: '',
    notes: '',
    inci: 'AQUA, *ALOE BARBADENSIS LEAF JUICE, GLYCERIN, COCO BETAINE, COCO-GLUCOSIDE, XANTHAN GUM, BENZYL ALCOHOL, CITRIC ACID, DEHYDROACETIC ACID, PROPANEDIOL, *LITSEA CUBEBA FRUIT OIL, *CITRUS LIMON PEEL OIL, ASCORBIC ACID, CITRAL, LIMONENE',
    url: 'https://www.atida.fr/pur-aloe-gel-douche-aloe-vera-80-bio-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/39c3c955-a176-47e7-a708-0f697da5e6ea/Pur-Aloe-Gel-Douche-Aloe-Vera-20-Bio-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['anti-age', 'apaisant', 'hydratation'],
      secondary: ['nettoyant-corps', 'zone-corps'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.PROPANEDIOL }],
  },
]
