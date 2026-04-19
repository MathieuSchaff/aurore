import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

export const GARANCIA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'garancia-que-mes-rougeurs-disparaissent',
    name: 'Que mes Rougeurs Disparaissent',
    brand: 'Garancia',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3100,
    description: 'Sérum lacté concentré avec action ultra-rapide sur les flushs (30 min). Aide à réduire les vaisseaux apparents.',
    notes: `Complexe breveté CIRCULOX® (micro-algue rouge). Note Yuka 100/100. 91% d\"origine naturelle. Vegan.`,
    inci: 'WATER, HEPTYL UNDECYLENATE, METHYLPROPANEDIOL, BUTYLENE GLYCOL, GLYCYRRHETINIC ACID, GLYCERIN, VACCINIUM MYRTILLUS LEAF EXTRACT, PLANKTON EXTRACT, PANTHENOL, ESCIN, ARRABIDAEA CHICA LEAF/STEM EXTRACT, RUSCUS ACULEATUS ROOT EXTRACT, AMMONIUM GLYCYRRHIZATE, CENTELLA ASIATICA EXTRACT, HYDROLYZED YEAST PROTEIN, CALENDULA OFFICINALIS FLOWER EXTRACT, TOCOPHEROL, CITRIC ACID, PARFUM (FRAGRANCE), ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, GLYCERYL UNDECYLENATE, SODIUM BENZOATE, SODIUM CITRATE, POTASSIUM SORBATE, ETHYLHEXYLGLYCERIN, SODIUM HYDROXIDE',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.FLUSHS, TAG_SLUGS.ROSACEE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.BIO_NATUREL,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PLANKTON_EXTRACT, notes: 'CIRCULOX® : booste la microcirculation',},
      { slug: INGREDIENT_SLUGS.VACCINIUM_MYRTILLUS, notes: 'CIRCULOX® : renforce les capillaires',},
      { slug: INGREDIENT_SLUGS.REGLISSE, notes: 'Acide glycyrrhétinique 98% apaisant',},
      { slug: INGREDIENT_SLUGS.ESCIN, notes: 'Renforce les parois vasculaires',},
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Apaisant et cicatrisant',},
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Hydrate et répare',},
    ],
  },
]
