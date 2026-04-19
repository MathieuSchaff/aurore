import { TAG_SLUGS } from '../../tags/seed-tags'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../unified-types'

export const SEPHORA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'sephora-collection-creme-apaisante-centella-hyaluronique',
    name: 'Crème Apaisante - Acide hyaluronique & Centella asiatica',
    brand: 'Sephora Collection',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1700,
    description: 'Crème hydratante et apaisante avec acide hyaluronique pour l’hydratation et Centella asiatica pour calmer les rougeurs et irritations. Contient un pigment vert correcteur pour un effet immédiat sur les rougeurs.',
    notes: 'Texture crème confortable, adaptée aux peaux sensibles/irritées. Sans parfum fort.',
    inci: 'WATER, C15-19 ALKANE, DICAPRYLYL ETHER, BORON NITRIDE, PENTYLENE GLYCOL, GLYCERIN, POLYGLYCERYL-3 DISTEARATE, BUTYROSPERMUM PARKII BUTTER (BUTYROSPERMUM PARKII (SHEA BUTTER)), SODIUM ACRYLATES COPOLYMER, GLYCERYL STEARATE, TRIBEHENIN, OLUS OIL (VEGETABLE OIL), POTASSIUM CETYL PHOSPHATE, PROPANEDIOL, CETEARYL ALCOHOL, LECITHIN, CENTELLA ASIATICA EXTRACT, CI 77288 (CHROMIUM OXIDE GREENS), GLYCERYL STEARATE CITRATE, CITRIC ACID, SODIUM HYALURONATE, SODIUM PHYTATE, O-CYMEN-5-OL, SODIUM DEHYDROACETATE, TOCOPHEROL',
    url: 'https://www.sephora.fr',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PIGMENTS_VERTS,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.DESHYDRATATION,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EMOLLIENCE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Extrait de centella apaisant anti-rougeurs',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique hydratant',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité nourrissant',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante',},
    ],
  },
  {
    slug: 'sephora-collection-glow-gel-creme-vitamine-c-polyglutamique',
    name: 'GLOW Gel-Crème Éclat Vitamine C & Acide Polyglutamique',
    brand: 'Sephora Collection',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1699,
    description: 'Gel-crème léger illuminant avec vitamine C (3-O-ethyl ascorbic acid) et acide polyglutamique pour booster l’éclat, hydrater intensément et uniformiser le teint.',
    notes: 'Texture gel non grasse, fini glowy. Idéal pour tous types de peau cherchant de la luminosité sans lourdeur.',
    inci: 'WATER, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLYCERIN, PROPANEDIOL, SODIUM POLYACRYLOYLDIMETHYL TAURATE, 3-O-ETHYL ASCORBIC ACID, C15-19 ALKANE, COCO-CAPRYLATE/CAPRATE, POLYGLYCERYL-6 STEARATE, SODIUM CITRATE, CITRIC ACID, HYDROXYACETOPHENONE, 1,2-HEXANEDIOL, CAPRYLYL GLYCOL, C10-18 TRIGLYCERIDES, SODIUM BENZOATE, POLYGLYCERYL-6 BEHENATE, TETRASODIUM GLUTAMATE DIACETATE, TOCOPHEROL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, POLYGLUTAMIC ACID, CI 15510 (ORANGE 4), CI 19140 (YELLOW 5), SODIUM HYDROXIDE',
    url: 'https://www.sephora.fr',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.GEL_CREME,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.EMOLLIENCE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
        notes: '3-O-Ethyl Ascorbic Acid — vitamine C stable éclat',},
      {
        slug: INGREDIENT_SLUGS.POLYGLUTAMIC_ACID,
        notes: 'Acide polyglutamique — hydratation intense',},
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
        notes: 'Humectant',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante',},
    ],
  },
]
