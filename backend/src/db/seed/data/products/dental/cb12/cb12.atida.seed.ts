import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const CB12_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cb12-bain-de-bouche-12h-d-haleine-fraiche-sans-alcool-arome-menthe',
    name: 'Bain De Bouche 12h D’haleine Fraîche Sans Alcool Arôme Menthe -',
    brand: 'CB12',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1674,
    description: '',
    notes: '',
    inci: 'AQUA, GLYCERIN, HYDROGENATED STARCH HYDROLYSATE, PEG-40 HYDROGENATED CASTOR OIL, ZINC ACETATE, SODIUM FLUORIDE, CHLORHEXIDINE DIACETATE, AROMA, ARGININE, CITRIC ACID, POTASSIUM ACESULFAME, MENTHOL, MENTHA PIPERITA OIL',
    url: 'https://www.atida.fr/cb12-haleine-fraiche-menthe-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/670d2956-b3c4-44be-aa23-30045593157c/CB12-Haleine-Fraiche-Menthe-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ZINC_ACETATE },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
      { slug: INGREDIENT_SLUGS.ARGININE },
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
      { slug: INGREDIENT_SLUGS.MENTHE_POIVREE },
    ],
  },
  {
    slug: 'cb12-spray-haleine-fraiche-sans-alcool-arome-menthe',
    name: 'Spray Haleine Fraîche Sans Alcool Arôme Menthe -',
    brand: 'CB12',
    kind: 'mouthwash',
    unit: 'spray',
    totalAmount: 15,
    amountUnit: 'ml',
    priceCents: 599,
    description: '',
    notes: '',
    inci: 'AQUA, GLYCERIN, HYDROGENATED STARCH HYDROLYSATE, PEG-40 HYDROGENATED CASTOR OIL, AROMA, ZINC ACETATE, POTASSIUM ACESULFAME, CHLORHEXIDINE DIACETATE, CITRIC ACID',
    url: 'https://www.atida.fr/cb-12-spray-15ml.html',
    imageUrl:
      'https://assets.atida.com/transform/30937229-5339-420a-a010-17bc4f2c1233/CB12-Spray-Haleine-fraiche-Sans-alcool-Arome-menthe-15-ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['bain-de-bouche'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.ZINC_ACETATE }],
  },
]
