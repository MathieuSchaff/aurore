import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const RENE_FURTERER_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'furterer-triphasic-active-grow-serum-accelerateur-de-pousse',
    name: 'Furterer Triphasic Active Grow - Sérum Accélérateur De Pousse -',
    brand: 'René Furterer',
    kind: 'serum',
    unit: 'dropper',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 3685,
    description: '',
    notes: '',
    inci: 'WATER (AQUA)*, ALCOHOL DENAT.*, GLYCERIN*, CAFFEINE, BIOTIN, CAMPHOR*, CITRAL*, CITRIC ACID*, CITRONELLOL*, FRAGRANCE (PARFUM)*, GERANIOL*, HEXYL CINNAMAL*, LIMONENE*, LINALOOL*, LINALYL ACETATE*, MALTODEXTRIN*, OLETH-10, PANAX GINSENG ROOT EXTRACT*, PINENE*, PROPANEDIOL*, PROPOLIS EXTRACT**, ROSMARINUS OFFICINALIS (ROSEMARY) LEAF OIL (ROSMARINUS OFFICINALIS LEAF OIL)*, SODIUM CITRATE*, SODIUM HYALURONATE*, TERPINEOL*, TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES*, TOCOPHEROL',
    url: 'https://www.atida.fr/furterer-triphasic-active-grow-serum-accelerateur-de-pousse-100ml.html',
    imageUrl:
      'https://assets.atida.com/transform/10bf46fa-5e1b-4f56-ad8f-1e1aaa882406/Rene-furterer-Serum-accelerateur-de-pousse-100ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['hydratation', 'anti-oxydant'],
      secondary: ['reparateur', 'serum', 'traitement', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.CAFFEINE }, { slug: INGREDIENT_SLUGS.BIOTIN }],
  },
  {
    slug: 'rene-furterer-sublime-karite-masque-hydratant-gainant',
    name: 'Sublime Karité Masque Hydratant Gainant',
    brand: 'René Furterer',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 3003,
    description: '',
    notes: '',
    inci: 'WATER (AQUA)*, CETYL ALCOHOL*, ETHYLHEXYL PALMITATE*, BEHENAMIDOPROPYL DIMETHYLAMINE*, DICAPRYLYL CARBONATE*, CETEARYL ALCOHOL*, 1,2-HEXANEDIOL, BUTYROSPERMUM PARKII (SHEA) BUTTER (BUTYROSPERMUM PARKII BUTTER)**, BENZOIC ACID, CANANGA ODORATA FLOWER OIL**, CERAMIDE NG*, CETEARYL GLUCOSIDE*, FRAGRANCE (PARFUM), GLYCINE SOJA (SOYBEAN) OIL (GLYCINE SOJA OIL)*, LACTIC ACID*, OLEA EUROPAEA (OLIVE) FRUIT OIL (OLEA EUROPAEA FRUIT OIL)*, RICINUS COMMUNIS (CASTOR) SEED OIL (RICINUS COMMUNIS SEED OIL)*, SCLEROTIUM GUM, TOCOPHEROL',
    url: 'https://www.atida.fr/rene-furterer-sublime-karite-masque-hydratant-gainant-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/f3944906-d49e-4610-a4d4-56b49772d0c1/Rene-Furterer-Sublime-Karite-Masque-Hydratant-gainant-200ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['barriere-cutanee', 'hydratation', 'anti-oxydant'],
      secondary: ['emollience', 'reparateur', 'masque-hebdo', 'zone-visage'],
      avoid: [],
    },
  },
]
