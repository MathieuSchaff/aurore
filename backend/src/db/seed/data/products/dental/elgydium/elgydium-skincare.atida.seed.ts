import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ELGYDIUM_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'elgydium-fix-creme-fixative-extra-fort',
    name: 'Fix Crème Fixative Extra-fort',
    brand: 'Elgydium',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 45,
    amountUnit: 'g',
    priceCents: 794,
    description: '',
    notes: '',
    inci: 'PARAFFINUM LIQUIDUM, CALCIUM/SODIUM PVM/MA COPOLYMER, CELLULOSE GUM, PETROLATUM, SILICA, AROMA, MENTHYL LACTATE, COLORANT, TOCOPHEROL',
    url: 'https://www.atida.fr/elgydium-fix-creme-fixative-extra-fort-45g.html',
    imageUrl:
      'https://assets.atida.com/transform/c2d83af8-3718-4317-b018-b4833f768105/Elgydium-Fix-Creme-Fixative-Extra-Fort-45g?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['anti-oxydant'],
      secondary: ['reparateur', 'creme-hydratante', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.SILICA }],
  },
]
