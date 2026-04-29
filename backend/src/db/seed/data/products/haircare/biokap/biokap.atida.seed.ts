import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const BIOKAP_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'biokap-shampoing-anti-pelliculaire',
    name: 'Shampoing Anti-pelliculaire',
    brand: 'Biokap',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 1115,
    description: '',
    notes: '',
    inci: "AQUA/WATER, SODIUM COCO-SULFATE, COCO-GLUCOSIDE, ALOE BARBADENSIS LEAF JUICE*, GLYCERIN, LACTIC ACID, MENTHOL, SALIX ALBA BARK (WILLOW) EXTRACT, OPUNTIA COCCINELLIFERA FLOWER EXTRACT, AGAVE RIGIDA (SISAL) EXTRACT, PIROCTONE OLAMINE, HYDROLYZED WHEAT PROTEIN, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, SALICYLIC ACID, ALUMINIUM CHLORHYDRATE, ALLANTOIN, CITRIC ACID, HELICHRYSUM ITALICUM EXTRACT, RIBES NIGRUM (BLACK CURRANT) LEAF EXTRACT*, ROSMARINUS OFFICINALIS (ROSEMARY) LEAF OIL*, MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF OIL*, GLYCERYL OLEATE, DISODIUM COCOYL GLUTAMATE, PARFUM/FRAGRANCE, SODIUM COCOYL GLUTAMATE, HEPTYL GLUCOSIDE, HEPTANOL, SODIUM BENZOATE, POTASSIUM SORBATE, CI 75810/CHLOROPHYLLIN-COPPER COMPLEX. * INGRÉDIENT ISSU DE L'AGRICULTURE BIOLOGIQUE",
    url: 'https://www.atida.fr/biokap-shampoing-anti-pelliculaire-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/af29ae1e-ac7b-4618-b538-44ccd2098341/Biokap-Shampoing-Anti-Pelliculaire-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_COCO_SULFATE },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_WHEAT_PROTEIN },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.ALLANTOIN },
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_GLUTAMATE },
    ],
  },
]
