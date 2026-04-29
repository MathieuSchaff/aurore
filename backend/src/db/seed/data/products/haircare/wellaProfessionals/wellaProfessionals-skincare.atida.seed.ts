import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const WELLA_PROFESSIONALS_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'wella-professionals-fusion-intense-repair-masque-reparation-intense',
    name: 'Fusion Intense Repair Masque Réparation Intense',
    brand: 'Wella Professionals',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 2305,
    description: '',
    notes: '',
    inci: 'AQUA/WATER/EAU, STEARYL ALCOHOL, BEHENTRIMONIUM CHLORIDE, CETYL ALCOHOL, QUATERNIUM-80, PROPYLENE GLYCOL, PARFUM/FRAGRANCE, ISOPROPYL ALCOHOL, PHENOXYETHANOL, METHYLPARABEN, PROPYLPARABEN, DISODIUM EDTA, HEXYL CINNAMAL, LINALOOL, BENZYL SALICYLATE, LIMONENE, CITRIC ACID, ALANINE, GLYCINE, ALPHA-ISOPMETHYL IONONE, HISTIDINE, SILK AMINO ACIDS, SODIUM BENZOATE',
    url: 'https://www.atida.fr/wella-professionals-fusion-intense-repair-masque-reparation-intense-150ml.html',
    imageUrl:
      'https://assets.atida.com/transform/a5147ea6-56e9-4ab7-8de9-5bd952186d16/Wella-Professionals-Fusion-Intense-Repair-Masque-Reparation-Intense-150ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['cicatrisation'],
      secondary: ['masque-hebdo', 'zone-visage', 'reparateur'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ALANINE },
      { slug: INGREDIENT_SLUGS.GLYCINE },
      { slug: INGREDIENT_SLUGS.HISTIDINE },
    ],
  },
]
