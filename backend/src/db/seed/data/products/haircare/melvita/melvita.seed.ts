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
  },
  {
    slug: 'melvita-les-essentiels-shampoing-douche-extra-doux-bio-1l-259310',
    name: 'Melvita Les Essentiels Shampoing Douche Extra-Doux Bio 1L',
    brand: 'Melvita',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1231,
    description: '',
    notes: '',
    inci: "Aqua/water - glycerin - ammonium lauryl sulfate - cocamidopropyl betaine - hordeum vulgare extract* - decyl glucoside - caprylyl/capryl glucoside - actinidia chinensis (kiwi) fruit water - ficus carica (fig) fruit water* - lavandula hybrida oil* - citrus aurantium dulcis (orange) oil* - arginine - inulin – levulinic acid - sodium levulinate - lactic acid - caramel – potassium sorbate - sodium benzoate - benzoic acid - limonene** - linalool**.*ingrédients issus de l'agriculture biologique / ingredients from organic farming ** constituants naturels des huiles essentielles / natural components of essential oils",
    url: 'https://www.atida.fr/melvita-les-essentiels-shampooing-douche-extradoux-1l.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/melvita-les-essentiels-shampoing-douche-extra-doux-bio-1l-259310.webp',
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
