import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const CAUDALIE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'caudalie-vinohydra-masque-creme-hydratant-75-ml-250817',
    name: 'Caudalie Vinohydra Masque-Crème Hydratant 75 ml',
    brand: 'Caudalie',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 1685,
    description: '',
    notes: '',
    inci: 'GLYCERIN, BUTYROSPERMUM PARKII (SHEA) BUTTER EXTRACT, HEXYLDECANOL, HEXYLDECYL  LAURATE, PALMITOYL GRAPE SEED EXTRACT, BEHENYL ALCOHOL, GLYCERYL STEARATE,  ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, ERYTHRITOL, LECITHIN, MANNITOL,  TOCOPHEROL, CAPRYLYL GLYCOL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, XANTHAN  GUM, SODIUM BENZOATE, VITIS VINIFERA (GRAPE) JUICE, GLYCINE SOJA (SOYBEAN) STEROLS,  BUTYLENE GLYCOL, CHAMOMILLA RECUTITA (MATRICARIA) FLOWER EXTRACT, SODIUM  HYDROXIDE, CITRIC ACID, SODIUM CARBOXYMETHYL BETA-GLUCAN, SODIUM CITRATE,  SODIUM PHYTATE, POTASSIUM SORBATE, BIOSACCHARIDE GUM-1, SODIUM HYALURONATE,  SODIUM LEVULINATE, GLYCERYL CAPRYLATE, HOMARINE HCL, SODIUM ANISATE, ALCOHOL,  ACETYL TETRAPEPTIDE-15, PARFUM (FRAGRANCE).(098/131)',
    url: 'https://www.atida.fr/caudalie-vinohydra-masque-creme-hydratant-75-ml.html',
    imageUrl:
      'https://assets.atida.com/transform/8f5fca71-1d7f-4cea-ab80-7f434fb51450/Caudalie-Vinohydra-Masque-Creme-Hydratant-75-ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SHAMPOING],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'glycerin-hair' },
      { slug: 'shea-butter-hair' },
      { slug: 'sunflower-oil-hair' },
      { slug: 'sodium-hyaluronate-hair' },
      { slug: 'tocopherol-hair' },
    ],
  },
]
