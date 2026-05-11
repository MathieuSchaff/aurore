import { DENTAL_PRODUCT_TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const BAUSCH___LOMB_SEED: UnifiedProductSeed[] = [
  {
    slug: 'bausch-lomb-bloxaphte-gel-junior-aphtes-et-lesions-buccales-15ml-284052',
    name: 'Bausch & Lomb Bloxaphte Gel Junior Aphtes et Lésions Buccales 15ml',
    brand: 'Bausch & Lomb',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 15,
    amountUnit: 'ml',
    priceCents: 777,
    description: '',
    notes: '',
    inci: "Eau, xylitol, glycérine, extrait de pétale de rose de Damas, gomme xanthane, polycarbophile, hydroxide de sodium, hyaluronate de sodium, pectine, sorbate de potassium, benzoate de sodium, stévia, panthénol, arôme naturel de fruits rouges, extrait de feuilles d'Aloe vera.",
    url: 'https://www.atida.fr/bausch-lomb-bloxaphte-gel-junior-aphtes-et-lesions-buccales-15ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/bausch-lomb-bloxaphte-gel-junior-aphtes-et-lesions-buccales-15ml-284052.webp',
    tags: {
      primary: [DENTAL_PRODUCT_TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'xylitol-dental' }],
  },
]
