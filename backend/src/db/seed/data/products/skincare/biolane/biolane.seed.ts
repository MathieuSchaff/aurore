import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const BIOLANE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'biolane-gel-lavant-corps-et-cheveux-peaux-sensibles-cheveux-fins-bebe-750ml-239560',
    name: 'Biolane Gel Lavant Corps et Cheveux Peaux Sensibles Cheveux Fins Bébé 750ml',
    brand: 'Biolane',
    kind: 'cleanser',
    unit: 'pump',
    totalAmount: 750,
    amountUnit: 'ml',
    priceCents: 602,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), LAURYL GLUCOSIDE, COCAMIDOPROPYL BETAINE, COCO-GLUCOSIDE, GLYCERYL OLEATE, PARFUM (FRAGRANCE), CITRIC ACID, SODIUM BENZOATE, TOCOPHEROL, HYDROGENATED PALM GLYCERIDES CITRAT',
    url: 'https://www.atida.fr/biolane-gel-corps-cheveux-peaux-sensibles-cheveux-fins-bebe-750ml.html',
    imageUrl:
      'https://assets.atida.com/transform/fcb04601-9c91-4886-aeb0-96c6099da129/Biolane-Gel-Corps-Cheveux-Peaux-Sensibles-Cheveux-Fins-Bebe-750ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.ANTI_OXYDANT],
      secondary: [
        TAG_SLUGS.REPARATEUR,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.DOUBLE_NETTOYAGE_2,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [],
  },
]
