import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const PETROLE_HAHN_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'petrole-hahn-vert-lotion-tonique-force-5-vitalite-cheveux-normaux',
    name: 'Vert Lotion Tonique Force 5 Vitalité Cheveux Normaux',
    brand: 'Petrole Hahn',
    kind: 'toner',
    unit: 'bottle',
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 522,
    description: '',
    notes: '',
    inci: 'AQUA/WATER/EAU, ALCOHOL DENAT., C11-13 ISOPARAFFIN, LIMONENE, CITRUS AURANTIUM DULCIS (ORANGE) PEEL OIL, CITRUS AURANTIUM BERGAMIA (BERGAMOT) PEEL OIL, CITRUS LIMON (LEMON) PEEL OIL, PANTHENYL ETHYL ETHER, SODIUM CHLORIDE, LINALOOL, CITRUS AURANTIFOLIA (LIME) SEED OIL, CITRAL, PANTHENOL, CAMPHOR, CHLOROPHYLLIN-COPPER COMPLEX (CI 75810), BHT, GERANIOL, CITRONELLOL. (F01)',
    url: 'https://www.atida.fr/petrole-hahn-vert-lotion-tonique-force-5-vitalite-cheveux-normaux-300ml-32305.html',
    imageUrl:
      'https://assets.atida.com/transform/59214781-cf45-4359-8e39-be473b8ec89e/Petrole-Hahn-Vert-Lotion-Tonique-Force-5-Vitalite-Cheveux-Normaux-300ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'barriere-cutanee'],
      secondary: ['reparateur', 'tonique', 'preparation', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.CITRUS_AURANTIUM_DULCIS },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
    ],
  },
]
