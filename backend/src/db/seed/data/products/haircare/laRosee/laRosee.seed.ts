import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const LA_ROS_E_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-rosee-huile-de-soin-nourrissante-aux-huiles-vegetales-bio-100ml-235183',
    name: 'La Rosée Huile de Soin Nourrissante aux Huiles Végétales Bio 100ml',
    brand: 'La Rosée',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 2034,
    description: '',
    notes: '',
    inci: 'Helianthus annus seed oil, ethylexyl stearate, squalane, borago officinalis seed oil, parfum, calendula officinalis flower extract, tocopherol, hippophae rhamnoides fruit oil.',
    url: 'https://www.atida.fr/la-rosee-huile-de-soin-nourrissante-aux-huiles-vegetales-bio-100ml.html',
    imageUrl:
      'https://assets.atida.com/transform/6cfaf892-8172-424e-8f88-bdf7564ebffa/La-Rosee-Huile-de-Soin-Nourrissante-aux-Huiles-Vegetales-Bio-100ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'sunflower-oil-hair' },
      { slug: 'squalane-hair' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
