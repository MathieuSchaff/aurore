import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const POUXIT_SEED: UnifiedProductSeed[] = [
  {
    slug: 'pouxit-spray-preventif-anti-poux-sans-rincage-200ml-272691',
    name: 'Pouxit Spray Préventif Anti-poux Sans Rinçage 200ml',
    brand: 'Pouxit',
    kind: 'conditioner',
    unit: 'spray',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 890,
    description: '',
    notes: '',
    inci: '1,2-dihydroxyoctane 1%(Protectdiol®); PEG-6 caprylic/capric glycerides; PEG-12 dimethicone; carbomer; sodium hydroxide; eau.',
    url: 'https://www.atida.fr/pouxit-protect-200ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pouxit-spray-preventif-anti-poux-sans-rincage-200ml-272691.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.LEAVE_IN,
        HAIRCARE_PRODUCT_TAG_SLUGS.SOIN_SANS_RINCAGE,
        HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'dimethicone-hair', notes: 'physical lice prevention via silicone coating' },
    ],
  },
  {
    slug: 'pouxit-lotion-spray-anti-poux-et-lentes-100-efficace-150ml-238892',
    name: 'Pouxit Lotion Spray Anti-poux et Lentes 100% efficace 150ml',
    brand: 'Pouxit',
    kind: 'shampoo',
    unit: 'spray',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 1745,
    description: '',
    notes: '',
    inci: 'Diméticone (80% m/v), adipate de diisopropyle, sébacate de diisopropyle, alcool laurique, acétate de tocophéryle.',
    url: 'https://www.atida.fr/pouxit-flash-lotion-spray-anti-poux-et-lentes-150ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pouxit-lotion-spray-anti-poux-et-lentes-100-efficace-150ml-238892.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'dimethicone-hair', notes: 'physical pediculicide at 80% concentration' },
      { slug: 'tocopherol-hair' },
    ],
  },
  {
    slug: 'pouxit-xf-lotion-anti-poux-et-lentes-100-efficace-lot-de-2x-200ml-279559',
    name: 'Pouxit XF Lotion Anti-poux et Lentes 100% efficace Lot de 2x 200ml',
    brand: 'Pouxit',
    kind: 'shampoo',
    unit: 'pack',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 3073,
    description: '',
    notes: '',
    inci: 'Dimeticone, penetrol®',
    url: 'https://www.atida.fr/pouxit-extra-fort-lotion-traitement-anti-poux-et-lentes-du-cuir-chevelu-lot-2x200-ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pouxit-xf-lotion-anti-poux-et-lentes-100-efficace-lot-de-2x-200ml-279559.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU],
      avoid: [],
    },
    keyIngredients: [{ slug: 'dimethicone-hair', notes: 'physical pediculicide via asphyxiation' }],
  },
  {
    slug: 'pouxit-xf-lotion-anti-poux-et-lentes-100-efficace-200ml-263881',
    name: 'Pouxit XF Lotion Anti-poux et Lentes 100% efficace 200ml',
    brand: 'Pouxit',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 2036,
    description: '',
    notes: '',
    inci: 'Dimeticone (4%); 1,6,10-Dodecatrien-3-ol,3,7,11-triméthyl ; PEG/PPG Dimeticone co-polymer; Silica Silylate.',
    url: 'https://www.atida.fr/pouxit-xf-anti-poux-et-lentes-200ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pouxit-xf-lotion-anti-poux-et-lentes-100-efficace-200ml-263881.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: 'dimethicone-hair',
        notes: 'physical pediculicide; low concentration paired with nerolidol penetrant',
      },
    ],
  },
  {
    slug: 'pouxit-baume-decolleur-de-lentes-100g-268020',
    name: 'Pouxit Baume décolleur de lentes 100g',
    brand: 'Pouxit',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'g',
    priceCents: 943,
    description: '',
    notes: '',
    inci: 'Aqua, Isononyl isononanoate, Sodium acrylate/sodium acryloyldimethyl taurate copolymer, Phenoxyethanol, Ethylhexyl- glycerin',
    url: 'https://www.atida.fr/pouxit-baume-decolleur-de-lentes-100g.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/pouxit-baume-decolleur-de-lentes-100g-268020.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.POUX],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU],
      avoid: [],
    },
    keyIngredients: [],
  },
]
