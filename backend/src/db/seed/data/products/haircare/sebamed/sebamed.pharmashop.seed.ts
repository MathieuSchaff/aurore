import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const SEBAMED_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'sebamed-shampooing',
    name: 'Shampooing',
    brand: 'Sebamed',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1060,
    description: '',
    notes: '',
    inci: 'AQUA, DECYL GLUCOSIDE, DISODIUM LAURETH SULFOSUCCINATE, SODIUM LAURYL SULFOACETATE, PEG-55 PROPYLENE GLYCOL OLEATE, PROPYLENE GLYCOL, HYDROXYPROPYL OXIDIZED STARCH PG-TRIMONIUM CHLORIDE, CITRIC ACID, PARFUM, PHENOXYETHANOL, SODIUM BENZOATE',
    url: 'https://www.pharmashopdiscount.com/fr/visage-et-corps/par-produits/bain-et-douche/sebamed-shampooing-1l.html',
    imageUrl: '',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.DISODIUM_LAURETH_SULFOSUCCINATE }],
  },
]
