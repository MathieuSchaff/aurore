import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LA_ROSEE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-rosee-ecorecharge-huile-de-douche-lavante-a-l-huile-de-graines-de-tournesol-bio',
    name: "Ecorecharge Huile De Douche Lavante À L'huile De Graines De Tournesol Bio -",
    brand: 'La Rosée',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 800,
    amountUnit: 'ml',
    priceCents: 2327,
    description: '',
    notes: '',
    inci: 'LAURETH-4, MIPA-LAURETH SULFATE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, COCAMIDE DEA, CAPRYLIC/CAPRIC TRIGLYCERIDE, PARFUM (FRAGRANCE), TOCOPHERYL ACETATE, AQUA (WATER), CI 14700 (RED 4)',
    url: 'https://www.atida.fr/la-rosee-ecorecharge-huile-de-douche-lavante-a-l-huile-de-graines-de-tournesol-bio-800ml.html',
    imageUrl:
      'https://assets.atida.com/transform/549be090-0332-4211-b4f3-783cc9cb8a8b/La-Rosee-Ecorecharge-Huile-De-Douche-Lavante-A-L-Huile-De-Graines-De-Tournesol-Bio-800Ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['anti-oxydant'],
      secondary: ['nettoyant-corps', 'zone-corps'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL }],
  },
]
