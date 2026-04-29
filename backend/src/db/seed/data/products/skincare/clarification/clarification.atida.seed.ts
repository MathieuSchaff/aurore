import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const CLARIFICATION_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'clarification-la-poudre-lavante-naturelle-avoine-bio-et-acide-hyaluronique',
    name: 'La Poudre Lavante Naturelle Avoine Bio Et Acide Hyaluronique',
    brand: 'Clarification',
    kind: 'cleanser',
    unit: 'powder',
    totalAmount: 40,
    amountUnit: 'g',
    priceCents: 1279,
    description: '',
    notes: '',
    inci: 'SODIUM LAUROYL GLUTAMATE, AQUA / WATER, KAOLIN, AVENA SATIVA KERNEL FLOUR / AVENA SATIVA (OAT) KERNEL FLOUR*, SODIUM MYRISTOYL GLUTAMATE, CITRIC ACID, PARFUM / FRAGRANCE, GLUCOSE, SODIUM HYALURONATE, 100% DES INGRÉDIENTS SONT D’ORIGINE NATURELLE. *INGRÉDIENT ISSU DE L’AGRICULTURE BIOLOGIQUE',
    url: 'https://www.atida.fr/clarification-la-poudre-lavante-naturelle-avoine-bio-et-acide-hyaluronique-40g.html',
    imageUrl:
      'https://assets.atida.com/transform/f47ff985-aa55-4ddd-8d1a-6d3fc5a0f453/Clarification-La-Poudre-Lavante-Naturelle-Avoine-Bio-et-Acide-Hyaluronique-40g?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'hydratation'],
      secondary: ['peau-sensible', 'nettoyant', 'double-nettoyage-2', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.KAOLIN },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE },
    ],
  },
]
