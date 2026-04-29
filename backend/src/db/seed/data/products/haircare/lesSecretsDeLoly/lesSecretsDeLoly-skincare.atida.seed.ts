import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LES_SECRETS_DE_LOLY_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'les-secrets-de-loly-soin-masque-hydratant-repair-time',
    name: 'Soin Masque Hydratant Repair Time',
    brand: 'Les Secrets de Loly',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 230,
    amountUnit: 'ml',
    priceCents: 1563,
    description: '',
    notes: '',
    inci: "AQUA, GLYCERIN, CETEARYL ALCOHOL, SIMMONDSIA CHINENSIS SEED OIL, BEHENTRIMONIUM METHOSULFATE, COCOS NUCIFERA OIL*, STEARAMIDOPROPYL DIMETHYLAMINE, CITRIC ACID, ALOE BARBADENSIS LEAF JUICE POWDER*, MACADAMIA INTEGRIFOLIA SEED OIL, PANTHENOL, CITRUS PARADISI PEEL OIL, ANIBA ROSAEODORA WOOD OIL, BENZYL ALCOHOL, DEHYDROACETIC ACID, LIMONENE**, LINALOOL**. * ISSU DE L'AGRICULTURE BIOLOGIQUE ** PRÉSENT DANS LES HUILES ESSENTIELLES",
    url: 'https://www.atida.fr/les-secrets-de-loly-soin-masque-hydratant-repair-time-230ml.html',
    imageUrl:
      'https://assets.atida.com/transform/23103a04-b302-44dc-b2e8-89977573ea6b/Les-Secrets-de-Loly-Soin-Masque-Hydratant-Repair-Time-230ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'hydratation', 'barriere-cutanee'],
      secondary: ['reparateur', 'masque-hebdo', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
    ],
  },
]
