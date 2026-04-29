import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LAZARTIGUE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'lazartigue-extra-gentle-shampooing-detox',
    name: 'Extra-gentle Shampooing Détox',
    brand: 'Lazartigue',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 2095,
    description: '',
    notes: '',
    inci: 'AQUA/WATER/EAU, SODIUM LAUROYL GLUTAMATE, DECYL GLUCOSIDE, SODIUM METHYL COCOYL TAURATE, SODIUM COCOAMPHOACETATE, DIGLYCERIN, PROPANEDIOL, PROPYLENE GLYCOL, CITRIC ACID, ALPHA-GLUCAN OLIGOSACCHARIDE, PARFUM/FRAGRANCE, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, XANTHAN GUM, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, SODIUM BENZOATE, ETHYLHEXYLGLYCERIN, TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES, GLYCERIN, CITRONELLOL, GERANIOL, GERANYL ACETATE, CANANGA ODORATA FLOWER OIL, CITRUS LIMON (LEMON) PEEL OIL, PELARGONIUM GRAVEOLENS FLOWER OIL, SODIUM HYDROXIDE, ORYZA SATIVA (RICE) BRAN OIL, MAGNESIUM ALUMINUM SILICATE, TOCOPHEROL, SORBIC ACID',
    url: 'https://www.atida.fr/lazartigue-extra-gentle-shampooing-detox-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/6d2d5a80-0ac6-475b-8ad3-73df2fc146c7/Lazartigue-Extra-Gentle-Shampooing-Detox-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_LAUROYL_GLUTAMATE },
      { slug: INGREDIENT_SLUGS.PROPANEDIOL },
      { slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE },
    ],
  },
  {
    slug: 'lazartigue-clear-shampooing-cuir-chevelu-sec',
    name: 'Clear Shampooing Cuir Chevelu Sec',
    brand: 'Lazartigue',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 1745,
    description: '',
    notes: '',
    inci: 'AQUA/WATER/EAU, SODIUM LAUROYL GLUTAMATE, SODIUM METHYL COCOYL TAURATE, DECYL GLUCOSIDE, PROPANEDIOL, SODIUM COCOAMPHOACETATE, MALUS DOMESTICA FRUIT CELL CULTURE EXTRACT, CITRIC ACID, PROPYLENE GLYCOL, CAPRYLYL/CAPRYL GLUCOSIDE, XANTHAN GUM, XYLITYLGLUCOSIDE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, PCA GLYCERYL OLEATE, HYDROXYPROPYL GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, ANHYDROXYLITOL, SODIUM BENZOATE, ISOAMYL LAURATE, PARFUM/FRAGRANCE, POLYGLYCERYL-3 COCOATE, ETHYLHEXYLGLYCERIN, XYLITOL, POLYGLYCERYL-10 LAURATE, ZIZIPHUS JOAZEIRO BARK EXTRACT, HYDROXYACETOPHENONE, SODIUM HYDROXIDE, TOCOPHEROL',
    url: 'https://www.atida.fr/lazartigue-clear-shampooing-cuir-chevelu-sec-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/7dfa8f59-fc93-41af-a6f6-4254636a33a2/Generated-image?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_LAUROYL_GLUTAMATE },
      { slug: INGREDIENT_SLUGS.PROPANEDIOL },
      { slug: INGREDIENT_SLUGS.XYLITYLGLUCOSIDE },
      { slug: INGREDIENT_SLUGS.ANHYDROXYLITOL },
      { slug: INGREDIENT_SLUGS.XYLITOL },
    ],
  },
]
