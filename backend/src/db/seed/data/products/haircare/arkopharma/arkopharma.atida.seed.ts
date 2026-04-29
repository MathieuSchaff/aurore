import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ARKOPHARMA_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'arkopharma-forcapil-elixir-croissance-cheveux',
    name: 'Forcapil Elixir Croissance Cheveux',
    brand: 'Arkopharma',
    kind: 'hair-serum',
    unit: 'bottle',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2909,
    description: '',
    notes: '',
    inci: 'AQUA, PROPYLENE GLYCOL, SODIUM PCA, PANICUM MILIACEUM SEED EXTRACT, URTICA DIOICA EXTRACT, GINKGO BILOBA LEAF EXTRACT, EQUISETUM ARVENSE EXTRACT, BAMBUSA ARUNDINACEA JUICE, SODIUM HYALURONATE, PYRIDOXINE HCI, CALCIUM PANTOTHENATE, BIOTIN, ZINC, GLUCONATE, PEG-40 CASTOR OIL, POTASSIUM, HYDROXIDE, POTASSIUM SORBATE, BENZYL, ALCOHOL, DEHYDROACETIC ACID, PARFUM',
    url: 'https://www.atida.fr/arkopharma-forcapil-elixir-croissance-cheveux-10-ml.html',
    imageUrl:
      'https://assets.atida.com/transform/e7f18b54-41d4-4b35-bbf3-77ad06916acf/Arkopharma-Forcapil-Elixir-Croissance-Cheveux-10-ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['serum-capillaire'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_PCA },
      { slug: INGREDIENT_SLUGS.GINKGO_BILOBA },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE },
      { slug: INGREDIENT_SLUGS.CALCIUM_PANTOTHENATE },
      { slug: INGREDIENT_SLUGS.BIOTIN },
    ],
  },
  {
    slug: 'arkopharma-forcapil-shampoing-fortifiant-cheveux-keratine',
    name: 'Forcapil Shampoing Fortifiant Cheveux Kératine',
    brand: 'Arkopharma',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 801,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM LAURETH SULFATE, SODIUM CHLORIDE, COCAMIDOPROPYL BETAINE, POLYSORBATE 20, HYDROLYZED KERATIN, POLYQUATERNIUM-10, PANTHENOL, PEG-200 HYDROGENATED GLYCERYL PALMATE, PEG-7 GLYCERYL COCOATE, CITRIC ACID, SODIUM HYDROXIDE, SODIUM BENZOATE, PARFUM, LINALOOL, LIMONENE',
    url: 'https://www.atida.fr/arkopharma-forcapil-shampoing-fortifiant-cheveux-keratine-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/d72c165f-98a8-4751-ba40-4cc218b415ca/Arkopharma-Forcapil-Shampoing-Fortifiant-Cheveux-Keratine-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_KERATIN },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
    ],
  },
]
