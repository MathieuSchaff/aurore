import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const ELMEX_SOLAIRE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'elmex-protection-email-professional',
    name: 'Protection Email Professional',
    brand: 'Elmex',
    kind: 'sunscreen',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 580,
    description:
      'Le dentifrice ELMEX Protection émail Professionnal nettoie et protège les dents dès le 1er brossage.\n\n\nLe laboratoire ELMEX a conçu des produits d’hygiène dentaires reconnus par des dentistes pour des soins d’hygiène bucco-dentaire, blancheur des dents, prévention caries… Le dentifrice Protection émail Professionnal nettoie l’émail des dents quotidiennement sans les abîmer. Composé de la technologie unique ChitoActive ELMEX et de fluorure d’amine, il va protéger les dents de l’acidité et de la formation des caries en formant un film protecteur sur la dent pour lutter contre l’érosion et la perte de l’émail au quotidien et pendant le brossage. Dès le premier brossage, les dents sont plus fortes face à l’agression des bactéries et protégées de l’érosion de l’émail.',
    notes: '',
    inci: 'AQUA, HYDRATED SILICA, GLYCERIN, SORBITOL, HYDROXYETHYLCELLULOSE, AROMA, COCAMIDOPROPYL BETAINE, OLAFLUR, SODIUM GLUCONATE, STANNOUS CHLORIDE, ALUMINIA, CHITOSAN, SODIUM SACCHARIN, SODIUM FLUORIDE, POTASSIUM HYDROXIDE, HYDROCHLORIC ACID, CI 77891',
    url: 'https://www.pharmashopdiscount.com/fr/parapharmacie/hygiene/bucco-dentaire/dentifrices/elmex/elmex-protection-email-professional-75ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/elmex-protection-email-professional.webp',
    tags: {
      primary: ['step-hydratation'],
      secondary: [
        'type-solaire',
        'texture-creme',
        'step-protection-solaire',
        'moment-matin',
        'moment-matin',
        'zone-visage',
      ],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.POTASSIUM_HYDROXIDE }],
  },
]
