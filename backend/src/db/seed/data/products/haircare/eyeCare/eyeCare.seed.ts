import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const EYE_CARE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eye-care-soins-capillaire-ultracapil-serum-capillaire-75ml-273179',
    name: 'Eye Care Soins Capillaire UltraCapil Sérum Capillaire 75ml',
    brand: 'Eye Care',
    kind: 'hair-serum',
    unit: 'bottle',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 1536,
    description: '',
    notes: '',
    inci: 'Aqua (water), glycerin, niacinamide, propanediol, butylene glycol, phenethyl alcohol, polyacrylate crosspolymer-6, sodium phosphate, arginine, lactic acid, allium cepa bulb extract, glycine soja germ extract, triticum vulgare germ extract, disodium phosphate, gluconolactone, sodium benzoate, t-butyl alcohol, scutellaria baicalensis root extract, potassium sorbate, cynanchum atratum extract, panthenol, calcium gluconate, biotinoyl tripeptide-1 (lrc01)',
    url: 'https://www.atida.fr/eye-care-soins-capillaire-ultracapil-serum-capillaire-75ml.html',
    imageUrl:
      'https://assets.atida.com/transform/6bc84f96-281b-4de2-b195-f3126a0afff9/Eye-Care-Soins-Capillaire-UltraCapil-Serum-Capillaire-75ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SERUM_CHEVEUX],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'glycerin-hair' },
      { slug: 'niacinamide-hair' },
      { slug: 'arginine-hair' },
      { slug: 'panthenol-hair' },
    ],
  },
]
