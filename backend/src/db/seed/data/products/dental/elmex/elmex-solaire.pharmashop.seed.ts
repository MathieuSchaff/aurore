import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ELMEX_SOLAIRE_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'elmex-protection-email-professional',
    name: 'Protection Email Professional',
    brand: 'Elmex',
    kind: 'sunscreen',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 580,
    description: '',
    notes: '',
    inci: 'AQUA, HYDRATED SILICA, GLYCERIN, SORBITOL, HYDROXYETHYLCELLULOSE, AROMA, COCAMIDOPROPYL BETAINE, OLAFLUR, SODIUM GLUCONATE, STANNOUS CHLORIDE, ALUMINIA, CHITOSAN, SODIUM SACCHARIN, SODIUM FLUORIDE, POTASSIUM HYDROXIDE, HYDROCHLORIC ACID, CI 77891',
    url: 'https://www.pharmashopdiscount.com/fr/parapharmacie/hygiene/bucco-dentaire/dentifrices/elmex/elmex-protection-email-professional-75ml.html',
    imageUrl: '',
    tags: {
      primary: ['hydratation'],
      secondary: ['creme-solaire', 'protection-solaire', 'matin', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.POTASSIUM_HYDROXIDE }],
  },
]
