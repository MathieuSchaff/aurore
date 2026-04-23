import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const NEUTROGENA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'neutrogena-t-gel-fort-demangeaisons-severes-250ml-277627',
    name: 'Neutrogena® T/GEL® Fort Démangeaisons Sévères - 250ml',
    brand: 'Neutrogena',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 1388,
    description: '',
    notes: '',
    inci: 'Aqua, Sodium C14-16 Olefin Sulfonate, Cocamidopropyl Betaine, Salicylic Acid, Sodium Chloride, Sodium Methyl Cocoyl Taurate, Polyquaternium-22, Piroctone Olamine, Sodium Sulfate, Hexylene Glycol, Dichlorophenyl Imidazoldioxolan, Coconut Acid, Linoleamidopropyl PG-Dimonium Chloride Phosphate, Propylene Glycol, Disodium EDTA, BHT, Tocopheryl Acetate, Sodium Citrate, Ethylparaben, Methylparaben, Propylparaben, Phenoxyethanol, Parfum, Geraniol, Citronellol, Linalool, Limonene, Hydroxycitronellal, CI 19140, CI 16035, CI 42090',
    url: 'https://www.atida.fr/neutrogena-t-gel-fort-demangeaisons-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/bc6575df-8122-4ae2-8bb2-336e13b54e92/Neutrogena-T-GEL-Fort-Demangeaisons-Severes-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'salicylic-acid-hair' },
      { slug: 'piroctone-olamine' },
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
