import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const WELLA_PROFESSIONALS_SEED: UnifiedProductSeed[] = [
  {
    slug: 'wella-professionals-fusion-intense-repair-masque-reparation-intense-150ml-249293',
    name: 'Wella Professionals Fusion Intense Repair Masque Réparation Intense 150ml',
    brand: 'Wella Professionals',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 2305,
    description: '',
    notes: '',
    inci: 'Aqua/water/eau, stearyl alcohol, behentrimonium chloride, cetyl alcohol, quaternium-80, propylene glycol, parfum/fragrance, isopropyl alcohol, phenoxyethanol, methylparaben, propylparaben, disodium edta, hexyl cinnamal, linalool, benzyl salicylate, limonene, citric acid, alanine, glycine, alpha-isopmethyl ionone, histidine, silk amino acids, sodium benzoate.',
    url: 'https://www.atida.fr/wella-professionals-fusion-intense-repair-masque-reparation-intense-150ml.html',
    imageUrl:
      'https://assets.atida.com/transform/a5147ea6-56e9-4ab7-8de9-5bd952186d16/Wella-Professionals-Fusion-Intense-Repair-Masque-Reparation-Intense-150ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'behentrimonium-chloride' },
      { slug: 'stearyl-alcohol-hair' },
      { slug: 'cetyl-alcohol-hair' },
      { slug: 'silk-amino-acids' },
      { slug: 'alanine-hair' },
      { slug: 'glycine-hair' },
      { slug: 'histidine-hair' },
    ],
  },
]
