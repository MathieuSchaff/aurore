import { TAG_SLUGS } from "../../tags/seed-tags";
import { INGREDIENT_SLUGS } from "../../ingredients/ingredient-slugs";
import type { UnifiedProductSeed } from "../unified-types";

export const AROMA_ZONE_SEED: UnifiedProductSeed[] = [
  {
    slug: "aroma-zone-serum-concentre-acide-azelaique-10",
    name: 'Sérum Concentré Acide Azélaïque 10%',
    brand: 'Aroma-Zone',
    kind: 'serum',
    unit: "pump",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 695,
    description: 'Sérum naturel 10% acide azélaïque + HA + silice. Séborégulateur, matifiant.',
    notes: '100% origine naturelle, marque française. Très asséchant selon avis, extrait saule (BHA naturel), picotements possibles. Pas idéal post-IPL.',
    inci: 'WATER, AZELAIC ACID, PENTYLENE GLYCOL, PHYTIC ACID, SALIX NIGRA BARK EXTRACT, SILICA, SODIUM HYDROXIDE, XANTHAN GUM, SODIUM HYALURONATE',
    url: 'https://www.aroma-zone.com',
    tags: {
      primary: [
        TAG_SLUGS.ANTI_ACNE,
        TAG_SLUGS.MATIFIANT,
        TAG_SLUGS.ANTI_ROUGEURS,
      ],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.BIO_NATUREL,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.BRILLANCE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
      ],
      avoid: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
        TAG_SLUGS.PEAU_REACTIVE,
      ],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        value: 10,
        unit: "%",
        notes: 'Acide azélaïque – séborégulateur, matifiant, anti-imperfections',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique – hydratation',},
      {
        slug: INGREDIENT_SLUGS.SALIX_NIGRA,
        notes: 'Extrait écorce de saule noir – BHA naturel, purifiant',},
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
      },
      {
        slug: INGREDIENT_SLUGS.SILICA,
        notes: 'Silice – matifiant instantané, absorbe sébum',},
    ],
  },
  {
    slug: "aroma-zone-serum-vitamine-c-10-astaxanthine",
    name: 'Sérum Concentré Vitamine C 10% & Astaxanthine',
    brand: 'Aroma-Zone',
    kind: 'serum',
    unit: "dropper",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 0,
    description: 'Sérum antioxydant puissant avec 10% d’ascorbyl glucoside et astaxanthine pour protéger contre le photo-vieillissement, stimuler le collagène, éclaircir et réduire les taches.',
    notes: 'Formule clean, vegan, avec hyaluronate de sodium et huile de jojoba. Convient aux peaux matures ou exposées.',
    inci: 'WATER, ASCORBYL GLUCOSIDE, GLYCERIN, SALIX NIGRA BARK EXTRACT, SODIUM HYDROXIDE, SODIUM LEVULINATE, HAEMATOCOCCUS PLUVIALIS EXTRACT, SODIUM HYALURONATE, SIMMONDSIA CHINENSIS SEED OIL, ASTRAGALUS GUMMIFER GUM, LEVULINIC ACID, SODIUM ANISATE, PHYTIC ACID, POLYPEPSILON-LYSINE, TOCOPHEROL, HELIANTHUS ANNUUS SEED OIL',
    url: 'https://www.aroma-zone.com',
    tags: {
      primary: [
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.ANTI_TACHES,
        TAG_SLUGS.PHOTO_VIEILLISSEMENT,
      ],
      secondary: [
        TAG_SLUGS.ANTI_AGE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.BIO_NATUREL,
        TAG_SLUGS.VEGAN,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
        notes: '10% ascorbyl glucoside (vitamine C stable) – éclat, antioxydant, anti-taches',},
      {
        slug: INGREDIENT_SLUGS.HAEMATOCOCCUS_PLUVIALIS,
        notes: 'Astaxanthine (extrait Haematococcus pluvialis) – antioxydant puissant',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique – hydratation',},
      {
        slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA,
        notes: 'Huile de jojoba – émollient, barrière',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E – antioxydant',},
      {
        slug: INGREDIENT_SLUGS.SALIX_NIGRA,
        notes: 'Extrait saule noir – purifiant',},
    ],
  },
  {
    slug: "aroma-zone-serum-bakuchiol",
    name: 'Sérum Bakuchiol',
    brand: 'Aroma-Zone',
    kind: 'serum',
    unit: "dropper",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 600,
    description: 'Sérum anti-âge naturel au bakuchiol (alternative douce au rétinol) dans une base squalane. Stimule collagène, réduit rides sans irritation.',
    notes: 'Minimaliste (3 ingrédients), vegan, stable.',
    inci: 'SQUALANE, ISOSORBIDE DICAPRYLATE, BAKUCHIOL',
    url: 'https://www.aroma-zone.com',
    tags: {
      primary: [
        TAG_SLUGS.ANTI_AGE,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.POST_ACNE,
      ],
      secondary: [
        TAG_SLUGS.CICATRISATION,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.HUILE_VISAGE,
        TAG_SLUGS.BIO_NATUREL,
        TAG_SLUGS.VEGAN,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.SOIR,
      ],
      avoid: [
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.BRILLANCE,
      ],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.BAKUCHIOL,
        notes: 'Bakuchiol – alternative douce au rétinol, anti-âge, collagène',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Squalane – hydratant, barrière (base minimaliste)',},
      {
        slug: INGREDIENT_SLUGS.ISOSORBIDE_DICAPRYLATE,
        notes: 'Émollient léger',},
    ],
  },
  {
    slug: "aroma-zone-serum-acide-hyaluronique-3-5",
    name: 'Sérum Concentré Acide Hyaluronique 3,5%',
    brand: 'Aroma-Zone',
    kind: 'serum',
    unit: "dropper",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 595,
    description: `Ce sérum 100% d'origine naturelle est l'un des plus concentrés du marché (3,5%). Il est reconnu pour lisser, hydrater et repulper la peau tout en comblant les rides.`,
    notes: `Note: 4.6/5. Sans alcool. Contient de l'acide hyaluronique de différents poids moléculaires (5 kDa à 1800 kDa). Peut aussi s'utiliser sur les cheveux secs. Certifié COSMOS NATURAL.`,
    inci: 'WATER, SODIUM HYALURONATE, SALIX NIGRA BARK EXTRACT, GLYCERIN',
    url: 'https://www.aroma-zone.com',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPULPANT],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.BIO_NATUREL,
        TAG_SLUGS.VEGAN,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_ATOPIQUE,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        value: 3.5,
        unit: "%",
        notes: 'Acide hyaluronique pur – 3 poids moléculaires pour hydratation en profondeur',},
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
        notes: 'Humectant de base',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Provitamine B5 apaisante',},
    ],
  },
];
