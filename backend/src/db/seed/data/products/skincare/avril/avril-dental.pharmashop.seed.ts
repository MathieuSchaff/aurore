import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const AVRIL_DENTAL_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'avril-dentifrice-bio-menthe-fraiche',
    name: 'Dentifrice BIO Menthe Fraiche',
    brand: 'Avril',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 359,
    description: '',
    notes: '',
    inci: "EAU, GLYCÉRINE**, HYDROLYSAT D'AMIDON DE MAÏS HYDROGÉNÉ, ACIDE SILICIQUE, DECYL GLUCOSIDE, CARMELLOSE (DÉRIVÉ DE CELLULOSE), AROME*, BENZOATE DE SODIUM (SEL DE SODIUM L'ACIDE BENZOÏQUE), EXTRAIT DE STEVIA REBAUDIANA*, HYDROXYDE DE SODIUM (SOUDE CAUSTIQUE), LIMONÈNE",
    url: 'https://www.pharmashopdiscount.com/fr/beaute/avril/avril-dentifrice-bio-menthe-fraiche-100ml.html',
    imageUrl: '',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
  },
  {
    slug: 'avril-dentifrice-blanchissant-bio',
    name: 'Dentifrice Blanchissant BIO',
    brand: 'Avril',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 399,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), SORBITOL, HYDRATED SILICA, GLYCERIN, XANTHAN GUM, LAURYL GLUCOSIDE, AROMA, CHARCOAL POWDER, MENTHA PIPERITA (PEPPERMINT) OIL, MENTHOL, SODIUM BENZOATE, REBAUDIOSIDE A, POTASSIUM SORBATE, CITRIC ACID, ANETHOLE, ALOE BARBADENSIS LEAF JUICE POWDER*, EUCALYPTUS GLOBULUS OIL, LIMONENE, BETA-CARYOPHYLLENE, PINENE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/avril/avril-dentifrice-blanchissant-bio-100ml.html',
    imageUrl: '',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SORBITOL_DENTAL },
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.MENTHE_POIVREE },
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
    ],
  },
]
