import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const PAULAS_CHOICE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'paula-choice-lait-corps-10-aha',
    name: 'Lait Corps Sublimateur 10% AHA',
    brand: `Paula's Choice`,
    kind: 'body-lotion',
    unit: 'pump',
    totalAmount: 210,
    amountUnit: 'ml',
    priceCents: 3120,
    description: `Lait corps exfoliant au glycolic acid (10% AHA) qui élimine les cellules mortes, lisse la peau et améliore l'apparence de la kératose pilaire, des taches et de la peau sèche.`,
    notes:
      '10% acide glycolique (AHA) pour exfoliation chimique. Contient beurre de karité, antioxydants (vitamine C, vitamine E, thé vert) et agents apaisants (allantoïne, camomille).',
    inci: 'WATER, GLYCOLIC ACID, CYCLOPENTASILOXANE, DIMETHICONE, GLYCERIN, GLYCERYL STEARATE, CETYL ALCOHOL, BUTYROSPERMUM PARKII BUTTER, STEARIC ACID, SODIUM HYDROXIDE, PEG-100 STEARATE, XANTHAN GUM, TETRAHEXYLDECYL ASCORBATE, TOCOPHERYL ACETATE, DISODIUM EDTA, BUTYLENE GLYCOL, ALLANTOIN, CHAMOMILLA RECUTITA FLOWER EXTRACT, VITIS VINIFERA SEED OIL, CAMELLIA OLEIFERA LEAF EXTRACT, EPILOBIUM ANGUSTIFOLIUM EXTRACT, METHYLPARABEN, BUTYLPARABEN, ETHYLPARABEN, PROPYLPARABEN, PHENOXYETHANOL, SODIUM BENZOATE',
    url: 'https://www.paulaschoice.com',
    tags: {
      primary: [
        TAG_SLUGS.PEAU_RUGUEUSE,
        TAG_SLUGS.KERATOSE_PILAIRE,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.ANTI_TACHES,
      ],
      secondary: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.DESHYDRATATION,
        TAG_SLUGS.LAIT_CORPS,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.SOIR,
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
      { slug: INGREDIENT_SLUGS.GLYCOLIC_ACID },
      { slug: INGREDIENT_SLUGS.GREEN_TEA },
      { slug: INGREDIENT_SLUGS.GLYCERIN },
      { slug: INGREDIENT_SLUGS.SHEA_BUTTER },
      { slug: INGREDIENT_SLUGS.THD_ASCORBATE },
      { slug: INGREDIENT_SLUGS.DIMETHICONE },
      { slug: INGREDIENT_SLUGS.ALLANTOIN },
      { slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE },
      { slug: INGREDIENT_SLUGS.HUILE_DE_PEPINS_DE_RAISIN },
      { slug: INGREDIENT_SLUGS.EXTRAIT_CAMOMILLE },
      { slug: INGREDIENT_SLUGS.BUTYLENE_GLYCOL },
      { slug: INGREDIENT_SLUGS.EXTRAIT_EPILOBE },
    ],
  },
]
