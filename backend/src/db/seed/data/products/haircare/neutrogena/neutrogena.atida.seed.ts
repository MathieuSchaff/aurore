import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const NEUTROGENA_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'neutrogena-t-gel-fort-demangeaisons-severes',
    name: 'T/gel® Fort Démangeaisons Sévères -',
    brand: 'Neutrogena',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 1388,
    description: '',
    notes: '',
    inci: 'AQUA, SODIUM C14-16 OLEFIN SULFONATE, COCAMIDOPROPYL BETAINE, SALICYLIC ACID, SODIUM CHLORIDE, SODIUM METHYL COCOYL TAURATE, POLYQUATERNIUM-22, PIROCTONE OLAMINE, SODIUM SULFATE, HEXYLENE GLYCOL, DICHLOROPHENYL IMIDAZOLDIOXOLAN, COCONUT ACID, LINOLEAMIDOPROPYL PG-DIMONIUM CHLORIDE PHOSPHATE, PROPYLENE GLYCOL, DISODIUM EDTA, BHT, TOCOPHERYL ACETATE, SODIUM CITRATE, ETHYLPARABEN, METHYLPARABEN, PROPYLPARABEN, PHENOXYETHANOL, PARFUM, GERANIOL, CITRONELLOL, LINALOOL, LIMONENE, HYDROXYCITRONELLAL, CI 19140, CI 16035, CI 42090',
    url: 'https://www.atida.fr/neutrogena-t-gel-fort-demangeaisons-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/bc6575df-8122-4ae2-8bb2-336e13b54e92/Neutrogena-T-GEL-Fort-Demangeaisons-Severes-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID },
      { slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE },
      { slug: INGREDIENT_SLUGS.SODIUM_CITRATE },
    ],
  },
]
