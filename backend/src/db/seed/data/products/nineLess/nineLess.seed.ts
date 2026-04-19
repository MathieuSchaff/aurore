import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

export const NINE_LESS_SEED: UnifiedProductSeed[] = [
  {
    slug: 'nine-less-a-control-10-azelaic-acid-serum',
    name: 'A-Control 10% Azelaic Acid Serum',
    brand: 'Nine Less',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1158,
    description: `Sérum budget 10% acide azélaïque + mucine d'escargot + peptide + 3x centella. Réduit imperfections, hydrate, régénère.`,
    notes: 'Meilleur budget : prix imbattable, mucine escargot boost collagène, peptide anti-âge. Attention acide lactique + saule (légers exfoliants, introduire progressivement avec rétinal).',
    inci: 'WATER, AZELAIC ACID (10%), GLYCERETH-26, GLYCERIN, DIPROPYLENE GLYCOL, NIACINAMIDE, BUTYLENE GLYCOL, 1,2-HEXANEDIOL, PANTHENOL, CENTELLA ASIATICA LEAF EXTRACT, CENTELLA ASIATICA EXTRACT, CENTELLA ASIATICA ROOT EXTRACT, LACTIC ACID, PROPANEDIOL, POLYGLYCERYL-10 LAURATE, CELLULOSE GUM, SODIUM POLYACRYLATE, DISODIUM EDTA, SNAIL SECRETION FILTRATE, DECYL GLUCOSIDE, SALIX ALBA (WILLOW) BARK EXTRACT, CLADOSIPHON OKAMURANUS EXTRACT, CAMELLIA SINENSIS LEAF EXTRACT, ASIATIC ACID, ASIATICOSIDE, ACETYL HEXAPEPTIDE-8, MADECASSIC ACID, MADECASSOSIDE, COFFEA ARABICA (COFFEE) SEED EXTRACT, CITRUS AURANTIUM BERGAMIA (BERGAMOT) LEAF EXTRACT, PINUS DENSIFLORA LEAF EXTRACT',
    url: 'https://www.yesstyle.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.POST_ACNE],
      secondary: [TAG_SLUGS.SERUM, TAG_SLUGS.TRAITEMENT, TAG_SLUGS.TEXTURE_LEGERE],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        notes: '10% acide azélaïque – anti-imperfections, anti-rougeurs, éclaircissant',},
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Régulateur de sébum, barrière, éclaircissant',},
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: '3 extraits + madecassoside, asiaticoside – apaisant puissant',},
      {
        slug: INGREDIENT_SLUGS.SNAIL_MUCIN,
        notes: `Mucine d'escargot – hydratant, régénérant, boost collagène`,},
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID, notes: 'Exfoliant doux (AHA)',},
      { slug: INGREDIENT_SLUGS.ARGIRELINE, notes: 'Peptide anti-âge',},
    ],
  },
]
