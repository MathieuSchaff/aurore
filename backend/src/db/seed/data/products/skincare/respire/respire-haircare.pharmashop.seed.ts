import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const RESPIRE_HAIRCARE_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'respire-apres-shampooing-solide-bio',
    name: 'Apres Shampooing Solide BIO',
    brand: 'Respire',
    kind: 'conditioner',
    unit: 'bar',
    totalAmount: 50,
    amountUnit: 'g',
    priceCents: 1064,
    description: '',
    notes: '',
    inci: 'ARACHIDYL/BEHENYL ALCOHOL, ARACHIDYL/BEHENYL BETAINATE ESYLATE, HELIANTHUS ANNUUS SEED OIL, ZEA MAYS STARCH*, ARACHIDYL ALCOHOL, THEOBROMA CACAO SEED BUTTER*, BRASSICA OLERACEA ITALICA SEED OIL*, BEHENYL ALCOHOL, PARFUM, ARACHIDYL GLUCOSIDE, GLYCERIN*, TOCOPHEROL, CI 77492, CI 77491, COUMARIN, LINALOOL',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/respire/respire-apres-shampooing-solide-bio-50g.html',
    imageUrl: '',
    tags: {
      primary: ['apres-shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL },
      { slug: INGREDIENT_SLUGS.IRON_OXIDE },
    ],
  },
]
