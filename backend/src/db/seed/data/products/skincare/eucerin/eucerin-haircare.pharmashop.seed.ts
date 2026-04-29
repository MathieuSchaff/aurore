import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const EUCERIN_HAIRCARE_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eucerin-dermo-capillaire-calmant-soin-trait',
    name: 'Dermo Capillaire Calmant SOIN Trait',
    brand: 'Eucerin',
    kind: 'conditioner',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1252,
    description: '',
    notes: '',
    inci: 'AQUA, UREA, METHYLPROPANEDIOL, SODIUM LACTATE, LAURETH-9, GLYCYRRHIZA INFLATA ROOT EXTRACT, GLYCERIN, LACTID ACID, ARGININE HCL, HYDROXYETHYLCELLULOSE, PEG-40 HYDROGENATED CASTOR OIL, CETRIMONIUM CHLORIDE, PHENOXYETHANOL',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/eucerin/eucerin-dermo-capillaire-calmant-soin-trait-100ml.html',
    imageUrl: '',
    tags: {
      primary: ['apres-shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.UREA },
      { slug: INGREDIENT_SLUGS.SODIUM_LACTATE },
      { slug: INGREDIENT_SLUGS.LICOCHALCONE_A },
      { slug: INGREDIENT_SLUGS.CETRIMONIUM_CHLORIDE },
    ],
  },
  {
    slug: 'eucerin-dermo-capillaire-shampooing',
    name: 'Dermo Capillaire Shampooing',
    brand: 'Eucerin',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 790,
    description: '',
    notes: '',
    inci: 'AQUA, DECYL GLUCOSIDE, SODIUM MYRETH SULFATE, PEG-80 SORBITAN LAURATE, PEG-200 HYDROGENATED GLYCERYL PALMATE, DISODIUM PEG-5 LAURYLCITRATE SULFOSUCCINATE, PEG-90 GLYCERYL ISOSTEARATE; BISABOLOL, POLYQUATERNIUM-10, CITRIC ACID, LAURETH-2, SIODIUM LAURETH SULFATE, SODIUM BENZOATE, SODIUM SALICYLATE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/eucerin/soins-corps/eucerin-dermo-capillaire-shampooing-250ml.html',
    imageUrl: '',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.BISABOLOL }],
  },
]
