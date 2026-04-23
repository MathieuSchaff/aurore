import { TAG_SLUGS } from '../../../tags'
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
    imageUrl:
      'https://assets.atida.com/transform/f03e141f-00f9-4ac7-85be-3994852bed4a/MKL-Shampoing-Solide-Ortie-et-Charbon-Cheveux-Gras-65g?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
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
