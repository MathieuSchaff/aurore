import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const NEUTRADERM_HAIRCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'neutraderm-shampoing-extra-doux-dermo-respect',
    name: 'Shampoing Extra-doux Dermo-respect',
    brand: 'Neutraderm',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 619,
    description: '',
    notes: '',
    inci: 'AQUA (WATER) / EAU, OLIGOACTIVE WATER(2), SODIUM LAURETH SULFATE, UNDECYLENAMIDOPROPYL BETAINE, DECYL GLUCOSIDE, OLEA EUROPAEA (OLIVE) LEAF EXTRACT, PANTHENOL, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, POLYQUATERNIUM- 10, COCO-GLUCOSIDE, GLYCERYL OLEATE, TOCOPHEROL, PARFUM (FRAGRANCE), HYDROGENATED PALM GLYCERIDES CITRATE, LAURETH-2, PEG-120 METHYL GLUCOSE DIOLEATE, PEG-6, PROPYLENE GLYCOL, SODIUM CHLORIDE, TETRASODIUM GLUTAMATE DIACETATE, SODIUM BENZOATE, UNDECANOIC ACID, CITRIC ACID, CI 15985 (YELLOW 6), CI 19140 (YELLOW 5)',
    url: 'https://www.atida.fr/neutraderm-shampooing-extra-doux-dermo-respect-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/64df304d-af04-47a4-8028-e94c63c4ca57/Neutraderm-Shampoing-Extra-Doux-Dermo-Respect-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL },
      { slug: INGREDIENT_SLUGS.PEG_120_METHYL_GLUCOSE_DIOLEATE },
    ],
  },
]
