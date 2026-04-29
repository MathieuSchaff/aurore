import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LA_ROSEE_DENTAL_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-rosee-dentifrice-a-la-fraise-bio-1-6-ans',
    name: 'Dentifrice A LA Fraise BIO 1-6 ANS',
    brand: 'La Rosee',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 490,
    description: '',
    notes: '',
    inci: 'SORBITOL, AQUA (WATER), HYDRATED SILICIA, GLYCERIN, PERLITE, XANTHAN GUM, FRAGARIA VESCA (STRAWBERRY) FRUIT EXTRACT, HYDROLYZED GARDENIA FLORIDA EXTRACT, SODIUM FLUORIDE, AROME (FLAVOR), STEVIA REBAUDIANA EXTRACT, SODIUM CHLORIDE, SODIUM BENZOATE, CITRIC ACID, SODIUM COCOYL GLUTAMATE, MALTODEXTRIN, POTASSIUM SORBATE, SODIUM HYDROXIDE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/la-rosee/la-rosee-dentifrice-a-la-fraise-bio-1-6-ans-50ml.html',
    imageUrl: '',
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
  {
    slug: 'la-rosee-dentifrice-soin-complet-a-la-menthe-bio',
    name: 'Dentifrice SOIN Complet A LA Menthe BIO',
    brand: 'La Rosee',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 467,
    description: '',
    notes: '',
    inci: 'HYDROGENATED STARCH HYDROLISATE, AQUA, HYDRATED SILICA, GLYCERIN, PERLITE, SODIUM COCOYL ISETHIONATE, AROMA, SODIUM COCOAMPHOACETATE, XANTHAN GUM, SODIUM FLUORIDE (FLUOR), LEVULINIC ACID, MENTHOL, MENTHYL LACTATE, SODIUM LEVULINATE, STEVIA REBAUDIANA EXTRACT, SODIUM CHLORIDE, MENTHA VIRIDIS LEAF EXTRACT, CITRIC ACID, SODIUM HYDROXIDE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/la-rosee/la-rosee-dentifrice-soin-complet-a-la-menthe-bio-75ml.html',
    imageUrl: '',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
    ],
  },
]
