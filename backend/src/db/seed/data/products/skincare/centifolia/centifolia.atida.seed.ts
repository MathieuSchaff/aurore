import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const CENTIFOLIA_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'centifolia-neutre-gel-moussant-3-en-1-bio',
    name: 'Neutre Gel Moussant 3 En 1 Bio',
    brand: 'Centifolia',
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 5,
    amountUnit: 'l',
    priceCents: 5699,
    description: '',
    notes: '',
    inci: 'AQUA, LAURYL GLUCOSIDE, COCO-BETAINE, SODIUM CHLORIDE, COCO-GLUCOSIDE, ALOE BARBADENSIS LEAF JUICE POWDER*, ALPHA-GLUCAN OLIGOSACCHARIDE, DISODIUM COCOYL GLUTAMATE, SODIUM COCOYL GLUTAMATE, PROPANEDIOL, RHAMNOSE, GLUCOSE, GLUCURONIC ACID, CITRIC ACID, SODIUM BENZOATE',
    url: 'https://www.atida.fr/centifolia-gel-lavant-neutre-3en1-5l.html',
    imageUrl:
      'https://assets.atida.com/transform/30b128a0-b89a-428f-b70c-bc625c7c6817/Centifolia-Neutre-Gel-Moussant-3-en-1-Bio-5L?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'hydratation'],
      secondary: ['nettoyant', 'double-nettoyage-2', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE },
      { slug: INGREDIENT_SLUGS.PROPANEDIOL },
      { slug: INGREDIENT_SLUGS.RHAMNOSE },
    ],
  },
]
