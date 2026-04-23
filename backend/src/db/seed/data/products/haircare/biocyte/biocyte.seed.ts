import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const BIOCYTE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'biocyte-pack-keratine-forte-serum-anti-chute-15-ampoules-de-9-ml-45-jours-249238',
    name: 'Biocyte Pack Kératine Forte Serum Anti-chute 15 Ampoules de 9 ml 45 jours',
    brand: 'Biocyte',
    kind: 'hair-serum',
    unit: 'bottle',
    totalAmount: 15,
    amountUnit: 'ampoules',
    priceCents: 5819,
    description: '',
    notes: '',
    inci: 'INGREDIENTS: AQUA (WATER), PEG-40 HYDROGENATED CASTOR OIL, HYDROLYZED KERATIN, BENZYL ALCOHOL, GLYCERIN, PARFUM (FRAGRANCE), HYDROXYETHYLCELLULOSE, NIACINAMIDE, RUSCUS ACULEATUS ROOT EXTRACT, CITRUS LIMON PEEL EXTRACT, SOLIDAGO VIRGAUREA EXTRACT, PHENOXYETHANOL, DISODIUM PYRROLOQUINOLINEDIONE TRICARBOXYLATE, CITRIC ACID, SODIUM HYDROXIDE, PISUM SATIVUM SPROUT EXTRACT, POTASSIUM SORBATE, SODIUM BENZOATE.',
    url: 'https://www.atida.fr/biocyte-keratine-anti-chute-serum-lot-de-3-x-5-ampoules.html',
    imageUrl:
      'https://assets.atida.com/transform/91ec7cb0-5e51-4fd7-91ff-f6e9386ba356/Biocyte-Keratine-Anti-chute-Serum-Lot-de-3-x-5-ampoules?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.SERUM_CHEVEUX],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'hydrolyzed-keratin' },
      { slug: 'niacinamide-hair' },
      { slug: 'glycerin-hair' },
      { slug: 'peg-40-hydrogenated-castor-oil' },
    ],
  },
]
