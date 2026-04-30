import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const LA_ROSEE_HAIRCARE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'la-rosee-flacon-vide-verre-rechargeable-pour-shampoing',
    name: 'Flacon Vide Verre Rechargeable pour Shampoing',
    brand: 'La Rosee',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 490,
    description:
      "LA ROSEE FLACON VIDE VERRE RECHARGEABLE POUR SHAMPOING 200ML en vente en ligne sur le site de votre parapharmacie à prix discount.\n\nCe flacon vide en verre rechargeable pour shampoing de 200ml est idéal pour les personnes soucieuses de l'environnement et de leur santé. Fabriqué par le laboratoire La Rosée, ce flacon est conçu pour être réutilisé et permet de limiter les déchets plastiques. Pratique et élégant, sa contenance de 200ml est parfaite pour une utilisation quotidienne. Optez pour ce flacon rechargeable et adoptez un geste éco-responsable tout en prenant soin de vos cheveux.",
    notes: '',
    inci: '',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/la-rosee/la-rosee-flacon-vide-verre-rechargeable-pour-shampoing-200ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/la-rosee-flacon-vide-verre-rechargeable-pour-shampoing.webp',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
  },
  {
    slug: 'la-rosee-recharge-masque-capillaire-reparateur',
    name: 'Recharge Masque Capillaire Reparateur',
    brand: 'La Rosee',
    kind: 'hair-mask',
    unit: 'jar',
    totalAmount: 200,
    amountUnit: 'g',
    priceCents: 1490,
    description:
      "LA ROSEE RECHARGE MASQUE CAPILLAIRE REPARATEUR 200G en vente en ligne, sur le site de votre parapharmacie à prix discount.\n\nDécouvrez la recharge du masque capillaire réparateur à la kératine et à la noix de coco de la marque La Rosée, un produit de qualité pour prendre soin de vos cheveux en profondeur. Ce masque nourrissant et hydratant est idéal pour réparer les cheveux abîmés et secs ou pour un usage quotidien. La kératine hydrate, renforce et protège le cheveu tandis que l'huile de ricin bio, de coco bio et d'amande douce bio apportent de la résistance et de la douceur aux cheveux. Le beurre de karité contenu dans ce produit nourrit en profondeur. Sa texture onctueuse et son parfum délicat vous offriront un moment de détente et de bien-être lors de son application. Produit formulé à 99% d'origine naturelle. Cette recharge recyclable permet d'économiser 73% de plastique par rapport à l'achat d'un pot complet. Offrez à vos cheveux les soins qu'ils méritent avec ce masque capillaire La Rosée.",
    notes: '',
    inci: 'AQUA (WATER), URTICA DIOICA LEAF EXTRACT, GLYCERIN, BRASSICAMIDOPROPYL DIMETHYLAMINE, COCOS NUCIFERA OIL, RICINUS COMMUNIS SEED OIL, ETHYLHEXYL STEARATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, HYDROLYZED WHEAT PROTEIN, HYDROLYZED CORN PROTEIN, HYDROLYZED SOY PROTEIN, PARFUM (FRAGRANCE), HYDROGENATED CASTOR OIL, LACTIC ACID, LEVULINIC ACID, SQUALANE, SODIUM BENZOATE, SODIUM LEVULINATE, LEUCONOSTOC/RADISH ROOT FERMENT FILTRATE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/la-rosee/la-rosee-recharge-masque-capillaire-reparateur-200g.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/la-rosee-recharge-masque-capillaire-reparateur.webp',
    tags: {
      primary: ['masque-capillaire'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_DE_COCO },
      { slug: INGREDIENT_SLUGS.HUILE_DE_RICIN },
      { slug: INGREDIENT_SLUGS.SHEA_BUTTER },
      { slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_WHEAT_PROTEIN },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_SOY_PROTEIN },
      { slug: INGREDIENT_SLUGS.HYDROGENATED_CASTOR_OIL_HAIR },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
    ],
  },
]
