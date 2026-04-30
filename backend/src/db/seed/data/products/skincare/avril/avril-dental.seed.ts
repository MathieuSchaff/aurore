import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const AVRIL_DENTAL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'avril-dentifrice-bio-menthe-fraiche',
    name: 'Dentifrice Bio Menthe Fraiche',
    brand: 'Avril',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 359,
    description:
      "AVRIL Dentifrice Bio Menthe Fraiche 100ml : Découvrez le dentifrice bio AVRIL à la menthe fraiche en vente en ligne sur le site de votre parapharmacie à prix discount.\n\nCe dentifrice bio est formulé à base d'ingrédients naturels pour une hygiène bucco-dentaire optimale. Sa formule à base de menthe fraiche et sans fluor est idéale pour une haleine fraiche et une protection durable contre les caries. Sa formule sans gluten et sans alcool est douce pour les gencives et respectueuse de l'environnement. Dentifrice idéal pour les gencives sensibles. Certifié bio par Ecocert. Produit végan\n\nProduit végan",
    notes: '',
    inci: "EAU, GLYCÉRINE**, HYDROLYSAT D'AMIDON DE MAÏS HYDROGÉNÉ, ACIDE SILICIQUE, DECYL GLUCOSIDE, CARMELLOSE (DÉRIVÉ DE CELLULOSE), AROME*, BENZOATE DE SODIUM (SEL DE SODIUM L'ACIDE BENZOÏQUE), EXTRAIT DE STEVIA REBAUDIANA*, HYDROXYDE DE SODIUM (SOUDE CAUSTIQUE), LIMONÈNE",
    url: 'https://www.pharmashopdiscount.com/fr/beaute/avril/avril-dentifrice-bio-menthe-fraiche-100ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/avril-dentifrice-bio-menthe-fraiche.webp',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
  },
  {
    slug: 'avril-dentifrice-blanchissant-bio',
    name: 'Dentifrice Blanchissant Bio',
    brand: 'Avril',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 399,
    description:
      "AVRIL Dentifrice Blanchissant Bio 100ml est en vente en ligne sur le site de votre parapharmacie à prix discount.\n\nCe dentifrice bio est spécialement conçu pour blanchir les dents et leur donner un éclat naturel. Il est formulé à base d'ingrédients naturels tels que le charbon végétal, Parfum naturel de menthe fraîche. Il est sans fluor pour une protection optimale contre les caries. Sa texture crémeuse et sa saveur mentholée en font un produit agréable à utiliser. Sa formule est douce pour les gencives et convient à tous les types de dents. AVRIL Dentifrice Blanchissant Bio 100ml est le produit idéal pour un sourire éclatant et une hygiène bucco-dentaire optimale. Certifié bio par Ecocert. Produit végan.",
    notes: '',
    inci: 'AQUA (WATER), SORBITOL, HYDRATED SILICA, GLYCERIN, XANTHAN GUM, LAURYL GLUCOSIDE, AROMA, CHARCOAL POWDER, MENTHA PIPERITA (PEPPERMINT) OIL, MENTHOL, SODIUM BENZOATE, REBAUDIOSIDE A, POTASSIUM SORBATE, CITRIC ACID, ANETHOLE, ALOE BARBADENSIS LEAF JUICE POWDER*, EUCALYPTUS GLOBULUS OIL, LIMONENE, BETA-CARYOPHYLLENE, PINENE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/avril/avril-dentifrice-blanchissant-bio-100ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/avril-dentifrice-blanchissant-bio.webp',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SORBITOL_DENTAL },
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.MENTHE_POIVREE },
      { slug: INGREDIENT_SLUGS.MENTHOL_DENTAL },
    ],
  },
]
