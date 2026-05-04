import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const MELVITA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'melvita-les-essentiels-shampoing-douche-extra-doux-bio',
    name: 'Les Essentiels Shampoing Douche Extra-Doux Bio',
    brand: 'Melvita',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1231,
    description: '',
    notes: '',
    inci: 'AQUA/WATER - GLYCERIN - AMMONIUM LAURYL SULFATE - COCAMIDOPROPYL BETAINE - HORDEUM VULGARE EXTRACT* - DECYL GLUCOSIDE - CAPRYLYL/CAPRYL GLUCOSIDE - ACTINIDIA CHINENSIS (KIWI) FRUIT WATER - FICUS CARICA (FIG) FRUIT WATER* - LAVANDULA HYBRIDA OIL* - CITRUS AURANTIUM DULCIS (ORANGE) OIL* - ARGININE - INULIN – LEVULINIC ACID - SODIUM LEVULINATE - LACTIC ACID - CARAMEL – POTASSIUM SORBATE - SODIUM BENZOATE - BENZOIC ACID - LIMONENE** - LINALOOL',
    url: 'https://www.atida.fr/melvita-les-essentiels-shampooing-douche-extradoux-1l.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/melvita-les-essentiels-shampoing-douche-extra-doux-bio.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_TOUS_TYPES, HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'ammonium-lauryl-sulfate' },
      { slug: 'glycerin-hair' },
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'caprylyl-capryl-glucoside' },
      { slug: 'decyl-glucoside' },
    ],
  },
]
