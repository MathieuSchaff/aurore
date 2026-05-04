import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

// Items "environnement" (spray surfaces + additif lessive) retirés du domaine
// haircare : biocide ménager, hors scope soin du quotidien.
export const CINQ_SUR_CINQ_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cinq-sur-cinq-baume-decolleur-de-lentes-60ml-284064',
    name: 'Cinq sur Cinq Baume Décolleur de Lentes 60ml',
    brand: 'Cinq Sur Cinq',
    kind: 'styling',
    unit: 'bottle',
    totalAmount: 60,
    amountUnit: 'ml',
    priceCents: 1212,
    description: '',
    notes: '',
    inci: '',
    url: 'https://www.atida.fr/cinq-sur-cinq-baume-decolleur-de-lentes-60ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/cinq-sur-cinq-baume-decolleur-de-lentes-60ml-284064.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'cinq-sur-cinq-anti-poux-lentes-spray-repulsif-100ml-284087',
    name: 'Cinq sur Cinq Anti Poux & Lentes Spray Répulsif 100ml',
    brand: 'Cinq Sur Cinq',
    kind: 'styling',
    unit: 'spray',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 921,
    description: '',
    notes: '',
    inci: "Huile d'eucalyptus citriodora (hydratée, cylisée) (CAS1245629-80-4; 1.5g/100g).",
    url: 'https://www.atida.fr/cinq-sur-cinq-anti-poux-et-lentes-repulsif-spray-100ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/cinq-sur-cinq-anti-poux-lentes-spray-repulsif-100ml-284087.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'cinq-sur-cinq-shampooing-gel-anti-poux-et-lentes-400ml-284073',
    name: 'Cinq sur Cinq Shampooing Gel Anti-Poux et Lentes 400ml',
    brand: 'Cinq Sur Cinq',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 1551,
    description: '',
    notes: '',
    inci: 'Aqua, Sodium ; Laureth Sulfate, Cocamidopropyl Betaine, Cocos nucifera oil, Cocamide MEA, Tocopheryl Acetate, Methylchloroisoothiazolinone, Methulospthiazolinone, Citric Acid.',
    url: 'https://www.atida.fr/cinq-sur-cinq-shampooing-anti-poux-et-lentes-400ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/cinq-sur-cinq-shampooing-gel-anti-poux-et-lentes-400ml-284073.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING,
        HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sles-hair' },
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'coconut-oil-hair' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
