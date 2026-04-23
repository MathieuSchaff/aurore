import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const NEUTRADERM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'neutraderm-shampoing-extra-doux-dermo-respect-500ml-242343',
    name: 'Neutraderm Shampoing Extra-Doux Dermo-Respect 500ml',
    brand: 'Neutraderm',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 619,
    description: '',
    notes: '',
    inci: 'Aqua (water) / eau, oligoactive water(2), sodium laureth sulfate, undecylenamidopropyl betaine, decyl glucoside, olea europaea (olive) leaf extract, panthenol, prunus amygdalus dulcis (sweet almond) oil, polyquaternium- 10, coco-glucoside, glyceryl oleate, tocopherol, parfum (fragrance), hydrogenated palm glycerides citrate, laureth-2, peg-120 methyl glucose dioleate, peg-6, propylene glycol, sodium chloride, tetrasodium glutamate diacetate, sodium benzoate, undecanoic acid, citric acid, ci 15985 (yellow 6), ci 19140 (yellow 5).',
    url: 'https://www.atida.fr/neutraderm-shampooing-extra-doux-dermo-respect-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/64df304d-af04-47a4-8028-e94c63c4ca57/Neutraderm-Shampoing-Extra-Doux-Dermo-Respect-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sles-hair' },
      { slug: 'panthenol-hair' },
      { slug: 'almond-oil-hair' },
      { slug: 'polyquaternium-10' },
      { slug: 'coco-glucoside' },
      { slug: 'tocopherol-hair' },
    ],
  },
  {
    slug: 'neutraderm-shampoing-extra-doux-dermo-respect-lot-de-2-x-500ml-301117',
    name: 'Neutraderm Shampoing Extra-Doux Dermo-Respect Lot de 2 x 500ml',
    brand: 'Neutraderm',
    kind: 'shampoo',
    unit: 'pack',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1238,
    description: '',
    notes: '',
    inci: '',
    url: 'https://www.atida.fr/neutraderm-shampoing-extra-doux-dermo-respect-lot-de-2-x-500ml.html',
    imageUrl:
      'https://assets.atida.com/transform/7b14a800-cc92-4046-af8f-470be41056a0/Neutraderm-Shampoing-Extra-Doux-Dermo-Respect-Lot-de-2-x-500ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [],
  },
]
