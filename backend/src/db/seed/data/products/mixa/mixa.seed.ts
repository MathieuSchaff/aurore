import { TAG_SLUGS } from '../../../data/tags';
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs';
import type { UnifiedProductSeed } from '../types';

export const MIXA_SEED: UnifiedProductSeed[] = [
  {
    slug: "mixa-creme-niacinamide-correction-eclat",
    name: 'Crème Niacinamide Correction Éclat',
    brand: 'Mixa',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 400,
    amountUnit: "ml",
    priceCents: 790,
    description: 'Crème anti-taches et éclat pour peaux sèches à ternes. Unifie le teint, atténue hyperpigmentation post-acné, hydrate 48h.',
    notes: 'Niacinamide + Vitamine Cg + beurre de karité + acide salicylique doux. Recommandé pour taches légères, teint terne. Multi-usages visage/corps/mains.',
    inci: 'WATER, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, ISOPROPYL PALMITATE, NIACINAMIDE, PROPANEDIOL, CETYL ALCOHOL, MYRISTYL MYRISTATE, ZEA MAYS STARCH, ASCORBYL GLUCOSIDE, CAPRYLYL GLYCOL, CARBOMER, CITRIC ACID, HYDROXYACETOPHENONE, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, SALICYLIC ACID, SODIUM HYDROXIDE, TOCOPHEROL, PARFUM',
    url: 'https://www.mixa.fr',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.ZONE_MAINS,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Niacinamide – unifie teint, atténue taches post-acné, barrière',},
      {
        slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
        notes: 'Vitamine C stable (Ascorbyl Glucoside) – éclat, anti-taches',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – nourrissant 48h',},
      {
        slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
        notes: 'Acide salicylique doux – exfoliation légère, anti-imperfections',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E – antioxydant',},
    ],
  },
  {
    slug: "mixa-creme-fraiche-fondante-acide-hyaluronique",
    name: `Crème Fraîche et Fondante à l'Acide Hyaluronique`,
    brand: 'Mixa',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 400,
    amountUnit: "ml",
    priceCents: 442,
    description: 'Crème hydratante fraîche 24h pour peaux déshydratées. Texture fondante non grasse, #1 crèmes mains/ongles.',
    notes: `Sodium Hyaluronate + beurre de karité + huiles d'amande douce et soja. Idéal hydratation quotidienne, sensation fraîche.`,
    inci: 'WATER, CETYL ALCOHOL, GLYCERIN, ISOPROPYL PALMITATE, BUTYROSPERMUM PARKII BUTTER, GLYCERYL STEARATE, DIMETHICONE, ALCOHOL DENAT., PEG-40 STEARATE, PRUNUS AMYGDALUS DULCIS OIL, GLYCINE SOJA OIL, SORBITAN TRISTEARATE, CARBOMER, SODIUM HYALURONATE, SODIUM HYDROXIDE, CAPRYLYL GLYCOL, CITRIC ACID, TOCOPHEROL, CHLORHEXIDINE DIGLUCONATE, PARFUM',
    url: 'https://www.mixa.fr',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.CREME_MAINS,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.ZONE_MAINS,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique – hydratation 24h, sensation fraîche',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – nourrissant',},
      {
        slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
        notes: `Huile d'amande douce – émollient`,},
      {
        slug: INGREDIENT_SLUGS.HUILE_SOJA,
        notes: 'Huile de soja – nourrissante',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
    ],
  },
  {
    slug: "mixa-creme-peaux-seches-sensibles",
    name: 'Crème pour Peaux Sèches et Sensibles',
    brand: 'Mixa',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 400,
    amountUnit: "ml",
    priceCents: 443,
    description: 'Crème minimaliste nourrissante pour peaux sèches/sensibles. Convient bébés/enfants/adultes, meilleur rapport qualité/prix.',
    notes: `Beurre de karité + huiles d'amande douce/soja + triglycérides. Formule simple, apaisante, usage quotidien.`,
    inci: 'WATER, CETYL ALCOHOL, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, BUTYROSPERMUM PARKII BUTTER, GLYCERYL STEARATE, DIMETHICONE, PEG-40 STEARATE, PRUNUS AMYGDALUS DULCIS OIL, GLYCINE SOJA OIL, SORBITAN TRISTEARATE, CARBOMER, SODIUM HYDROXIDE, CAPRYLYL GLYCOL, CITRIC ACID, TOCOPHEROL, CHLORHEXIDINE DIGLUCONATE, PARFUM',
    url: 'https://www.mixa.fr',
    tags: {
      primary: [TAG_SLUGS.PEAU_SENSIBLE],
      secondary: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.ZONE_MAINS,
        TAG_SLUGS.HYPOALLERGENIQUE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – nourrissant intense',},
      {
        slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
        notes: `Huile d'amande douce – apaisant`,},
      {
        slug: INGREDIENT_SLUGS.HUILE_SOJA,
        notes: 'Huile de soja – émollient',},
      {
        slug: INGREDIENT_SLUGS.CAPRYLIC_CAPRIC_TRIGLYCERIDE,
        notes: 'Triglycérides – hydratation légère',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
    ],
  },
  {
    slug: "mixa-creme-panthenol-confort",
    name: 'Crème Panthénol Confort',
    brand: 'Mixa',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 400,
    amountUnit: "ml",
    priceCents: 682,
    description: 'Crème apaisante anti-démangeaisons sans parfum pour peaux réactives/irritées. Soulage eczéma/psoriasis léger.',
    notes: 'Panthénol + niacinamide + beurre de karité + vitamine E. Idéal peaux qui grattent, allergies parfums.',
    inci: 'WATER, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, ISOPROPYL PALMITATE, PROPANEDIOL, CETYL ALCOHOL, MYRISTYL MYRISTATE, PANTHENOL, ZEA MAYS STARCH, NIACINAMIDE, CAPRYLYL GLYCOL, CARBOMER, CITRIC ACID, HYDROXYACETOPHENONE, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, SODIUM HYDROXIDE, TOCOPHEROL',
    url: 'https://www.mixa.fr',
    tags: {
      primary: [TAG_SLUGS.PEAU_REACTIVE],
      secondary: [
        TAG_SLUGS.PEAU_ATOPIQUE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.ZONE_MAINS,
        TAG_SLUGS.HYPOALLERGENIQUE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Panthénol – apaisant, anti-démangeaisons, réparateur',},
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Niacinamide – barrière, anti-irritations',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – confort',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E – antioxydant',},
    ],
  },
  {
    slug: "mixa-creme-ceramide-protection",
    name: 'Crème Céramide Protection',
    brand: 'Mixa',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 400,
    amountUnit: "ml",
    priceCents: 631,
    description: 'Crème renforçante barrière sans parfum pour peaux atopiques/sensibles. Protection environnementale (pollution).',
    notes: 'Céramides synthétiques + squalane + beurre de karité. Idéal barrière endommagée, peaux atopiques.',
    inci: 'WATER, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, ISOPROPYL PALMITATE, PROPANEDIOL, CETYL ALCOHOL, MYRISTYL MYRISTATE, ZEA MAYS STARCH, SQUALANE, CARBOMER, SODIUM HYDROXIDE, 2-OLEAMIDO-1,3-OCTADECANEDIOL, HYDROXYACETOPHENONE, HYDROXYPALMITOYL SPHINGANINE, CAPRYLYL GLYCOL, CITRIC ACID, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, TOCOPHEROL',
    url: 'https://www.mixa.fr',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.PEAU_ATOPIQUE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.ZONE_MAINS,
        TAG_SLUGS.HYPOALLERGENIQUE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Squalane – renforce barrière, protection pollution',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – nourrissant',},
      {
        slug: INGREDIENT_SLUGS.TWO_OLEAMIDO_1_3_OCTADECANEDIOL,
        notes: 'Céramide synthétique (2-Oleamido-1,3-Octadecanediol) – barrière',},
      {
        slug: INGREDIENT_SLUGS.HYDROXYPALMITOYL_SPHINGANINE,
        notes: 'Céramide-like – protection atopique',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
    ],
  },
  {
    slug: "mixa-creme-cica-reparation",
    name: 'Crème Cica Réparation',
    brand: 'Mixa',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 400,
    amountUnit: "ml",
    priceCents: 642,
    description: 'Crème réparatrice exfoliante douce avec urée pour peaux rugueuses/squameuses. Best-seller Amazon.',
    notes: 'Urée haute concentration + niacinamide + panthénol + glycine. Optimal kératose pilaire, psoriasis léger, coudes/genoux/talons.',
    inci: 'WATER, UREA, GLYCERIN, DIMETHICONE, PARAFFINUM LIQUIDUM, PROPYLENE GLYCOL, BUTYROSPERMUM PARKII BUTTER, CETEARYL ALCOHOL, ALCOHOL DENAT., ZEA MAYS STARCH, HELIANTHUS ANNUUS SEED OIL, GLYCERYL STEARATE, PEG-100 STEARATE, GLYCINE, HYDROXYETHYLPIPERAZINE ETHANE SULFONIC ACID, SODIUM HYDROXIDE, SODIUM LACTATE, TETRASODIUM GLUTAMATE DIACETATE, NIACINAMIDE, PANTHENOL, TOCOPHEROL, TOCOPHERYL ACETATE, CAPRYLYL GLYCOL, CARBOMER, CITRIC ACID, XANTHAN GUM, PHENOXYETHANOL, PARFUM',
    url: 'https://www.mixa.fr',
    tags: {
      primary: [TAG_SLUGS.PEAU_RUGUEUSE, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.ZONE_MAINS,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.UREA,
        notes: 'Urée haute concentration – exfolie, hydrate, répare kératose/squames',},
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Niacinamide – apaisant, barrière',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Panthénol – réparateur',},
      {
        slug: INGREDIENT_SLUGS.GLYCINE,
        notes: 'Glycine – hydratant, apaisant',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
      },
    ],
  },
  {
    slug: "mixa-creme-peaux-tres-seches-ternes",
    name: 'Crème des Peaux Très Sèches et Ternes',
    brand: 'Mixa',
    kind: 'moisturizer',
    unit: "pump",
    totalAmount: 400,
    amountUnit: "ml",
    priceCents: 452,
    description: 'Crème nourrissante éclat pour peaux très sèches/ternes (mates à foncées). Ravive luminosité, nourrit 48h.',
    notes: `Beurre de cacao pur + beurre de karité + glycérine. Idéal \"peau de crocodile\", teint grisâtre, nutrition intense.`,
    inci: 'WATER, GLYCERIN, ISOPROPYL PALMITATE, CETEARYL ALCOHOL, PROPANEDIOL, GLYCERYL STEARATE, DIMETHICONE, CETYL ESTERS, THEOBROMA CACAO SEED BUTTER, BUTYROSPERMUM PARKII BUTTER, PEG-100 STEARATE, AMMONIUM POLYACRYLOYLDIMETHYL TAURATE, HYDROXYACETOPHENONE, CAPRYLYL GLYCOL, CITRIC ACID, XANTHAN GUM, PARFUM',
    url: 'https://www.mixa.fr',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.PEAU_SECHE],
      secondary: [
        TAG_SLUGS.OCCLUSIF,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.ZONE_MAINS,
        TAG_SLUGS.TEXTURE_RICHE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.BEURRE_CACAO,
        notes: 'Beurre de cacao pur – nutrition intense, anti-terne',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – nourrissant 48h',},
      { slug: INGREDIENT_SLUGS.GLYCERIN, notes: 'Glycérine – hydratant',},
    ],
  },
];
