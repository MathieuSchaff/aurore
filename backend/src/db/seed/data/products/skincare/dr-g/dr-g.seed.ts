import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const DR_G_SEED: UnifiedProductSeed[] = [
  {
    slug: 'drg-red-blemish-cica-soothing-cream',
    name: 'R.E.D Blemish Cica Soothing Cream',
    brand: 'Dr.G',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 70,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Crème apaisante Cica pour peaux sensibles, irritées ou à imperfections (rougeurs, boutons).',
    notes:
      'Occlusion 6.5/10. Texture crème légère. 5-Cica Complex (centella multi-formes) + niacinamide + panthenol.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, C13-16 ISOPARAFFIN, NIACINAMIDE, C12-14 ISOPARAFFIN, 1,2-HEXANEDIOL, HYDROGENATED POLYDECENE, PENTYLENE GLYCOL, VINYL DIMETHICONE, CAPRYLYL METHICONE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, PANTHENOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, DIMETHICONOL, POLYMETHYLSILSESQUIOXANE, TROMETHAMINE, DIPOTASSIUM GLYCYRRHIZATE, GLYCERYL ACRYLATE/ACRYLIC ACID COPOLYMER, ETHYLHEXYLGLYCERIN, XANTHAN GUM, DISODIUM EDTA, BETA-GLUCAN, CENTELLA ASIATICA EXTRACT, MADECASSOSIDE, PYRUS MALUS (APPLE) FRUIT EXTRACT, EPIGALLOCATECHIN GALLATE, ASIATICOSIDE, ASIATIC ACID, MADECASSIC ACID',
    url: 'https://dr-g.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CENTELLA_COMPLEX,
        notes: '5-Cica Complex pour apaiser les inflammations',
      },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclat et régulation du sébum' },
      {
        slug: INGREDIENT_SLUGS.BETA_GLUCAN,
        notes: 'Hydratation supérieure à l’acide hyaluronique',
      },
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Apaisant (Vitamine B5)' },
    ],
  },
]
