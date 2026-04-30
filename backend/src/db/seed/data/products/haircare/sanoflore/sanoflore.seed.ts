import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const SANOFLORE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'sanoflore-veritable-eau-florale-lavande-200-ml-301936',
    name: 'Sanoflore Véritable Eau florale lavande - 200 ml',
    brand: 'Sanoflore',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 1018,
    description: '',
    notes: '',
    inci: "Lavandula Angustifolia Flower Water*, Benzyl Alcohol, Dehydroacetic Acid, Citric Acid, Arginine, Linalyl Acetate, Linalool, Aqua / Water - 4960104010 *Ingrédient issu de l'Agriculture Biologique",
    url: 'https://www.atida.fr/sanoflore-veritable-eau-florale-lavande-200-ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/sanoflore-veritable-eau-florale-lavande-200-ml-301936.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'arginine-hair', notes: 'pH buffer, minor functional role' }],
  },
]
