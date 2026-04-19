import { TAG_SLUGS } from '../../tags/seed-tags'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../unified-types'

export const IM_FROM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'im-from-rice-toner',
    name: 'Rice Toner',
    brand: `I'm From`,
    kind: 'toner',
    unit: 'pump',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 2170,
    description: 'Tonique au riz goami 77.78% + niacinamide. Anti-rides, illumine, nourrit peaux sèches/fatiguées.',
    notes: 'Extrait de riz + son de riz + amaranthus + portulaca. Hydratant/apaisant, tous types (idéal sensible).',
    inci: 'ORYZA SATIVA (RICE) EXTRACT, METHYLPROPANEDIOL, TRIETHYLHEXANOIN, HYDROGENATED POLY(C6-14 OLEFIN), NIACINAMIDE, PENTYLENE GLYCOL, PORTULACA OLERACEA EXTRACT, ORYZA SATIVA (RICE) BRAN EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, AMARANTHUS CAUDATUS SEED EXTRACT, HYDROGENATED LECITHIN, WATER, POLYGLYCERYL-10 MYRISTATE, BUTYLENE GLYCOL, ADENOSINE, CELLULOSE GUM, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://imfrom.co.kr',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.TEINT_TERNE],
      secondary: [
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.PREPARATION,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ORYZA_SATIVA, notes: '77.78% extrait de riz Goami — hydratant, anti-rides, illumine',},
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclaircissant, barrière, régulateur sébum',},
      { slug: INGREDIENT_SLUGS.PORTULACA_OLERACEA, notes: 'Extrait de pourpier — apaisant',},
      { slug: INGREDIENT_SLUGS.AMARANTHUS_CAUDATUS, notes: `Graines d'amarante — nourrissant`,},
      { slug: INGREDIENT_SLUGS.ADENOSINE, notes: 'Anti-âge',},
    ],
  },
]
