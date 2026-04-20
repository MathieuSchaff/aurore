import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

export const BYOMA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'byoma-blemish-control-body-lotion',
    name: 'Blemish Control Body Lotion',
    brand: 'BYOMA',
    kind: 'body-lotion',
    unit: 'pump',
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 2000,
    description: 'Lotion corporelle légère anti-imperfections avec acide salicylique pour désobstruer les pores, réduire les rougeurs et lisser la texture de la peau.',
    notes: 'Contient BHA (salicylic acid), céramide NP et phytosphingosine pour soutenir la barrière cutanée, bakuchiol et antioxydants (vitamine E, rutin). Huiles nourrissantes de carthame et soja.',
    inci: 'WATER, CETEARYL ALCOHOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLYCERIN, HAMAMELIS VIRGINIANA WATER, GLYCERYL STEARATE SE, GLYCINE SOJA OIL, ETHYL LINOLEATE, CARTHAMUS TINCTORIUS SEED OIL, PHENOXYETHANOL, AMMONIUM POLYACRYLOYLDIMETHYL TAURATE, SALICYLIC ACID, SODIUM HYDROXIDE, ETHYLHEXYLGLYCERIN, TOCOPHEROL, PHYTOSPHINGOSINE, CERAMIDE NP, BAKUCHIOL, PROPANEDIOL, RUTIN, HYDROXYCINNAMIC ACID',
    url: 'https://www.byoma.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE],
      secondary: [
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.LAIT_CORPS,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.NON_COMEDOGENE,
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
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA – désobstrue pores, anti-acné corporelle',},
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Céramide NP – renforce barrière cutanée',},
      { slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE, notes: 'Lipide biomimétique – soutien barrière',},
      { slug: INGREDIENT_SLUGS.BAKUCHIOL, notes: 'Bakuchiol – rétinol-like, anti-imperfections',},
      { slug: INGREDIENT_SLUGS.TOCOPHEROL, notes: 'Vitamine E – antioxydant',},
      { slug: INGREDIENT_SLUGS.GLYCERIN },
    ],
  },
]
