import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LES_SECRETS_DE_LOLY_SOLAIRE_PHARMASHOP_SEED: UnifiedProductSeed[] = [
  {
    slug: 'les-secrets-de-loly-serum-de-finition-multi-protection',
    name: 'Serum DE Finition Multi Protection',
    brand: 'Les Secrets De Loly',
    kind: 'sunscreen',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1992,
    description: '',
    notes: '',
    inci: 'HYDROGENATED ETHYLHEXYL OLIVATE, PRUNUS AMYGDALUS DULCIS OIL, ISOAMYL LAURATE, CRAMBE ABYSSINICA SEED OIL PHYTOSTEROL ESTERS, HYDROGENATED CASTOR OIL, BUTYROSPERMUM PARKII BUTTER, HYDROGENATED OLIVE OIL UNSAPONIFIABLES, RICINUS COMMUNIS SEED OIL, PARFUM, ETHYL OLIVATE, ETHYL LAURATE, HELIANTHUS ANNUUS SEED OIL, PHYTOSTEROLS, AQUA, ALCOHOL, TOCOPHEROL, GLYCINE SOJA OIL, JOJOBA ESTERS, GLYCOLIC ACID, HYDROLYZED RICE PROTEIN, ORYZA SATIVA BRAN WAX, BETA-SITOSTEROL, SQUALENE, XYLITOL',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/les-secrets-de-loly/les-secrets-de-loly-serum-de-finition-multi-protection-100ml.html',
    imageUrl: '',
    tags: {
      primary: ['eclat', 'anti-oxydant'],
      secondary: ['reparateur', 'creme-solaire', 'protection-solaire', 'matin', 'zone-visage'],
      avoid: ['peau-sensible', 'peau-reactive'],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL },
      { slug: INGREDIENT_SLUGS.SHEA_BUTTER },
      { slug: INGREDIENT_SLUGS.HUILE_DE_RICIN },
      { slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL },
      { slug: INGREDIENT_SLUGS.GLYCOLIC_ACID },
      { slug: INGREDIENT_SLUGS.XYLITOL },
    ],
  },
]
