import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const L_OREAL_PROFESSIONNEL_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'l-oreal-professionnel-serie-expert-vitamino-color-shampoing-fixateur-de-couleur',
    name: 'Serie Expert Vitamino Color Shampoing Fixateur De Couleur',
    brand: "L'Oréal Professionnel",
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 2497,
    description: '',
    notes: '',
    inci: 'AQUA / WATER / EAU, SODIUM LAURETH SULFATE, COCAMIDOPROPYL BETAINE, DIMETHICONE, SODIUM CHLORIDE, CITRIC ACID, HEXYLENE GLYCOL, SODIUM BENZOATE, SODIUM HYDROXIDE, AMODIMETHICONE, CARBOMER, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, TRIDECETH-10, GLYCERIN, SALICYLIC ACID, GLYCOL DISTEARATE, NIACINAMIDE, MICA, PEG-100 STEARATE, LINALOOL, STEARETH-6, PHENOXYETHANOL, COCO-BETAINE, TRIDECETH-3, CI 77891 / TITANIUM DIOXIDE, RESVERATROL, BENZYL ALCOHOL, ACETIC ACID, FUMARIC ACID, PARFUM / FRAGRANCE (F.I.L, C261695/1)',
    url: 'https://www.atida.fr/l-oreal-professionnel-serie-expert-vitamino-color-shampoing-fixateur-de-couleur-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/4e55b560-5ebc-4cba-98c1-44dda426b234/L-Oreal-Professionnel-Serie-Expert-Vitamino-Color-Shampoing-Fixateur-de-Couleur-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.AMODIMETHICONE },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.GLYCOL_DISTEARATE },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE },
      { slug: INGREDIENT_SLUGS.MICA_HAIR },
      { slug: INGREDIENT_SLUGS.COCO_BETAINE },
      { slug: INGREDIENT_SLUGS.RESVERATROL },
    ],
  },
  {
    slug: 'l-oreal-professionnel-serie-expert-absolut-repair-shampoing-restructurant',
    name: 'Serie Expert Absolut Repair Shampoing Restructurant',
    brand: "L'Oréal Professionnel",
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 2523,
    description: '',
    notes: '',
    inci: 'AQUA / WATER, SODIUM LAURETH SULFATE, COCAMIDOPROPYL BETAINE, DIMETHICONE, SODIUM CHLORIDE, CITRIC ACID, HEXYLENE GLYCOL, SODIUM BENZOATE, SODIUM HYDROXIDE, AMODIMETHICONE, CARBOMER, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, TRIDECETH-10, GLYCERIN, SALICYLIC ACID, GLYCOL DISTEARATE, LINALOOL, MICA, PEG-100 STEARATE, HEXYL CINNAMAL, PHENOXYETHANOL, STEARETH-6, COCO-BETAINE, TRIDECETH-3, CI 77891 / TITANIUM DIOXIDE, LIMONENE, CHENOPODIUM QUINOA SEED EXTRACT, ACETIC ACID, FUMARIC ACID, HYDROLYZED WHEAT PROTEIN, CI 19140 / YELLOW 5, HYDROLYZED CORN PROTEIN, HYDROLYZED SOY PROTEIN, CI 17200 / RED 33, PARFUM / FRAGRANCE (F.I.L, C228932/1)',
    url: 'https://www.atida.fr/l-oreal-professionnel-serie-expert-absolut-repair-shampoing-restructurant-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/b23e32ca-26d1-486a-8031-5e839fe21bce/L-Oreal-Professionnel-Serie-Expert-Absolut-Repair-Shampoing-Restructurant-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.AMODIMETHICONE },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.GLYCOL_DISTEARATE },
      { slug: INGREDIENT_SLUGS.MICA_HAIR },
      { slug: INGREDIENT_SLUGS.COCO_BETAINE },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_WHEAT_PROTEIN },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_SOY_PROTEIN },
    ],
  },
]
