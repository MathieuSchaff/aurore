import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

export const NOREVA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'noreva-sensidiane-ar-plus',
    name: 'Sensidiane AR+',
    brand: 'Noreva',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2050,
    description: 'Soin anti-rougeurs avec pigments verts, utilisant un acide hyaluronique spécifique (450 kDa) pour renforcer les défenses de la peau.',
    notes: `Complexe Neutrazen™ Pro. Apaise immédiatement les sensations d\"échauffement. Texture onctueuse, excellente base de maquillage. Sans parfum.`,
    inci: 'WATER, OCTYLDODECANOL, GLYCERIN, CETEARYL ALCOHOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, C9-12 ALKANE, C20-22 ALKYL PHOSPHATE, C20-22 ALCOHOLS, PENTYLENE GLYCOL, NIACINAMIDE, DIMETHICONE, GLYCERYL STEARATE, PEG-100 STEARATE, SODIUM POLYACRYLATE, CHLORPHENESIN, TOCOPHERYL ACETATE, XANTHAN GUM, O-CYMEN-5-OL, MALTODEXTRIN, ASIATICOSIDE, ASPARAGOPSIS ARMATA EXTRACT, PANAX GINSENG ROOT EXTRACT, POLYGLYCERYL-10 STEARATE, SODIUM BENZOATE, POTASSIUM SORBATE, ASCOPHYLLUM NODOSUM EXTRACT, TRIETHYL CITRATE, POLYGLYCERYL-6 BEHENATE, CI 77491 (IRON OXIDES), SILICA, BEHENIC ACID, CERAMIDE NP, CETEARYL ALCOHOL, CHOLESTEROL, LACTIC ACID, CERAMIDE NS, TOCOPHEROL, CERAMIDE EOP, CERAMIDE AP, SODIUM CETEARYL SULFATE, SODIUM HYDROXIDE',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.FLUSHS],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.PIGMENTS_VERTS,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.NON_COMEDOGENE,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_GRASSE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.NEUTRAZEN, notes: 'Neutrazen™ Pro : apaise et limite les médiateurs inflammatoires',},
      { slug: INGREDIENT_SLUGS.ASIATICOSIDE, notes: 'Calmactiv (Centella) : combat les signes de rosacée',},
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID, notes: 'Acide hyaluronique 450 kDa : renforce les défenses naturelles',},
      { slug: INGREDIENT_SLUGS.ALLANTOIN, notes: 'Apaisante et réparatrice',},
    ],
  },
]
