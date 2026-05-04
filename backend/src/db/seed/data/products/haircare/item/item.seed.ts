import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const ITEM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'item-alphacade-pso-shampoing-200ml-246853',
    name: 'Item Alphacade PSO Shampoing 200ml',
    brand: 'Item',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 812,
    description: '',
    notes: '',
    inci: 'aqua (water), sodium laureth sulfate, lauryl glucoside, caprylyl/capryl glucoside, cocamidopropyl betaine, salicylic acid, propylene glycol, citric acid, citrus grandis (grapefruit) fruit extract, peg-150 pentaerythrityl tetrastearate, sodium hydroxide, juniperus mexicana wood oil, peg-15 cocopolyamine, ppg-2 hydroxyethyl cocamide, juniperus oxycedrus wood oil, sodium citrate.',
    url: 'https://www.atida.fr/item-alphacade-pso-shampooing-200ml-2254763.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/item-alphacade-pso-shampoing-200ml-246853.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CUIR_CHEVELU_IRRITE,
        HAIRCARE_PRODUCT_TAG_SLUGS.PELLICULES,
        HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE,
        HAIRCARE_PRODUCT_TAG_SLUGS.REPARATION,
        HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sles-hair' },
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'salicylic-acid-hair' },
      { slug: 'caprylyl-capryl-glucoside' },
    ],
  },
]
