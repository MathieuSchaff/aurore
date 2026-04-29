import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LED_NOREVA_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'noreva-sebodiane-ds-serum-lp-seboregulateur',
    name: 'Noreva Sebodiane DS Sérum LP Séborégulateur',
    brand: 'LED NOREVA',
    kind: 'serum',
    unit: 'dropper',
    totalAmount: 8,
    amountUnit: 'ml',
    priceCents: 1248,
    description: '',
    notes: '',
    inci: 'CAPRYLIC/CAPRIC TRIGLYCERIDE, ISOPROPYLIDENE GLYCEROL, ALCOHOL, LINOLEIC ACID, PHYTOSPHINGOSINE HCL, TOCOPHERYL ACETATE, BHT',
    url: 'https://www.atida.fr/noreva-sebodiane-ds-serum-lp-seboregulateur-8ml.html',
    imageUrl:
      'https://assets.atida.com/transform/ac9572a1-da56-4a92-a613-cdc5f8117a62/Noreva-Sebodiane-DS-Serum-LP-Seboregulateur-8ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['barriere-cutanee', 'anti-oxydant', 'sebo-regulateur'],
      secondary: ['serum', 'traitement', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.LINOLEIC_ACID }],
  },
]
