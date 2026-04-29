import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LES_SECRETS_DE_LOLY_SOLAIRE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'les-secrets-de-loly-serum-de-finition-multi-protection',
    name: 'Serum de Finition Multi Protection',
    brand: 'Les Secrets De Loly',
    kind: 'sunscreen',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1992,
    description:
      "LES SECRETS DE LOLY SERUM DE FINITION MULTI PROTECTION 100ML est disponible en vente en ligne à prix discount sur Pharmashopdiscount. \n\nLes Secrets de Loly est une marque reconnue pour ses produits capillaires naturels et performants. Ce sérum de finition se distingue par sa texture légère et non grasse, enrichie en huile d'Abyssinie, protéine de riz, huile de jojoba, huile de ricin et beurre de karité, qui contribuent à nourrir, protéger et apporter de la brillance aux cheveux. L'huile d'Abyssinie aide à maintenir l'hydratation, tandis que la protéine de riz soutient la fonction de renforcement des cheveux. L'huile de jojoba et l'huile de ricin participent à la nutrition et à la protection des cheveux, et le beurre de karité aide à adoucir et lisser la fibre capillaire. Une solution idéale pour votre routine beauté au quotidien, ce sérum est un allié du quotidien pour prendre soin de vos cheveux simplement et efficacement.",
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
