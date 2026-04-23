import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const FLORAME_SEED: UnifiedProductSeed[] = [
  {
    slug: 'florame-corps-gel-aloe-vera-bio-250ml-274728',
    name: 'Florame Corps Gel Aloé Vera Bio 250ml',
    brand: 'Florame',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 969,
    description: '',
    notes: '',
    inci: 'Aloe barbadensis leaf juice*, aqua (water), acacia senegal gum, leuconostoc/radish root ferment filtrate, xanthan gum, sodium hydroxide.* ingrédients issus de l’Agriculture Biologique\n100% du total est d’origine naturelle\n 95% du total des ingrédients sont issus de l’Agriculture Biologique',
    url: 'https://www.atida.fr/florame-gel-aloe-vera-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/3cfcfc38-0ef0-4d20-b34e-dbe728ded5cf/Florame-Corps-Gel-Aloe-Vera-Bio-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'aloe-vera-hair' }],
  },
]
