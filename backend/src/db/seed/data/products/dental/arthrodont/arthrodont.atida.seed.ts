import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ARTHRODONT_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'arthrodont-classic-pate-dentifrice',
    name: 'Classic Pâte Dentifrice',
    brand: 'Arthrodont',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 865,
    description: '',
    notes: '',
    inci: 'WATER (AQUA), CALCIUM CARBONATE, GLYCERIN, SODIUM LAURYL SULFATE, ALGIN, CARRAGEENAN, CETYLPYRIDINIUIM CHLORIDE EUGENOL, FLAVOR (AROMA), GLYCYRRHETINIC ACID, ILLICIUM VERUM',
    url: 'https://www.atida.fr/arthrodont-classic-pate-dentifrice-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/804aeb44-a878-4d28-974a-24fcff296150/Arthrodont-Classic-Pate-Dentifrice-Lot-de-2-x-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.CALCIUM_CARBONATE },
      { slug: INGREDIENT_SLUGS.CARRAGEENAN_DENTAL },
    ],
  },
  {
    slug: 'arthrodont-protect-dentifrice-gel-fluore',
    name: 'Protect Dentifrice Gel Fluoré',
    brand: 'Arthrodont',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 1017,
    description: '',
    notes: '',
    inci: 'HYDROGENATED STARCH HYDROLYSATE, WATER (AQUA), HYDRATED SILICA, SODIUM LAURYL SULFATE, BLUE 1 (CI 42090), CELLULOSE GUM, FLAVOR (AROMA), GLYCYRRHETINIC ACID, PEG-12 ALLYL ETHER, PEG-12 DIMETHICONE, SODIUM CARBONATE, SODIUM PROPIONATE, SODIUM SACCHARIN, YELLOW 5 (CI 19140)',
    url: 'https://www.atida.fr/arthrodont-protect-dentifrice-gel-fluore-lot-de-2-x-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/fe388861-6e42-4c0b-8729-817411d4fa11/Generated-image?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.CELLULOSE_GUM_DENTAL },
    ],
  },
  {
    slug: 'arthrodont-solution-bain-de-bouche',
    name: 'Solution Bain De Bouche',
    brand: 'Arthrodont',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 576,
    description: '',
    notes: '',
    inci: 'AQUA, GLYCERIN, ALCOHOL, PEG 60.HYDROGENATED CASTOR OIL, DIPOTASSIUM GLYCYRRHIZINATE, LAURETH-9, MENTHA PIPERITA, FORMALDEHYDE, ILLICIUM VERUM, MENTHOL, EUGENOL, LIMONENE, AROMA CL42051',
    url: 'https://www.atida.fr/arthrodont-solution-bain-de-bouche-300ml.html',
    imageUrl:
      'https://assets.atida.com/transform/48ced254-acaf-497a-9922-41e0915681d3/Arthrodont-Solution-Bain-de-Bouche-300ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
      { slug: INGREDIENT_SLUGS.CLOVE_OIL_EUGENOL },
    ],
  },
  {
    slug: 'arthrodont-expert-dentifrice',
    name: 'Expert Dentifrice',
    brand: 'Arthrodont',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 576,
    description: '',
    notes: '',
    inci: 'WATER (AQUA), GLYCERIN, HYDRATED SILICA, CELLULOSE GUM, CARRAGEENAN, SODIUM METHYL COCOYL TAURATE, ALLANTOIN, CHLORHEXIDINE DIGLUCONATE, FLAVOR (AROMA), GLYCYRRHETINIC ACID, HEXYLENE GLYCOL, LACTIC ACID, LIMONENE, POTASSIUM ACESULFAME, SODIUM COCOYL APPLE AMINO ACIDS, SUCRALOSE, TETRASODIUM GLUTAMATE DIACETATE',
    url: 'https://www.atida.fr/arthrodont-expert-dentifrice-50ml.html',
    imageUrl:
      'https://assets.atida.com/transform/fa2bf956-a09f-4166-93ce-b825074d62cf/Arthrodont-Expert-Dentifrice-50ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.CELLULOSE_GUM_DENTAL },
      { slug: INGREDIENT_SLUGS.CARRAGEENAN_DENTAL },
      { slug: INGREDIENT_SLUGS.ALLANTOIN },
      { slug: INGREDIENT_SLUGS.CHLORHEXIDINE },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
    ],
  },
]
