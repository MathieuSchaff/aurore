import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LA_ROSEE_DENTAL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-rosee-dentifrice-soin-complet-a-la-menthe-bio',
    name: 'Dentifrice Soin Complet a la Menthe Bio',
    brand: 'La Rosee',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 467,
    description:
      "La Rosée Dentifrice Soin Complet à la Menthe Bio 75ml en vente en ligne sur le site de votre parapharmacie à prix discount.LA ROSEE, une marque reconnue dans le domaine de la cosmétique, vous présente son dentifrice Soin Complet à la Menthe Bio spécialement conçu pour un nettoyage doux des dents et des gencives même sensibles\n\n.Ce dentifrice doux et efficace offre une protection optimale pour les dents et les gencives. Enrichi en ingrédients naturels et biologiques, ce dentifrice à la menthe bio est formulé avec du fluor (dosé à 1450 ppm) de la glycérine végétale, associé à la silice et la perlite pour nettoyer tout en douceur la surface des dents et éliminer les taches en révélant leur blancheur. Sa formule douce respecte l'émail des dents tout en prévenant les caries et en éliminant la plaque dentaire et le tartre. Grâce à son goût frais de menthe, ce dentifrice procurera une haleine frâiche. Sa texture onctueuse légèrement moussante facilite l'application et permet un brossage en douceur. \n\nOffrez vous une hygiène bucco-dentaire optimale avec ce dentifrice complet à la menthe bio de La Rosée. Commandez-le dès maintenant sur notre site de vente en ligne et profitez de notre prix discount.",
    notes: '',
    inci: 'HYDROGENATED STARCH HYDROLISATE, AQUA, HYDRATED SILICA, GLYCERIN, PERLITE, SODIUM COCOYL ISETHIONATE, AROMA, SODIUM COCOAMPHOACETATE, XANTHAN GUM, SODIUM FLUORIDE (FLUOR), LEVULINIC ACID, MENTHOL, MENTHYL LACTATE, SODIUM LEVULINATE, STEVIA REBAUDIANA EXTRACT, SODIUM CHLORIDE, MENTHA VIRIDIS LEAF EXTRACT, CITRIC ACID, SODIUM HYDROXIDE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/la-rosee/la-rosee-dentifrice-soin-complet-a-la-menthe-bio-75ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/la-rosee-dentifrice-soin-complet-a-la-menthe-bio.webp',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE },
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
    ],
  },
]
