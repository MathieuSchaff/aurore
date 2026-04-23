import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const BIORENE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'biorene-coiffant-creme-de-coiffage-25ml-248214',
    name: 'Biorene Coiffant Crème de Coiffage 25ml',
    brand: 'Biorene',
    kind: 'styling',
    unit: 'jar',
    totalAmount: 25,
    amountUnit: 'ml',
    priceCents: 369,
    description: '',
    notes: '',
    inci: "Paraffinum liquidum/mineral oil/huile minerale, aqua/water/eau, cetyl alcohol, hydroxystearic/ linolenic/ oleic polyglycerides, cera microcristallina/microcrystalline wax/cire microcristalline, diisopropyl adipate, cera alba /beeswax/cire d'abeille, glycol stearate, hydrogenated microcrystalline wax, synthetic wax, stearic acid, sorbitan oleate, hydrogenated castor oil, stearyl stearate, cetyl palmitate, stearyl palmitate, cetyl stearate, magnesium stearate, potassium sorbate, parfum (fragrance), dmdm hydantoin, behenic acid, cetrimonium chloride, citronellol, linalool, geraniol, cinnamyl alcohol, evernia prunastri (oakmoss) extract, eugenol, limonene, citral. (f18)",
    url: 'https://www.atida.fr/biorene-coiffant-creme-de-coiffage-25ml.html',
    imageUrl:
      'https://assets.atida.com/transform/13b3cf01-4b07-4bb2-b207-6e7b38cd9dd8/Biorene-Coiffant-Creme-de-Coiffage-25ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.PRODUIT_COIFFANT],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'paraffinum-liquidum-hair' },
      { slug: 'cetyl-alcohol-hair' },
      { slug: 'cera-microcristallina-hair' },
      { slug: 'cetrimonium-chloride' },
      { slug: 'behenic-acid' },
    ],
  },
]
