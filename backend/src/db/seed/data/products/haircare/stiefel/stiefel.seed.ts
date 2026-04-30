import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const STIEFEL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'stiproxal-shampoing-antipelliculaire-100ml-277692',
    name: 'Stiproxal Shampoing Antipelliculaire 100ml',
    brand: 'Stiefel',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1309,
    description: '',
    notes: '',
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamide DEA, Polysorbate 80, PEG-120 Methyl Glucose Dioleate, Salicylic Acid, Ciclopirox olamine, disodium cocoamphodiacetate, sodium cocoamphoacetate, Oleyl Alcohol, Propylene glycol, Sodium Hydroxide, Glycerin, Sodium hydroxide, Citric acid, Menthol, Panthenol, Tocopherol.',
    url: 'https://www.atida.fr/stiproxal-shampooing-antipelliculaire-100ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/stiproxal-shampoing-antipelliculaire-100ml-277692.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sles-hair' },
      { slug: 'salicylic-acid-hair' },
      { slug: 'panthenol-hair' },
      { slug: 'glycerin-hair' },
      { slug: 'tocopherol-hair' },
    ],
  },
  {
    slug: 'stiprox-1-5-shampoing-antipelliculaire-100ml-277527',
    name: 'Stiprox 1.5% Shampoing Antipelliculaire 100ml',
    brand: 'Stiefel',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1212,
    description: '',
    notes: '',
    inci: 'Aqua, sodium laureth sulfate, cocamidopropyl betaine, polysorbate 80, cocamide DEA, hexylene glycol, ciclopiroxolamine 1,5 %, oleyl alcohol, citric acid, disodium phosphate, polyquaternium-10, fragance, sodium hydroxide Shampooing liquide 1,5% Flacon plastique 100ml',
    url: 'https://www.atida.fr/stiprox-1-5-shampooing-antipelliculaire-100ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/stiprox-1-5-shampoing-antipelliculaire-100ml-277527.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sles-hair' },
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'polyquaternium-10' },
    ],
  },
]
