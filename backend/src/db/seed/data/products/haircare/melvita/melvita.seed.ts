import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const MELVITA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'melvita-les-essentiels-shampoing-douche-extra-doux-bio-1l-259310',
    name: 'Melvita Les Essentiels Shampoing Douche Extra-Doux Bio 1L',
    brand: 'Melvita',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 1231,
    description: '',
    notes: '',
    inci: "Aqua/water - glycerin - ammonium lauryl sulfate - cocamidopropyl betaine - hordeum vulgare extract* - decyl glucoside - caprylyl/capryl glucoside - actinidia chinensis (kiwi) fruit water - ficus carica (fig) fruit water* - lavandula hybrida oil* - citrus aurantium dulcis (orange) oil* - arginine - inulin – levulinic acid - sodium levulinate - lactic acid - caramel – potassium sorbate - sodium benzoate - benzoic acid - limonene** - linalool**.*ingrédients issus de l'agriculture biologique / ingredients from organic farming ** constituants naturels des huiles essentielles / natural components of essential oils",
    url: 'https://www.atida.fr/melvita-les-essentiels-shampooing-douche-extradoux-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/e0679cbd-7a66-490e-85a1-aefe8c38481a/Melvita-Les-Essentiels-Shampoing-Douche-Extra-Doux-Bio-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'ammonium-lauryl-sulfate' },
      { slug: 'glycerin-hair' },
      { slug: 'cocamidopropyl-betaine' },
      { slug: 'caprylyl-capryl-glucoside' },
      { slug: 'decyl-glucoside' },
    ],
  },
]
