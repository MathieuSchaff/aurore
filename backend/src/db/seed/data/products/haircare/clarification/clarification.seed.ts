import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const CLARIFICATION_SEED: UnifiedProductSeed[] = [
  {
    slug: 'clarification-coffret-cheveux-mes-chouchous-edition-limitee-245802',
    name: 'Clarification Coffret Cheveux Mes Chouchous Édition Limitée',
    brand: 'Clarification',
    kind: 'hair-serum',
    unit: 'bottle',
    totalAmount: 35,
    amountUnit: 'g',
    priceCents: 2133,
    description: '',
    notes: '',
    inci: "INGRÉDIENTS : ZEA MAYS (CORN) STARCH • KAOLIN • AVENA SATIVA (OAT) KERNEL FLOUR. 100% d'ingrédients d'origine naturelle 92% d’ingrédients d’origine biologique.",
    url: 'https://www.atida.fr/clarification-coffret-cheveux-mes-chouchous-edition-limitee.html',
    imageUrl:
      'https://assets.atida.com/transform/509651e8-fc09-4582-97bb-d0907533cc9c/Clarification-Coffret-Cheveux-Mes-Chouchous-Edition-Limitee?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SERUM_CHEVEUX],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'kaolin-hair' }],
  },
]
