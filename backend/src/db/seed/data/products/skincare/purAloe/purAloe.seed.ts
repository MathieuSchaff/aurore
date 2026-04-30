import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const PUR_ALO__SEED: UnifiedProductSeed[] = [
  {
    slug: 'pur-aloe-gel-douche-aloe-vera-20-bio-500ml-265967',
    name: 'Pur Aloé Gel Douche Aloé Vera 20% Bio 500ml',
    brand: 'Pur Aloé',
    kind: 'body-wash',
    unit: 'pump',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1773,
    description: '',
    notes: '',
    inci: "Aqua, *aloe barbadensis leaf juice, glycerin, coco betaine, coco-glucoside, xanthan gum, benzyl alcohol, citric acid, dehydroacetic acid, propanediol, *litsea cubeba fruit oil, *citrus limon peel oil, ascorbic acid, citral, limonene.20% du total des ingrédients sont issus de l'Agriculture Biologique, 98% du total des ingrédients sont d'origine naturelle.",
    url: 'https://www.atida.fr/pur-aloe-gel-douche-aloe-vera-80-bio-250ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/pur-aloe-gel-douche-aloe-vera-20-bio-500ml-265967.webp',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.APAISANT, TAG_SLUGS.ECLAT],
      secondary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.NETTOYANT_CORPS, TAG_SLUGS.ZONE_CORPS],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'pur-aloe-gel-douche-aloe-vera-20-bio',
    name: 'Gel Douche Aloé Vera 20% Bio',
    brand: 'Pur Aloé',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1773,
    description: '',
    notes: '',
    inci: 'AQUA, *ALOE BARBADENSIS LEAF JUICE, GLYCERIN, COCO BETAINE, COCO-GLUCOSIDE, XANTHAN GUM, BENZYL ALCOHOL, CITRIC ACID, DEHYDROACETIC ACID, PROPANEDIOL, *LITSEA CUBEBA FRUIT OIL, *CITRUS LIMON PEEL OIL, ASCORBIC ACID, CITRAL, LIMONENE',
    url: 'https://www.atida.fr/pur-aloe-gel-douche-aloe-vera-80-bio-250ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/pur-aloe-gel-douche-aloe-vera-20-bio.webp',
    tags: {
      primary: ['anti-age', 'apaisant', 'hydratation'],
      secondary: ['nettoyant-corps', 'zone-corps'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.PROPANEDIOL }],
  },
]
