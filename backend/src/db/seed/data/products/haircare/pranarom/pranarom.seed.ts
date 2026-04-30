import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const PRANAROM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'pranarom-huile-vegetale-nigelle-60-capsules-299205',
    name: 'Pranarom Huile Végétale Nigelle 60 capsules',
    brand: 'Pranarom',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 1406,
    description: '',
    notes: '',
    inci: 'Pour la composition, se référer à l’image produit.',
    url: 'https://www.atida.fr/pranarom-huile-vegetale-nigelle-60-capsules.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pranarom-huile-vegetale-nigelle-60-capsules-299205.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'pranarom-huile-vegetale-bio-argan-50ml-279908',
    name: 'Pranarom Huile Végétale Bio Argan 50ml',
    brand: 'Pranarom',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 760,
    description: '',
    notes: '',
    inci: '100% pure and natural plant oil.\nHalf of the contents are unsaturated fatty acids (omega 9)\nA third are polyunsaturated fats.\nVitamin E.',
    url: 'https://www.atida.fr/pranarom-huile-vegetale-bio-argan-50ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pranarom-huile-vegetale-bio-argan-50ml-279908.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'argan-oil-hair' }],
  },
  {
    slug: 'pranarom-huile-vegetale-bio-onagre-50ml-279916',
    name: 'Pranarom Huile Végétale Bio Onagre 50ml',
    brand: 'Pranarom',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 733,
    description: '',
    notes: '',
    inci: 'Oenothera biennis, from organic farming, evening primrose seeds.',
    url: 'https://www.atida.fr/pranarom-huile-vegetale-bio-onagre-50ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pranarom-huile-vegetale-bio-onagre-50ml-279916.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
]
