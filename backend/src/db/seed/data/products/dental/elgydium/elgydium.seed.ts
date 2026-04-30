import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const ELGYDIUM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'elgydium-blancheur-dentifrice-lot-de-2-x-75ml-265562',
    name: 'Elgydium Blancheur Dentifrice Lot de 2 x 75ml',
    brand: 'Elgydium',
    kind: 'toothpaste',
    unit: 'pack',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 805,
    description: '',
    notes: '',
    inci: 'Aqua, Glycerin, Silica, Sodium bicarbonate, Sodium laurylsulfate, Chondrus crispus, Aroma, CI 77891, Triethanolamine, Chlorhexidine digluconate, ydroxyéthylcellulose, Mentha piperita, Sodium saccharin.',
    url: 'https://www.atida.fr/elgydium-dentifrice-blancheur-lot-de-2-x-75ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/elgydium-blancheur-dentifrice-lot-de-2-x-75ml-265562.webp',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'sodium-bicarbonate-dental' }, { slug: 'chlorhexidine' }],
  },
  {
    slug: 'elgydium-fix-creme-fixative-extra-fort-45g-265259',
    name: 'Elgydium Fix Crème Fixative Extra-Fort 45g',
    brand: 'Elgydium',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 45,
    amountUnit: 'g',
    priceCents: 794,
    description: '',
    notes: '',
    inci: 'Paraffinum liquidum, calcium/sodium pvm/ma copolymer, cellulose gum, petrolatum, silica, aroma, menthyl lactate, colorant, tocopherol.',
    url: 'https://www.atida.fr/elgydium-fix-creme-fixative-extra-fort-45g.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/elgydium-fix-creme-fixative-extra-fort-45g-265259.webp',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'elgydium-classique-brosse-a-dents-dure-272935',
    name: 'Elgydium Classique Brosse à Dents Dure',
    brand: 'Elgydium',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 1,
    amountUnit: 'unité',
    priceCents: 329,
    description: '',
    notes: '',
    inci: 'Plastique, nylon.',
    url: 'https://www.atida.fr/elgydium-brosse-a-dents-classique-dure-grande-tete.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/elgydium-classique-brosse-a-dents-dure-272935.webp',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
]
