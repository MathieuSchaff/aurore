import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const SEBAMED_SEED: UnifiedProductSeed[] = [
  {
    slug: 'sebamed-shampooing',
    name: 'Shampooing',
    brand: 'Sebamed',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1060,
    description:
      'Le Shampooing Everyday de SEBAMED discount, la solution ultra-douce et haute tolérance dans votre parapharmacie à prix discount, pour laver en douceur les cheveux de toute la famille au quotidien.\n\nLe Shampooing Everyday est un soin d’hygiène à la formule haute tolérance, spécialement conçu pour nettoyer en douceur les cheveux même les plus sensibles. Il associe un complexe d’actifs d’origine végétale à un pH de 5,5 qui respectent l’équilibre physiologique du cheveu et du cuir chevelu, protège de la perte en eau et en lipide, soulage les irritations et hydrate en profondeur. Après le shampooing, la chevelure hydratée retrouve vitalité, douceur et volume.',
    notes: '',
    inci: 'AQUA, DECYL GLUCOSIDE, DISODIUM LAURETH SULFOSUCCINATE, SODIUM LAURYL SULFOACETATE, PEG-55 PROPYLENE GLYCOL OLEATE, PROPYLENE GLYCOL, HYDROXYPROPYL OXIDIZED STARCH PG-TRIMONIUM CHLORIDE, CITRIC ACID, PARFUM, PHENOXYETHANOL, SODIUM BENZOATE',
    url: 'https://www.pharmashopdiscount.com/fr/visage-et-corps/par-produits/bain-et-douche/sebamed-shampooing-1l.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/sebamed-shampooing.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_TOUS_TYPES,
        HAIRCARE_PRODUCT_TAG_SLUGS.CUIR_CHEVELU_SENSIBLE,
        HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE,
      ],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.DISODIUM_LAURETH_SULFOSUCCINATE }],
  },
]
