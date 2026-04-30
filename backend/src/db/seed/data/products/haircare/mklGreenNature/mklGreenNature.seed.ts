import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const MKL_GREEN_NATURE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'mkl-shampoing-solide-ortie-et-charbon-cheveux-gras-65g-270655',
    name: 'MKL Shampoing Solide Ortie et Charbon Cheveux Gras 65g',
    brand: 'MKL Green Nature',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'unité',
    priceCents: 405,
    description: '',
    notes: '',
    inci: 'Sodium cocoyl isethionate, hydrogenated vegetable oil, aqua, polyglyceryl-4-laurate, glycerin, parfum, lamium album flower extract, charcoal powder, citric acid, tetrasodium glutamate diacetate, hexyl cinnamal, linalool, geraniol, benzyl salicylate.',
    url: 'https://www.atida.fr/mkl-shampooing-solide-ortie-et-charbon-cheveux-gras-65g.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/mkl-shampoing-solide-ortie-et-charbon-cheveux-gras-65g-270655.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sodium-cocoyl-isethionate' },
      { slug: 'glycerin-hair' },
      { slug: 'activated-charcoal-hair' },
    ],
  },
]
