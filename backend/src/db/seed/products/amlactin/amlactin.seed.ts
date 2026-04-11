import { TAG_SLUGS } from '../../tags/seed-tags'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../unified-types'

export const AMLACTIN_SEED: UnifiedProductSeed[] = [
  {
    slug: 'amlactin-dayli-nourish-12-aha',
    name: 'Daily Nourish Lotion 12% AHA',
    brand: 'AmLactin',
    kind: 'body-lotion',
    unit: 'pump',
    totalAmount: 225,
    amountUnit: 'ml',
    priceCents: 1600,
    description: `Lotion exfoliante hydratante au lactate d'ammonium (12% AHA) pour peaux sèches, rugueuses ou kératose pilaire. Exfolie en douceur et améliore la texture.`,
    notes: '12% acide lactique sous forme ammonium lactate. Exfolie + hydrate (AHA humectant). Sans parfum, sans parabènes, sans phtalates. Texture légère non grasse.',
    inci: 'WATER, AMMONIUM LACTATE, MINERAL OIL, GLYCERIN, CETEARYL ALCOHOL, DIMETHICONE, GLYCERYL STEARATE SE, STEARETH-2, STEARYL ALCOHOL, XANTHAN GUM, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN',
    url: 'https://www.amlactin.com',
    tags: {
      primary: [
        TAG_SLUGS.PEAU_RUGUEUSE,
        TAG_SLUGS.KERATOSE_PILAIRE,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.DESHYDRATATION,
      ],
      secondary: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.LAIT_CORPS,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.ZONE_CORPS,
      ],
      avoid: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_ATOPIQUE,
        TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
      ],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.LACTIC_ACID,
        notes: 'Ammonium lactate 12% – AHA exfoliant + humectant',},
      { slug: INGREDIENT_SLUGS.GLYCERIN, notes: 'Glycérine – humectant',},
    ],
  },
]
