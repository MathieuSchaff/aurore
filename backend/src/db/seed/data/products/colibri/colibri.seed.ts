import { TAG_SLUGS } from '../../../data/tags';
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs';
import type { UnifiedProductSeed } from '../types';

export const COLIBRI_SEED: UnifiedProductSeed[] = [
  {
    slug: "colibri-brightening-booster-azelaic-10",
    name: 'Brightening Booster',
    brand: 'Colibri Skincare',
    kind: 'serum',
    unit: "pump",
    totalAmount: 50,
    amountUnit: "ml",
    priceCents: 2471,
    description: 'Booster éclaircissant 10% acide azélaïque + mandélique doux + réglisse + thé vert. Uniformise teint, apaise, compatible rétinal.',
    notes: 'Recommandé post-IPL : 10% efficace, mandélique peu irritant, céramides-like (jojoba/squalane), texture crèmeuse agréable, excellent rapport qualité/prix.',
    inci: 'AQUA, AZELAIC ACID, GLYCERIN, COCO-CAPRYLATE, PENTYLENE GLYCOL, POTASSIUM HYDROXIDE, METHYL GLUCOSE SESQUISTEARATE, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, SQUALANE, ETHYL MACADAMIATE, CETEARYL ALCOHOL, PRUNUS DOMESTICA SEED OIL, GLYCYRRHIZA GLABRA (LICORICE) ROOT EXTRACT, 3-O-ETHYL ASCORBIC ACID, CAMELLIA SINENSIS LEAF EXTRACT, TOCOPHEROL, MANDELIC ACID, MALIC ACID, BEHENYL ALCOHOL, XANTHAN GUM',
    url: 'https://colibriskincare.com',
    tags: {
      primary: [
        TAG_SLUGS.ANTI_ROUGEURS,
        TAG_SLUGS.HYPERPIGMENTATION,
        TAG_SLUGS.ECLAT,
      ],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.NON_COMEDOGENE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        notes: '10% — Anti-taches, anti-rougeurs et kératolytique',},
      {
        slug: INGREDIENT_SLUGS.MANDELIC_ACID,
        notes: 'AHA doux exfoliant et uniformisant',},
      {
        slug: INGREDIENT_SLUGS.REGLISSE,
        notes: 'Extrait de réglisse anti-inflammatoire',},
      {
        slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
        notes: 'Dérivé vitamine C stable éclat',},
      {
        slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA,
        notes: 'Émollient céramide-like',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Lipide occlusif doux',},
    ],
  },
  {
    slug: "colibri-pore-control-booster",
    name: 'Pore Control Booster',
    brand: 'Colibri Skincare',
    kind: 'serum',
    unit: "pump",
    totalAmount: 50,
    amountUnit: "ml",
    priceCents: 2795,
    description: 'Booster ciblé pores dilatés, sébum et imperfections. Régule production de sébum, affine pores, réduit inflammations.',
    notes: 'Niacinamide 8% + NMN 4% + extrait Bixa Orellana + Acetyl-Hexapeptide-1. Texture légère aqueuse, idéal peaux mixtes/grasses/à imperfections. Jour/nuit.',
    inci: 'AQUA, NIACINAMIDE, BUTYLENE GLYCOL, GLYCERIN, NICOTINAMIDE MONONUCLEOTIDE, PENTYLENE GLYCOL, PROPYLHEPTYL CAPRYLATE, LAUROYL LYSINE, SODIUM GLUCONATE, ACETYL HEXAPEPTIDE-1, BIXA ORELLANA (ANNATTO) SEED EXTRACT, POLYGLUTAMIC ACID, SODIUM STEAROYL GLUTAMATE, CAPRYLYL GLYCOL, SODIUM HYALURONATE, 1,2-HEPTANEDIOL, CETEARYL ALCOHOL, SPHINGOMONAS FERMENT EXTRACT, ARGININE, MALTODEXTRIN, MICROCRYSTALLINE CELLULOSE, TOCOPHEROL, CELLULOSE GUM, CITRIC ACID',
    url: 'https://colibriskincare.com',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE],
      secondary: [
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.ANTI_ACNE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: '8% — Resserre pores et régule sébum',},
      {
        slug: INGREDIENT_SLUGS.NMN,
        notes: '4% — NMN précurseur NAD+ anti-âge cellulaire',},
      {
        slug: INGREDIENT_SLUGS.POLYGLUTAMIC_ACID,
        notes: 'Super-hydratant',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique hydratant',},
      {
        slug: INGREDIENT_SLUGS.SPHINGOMONAS_FERMENT,
        notes: 'Postbiotique rééquilibrant microbiome',},
    ],
  },
  {
    slug: "colibri-calming-moisturizer",
    name: 'Calming Moisturizer',
    brand: 'Colibri Skincare',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 80,
    amountUnit: "ml",
    priceCents: 2695,
    description: 'Crème apaisante et hydratante pour peaux sensibles/irritées. Renforce barrière, calme rougeurs et soutient régénération.',
    notes: 'Centella Asiatica + Panthénol + Squalane + HA + Céramide NP + Vitamine E. Texture crème nourrissante mais légère, usage quotidien jour/nuit.',
    inci: 'AQUA, SQUALANE, DECYL COCOATE, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, GLYCERYL STEARATE CITRATE, CETEARYL ALCOHOL, PANTHENOL, PRUNUS AMYGDALUS DULCIS OIL, CERAMIDE NP, TOCOPHEROL, CENTELLA ASIATICA LEAF EXTRACT, GLYCERYL STEARATE, HYDROXYACETOPHENONE, 1,2-HEXANEDIOL, CAPRYLYL GLYCOL, SODIUM STEAROYL GLUTAMATE, SODIUM HYALURONATE, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, HYDROGENATED PHOSPHATIDYLCHOLINE, HELIANTHUS ANNUUS SEED OIL, CITRIC ACID, ASIATICOSIDE, PENTYLENE GLYCOL, MADECASSIC ACID, ASIATIC ACID, XANTHAN GUM',
    url: 'https://colibriskincare.com',
    tags: {
      primary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_ATOPIQUE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Asiaticoside + acides madécassique et asiatique',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Provitamine B5 hydratante',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Lipide émollient biomimétique',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramide NP barrière cutanée',},
      {
        slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
        notes: `Huile d'amande douce émolliente`,},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité nourrissant',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique hydratant',},
    ],
  },
  {
    slug: "colibri-vitamin-c-20-booster",
    name: 'Vitamin C 20 Booster',
    brand: 'Colibri Skincare',
    kind: 'serum',
    unit: "pump",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 3295,
    description: 'Booster vitamine C stable 20% multi-formes. Stimule collagène, atténue hyperpigmentation, protection antioxydante.',
    notes: '3-O-Ethyl Ascorbic Acid + THD Ascorbate + 3-Glyceryl Ascorbate + Acetyl Zingerone + Hexylresorcinol. Texture huileuse légère, soir (ou jour avec SPF).',
    inci: 'AQUA, 3-O-ETHYL ASCORBIC ACID, TETRAHEXYLDECYL ASCORBATE, 3-GLYCERYL ASCORBATE, GLYCERIN, PENTYLENE GLYCOL, PROPYLHEPTYL CAPRYLATE, GLYCERYL STEARATE CITRATE, COCO-CAPRYLATE/CAPRATE, ACETYL ZINGERONE, HYDROGENATED LECITHIN, HEXYLRESORCINOL, POLYGLYCERYL-3 STEARATE, HYDROGENATED PHOSPHATIDYLCHOLINE, ALLANTOIN, MICROCRYSTALLINE CELLULOSE, SODIUM STEAROYL GLUTAMATE, SODIUM CARBOXYMETHYLCELLULOSE, TOCOPHEROL, CITRIC ACID, SODIUM PHYTATE, XANTHAN GUM',
    url: 'https://colibriskincare.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_AGE],
      secondary: [
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.HYPERPIGMENTATION,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PHOTO_VIEILLISSEMENT,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.PEAU_SENSIBLE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
        notes: '3-O-Ethyl Ascorbic Acid — vitamine C stable',},
      {
        slug: INGREDIENT_SLUGS.THD_ASCORBATE,
        notes: 'THD Ascorbate — vitamine C liposoluble stable',},
      {
        slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
        notes: 'Dépigmentant et antioxydant',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E synergique',},
    ],
  },
  {
    slug: "colibri-vitamin-c15-booster",
    name: 'Vitamin C15 Booster',
    brand: 'Colibri Skincare',
    kind: 'serum',
    unit: "pump",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 2195,
    description: 'Booster vitamine C stable 15%. Uniformise teint, protège radicaux libres, stimule collagène.',
    notes: '3-O-Ethyl Ascorbic Acid 15% + complexe plancton/arginine ferulate. Texture aqueuse légère, jour/nuit (avec SPF le jour).',
    inci: 'AQUA, 3-O-ETHYL ASCORBIC ACID, BUTYLENE GLYCOL, PENTYLENE GLYCOL, SODIUM HYALURONATE, ARGININE FERULATE, CELLULOSE GUM, XANTHAN GUM, PLANKTON EXTRACT, CELLULOSE, FRUCTOSE, GLUCOSE',
    url: 'https://colibriskincare.com',
    tags: {
      primary: [TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.DESHYDRATATION,
        TAG_SLUGS.ANTI_TACHES,
        TAG_SLUGS.ANTI_AGE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.PHOTO_VIEILLISSEMENT,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
        notes: '15% — 3-O-Ethyl Ascorbic Acid — vitamine C stable',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique hydratant',},
      {
        slug: INGREDIENT_SLUGS.ARGININE,
        notes: 'Complexe plancton/arginine ferulate antioxydant',},
    ],
  },
  {
    slug: "colibri-barrier-booster",
    name: 'Barrier Booster',
    brand: 'Colibri Skincare',
    kind: 'serum',
    unit: "pump",
    totalAmount: 50,
    amountUnit: "ml",
    priceCents: 2471,
    description: `Booster barrière cutanée avec 5 céramides + ectoine. Réduit perte d'eau transépidermique, apaise, renforce protection.`,
    notes: 'Céramides NP/AP/AS/NS/EOP + Ectoin + Panthénol + Allantoïne + Vitamine F + HA. Texture crème riche mais absorbante, jour/nuit.',
    inci: 'AQUA, PENTYLENE GLYCOL, PANTHENOL, TRICAPRYLIN, GLYCERYL STEARATE, CANDELILLA/JOJOBA/RICE BRAN POLYGLYCERYL-3 ESTERS, ASCORBYL GLUCOSIDE, CAPRYLYL CAPRYLATE/CAPRATE, ECTOIN, NIACINAMIDE, SQUALANE, CERAMIDE NP, CERAMIDE AP, CERAMIDE AS, CERAMIDE NS, CERAMIDE EOP, LINOLEIC ACID, LINOLENIC ACID, CHOLESTEROL, ASIATICOSIDE, MADECASSIC ACID, ASIATIC ACID, TOCOPHEROL, ALLANTOIN, BETA_GLUCAN, GLYCERIN, SODIUM HYALURONATE, HYDROGENATED LECITHIN, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, CETEARYL ALCOHOL, SODIUM STEAROYL LACTYLATE, CITRIC ACID, DIPROPYLENE GLYCOL, SUCROSE DISTEARATE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, PROPYLHEPTYL CAPRYLATE, XANTHAN GUM',
    url: 'https://colibriskincare.com',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.PEAU_ATOPIQUE],
      secondary: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.OCCLUSIF,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CERAMIDES,
        notes: '5 céramides biomimétiques (NP/AP/AS/NS/EOP)',},
      {
        slug: INGREDIENT_SLUGS.ECTOIN,
        notes: 'Ectoine — osmoprotecteur anti-stress cutané',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Provitamine B5 réparatrice',},
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
        notes: 'Lipide barrière biomimétique',},
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Renforce la barrière',},
      {
        slug: INGREDIENT_SLUGS.ALLANTOIN,
        notes: 'Apaisant et cicatrisant',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique hydratant',},
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Asiaticoside + acides madécassique et asiatique',},
    ],
  },
  {
    slug: "colibri-antioxidant-serum",
    name: 'Antioxidant Serum',
    brand: 'Colibri Skincare',
    kind: 'serum',
    unit: "pump",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 2595,
    description: 'Sérum antioxydant multi-sources pour protéger du vieillissement prématuré, radicaux libres et stress oxydatif.',
    notes: 'Resvératrol + Superoxyde Dismutase + Caroténoïdes + extraits thé blanc/vert/rooibos. Texture aqueuse légère, usage jour (avec SPF).',
    inci: 'AQUA, DIMETHYL ISOSORBIDE, PENTYLENE GLYCOL, ASCORBYL GLUCOSIDE, NIACINAMIDE, TOCOPHERYL ACETATE, TRICAPRYLIN, PROPYLHEPTYL CAPRYLATE, GLYCERYL STEARATE, CANDELILLA/JOJOBA/RICE BRAN POLYGLYCERYL-3 ESTERS, RESVERATROL, GLYCERIN, ACETYL ZINGERONE, SUPEROXIDE DISMUTASE, SODIUM STEAROYL GLUTAMATE, CETEARYL ALCOHOL, CAMELLIA SINENSIS (TEA) LEAF EXTRACT, CAROTENOIDS, SODIUM STEAROYL LACTYLATE, MALTODEXTRIN, ALLANTOIN, ASPALATHUS LINEARIS (ROOIBOS) LEAF EXTRACT, TOCOPHEROL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, SODIUM PHYTATE, SODIUM HYALURONATE, SODIUM CHLORIDE, XANTHAN GUM, CITRIC ACID',
    url: 'https://colibriskincare.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.PHOTO_VIEILLISSEMENT],
      secondary: [
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.PROTECTION_CUTANEE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.RESVERATROL,
        notes: 'Polyphénol antioxydant puissant',},
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Antioxydant et protecteur barrière',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante',},
      {
        slug: INGREDIENT_SLUGS.GREEN_TEA,
        notes: 'Extrait thé vert polyphénols',},
    ],
  },
];
