import { DENTAL_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const DENTAL_CARE_PRODUCTS_SEED: UnifiedProductSeed[] = [
  {
    slug: 'nitradine-ortho-junior-64-comprimes-effervescents-264747',
    name: 'Nitradine Ortho & Junior 64 comprimés effervescents',
    brand: 'Dental Care Products',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 64,
    amountUnit: 'comprimés',
    priceCents: 3879,
    description: '',
    notes: '',
    inci: 'Ingrédients : Citric Acid, Sodium Lauryl Sulfate, Lactose Monohydrate, Sodium Bicarbonate, Sodium Chloride, Potassium Monopersulfate, Sodium Carbonate, Peppermint Flavour, PVP.',
    url: 'https://www.atida.fr/nitradine-ortho-junior-64-comprimes-effervescents.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/nitradine-ortho-junior-64-comprimes-effervescents-264747.webp',
    tags: {
      primary: [DENTAL_PRODUCT_TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'sodium-bicarbonate-dental' }],
  },
  {
    slug: 'bonyf-bonyplus-fixobridge-kit-pour-la-fixation-temporaire-des-protheses-dentaires-7g-278782',
    name: 'Bonyf Bonyplus Fixobridge Kit pour la Fixation Temporaire des Prothèses Dentaires 7g',
    brand: 'Dental Care Products',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 7,
    amountUnit: 'g',
    priceCents: 2812,
    description: '',
    notes: '',
    inci: 'Ingrédients : Calcium Sulphate, Glycol Ether, Barium Sulphate, Zinc Oxide, Acrylic Polymer, Triacetin',
    url: 'https://www.atida.fr/bonyf-bonyplus-fixobridge-kit-pour-la-fixation-temporaire-des-protheses-dentaires-7g.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/bonyf-bonyplus-fixobridge-kit-pour-la-fixation-temporaire-des-protheses-dentaires-7g-278782.webp',
    tags: {
      primary: [DENTAL_PRODUCT_TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'bonyf-bonyplus-reparfix-pour-la-reparation-des-dentiers-271302',
    name: 'Bonyf Bonyplus Reparfix pour la Réparation des Dentiers',
    brand: 'Dental Care Products',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 2,
    amountUnit: 'g',
    priceCents: 4802,
    description: '',
    notes: '',
    inci: 'tube de colle : Ethyl Cyanoacrylate 2gfiole de liquide : Methyl Methacrylate, N, N-Dihydroxyethyl-p-toluidine 2,10mlfiole de poudre : Poly(methyl methacrylate) 1,80g',
    url: 'https://www.atida.fr/bonyf-bonyplus-reparfix-pour-la-reparation-des-dentiers.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/bonyf-bonyplus-reparfix-pour-la-reparation-des-dentiers-271302.webp',
    tags: {
      primary: [DENTAL_PRODUCT_TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
]
