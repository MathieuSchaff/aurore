import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LA_ROSEE_DENTAL_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-rosee-hygiene-dentifrice-soin-complet',
    name: 'Hygiène Dentifrice Soin Complet',
    brand: 'La Rosée',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 513,
    description: '',
    notes: '',
    inci: 'SORBITOL, AQUA (WATER), HYDRATED SILICA, GLYCERIN, PERLITE, SODIUM COCOYL ISETHIONATE, MENTHA VIRIDIS (SPEARMINT) LEAF EXTRACT, SODIUM FLUORIDE, STEVIA REBAUDIANA EXTRACT, MENTHOL, AROMA (FLAVOR), XANTHAN GUM, SODIUM COCOAMPHOACETATE, LEVULINIC ACID, MENTHYL LACTATE, SODIUM LEVULINATE, SODIUM CHLORIDE, CITRIC ACID, SODIUM HYDROXIDE',
    url: 'https://www.atida.fr/la-rosee-hygiene-dentifrice-soin-complet-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/aeab093d-c93d-4573-8651-f08731bbc48a/La-Rosee-Hygiene-Dentifrice-Soin-Complet-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SORBITOL_DENTAL },
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
    ],
  },
  {
    slug: 'la-rosee-mon-petit-la-rosee-dentifrice-a-la-fraise-bio',
    name: 'Mon Petit La Rosée Dentifrice À La Fraise Bio',
    brand: 'La Rosée',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 463,
    description: '',
    notes: '',
    inci: 'SORBITOL, AQUA (WATER), HYDRATED SILICIA, GLYCERIN, PERLITE, XANTHAN GUM, FRAGARIA VESCA (STRAWBERRY) FRUIT EXTRACT, HYDROLYZED GARDENIA FLORIDA EXTRACT, SODIUM FLUORIDE, AROME (FLAVOR), STEVIA REBAUDIANA EXTRACT, SODIUM CHLORIDE, SODIUM BENZOATE, CITRIC ACID, SODIUM COCOYL GLUTAMATE, MALTODEXTRIN, POTASSIUM SORBATE, SODIUM HYDROXIDE',
    url: 'https://www.atida.fr/la-rosee-mon-petit-la-rosee-dentifrice-a-la-fraise-bio-50ml.html',
    imageUrl:
      'https://assets.atida.com/transform/ffe82a8e-ea7f-4434-a2e3-4ff4f8d0a0f2/La-Rosee-Mon-Petit-La-Rosee-Dentifrice-a-la-Fraise-Bio-50ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SORBITOL_DENTAL },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
    ],
  },
]
