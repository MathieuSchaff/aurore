import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const PARODONTAX_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'parodontax-dentifrice-pate-gingivale',
    name: 'Dentifrice Pâte Gingivale',
    brand: 'Parodontax',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 900,
    description: '',
    notes: '',
    inci: 'SODIUM BICARBONATE, AQUA, GLYCERIN, SODIUM LAURYL SULFATE, AROMA, XANTHAN GUM, COCAMIDOPROPYL BETAINE, SODIUM FLUORIDE, SODIUM SACCHARIN, TITANIUM DIOXIDE, STEVIOL GLYCOSIDES, LIMONENE, CI 77491, CONTIENT DU FLUORURE DE SODIUM À 0,310% P/P (1400 PPM DE FLUOR)',
    url: 'https://www.atida.fr/parodontax-dentifrice-pate-gingivale-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/473242d4-08bb-4082-9852-268b420bde58/Parodontax-Dentifrice-Pate-Gingivale-Lot-de-2-x-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_BICARBONATE_DENTAL },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
      { slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE },
    ],
  },
  {
    slug: 'parodontax-bain-de-bouche-quotidien-protection-active-menthe-fraiche',
    name: 'Bain De Bouche Quotidien Protection Active Menthe Fraîche',
    brand: 'Parodontax',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 749,
    description: '',
    notes: '',
    inci: 'AQUA, GLYCERIN, PEG 60 HYDROGENATED CASTOR OIL, SODIUM CITRATE, SODIUM LAURYL SULFATE,AROMA, METHYLPARABEN, PROPYLPARABEN, ZINC CHLORIDE, GELLAN GUM, O-CYMEN-5-OL, SODIUM FLUORIDE, SODIUM SACCHARIN, CI17200',
    url: 'https://www.atida.fr/parodontax-bain-de-bouche-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/ff44b4eb-4d69-4522-9087-a79e72267c58/Parodontax-Bain-de-Bouche-Quotidien-Protection-Active-Menthe-Fraiche-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_CITRATE },
      { slug: INGREDIENT_SLUGS.ZINC_CHLORIDE },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
    ],
  },
  {
    slug: 'parodontax-dentifrice-blancheur',
    name: 'Dentifrice Blancheur',
    brand: 'Parodontax',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 1049,
    description: '',
    notes: '',
    inci: '',
    url: 'https://www.atida.fr/parodontax-dentifrice-blancheur-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/5f71a555-ed1f-4b9e-8d77-6bec6ce6edea/Parodontax-Dentifrice-Blancheur-Lot-de-2-x-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
  },
  {
    slug: 'parodontax-reparation-active-gencives-bitube',
    name: 'Réparation Active Gencives Bitube',
    brand: 'Parodontax',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 1163,
    description: '',
    notes: '',
    inci: 'SODIUM BICARBONATE, AQUA, GLYCERIN, COCAMIDOPROPY BETAINE, AROMA, XANTHAN GUM, SODIUM SACCHARIN, SODIUM FLUORIDE, LIMONENE, CI 77491',
    url: 'https://www.atida.fr/parodontax-reparation-active-gencives-bitube.html',
    imageUrl:
      'https://assets.atida.com/transform/a7f75afe-9e4a-4b66-ad17-16b2b26342dd/Parodontax-Reparation-Active-Gencives-bitube?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_BICARBONATE_DENTAL },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
    ],
  },
]
