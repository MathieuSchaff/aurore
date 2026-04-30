import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const DR_THEISS_SEED: UnifiedProductSeed[] = [
  {
    slug: 'dr-theiss-shampoing-a-la-silice-200ml-286389',
    name: 'Dr Theiss Shampoing à La Silice 200ml',
    brand: 'Dr Theiss',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 786,
    description: '',
    notes: '',
    inci: 'Aqua, sodium laureth sulfate, disodium laureth sulfosuccinate, PEG-3, distearat, cocamidopropyl betaine, sodium chloride, equisetum arvense, alcohol denat., parfum, polyquaternium-10, benzoic acid, citric acid, sodium hydroxide, potassium sorbate, diethyl phtalate.',
    url: 'https://www.atida.fr/dr-theiss-shampooing-a-la-silice-200ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/dr-theiss-shampoing-a-la-silice-200ml-286389.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sles-hair' },
      { slug: 'disodium-laureth-sulfosuccinate' },
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'polyquaternium-10' },
    ],
  },
]
