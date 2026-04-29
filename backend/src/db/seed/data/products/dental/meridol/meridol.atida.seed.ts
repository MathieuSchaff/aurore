import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const MERIDOL_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'meridol-parodont-expert-dentifrice',
    name: 'Meridol Parodont Expert Dentifrice',
    brand: 'Méridol',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 1018,
    description: '',
    notes: '',
    inci: '',
    url: 'https://www.atida.fr/meridol-parodont-expert-dentifrice-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/8e59e429-15eb-45ef-b79a-0960d61a7679/Meridol-Parodont-Expert-Dentifrice-Lot-de-2-x-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
  },
  {
    slug: 'meridol-bain-de-bouche-protection-gencives',
    name: 'Meridol Bain De Bouche Protection Gencives',
    brand: 'Méridol',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 630,
    description: '',
    notes: '',
    inci: "CONTIENT DEUX DÉRIVÉS FLUORÉS: FLUORURE D'AMINES OLAFLUOR, FLUORURE D'ÉTAIN, INGRÉDIENTS: AQUA, XYLITOL, PVP, PEG-40 HYDROGENATED CASTOR OILOLAFLUR, AROMA (MENTHE-ANIS-EUCALYPTUS), STANNOUS FLUORIDE, SODIUM SACCHARIN, CI 42051",
    url: 'https://www.atida.fr/meridol-bain-de-bouche-400ml.html',
    imageUrl:
      'https://assets.atida.com/transform/c604c0c5-2cac-44bf-add5-f628249795fa/Meridol-Bain-de-Bouche-Protection-Gencives-400ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.XYLITOL },
      { slug: INGREDIENT_SLUGS.STANNOUS_FLUORIDE },
    ],
  },
  {
    slug: 'meridol-bain-de-bouche-parodont-expert',
    name: 'Bain De Bouche Parodont Expert',
    brand: 'Méridol',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 727,
    description: '',
    notes: '',
    inci: 'AQUA, GLYCERIN, PROPYLENE GLYCOL, SORBITOL, SODIUM METHYL COCOYL TAURATE, POLOXAMER 407, ZINC LACTATE, AROMA, SODIUM HYALURONATE, CETYLPYRIDINIUM CHLORIDE, SODIUM FLUORIDE, POTASSIUM SORBATE, LACTIC ACID, MENTHOL, SODIUM SACCHARIN, SUCRALOSE, CI 42090',
    url: 'https://www.atida.fr/meridol-bain-de-bouche-parodont-expert-400ml.html',
    imageUrl:
      'https://assets.atida.com/transform/222fb3c2-d0aa-4104-b8eb-00502a72508e/Meridol-Bain-de-Bouche-Parodont-Expert-400ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SORBITOL_DENTAL },
      { slug: INGREDIENT_SLUGS.ZINC_LACTATE },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE },
      { slug: INGREDIENT_SLUGS.CETYLPYRIDINIUM_CHLORIDE },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
    ],
  },
]
