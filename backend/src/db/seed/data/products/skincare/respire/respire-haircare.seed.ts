import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const RESPIRE_HAIRCARE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'respire-apres-shampooing-solide-bio',
    name: 'Apres Shampooing Solide Bio',
    brand: 'Respire',
    kind: 'conditioner',
    unit: 'bar',
    totalAmount: 50,
    amountUnit: 'g',
    priceCents: 1064,
    description:
      "L'après Shampooing Solide bio discount de Respire, un soin d'origine naturelle pour nourrir et faciliter le démêlage des cheveux, dans votre parapharmacie en ligne à prix discount.\n\nRESPIRE, fondée par Justine Hutteau propose tout une gamme de soins d’hygiènes eco-responsable. Des produits engagés, naturels, recyclables, sains & naturels fabriqués en France.\n\nL'après Shampooing Solide bio, est formulée à partir de 100% d'ingrédients d'origine naturelle (huile de brocoli bio, huile de tournesol, beurre de cacao bio). Une formule naturelle et Vegan au parfum gourmand et vanillé pour nourrir et faciliter le démêlage des cheveux.",
    notes: '',
    inci: 'ARACHIDYL/BEHENYL ALCOHOL, ARACHIDYL/BEHENYL BETAINATE ESYLATE, HELIANTHUS ANNUUS SEED OIL, ZEA MAYS STARCH*, ARACHIDYL ALCOHOL, THEOBROMA CACAO SEED BUTTER*, BRASSICA OLERACEA ITALICA SEED OIL*, BEHENYL ALCOHOL, PARFUM, ARACHIDYL GLUCOSIDE, GLYCERIN*, TOCOPHEROL, CI 77492, CI 77491, COUMARIN, LINALOOL',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/respire/respire-apres-shampooing-solide-bio-50g.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/respire-apres-shampooing-solide-bio.webp',
    tags: {
      primary: ['apres-shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL },
      { slug: INGREDIENT_SLUGS.IRON_OXIDE },
    ],
  },
]
