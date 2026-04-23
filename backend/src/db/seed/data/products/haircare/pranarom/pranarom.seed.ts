import { TAG_SLUGS } from '../../../tags'
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
      'https://assets.atida.com/transform/1c831557-6ed5-40e0-b999-8202ee13f901/Pranarom-Huile-Vegetale-Nigelle-60-capsules?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
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
      'https://assets.atida.com/transform/e96ae433-b915-4d75-b80c-9eaa8af863ad/Pranarom-Huile-Vegetale-Bio-Argan-50ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
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
      'https://assets.atida.com/transform/67ceb197-1264-4f98-a99f-9db184e1e4ba/Pranarom-Huile-Vegetale-Bio-Onagre-50ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
]
