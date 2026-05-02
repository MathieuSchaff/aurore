import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const SAUGELLA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'saugella-dermoliquide-soin-lavant-hygiene-intime-femmes-sauge-flacon',
    name: 'Dermoliquide Soin Lavant Hygiène Intime Femmes Sauge - Flacon',
    brand: 'Saugella',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 986,
    description: '',
    notes: '',
    inci: 'AQUA, TEA-LAURYL SULFATE, AMMONIUM LAURYL SULFATE, SALVIA OFFICINALS LEAF EXTRACT, KETOGLUTARIC ACID, LACTIC ACID, WHEY, PEG-2 STEARATE, HYDROGENATED COCONUT OIL, HYDROXYETHYLCELLULOSE, PROPYLENE GLYCOL, GLYCOL STEARATE, PARFUM, SODIUM BENZOATE, CHOLESTEROL, SODIUM DEHYDROACETATE, POLYSORBATE 60, DISODIUM PHOSPHATE, CITRONELLOL, HEXYL CYNNAMAL',
    url: 'https://www.atida.fr/saugella-dermoliquide-500ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/saugella-dermoliquide-soin-lavant-hygiene-intime-femmes-sauge-flacon.webp',
    tags: {
      primary: ['step-traitement', 'barriere-cutanee', 'step-hydratation'],
      secondary: [
        'keratolytique',
        'step-hydratation',
        'type-nettoyant',
        'zone-corps',
        'zone-corps',
        'type-exfoliation',
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.CHOLESTEROL },
    ],
  },
  {
    slug: 'saugella-dermoliquide-soin-lavant-hygiene-intime-femmes-sauge',
    name: 'Dermoliquide Soin Lavant Hygiène Intime Femmes Sauge -',
    brand: 'Saugella',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1558,
    description: '',
    notes: '',
    inci: 'AQUA, TEA-LAURYL SULFATE, AMMONIUM LAURYL SULFATE, SALVIA OFFICINALS LEAF EXTRACT, KETOGLUTARIC ACID, LACTIC ACID, WHEY, PEG-2 STEARATE, HYDROGENATED COCONUT OIL, HYDROXYETHYLCELLULOSE, PROPYLENE GLYCOL, GLYCOL STEARATE, PARFUM, SODIUM BENZOATE, CHOLESTEROL, SODIUM DEHYDROACETATE, POLYSORBATE 60, DISODIUM PHOSPHATE, CITRONELLOL, HEXYL CYNNAMAL',
    url: 'https://www.atida.fr/saugella-dermoliquide-lot-de-2-x-500ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/saugella-dermoliquide-soin-lavant-hygiene-intime-femmes-sauge.webp',
    tags: {
      primary: ['step-traitement', 'barriere-cutanee', 'step-hydratation'],
      secondary: [
        'keratolytique',
        'step-hydratation',
        'type-nettoyant',
        'zone-corps',
        'zone-corps',
        'type-exfoliation',
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.CHOLESTEROL },
    ],
  },
  {
    slug: 'saugella-homme-soin-lavant-intime-et-corps-special-hygiene-masculine',
    name: 'Homme Soin Lavant Intime et Corps Spécial Hygiène Masculine -',
    brand: 'Saugella',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 630,
    description: '',
    notes: '',
    inci: 'AQUA, TEA-LAURYL SULFATE, PROPYLENE GLYCOL, AMMONIUM LAURYL SULFATE, EUGENIA CARYOPHYLLUS FLOWER EXTRACT, HELICHRYSUM ITALICUM EXTRACT, WHEY, PEG-2 STEARATE, HYDROGENATED COCONUT OIL, HYDROXYETHYLCELLULOSE, PHENOXYETHANOL, SODIUM BENZOATE, CITRIC ACID, PARFUM, ETHYLHEXYLGLYCERIN, GLYCOL STEARATE, CHOLESTEROL, CI 19140, CI 42051, LIMONENE',
    url: 'https://www.atida.fr/saugella-homme-solution-nettoyante-intime-200ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/saugella-homme-soin-lavant-intime-et-corps-special-hygiene-masculine.webp',
    tags: {
      primary: ['barriere-cutanee', 'step-hydratation'],
      secondary: ['step-hydratation', 'type-nettoyant', 'zone-corps', 'zone-corps'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.CHOLESTEROL }],
  },
]
