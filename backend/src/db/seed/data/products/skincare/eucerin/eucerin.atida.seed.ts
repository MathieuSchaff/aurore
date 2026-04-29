import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const EUCERIN_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eucerin-ph5-huile-de-douche-peaux-sensibles-seches',
    name: 'Ph5 Huile De Douche Peaux Sensibles Sèches',
    brand: 'Eucerin',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1949,
    description: '',
    notes: '',
    inci: 'GLYCINE SOJA OIL, LAURETH-4, MIPA-LAURETH SULFATE, RICINUS COMMUNIS SEED OIL, POLOXAMER 101, PARFUM, PROPYLENE GLYCOL, PANTHENOL, TOCOPHEROL, PANTOLACTONE, CITRIC ACID, SODIUM CITRATE, AQUA, PROPYL GALLATE',
    url: 'https://www.atida.fr/eucerin-ph5-huile-de-douche-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/59a18f13-0468-4bb5-b5cb-fc0e0a52e568/Eucerin-PH5-Huile-de-Douche-Peaux-Sensibles-Seches-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'barriere-cutanee', 'anti-oxydant'],
      secondary: ['reparateur', 'nettoyant-corps', 'zone-corps', 'peau-sensible'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_DE_RICIN },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.SODIUM_CITRATE },
    ],
  },
  {
    slug: 'eucerin-atopi-control-huile-bain-et-douche-peaux-atopiques',
    name: 'Atopi Control Huile Bain Et Douche Peaux Atopiques',
    brand: 'Eucerin',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 1336,
    description: '',
    notes: '',
    inci: 'GLYCINE SOJA OIL, RICINUS COMMUNIS SEED OIL, LAURETH-4, MIPA LAURETH, SULFATE, POLOXAMER 101, LAURETH-9, PROPYLENE GLYCOL, AQUA BHT, PROPYL GALLATE',
    url: 'https://www.atida.fr/eucerin-atopicontrol-huile-bain-douche-400ml.html',
    imageUrl:
      'https://assets.atida.com/transform/04c94350-4010-4bb4-a3a7-79a4472cf469/Eucerin-Atopi-Control-Huile-Bain-et-Douche-Peaux-Atopiques-400ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['eczema'],
      secondary: ['nettoyant-corps', 'zone-corps', 'peau-atopique', 'apaisant'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.HUILE_DE_RICIN }],
  },
  {
    slug: 'eucerin-ph5-gel-lavant-peaux-sensibles-seches',
    name: 'Ph5 Gel Lavant Peaux Sensibles Sèches',
    brand: 'Eucerin',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1196,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM COCOAMPHOACETATE, SODIUM MYRETH SULFATE, LAURYL GLUCOSIDE, CITRIC ACID, SODIUM CHLORIDE, METHYLPROPANEDIOL, PANTHENOL, GLYCERIN, PANTOLACTONE, SODIUM CITRATE, COCO-GLUCOSIDE, GLYCOL DISTEARATE, PEG-40 HYDROGENATED CASTOR OIL, PEG-200 HYDROGENATED GLYCERYL PALMATE, SODIUM BENZOATE, PARFUM',
    url: 'https://www.atida.fr/eucerin-ph5-gel-lavant-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/32ef268c-43b9-43fd-80d8-12b8b97a8c18/Eucerin-PH5-Gel-Lavant-Peaux-Sensibles-Seches-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'barriere-cutanee', 'hydratation'],
      secondary: ['reparateur', 'nettoyant-corps', 'zone-corps', 'peau-sensible'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.SODIUM_CITRATE },
    ],
  },
]
