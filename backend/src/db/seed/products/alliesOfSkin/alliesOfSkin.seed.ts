import { TAG_SLUGS } from '../../tags/seed-tags'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../unified-types'

export const ALLIES_OF_SKIN_SEED: UnifiedProductSeed[] = [
  {
    slug: 'allies-of-skin-azelaic-kojic-advanced-clarifying-serum',
    name: 'Azelaic & Kojic Advanced Clarifying Serum',
    brand: 'Allies of Skin',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 11000,
    description: 'Sérum luxe 10% azélaïque + kojique + hexylrésorcinol 3%. Éclaircissement puissant, anti-imperfections, anti-âge.',
    notes: 'Triple éclaircissant + bakuchiol + ribose. Études cliniques (45% amélioration teint). Ultra-clean, prix très élevé.',
    inci: 'WATER, AZELAIC ACID (10%), BUTYLENE GLYCOL, ALOE BARBADENSIS LEAF JUICE, PROPANEDIOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, KOJIC ACID (1%), POLYSORBATE 20, GLYCERIN, CAPRYLYL GLYCOL, HEXYLRESORCINOL (3%), ETHYL LINOLEATE, LEUCONOSTOC/RADISH ROOT FERMENT FILTRATE, DODECANE, HYDROXYETHYLCELLULOSE, XANTHAN GUM, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, SQUALANE, BISABOLOL, GLYCERYL LAURATE, GLYCERYL UNDECYLENATE, ALLANTOIN, RIBOSE, SODIUM ACETATE, BAKUCHIOL, GLYCYRRHIZA GLABRA (LICORICE) ROOT EXTRACT, CELLULOSE, PHENOXYETHANOL',
    url: 'https://allies.shop',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.GROSSESSE_COMPATIBLE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        concentrationValue: 10,
        concentrationUnit: "%",
        notes: '10% acide azélaïque – exfoliant doux, anti-rougeurs/pigmentation',},
      { slug: INGREDIENT_SLUGS.KOJIC_ACID, notes: '1% kojic acid – éclaircissant',},
      { slug: INGREDIENT_SLUGS.HEXYLRESORCINOL, notes: '3% hexylresorcinol – puissant anti-taches',},
      { slug: INGREDIENT_SLUGS.BAKUCHIOL, notes: 'Alternative douce au rétinol – anti-âge',},
      { slug: INGREDIENT_SLUGS.RIBOSE, notes: 'Sucre stimulant énergie cellulaire',},
      { slug: INGREDIENT_SLUGS.REGLISSE, notes: 'Réglisse – apaisant, anti-inflammatoire',},
      { slug: INGREDIENT_SLUGS.SQUALANE },
      { slug: INGREDIENT_SLUGS.ALOE_VERA },
      { slug: INGREDIENT_SLUGS.ALLANTOIN },
      { slug: INGREDIENT_SLUGS.BISABOLOL },
    ],
  },
]
