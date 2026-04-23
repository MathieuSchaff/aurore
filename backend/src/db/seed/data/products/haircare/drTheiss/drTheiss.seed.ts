import { TAG_SLUGS } from '../../../tags'
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
    imageUrl:
      'https://assets.atida.com/transform/36973dfe-c37e-4421-98a4-4edb909380eb/Dr-Theiss-Shampoing-a-La-Silice-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
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
