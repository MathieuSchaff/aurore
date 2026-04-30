import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'
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
      'https://aurore-cdn.b-cdn.net/products/biorene-coiffant-creme-de-coiffage-25ml-248214.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.CREME_COIFFANTE],
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
