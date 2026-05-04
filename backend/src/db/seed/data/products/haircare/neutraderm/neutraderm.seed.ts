import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const NEUTRADERM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'neutraderm-shampoing-extra-doux-dermo-respect-500ml-242343',
    name: 'Neutraderm Shampoing Extra-Doux Dermo-Respect 500ml',
    brand: 'Neutraderm',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 619,
    description: '',
    notes: '',
    inci: 'Aqua (water) / eau, oligoactive water(2), sodium laureth sulfate, undecylenamidopropyl betaine, decyl glucoside, olea europaea (olive) leaf extract, panthenol, prunus amygdalus dulcis (sweet almond) oil, polyquaternium- 10, coco-glucoside, glyceryl oleate, tocopherol, parfum (fragrance), hydrogenated palm glycerides citrate, laureth-2, peg-120 methyl glucose dioleate, peg-6, propylene glycol, sodium chloride, tetrasodium glutamate diacetate, sodium benzoate, undecanoic acid, citric acid, ci 15985 (yellow 6), ci 19140 (yellow 5).',
    url: 'https://www.atida.fr/neutraderm-shampooing-extra-doux-dermo-respect-500ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/neutraderm-shampoing-extra-doux-dermo-respect-500ml-242343.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_TOUS_TYPES,
        HAIRCARE_PRODUCT_TAG_SLUGS.CUIR_CHEVELU_SENSIBLE,
        HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sles-hair' },
      { slug: 'panthenol-hair' },
      { slug: 'almond-oil-hair' },
      { slug: 'polyquaternium-10' },
      { slug: 'coco-glucoside' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
