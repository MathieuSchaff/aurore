import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LA_ROCHE_POSAY_HAIRCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-roche-posay-kerium-shampoing-apaisant-gel-physiologique',
    name: 'Kerium Shampoing Apaisant Gel-physiologique',
    brand: 'La Roche Posay',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 1147,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM LAURETH SULFATE, POLYSORBATE 20, PEG-200 HYDROGENATED GLYCERYL PALMATE, GLYCERIN, SODIUM CHLORIDE, COCAMIDOPROPYL BETAÏNE, COCAMIDE MEA, CITRIC ACID, HEXYLENE GLYCOL, ALCOHOL, PEG-7 GLYCERYL COCOATE, POLYQUATERNIUM-10, SALICYLIC ACID, SODIUM ACETATE, SODIUM BENZOATE, SODIUM HYDROXIDE, PARFUM, FRAGRANCE',
    url: 'https://www.atida.fr/la-roche-posay-kerium-shampooing-gel-physiologique-400ml.html',
    imageUrl:
      'https://assets.atida.com/transform/a6f29ab9-3872-408a-8f9c-6e3cd7200b70/La-Roche-Posay-Kerium-Shampoing-Apaisant-Gel-Physiologique-400ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
    ],
  },
  {
    slug: 'la-roche-posay-kerium-ds-shampoing-antipelliculaire-pellicules-persistantes',
    name: 'Kerium DS Shampoing Antipelliculaire Pellicules Persistantes',
    brand: 'La Roche Posay',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 125,
    amountUnit: 'ml',
    priceCents: 1710,
    description: '',
    notes: '',
    inci: 'AQUA / WATER / EAU, SODIUM LAURETH SULFATE, COCAMIDE MEA, GLYCERIN, CAPRYLOYL GLYCINE, COCO-BETAINE, LAURETH-5 CARBOXYLIC ACID, SALICYLIC ACID, COCAMIDE MIPA, SODIUM HYDROXIDE, PIROCTONE OLAMINE, ISOPROPYL MYRISTATE, CAPRYLOYL SALICYLIC ACID, HEXYLENE GLYCOL, NIACINAMIDE, PEG-55 PROPYLENE GLYCOL OLEATE, POLYQUATERNIUM-10, PROPYLENE GLYCOL, SODIUM BENZOATE, SODIUM CHLORIDE, PARFUM / FRAGRANCE (F.I.L, N70016807/1)',
    url: 'https://www.atida.fr/la-roche-posay-kerium-ds-125ml.html',
    imageUrl:
      'https://assets.atida.com/transform/f85018af-aea5-47ac-83d7-67ef099180ea/La-Roche-Posay-Kerium-Shampoing-Antipelliculaire-Pellicules-Persistantes-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.COCO_BETAINE },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE },
      { slug: INGREDIENT_SLUGS.CAPRYLOYL_SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE },
    ],
  },
  {
    slug: 'la-roche-posay-kerium-shampoing-antipelliculaire-cheveux-gras',
    name: 'Kerium Shampoing Antipelliculaire Cheveux Gras',
    brand: 'La Roche Posay',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 1467,
    description: '',
    notes: '',
    inci: 'AQUA / WATER, SODIUM LAURETH SULFATE, COCAMIDOPROPYL BETAINE, COCAMIDE MIPA, GLYCERIN, SODIUM CHLORIDE, CAPRYLOYL GLYCINE, CAPRYLOYL SALICYLIC ACID, CITRIC ACID, GLYCERYL LAURATE, HEXYLENE GLYCOL, IODOPROPYNYL BUTYLCARBAMATE, ISOPROPYL ALCOHOL, PEG-4, PEG-4 DILAURATE, PEG-4 LAURATE, PIROCTONE OLAMINE, POLYQUATERNIUM-10, SALICYLIC ACID, SODIUM ACETATE, SODIUM BENZOATE, SODIUM HYDROXIDE, ZINC PCA, PARFUM / FRAGRANCE (F.I.L, C206747/1)',
    url: 'https://www.atida.fr/la-roche-posay-kerium-pellicules-grasses-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/2ae157cd-4d57-4d74-8c4d-ed51f831fc5e/La-Roche-Posay-Kerium-Shampoing-Antipelliculaire-Cheveux-Gras-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SLES_HAIR },
      { slug: INGREDIENT_SLUGS.CAPRYLOYL_SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.ZINC_PCA },
    ],
  },
]
