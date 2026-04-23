import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const AZELAIQUE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'dr-sam-flawless-brightly-10-azelaic-acid-serum',
    name: 'Flawless Brightly 10% Azelaic Acid Serum',
    brand: 'Sonya Driver',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 6000,
    description:
      'Sérum 10% azélaïque + niacinamide + vitamine C + bakuchiol. Éclaircissant tout-en-un pour teint terne.',
    notes:
      'Texture émulsion confortable, vegan/cruelty-free. Redondance niacinamide/vit C dans une routine, prix élevé pour formule basique.',
    inci: 'WATER, AZELAIC ACID (10%), CAPRYLIC/CAPRIC TRIGLYCERIDE, NIACINAMIDE, DICAPRYLYL CARBONATE, ASCORBYL GLUCOSIDE, CETEARYL ALCOHOL, GLYCERIN, GLYCERYL STEARATE SE, CETEARYL OLIVATE, BAKUCHIOL, SORBITAN OLIVATE, BENZYL ALCOHOL, XANTHAN GUM, PHENOXYETHANOL, SODIUM HYDROXIDE, DISODIUM EDTA, DEHYDROACETIC ACID',
    url: 'https://drsambunting.com',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.POST_ACNE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        concentrationValue: 10,
        concentrationUnit: '%',
        notes: 'éclaircissant, anti-imperfections',
      },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Multi-tâches : barrière, sébum, teint' },
      {
        slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
        notes: 'Vitamine C stable – antioxydant, éclat',
      },
      { slug: INGREDIENT_SLUGS.BAKUCHIOL, notes: 'Anti-âge doux' },
      { slug: INGREDIENT_SLUGS.GLYCERIN },
    ],
  },

  {
    slug: 'qa-azelaic-acid-balancing-serum',
    name: 'Azelaic Acid Balancing Serum',
    brand: 'Q+A',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 900,
    description: `Sérum équilibrant à l'acide azélaïque enrichi en Zinc PCA pour minimiser les pores et en antioxydants pour une peau plus lisse et fraîche. Idéal pour les peaux à tendance acnéique.`,
    notes: `Formule avec jus d'aloe vera et extraits de graines de céréales (épeautre, khorasan, teff, quinoa) pour un soin nourrissant et antioxydant.`,
    inci: 'WATER, ALOE BARBADENSIS LEAF JUICE, PROPYLENE GLYCOL, AZELAIC ACID, BETAINE, ZINC PCA, BIOSACCHARIDE GUM-1, GLYCERIN, TRITICUM SPELTA SEED EXTRACT, TRITICUM TURANICUM SEED EXTRACT, ERAGROSTIS TEF SEED EXTRACT, CHENOPODIUM QUINOA SEED EXTRACT, XANTHAN GUM, SODIUM LEVULINATE, GLYCERYL CAPRYLATE, SODIUM ANISATE, CAPRYLYL GLYCOL, SODIUM GLUCONATE, BENZYL ALCOHOL, DEHYDROACETIC ACID, SODIUM BENZOATE, PHENOXYETHANOL, SODIUM HYDROXIDE, CITRIC ACID',
    url: 'https://www.qandskincare.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PORES_DILATES],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        notes: `Actif principal équilibrant. Régule le sébum, réduit l'hyperpigmentation et les imperfections.`,
      },
      {
        slug: INGREDIENT_SLUGS.ZINC_PCA,
        notes: `Minimise les pores et régule le sébum, en synergie avec l'acide azélaïque.`,
      },
      {
        slug: INGREDIENT_SLUGS.ALOE_VERA,
        notes: `Jus de feuille d'aloe vera en tête de liste. Apaisant, hydratant et calmant.`,
      },
      {
        slug: INGREDIENT_SLUGS.BETAINE,
        notes: 'Osmoprotecteur et humectant doux. Renforce la tolérance cutanée.',
      },
    ],
  },

  {
    slug: 'apis-terapis-azelaic-acid-30',
    name: 'TerApis 30% Azelaic Acid Peeling Serum',
    brand: 'Apis Natural Cosmetics',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1000,
    description: `Sérum peeling exfoliant à haute concentration en acide azélaïque 30%. Exfolie délicatement, stimule le renouvellement cellulaire et réduit efficacement l'hyperpigmentation. Adapté aux peaux acnéiques, atopiques, avec érythème, rosacée, psoriasis et folliculite.`,
    notes: `Formule minimaliste à 30% d'acide azélaïque — concentration professionnelle. Usage en soin ciblé pour hyperpigmentation et décoloration.`,
    inci: 'WATER, POLYETHYLENE GLYCOL 400, AZELAIC ACID, CARBOMER, PHENOXYETHANOL, CAPRYLYL GLYCOL',
    url: 'https://www.notino.fr/apis-natural-cosmetics/',
    tags: {
      primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_ACNE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
        TAG_SLUGS.ROSACEE,
        TAG_SLUGS.PEAU_ATOPIQUE,
        TAG_SLUGS.GRAIN_PEAU,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        concentrationValue: 30,
        concentrationUnit: '%',
        notes:
          'concentration professionnelle. Exfoliation, renouvellement cellulaire, anti-pigmentation et anti-sébum.',
      },
    ],
  },

  {
    slug: 'cos-de-baha-azelaic-acid-10-serum',
    name: 'AZ Azelaic Acid 10 Serum',
    brand: 'Cos De BAHA',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 572,
    description: `Sérum à l'acide azélaïque 10% avec base à l'aloe vera. Estompe les cicatrices d'acné, améliore l'hyperpigmentation et traite la rosacée. Enrichi en niacinamide et extraits botaniques certifiés bio pour un teint plus lumineux et unifié.`,
    notes: `Base à l'extrait de feuille d'Aloe Barbadensis en tête de liste INCI. Extraits bio certifiés : thé vert, Momordica Charantia, fleurs de sureau, Leontopodium Alpinum (edelweiss).`,
    inci: 'ALOE BARBADENSIS LEAF EXTRACT, PROPYLENE GLYCOL, AZELAIC ACID (10%), POLYSORBATE 20, 1,2-HEXANEDIOL, PROPANEDIOL, PANTHENOL, NIACINAMIDE, SODIUM HYALURONATE, CAMELLIA SINENSIS LEAF EXTRACT, MOMORDICA CHARANTIA FRUIT EXTRACT, SAMBUCUS NIGRA FLOWER EXTRACT, LEONTOPODIUM ALPINUM EXTRACT',
    url: 'https://www.yesstyle.com/fr/cos-de-baha',
    tags: {
      primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_ACNE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.ROSACEE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.POST_ACNE,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        concentrationValue: 10,
        concentrationUnit: '%',
        notes: `efface cicatrices d'acné, améliore l'hyperpigmentation et traite la rosacée.`,
      },
      {
        slug: INGREDIENT_SLUGS.ALOE_VERA,
        notes: 'Base de la formule. Hydratant, apaisant et porteur naturel des actifs.',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: `Dépigmentant et anti-inflammatoire. Renforce l'action anti-taches de l'acide azélaïque.`,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: `Hydratation profonde et rétention d'eau.`,
      },
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Provitamine B5 apaisante et cicatrisante.' },
      {
        slug: INGREDIENT_SLUGS.GREEN_TEA,
        notes: 'Extrait de thé vert certifié bio. Antioxydant puissant et anti-inflammatoire.',
      },
    ],
  },
]
