import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const DERMACLAY_SEED: UnifiedProductSeed[] = [
  {
    slug: 'dermaclay-shampoing-traitant-bio-anti-chute-argile-blanche-250ml-233791',
    name: 'Dermaclay Shampoing Traitant Bio Anti-Chute Argile Blanche 250ml',
    brand: 'Dermaclay',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 1224,
    description: '',
    notes: '',
    inci: "WATER - SALVIA OFFICINALIS FLOWER/LEAF/STEM WATER* - COCAMIDOPROPYL BETAINE - GLYCERIN - DISODIUM COCOAMPHODIACETATE - KAOLIN - COCOGLUCOSIDE - GLYCERYL OLEATE - BENZYL ALCOHOL - SODIUM COCOYL GLUTAMATE - GLYCERYL LAURATE - DICAPRYLYL ETHER - LAURYL ALCOHOL - SODIUM CHLORIDE - CITRIC ACID - DEHYDROACETIC ACID - CITRUS SINENSIS PEEL OIL* - ROSMARINUS OFFICINALIS FLOWER OIL* - URTICA DIOICA LEAF EXTRACT* - ALCOHOL** - CYAMOPSIS TETRAGONOLOBA GUM* - MELALEUCA ALTERNIFOLIA LEAF OIL* - HYDROLIZED WHEAT PROTEIN - CAPSICUM FRUTESCENS FRUIT EXTRACT* - SODIUM BENZOATE - POTASSIUM SORBATE - LIMONENE***  *Ingrédients issus de l’agriculture biologique **Transformés à partir d’ingrédients biologiques ***Composants naturels des huiles essentielles  99% du total des ingrédients sont d’origine naturelle 99,9% du total des ingrédients végétaux sont certifiés biologiques 10,3% du total des ingrédients sont issus de l’agriculture biologique  Pour plus d'informations : Alcool Benzylique, Acide déhydroacétique, Benzoate de sodium, Sobrate de potassium : assurent la bonne conservation du produit Chlorure de sodium : épaississant, assure une bonne viscosité du produit Acide citrique : ajusteur de pH Alcool : facilite la pénétration d'actif  Gomme de guar : stabilise la formule",
    url: 'https://www.atida.fr/dermaclay-shampooing-bio-anti-chute-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/774aaabf-9c14-45d0-b433-8f6e0d673f27/Dermaclay-Shampoing-Traitant-Bio-Anti-Chute-Argile-Blanche-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'glycerin-hair' },
      { slug: 'kaolin-hair' },
      { slug: 'coco-glucoside' },
      { slug: 'sodium-cocoyl-glutamate' },
      { slug: 'hydrolyzed-wheat-protein' },
      { slug: 'tea-tree-oil-hair' },
    ],
  },
]
