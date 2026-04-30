import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const VICHY_HOMME_SEED: UnifiedProductSeed[] = [
  {
    slug: 'vichy-homme-gel-douche-corps-cheveux-hydra-mag-c-200ml-299448',
    name: 'Vichy Homme Gel Douche Corps & Cheveux Hydra Mag C 200ml',
    brand: 'Vichy Homme',
    kind: 'body-wash',
    unit: 'pump',
    totalAmount: 1,
    amountUnit: 'unité',
    priceCents: 846,
    description: '',
    notes: '',
    inci: 'Aqua / water, sodium laureth sulfate, glycerin, coco-betaine, laureth-11 carboxylic acid, parfum / fragrance, sodium chloride, ascorbyl glucoside, ci 14700 / red 4, ci 19140 / yellow 5, citric acid, disodium laureth sulfosuccinatemagnesium gluconate, polyquaternium-10, ppg-5-ceteth-20, salicylic acidsodium benzoate, sodium hydroxide (f.i.l. c35846/1).',
    url: 'https://www.atida.fr/vichy-homme-hydra-mag-c-200ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/vichy-homme-gel-douche-corps-cheveux-hydra-mag-c-200ml-299448.webp',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.EXFOLIATION],
      secondary: [
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.SEBO_REGULATEUR,
        TAG_SLUGS.KERATOLYTIQUE,
        TAG_SLUGS.NETTOYANT_CORPS,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
      ],
      avoid: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.PEAU_ATOPIQUE],
    },
    keyIngredients: [],
  },
  {
    slug: 'vichy-homme-gel-douche-corps-cheveux-hydra-mag-c',
    name: 'Gel Douche Corps & Cheveux Hydra Mag C',
    brand: 'Vichy Homme',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 846,
    description: '',
    notes: '',
    inci: 'AQUA / WATER, SODIUM LAURETH SULFATE, GLYCERIN, COCO-BETAINE, LAURETH-11 CARBOXYLIC ACID, PARFUM / FRAGRANCE, SODIUM CHLORIDE, ASCORBYL GLUCOSIDE, CI 14700 / RED 4, CI 19140 / YELLOW 5, CITRIC ACID, DISODIUM LAURETH SULFOSUCCINATEMAGNESIUM GLUCONATE, POLYQUATERNIUM-10, PPG-5-CETETH-20, SALICYLIC ACIDSODIUM BENZOATE, SODIUM HYDROXIDE (F.I.L, C35846/1)',
    url: 'https://www.atida.fr/vichy-homme-hydra-mag-c-200ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/vichy-homme-gel-douche-corps-cheveux-hydra-mag-c.webp',
    tags: {
      primary: ['anti-acne', 'hydratation'],
      secondary: ['sebo-regulateur', 'nettoyant-corps', 'zone-corps'],
      avoid: ['peau-sensible', 'peau-reactive', 'peau-atopique'],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE }],
  },
]
