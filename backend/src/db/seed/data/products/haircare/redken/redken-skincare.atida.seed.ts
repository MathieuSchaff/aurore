import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const REDKEN_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'redken-extreme-masque-reparateur',
    name: 'Extreme Masque Réparateur',
    brand: 'Redken',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 3299,
    description: '',
    notes: '',
    inci: 'AQUA / WATER, CETEARYL ALCOHOL, AMODIMETHICONE, BEHENTRIMONIUM METHOSULFATE, BEHENTRIMONIUM CHLORIDE, PARFUM / FRAGRANCE, DIPROPYLENE GLYCOL, PHENOXYETHANOL, CITRIC ACID, BENZOIC ACID, HEXADIMETHRINE CHLORIDE, TRIDECETH-6, CETYL ALCOHOL, ARGININE, HYDROLYZED SOY PROTEIN, HYDROXYPROPYL GUAR, HYDROLYZED VEGETABLE PROTEIN PG-PROPYL SILANETRIOL, POTASSIUM HYDROXIDE, SODIUM COCOYL AMINO ACIDS, QUATERNIUM-33, CETRIMONIUM CHLORIDE, POTASSIUM DIMETHICONE PEG-7 PANTHENYL PHOSPHATE, BENZYL BENZOATE, SODIUM SARCOSINATE, PROPYLENE GLYCOL, LIMONENE, BENZYL ALCOHOL, LINALOOL, 2-OLEAMIDO-1,3-OCTADECANEDIOL, POTASSIUM SORBATE, TETRASODIUM EDTA (F.I.L, D258267/1)',
    url: 'https://www.atida.fr/redken-extreme-masque-reparateur-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/12ab46dd-3c12-4059-baba-2e8a5dd85161/Redken-Extreme-Masque-Reparateur-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['cicatrisation'],
      secondary: ['masque-hebdo', 'zone-visage', 'reparateur'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ARGININE },
      { slug: INGREDIENT_SLUGS.POTASSIUM_HYDROXIDE },
    ],
  },
]
