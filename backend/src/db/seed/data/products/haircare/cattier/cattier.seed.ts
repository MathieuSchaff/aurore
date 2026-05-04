import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const CATTIER_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cattier-beurre-de-karite-100-bio-100g-278308',
    name: 'Cattier Beurre de Karité 100% Bio 100g',
    brand: 'Cattier',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'g',
    priceCents: 812,
    description: '',
    notes: '',
    inci: "Butyrospermum Parkii Butter*. *Ingrédient issu de l'agriculture biologique.100% du total des ingrédients sont issus de l'agriculture biologique.",
    url: 'https://www.atida.fr/cattier-beurre-de-karite-100-bio-100g.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/cattier-beurre-de-karite-100-bio-100g-278308.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.MASQUE_CAPILLAIRE],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_SECS,
        HAIRCARE_PRODUCT_TAG_SLUGS.CREPUS,
        HAIRCARE_PRODUCT_TAG_SLUGS.BOUCLES,
        HAIRCARE_PRODUCT_TAG_SLUGS.NUTRITION,
        HAIRCARE_PRODUCT_TAG_SLUGS.HYDRATATION,
        HAIRCARE_PRODUCT_TAG_SLUGS.MASQUE_HEBDO_CHEVEUX,
      ],
      avoid: [],
    },
    keyIngredients: [{ slug: 'shea-butter-hair' }],
  },
  {
    slug: 'cattier-shampoing-extra-doux-lait-d-avoine-bio-1l-257467',
    name: "Cattier Shampoing Extra-Doux Lait d'Avoine Bio 1L",
    brand: 'Cattier',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1379,
    description: '',
    notes: '',
    inci: 'Ingrédients : Aqua, ammonium lauryl sulfate, erythritol, sodium cocoamphoacetate, sodium benzoate, acetum, aloe barbadensis leaf extract*, ascorbyl palmitate, avena sativa kernel extract*, benzyl alcohol, citric acid, coco-glucoside, glycerin, glyceryl oleate, hydrogenated palm glycerides citrate, lactic acid, lavandula angustifolia flower extract, lecithin, parfum, phytic acid, potassium sorbate, rosmarinus officinalis leaf extract, salvia officinalis leaf extract, sodium chloride, thymus vulgaris flower/leaf extract, tocopherol, xanthan gum, limonene.',
    url: 'https://www.atida.fr/cattier-shampooing-extra-doux-usage-quotidien-1l.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/cattier-shampoing-extra-doux-lait-d-avoine-bio-1l-257467.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_TOUS_TYPES, HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'ammonium-lauryl-sulfate' },
      { slug: 'sodium-cocoamphoacetate' },
      { slug: 'aloe-vera-hair' },
      { slug: 'coco-glucoside' },
      { slug: 'glycerin-hair' },
      { slug: 'phytic-acid-hair' },
      { slug: 'romarin-extract-hair' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
