import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const EYE_CARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eye-care-soins-capillaire-ultracapil-serum-capillaire',
    name: 'Soins Capillaire Ultracapil Sérum Capillaire',
    brand: 'Eye Care',
    kind: 'hair-serum',
    unit: 'bottle',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 1536,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), GLYCERIN, NIACINAMIDE, PROPANEDIOL, BUTYLENE GLYCOL, PHENETHYL ALCOHOL, POLYACRYLATE CROSSPOLYMER-6, SODIUM PHOSPHATE, ARGININE, LACTIC ACID, ALLIUM CEPA BULB EXTRACT, GLYCINE SOJA GERM EXTRACT, TRITICUM VULGARE GERM EXTRACT, DISODIUM PHOSPHATE, GLUCONOLACTONE, SODIUM BENZOATE, T-BUTYL ALCOHOL, SCUTELLARIA BAICALENSIS ROOT EXTRACT, POTASSIUM SORBATE, CYNANCHUM ATRATUM EXTRACT, PANTHENOL, CALCIUM GLUCONATE, BIOTINOYL TRIPEPTIDE-1 (LRC01)',
    url: 'https://www.atida.fr/eye-care-soins-capillaire-ultracapil-serum-capillaire-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/6bc84f96-281b-4de2-b195-f3126a0afff9/Eye-Care-Soins-Capillaire-UltraCapil-Serum-Capillaire-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['serum-capillaire'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.NIACINAMIDE },
      { slug: INGREDIENT_SLUGS.PROPANEDIOL },
      { slug: INGREDIENT_SLUGS.ARGININE },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
    ],
  },
]
