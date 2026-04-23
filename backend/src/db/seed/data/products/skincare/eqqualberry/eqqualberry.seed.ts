import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const EQQUALBERRY_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eqqualberry-swimming-pool-daily-facial-toner',
    name: 'Swimming Pool Daily Facial Toner',
    brand: 'EQQUALBERRY',
    kind: 'toner',
    unit: 'pump',
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 1517,
    description:
      'Tonique quotidien hypoallergénique exfolie doucement (protéase), hydrate (8 HA), apaise avec 5 baies antioxydantes.',
    notes:
      'EWG green, sans alcool/parabènes/benzène. Texture légère, tous types (idéal sensible/texturée).',
    inci: 'WATER, BUTYLENE GLYCOL, GLYCERIN, PROPANEDIOL, 1,2-HEXANEDIOL, PROTEASE, BETAINE, PANTHENOL, XANTHAN GUM, ALLANTOIN, EUTERPE OLERACEA FRUIT EXTRACT, SODIUM HYALURONATE, BETA-GLUCAN, RUBUS FRUTICOSUS (BLACKBERRY) FRUIT, VACCINIUM MACROCARPON (CRANBERRY) FRUIT, VACCINIUM ANGUSTIFOLIUM (BLUEBERRY) FRUIT, RUBUS IDAEUS (RASPBERRY) FRUIT EXTRACT, SAMBUCUS NIGRA FRUIT EXTRACT, PENTYLENE GLYCOL, CAPRYLYL GLYCOL, FRUCTAN, STYRENE/VP COPOLYMER',
    url: 'https://eqqualberryglobal.com',
    tags: {
      primary: [TAG_SLUGS.EXFOLIATION, TAG_SLUGS.PORES_DILATES],
      secondary: [
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.PREPARATION,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.PROTEASE,
        notes: 'Enzyme protéase — exfoliation douce sans irritation (alternative AHA/BHA)',
      },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: '8 formes HA — hydratation profonde' },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.ALLANTOIN },
      { slug: INGREDIENT_SLUGS.BETA_GLUCAN },
    ],
  },
]
