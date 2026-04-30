import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const GABRIEL_COUZIAN_SEED: UnifiedProductSeed[] = [
  {
    slug: 'gabriel-couzian-bain-romain-huile-lavante-reparatrice-flacon-pompe',
    name: 'Bain Romain Huile Lavante Réparatrice Flacon Pompe',
    brand: 'Gabriel Couzian',
    kind: 'body-wash',
    unit: 'pump',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 2424,
    description: '',
    notes: '',
    inci: 'MIPA-LAURETH SULFATE, LAURETH 4, COCAMIDE DEA, PARAFFINUM LIQUIDUM (MINERAL OIL), AQUA (WATER), SODIUM LAURYL CARBOXYLATE, LAURYL GLUCOSIDE, PEG 6 CAPRYLIC/CAPRIC GLYCERIDES, DECYL GLUCOSIDE, OLEA EUROPAEA (OLIVE OIL) FRUIT OIL, HYPERICUM PERFORATUM EXTRACT, TOCOPHEROL, GLYCERIN, PARFUM (FRAGRANCE), HYDROLYZED WHEAT PROTEIN, UREA, GLUCONOLACTONE, SODIUM BENZOATE, ALOE BARBADENSIS LEAF JUICE, CALCIUM GLUCONATE, SORBIC ACID',
    url: 'https://www.atida.fr/gabriel-couzian-bain-romain-huile-reparatrice-400ml.html',
    imageUrl:
      'https://assets.atida.com/transform/41d4375d-53f0-4a2f-827f-75bd6f3201ce/Gabriel-Couzian-Bain-Romain-Huile-Lavante-Reparatrice-Flacon-Pompe-400ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['hydratation', 'apaisant', 'anti-oxydant', 'cicatrisation'],
      secondary: ['reparateur', 'keratolytique', 'peau-sensible', 'nettoyant-corps', 'zone-corps'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.UREA }, { slug: INGREDIENT_SLUGS.ALOE_VERA }],
  },
]
