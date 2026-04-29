import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const RESPIRE_DENTAL_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'respire-dentifrice-soin-complet',
    name: 'Dentifrice SOIN Complet',
    brand: 'Respire',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 699,
    description: '',
    notes: '',
    inci: 'GLYCERIN, AQUA, SORBITOL, HYDRATED SILICA, SODIUM COCOYL ISETHIONATE, AROMA, LAURYL GLUCOSIDE, HYDROXYAPATITE, CARRAGEENAN, SODIUM BICARBONATE, BETULA ALBA LEAF EXTRACT, XANTHAN GUM, STEVIA REBAUDIANA EXTRACT, POTASSIUM SORBATE, SORBIC ACID',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/respire/respire-dentifrice-soin-complet-75ml.html',
    imageUrl: '',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SORBITOL_DENTAL },
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.HYDROXYAPATITE },
      { slug: INGREDIENT_SLUGS.CARRAGEENAN_DENTAL },
      { slug: INGREDIENT_SLUGS.SODIUM_BICARBONATE_DENTAL },
    ],
  },
]
