import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const CB12_SEED: UnifiedProductSeed[] = [
  {
    slug: 'cb12-bain-de-bouche-12h-d-haleine-fraiche-sans-alcool-arome-menthe-500ml-281510',
    name: "CB12 Bain de bouche 12h d'haleine fraîche Sans alcool Arôme menthe - 500ml",
    brand: 'CB12',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1674,
    description: '',
    notes: '',
    inci: 'Aqua, Glycerin, Hydrogenated Starch Hydrolysate, PEG-40 Hydrogenated Castor Oil, Zinc Acetate, Sodium Fluoride, Chlorhexidine Diacetate, Aroma, Arginine, Citric Acid, Potassium Acesulfame, Menthol, Mentha Piperita Oil.',
    url: 'https://www.atida.fr/cb12-haleine-fraiche-menthe-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/670d2956-b3c4-44be-aa23-30045593157c/CB12-Haleine-Fraiche-Menthe-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.BAIN_DE_BOUCHE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'zinc-acetate' },
      { slug: 'sodium-fluoride' },
      { slug: 'chlorhexidine' },
      { slug: 'arginine-dental' },
      { slug: 'menthol-dental' },
    ],
  },
  {
    slug: 'cb12-spray-haleine-fraiche-sans-alcool-arome-menthe-15-ml-232673',
    name: 'CB12 Spray Haleine fraîche Sans alcool Arôme menthe - 15 ml',
    brand: 'CB12',
    kind: 'mouthwash',
    unit: 'spray',
    totalAmount: 15,
    amountUnit: 'ml',
    priceCents: 599,
    description: '',
    notes: '',
    inci: 'Aqua, Glycerin, Hydrogenated Starch Hydrolysate, PEG-40 Hydrogenated Castor Oil, Aroma, Zinc Acetate, Potassium Acesulfame, Chlorhexidine Diacetate, Citric Acid.',
    url: 'https://www.atida.fr/cb-12-spray-15ml.html',
    imageUrl:
      'https://assets.atida.com/transform/30937229-5339-420a-a010-17bc4f2c1233/CB12-Spray-Haleine-fraiche-Sans-alcool-Arome-menthe-15-ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.BAIN_DE_BOUCHE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'zinc-acetate' }, { slug: 'chlorhexidine' }],
  },
  {
    slug: 'cb12-boost-menthe-forte-fraicheur-instantanee-sans-sucres-10-gommes-a-macher-272852',
    name: 'CB12 Boost Menthe forte Fraîcheur instantanée Sans sucres - 10 gommes à mâcher',
    brand: 'CB12',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 10,
    amountUnit: 'g',
    priceCents: 484,
    description: '',
    notes: '',
    inci: 'Édulcorants (xylitol 38%*, sorbitol), base gomme, arômes, acétate de zinc, édulcorants (aspartame, sucralose, acésulfame K), fluorure de sodium, antioxydant (E321), colorants (E133, E132). Contient de la réglisse.',
    url: 'https://www.atida.fr/cb12-boost-10-gommes-a-macher.html',
    imageUrl:
      'https://assets.atida.com/transform/4c8e861b-0e88-47d4-8e3e-91f219bf6ffe/CB12-Boost-Menthe-forte-Fraicheur-instantanee-Sans-sucres-10-gommes-a-macher?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'xylitol-dental' },
      { slug: 'zinc-acetate' },
      { slug: 'sodium-fluoride' },
    ],
  },
]
