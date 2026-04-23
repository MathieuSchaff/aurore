import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const OCCITANE_SEED: UnifiedProductSeed[] = [
  // ── CLEANSERS ───────────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-mousse-nettoyante-125ml',
    name: 'Mousse-en-Crème Nettoyante Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'cleanser',
    unit: 'tube',
    totalAmount: 125,
    amountUnit: 'ml',
    priceCents: 3500,
    description: `Crème nettoyante onctueuse qui se transforme en mousse douce et légère au contact de l'eau. Retire délicatement le maquillage, même waterproof, et les impuretés accumulées tout au long de la journée pour révéler un teint frais et éclatant.`,
    notes: `Enrichie en AHA exfoliants et huile essentielle d'Immortelle bio de Corse. Formule testée sous contrôle dermatologique, adaptée à tous types de peau. 97% des femmes trouvent que la mousse aide la peau à paraître plus nette.`,
    inci: 'WATER, GLYCERIN, SODIUM COCOYL GLYCINATE, COCO-BETAINE, DECYL GLUCOSIDE, HELICHRYSUM ITALICUM EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, CITRIC ACID, LACTIC ACID, SODIUM CHLORIDE, XANTHAN GUM, TOCOPHERYL ACETATE, PARFUM/FRAGRANCE, BENZYL SALICYLATE, LIMONENE, LINALOOL, GERANIOL',
    url: 'https://fr.loccitane.com/mousse-en-creme-nettoyante-immortelle-divine-27MC125I23.html',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.GRAIN_PEAU],
      secondary: [
        TAG_SLUGS.DOUBLE_NETTOYAGE_2,
        TAG_SLUGS.MOUSSE_NETTOYANTE,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Extrait aqueux d'Immortelle bio de Corse aux propriétés antioxydantes et anti-âge, ainsi que HE`,
      },
      {
        slug: INGREDIENT_SLUGS.LACTIC_ACID,
        notes: `AHA exfoliant doux qui améliore le grain de peau et l'éclat`,
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
        notes: 'Vitamine E antioxydante, protège la peau lors du nettoyage',
      },
    ],
  },

  {
    slug: 'loccitane-immortelle-baume-demaquillant-60g',
    name: 'Baume Démaquillant Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'cleanser',
    unit: 'jar',
    totalAmount: 60,
    amountUnit: 'g',
    priceCents: 3900,
    description: `Baume démaquillant qui élimine efficacement le maquillage, même waterproof, tout en enveloppant la peau d'un voile de douceur. Sa texture se fond sous l'effet du massage pour se transformer en huile généreuse.`,
    notes: `Enrichi en vitamine E et huile essentielle d'Immortelle bio de Corse. La peau est 23% plus nourrie dès la première utilisation. 100% des utilisateurs trouvent le produit efficace et doux. Packaging en verre composé à 40% de verre recyclé.`,
    inci: 'HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, COCOS NUCIFERA (COCONUT) OIL, PEG-40 SORBITAN PEROLEATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, CERA ALBA/BEESWAX, HYDROGENATED VEGETABLE OIL, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, POLYSORBATE 20, HELICHRYSUM ITALICUM FLOWER OIL, BUTYROSPERMUM PARKII (SHEA) BUTTER, TOCOPHEROL, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/baume-demaquillant-immortelle-divine.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE],
      secondary: [
        TAG_SLUGS.DOUBLE_NETTOYAGE_1,
        TAG_SLUGS.BAUME_DEMAQUILLANT,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Huile essentielle d'Immortelle bio, antioxydante et anti-âge`,
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL,
        notes: 'Huile de tournesol, solvant démaquillant et nourrissant riche en oméga-6',
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_DE_COCO,
        notes: 'Huile de coco, aide à dissoudre le maquillage et nourrit la peau',
      },
      {
        slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
        notes: 'Huile douce émolliente et nourrissante pour peaux sensibles',
      },
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité, apport de douceur et nutrition intense',
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E naturelle, antioxydante et protectrice',
      },
    ],
  },

  {
    slug: 'loccitane-immortelle-huile-demaquillante-200ml',
    name: 'Huile Démaquillante Précieuse',
    brand: `L'Occitane`,
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 2900,
    description:
      'Huile démaquillante légère qui élimine le maquillage, même waterproof, et nettoie efficacement la peau en éliminant les impuretés et excès de sébum. La peau est +20% plus douce et 82% des utilisateurs trouvent leurs pores moins visibles.',
    notes: `Enrichie en huile de ricin et huile essentielle d'Immortelle bio de Corse. 97% des utilisateurs trouvent le produit efficace et doux. Formule testée sous contrôle dermatologique, adaptée à tous types de peau.`,
    inci: 'HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, PEG-40 SORBITAN PEROLEATE, ISOPROPYL ISOSTEARATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, COCO-CAPRYLATE/CAPRATE, RICINUS COMMUNIS (CASTOR) SEED OIL, C13-15 ALKANE, HELICHRYSUM ITALICUM EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, PRUNUS ARMENIACA (APRICOT) KERNEL OIL, HIPPOPHAE RHAMNOIDES FRUIT OIL, TOCOPHEROL, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/huile-demaquillante-precieuse-27HD200I23.html',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.DOUBLE_NETTOYAGE_1,
        TAG_SLUGS.HUILE_DEMAQUILLANTE,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Extrait d'Immortelle bio, antioxydant et protecteur. Huile essentielle d'Immortelle bio de Corse`,
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_DE_RICIN,
        notes: `Huile de ricin : démaquillante et rétentrice d'hydratation, réduit la visibilité des pores`,
      },
      {
        slug: INGREDIENT_SLUGS.APRICOT_KERNEL_OIL,
        notes: `Huile d'abricot légère, adoucissante et nourrissante`,
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER,
        notes: `Huile d'argousier riche en caroténoïdes, protège et illumine`,
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E naturelle antioxydante',
      },
    ],
  },

  // ── TONER / ESSENCE ─────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-eau-essentielle-precieuse-200ml',
    name: 'Eau Essentielle Précieuse',
    brand: `L'Occitane`,
    kind: 'toner',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 2500,
    description: `Tonique qui délivre un voile d'hydratation pour une peau rayonnante, comme énergisée, et un grain de peau lissé. Enrichi en acide hyaluronique hydratant et super extrait aqueux d'Immortelle bio de Corse.`,
    notes: `Formule légère pour l'étape tonique de la routine. Polyphénols de l'Immortelle aux propriétés antioxydantes. Enrichi en extrait de lentille et sodium PCA pour compléter l'hydratation.`,
    inci: 'WATER, GLYCERIN, POLYSORBATE 20, HELICHRYSUM ITALICUM EXTRACT, LENS ESCULENTA (LENTIL) FRUIT EXTRACT, SODIUM PCA, SODIUM HYALURONATE, LEVULINIC ACID, SODIUM LEVULINATE, SODIUM HYDROXIDE, PENTYLENE GLYCOL, CITRIC ACID, SODIUM BENZOATE, PARFUM/FRAGRANCE, HEXYL CINNAMAL, BENZYL SALICYLATE, ALPHA-ISOMETHYL IONONE, CITRAL, LIMONENE',
    url: 'https://fr.loccitane.com/eau-essentielle-precieuse-27EV200I22.html',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.PREPARATION,
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.PORES_DILATES,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Super extrait aqueux d'Immortelle bio aux polyphénols antioxydants`,
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique : hydratation immédiate et lissage du grain de peau',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_PCA,
        notes: `Facteur naturel d'hydratation (NMF), retient l'eau dans l'épiderme`,
      },
    ],
  },

  {
    slug: 'loccitane-immortelle-triphase-essence-reset-150ml',
    name: 'Triphase Essence Immortelle Reset',
    brand: `L'Occitane`,
    kind: 'essence',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 7900,
    description: `Essence triphase jour & nuit qui aide à équilibrer la peau et renforcer sa barrière pour un teint éclatant, apaisé et résilient. Réduit immédiatement la sensation d'inconfort de 54% et améliore visiblement l'éclat de 16%.`,
    notes:
      'Formule enrichie en extrait de betterave, extrait de chicorée, fructooligosaccharides et Immortelle bio. Dès 7 jours : barrière cutanée équilibrée, teint homogène +10%. Dès 28 jours : signes de fatigue réduits -10%, grain de peau affiné +9%.',
    inci: 'WATER, C15-19 ALKANE, RICINUS COMMUNIS (CASTOR) SEED OIL, PENTYLENE GLYCOL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, GLYCERIN, SODIUM CHLORIDE, BETA VULGARIS (BEET) ROOT EXTRACT, YEAST EXTRACT, CICHORIUM INTYBUS (CHICORY) ROOT EXTRACT, HELICHRYSUM ITALICUM EXTRACT, ALKANNA TINCTORIA ROOT EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, FRUCTOOLIGOSACCHARIDES, BISABOLOL, ADENOSINE, FRUCTOSE, LEVULINIC ACID, SODIUM LEVULINATE, SODIUM GLUCONATE, TOCOPHEROL, BENZOTRIAZOLYL DODECYL P-CRESOL, XANTHAN GUM, SODIUM HYDROXIDE, POTASSIUM LACTATE, ALCOHOL, CAPRYLYL GLYCOL, 1,2-HEXANEDIOL, LACTIC ACID, TRIS(TETRAMETHYLHYDROXYPIPERIDINOL) CITRATE, PARFUM/FRAGRANCE, CI 60725/VIOLET 2, CI 19140/YELLOW 5, CI 17200/RED 33',
    url: 'https://fr.loccitane.com/triphase-essence-immortelle-reset-27ER150I25.html',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.MICROBIOME],
      secondary: [
        TAG_SLUGS.PREPARATION,
        TAG_SLUGS.ESSENCE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Extrait d'Immortelle bio pour l'éclat et l'antioxydation`,
      },
      {
        slug: INGREDIENT_SLUGS.BEET_ROOT_EXTRACT,
        notes: 'Extrait de betterave, soutient le microbiome cutané',
      },
      {
        slug: INGREDIENT_SLUGS.INULINE,
        notes: 'Extrait de chicorée, prébiotique pour le microbiome',
      },
      {
        slug: INGREDIENT_SLUGS.FRUCTOOLIGOSACCHARIDES,
        notes: 'Prébiotiques qui équilibrent le microbiome de la peau',
      },
      {
        slug: INGREDIENT_SLUGS.BISABOLOL,
        notes: `Bisabolol apaisant, réduit les sensations d'inconfort de -54%`,
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge et apaisant, renforce la barrière cutanée',
      },
    ],
  },

  // ── SERUMS ──────────────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-serum-pro-fermete-30ml',
    name: 'Sérum Pro-Fermeté Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 9900,
    description:
      'Sérum visage qui agit sur les rides et la fermeté de la peau. Lisse les 5 types de rides du visage et raffermit progressivement la peau dès 14 jours. +17% peau visiblement lissée immédiatement, +73% aspect lissé et fermeté après 56 jours.',
    notes: `Formule enrichie en super extrait d'Immortelle (alternative naturelle au rétinol), extrait de Gleditsia tenseur et acide hyaluronique acétylé. 96% d'ingrédients d'origine naturelle. Nouvelle texture crème, pénétration rapide sans effet collant.`,
    inci: 'WATER, GLYCERIN, PENTYLENE GLYCOL, DICAPRYLYL CARBONATE, C14-22 ALCOHOLS, OENOTHERA BIENNIS (EVENING PRIMROSE) OIL, BORON NITRIDE, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, HELICHRYSUM ITALICUM EXTRACT, GLEDITSIA TRIACANTHOS SEED EXTRACT, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, ECHIUM PLANTAGINEUM SEED OIL, CAMELINA SATIVA SEED OIL, BORAGO OFFICINALIS SEED OIL, HELICHRYSUM ITALICUM FLOWER OIL, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, GLYCERYL STEARATE CITRATE, C12-20 ALKYL GLUCOSIDE, SODIUM ACETYLATED HYALURONATE, ETHYLHEXYLGLYCERIN, XANTHAN GUM, CAPRYLIC/CAPRIC TRIGLYCERIDE, ASCORBYL GLUCOSIDE, SORBITAN ISOSTEARATE, POLYSORBATE 60, ADENOSINE, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, TOCOPHEROL, ZINC GLUCONATE, MAGNESIUM ASPARTATE, COPPER GLUCONATE, GLYCERYL CAPRYLATE, SODIUM HYDROXIDE, CITRIC ACID, SODIUM BENZOATE, POTASSIUM SORBATE, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/serum-pro-fermete-immortelle-divine-27DS030I24.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPULPANT],
      secondary: [
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Super extrait d'Immortelle : alternative naturelle au rétinol, raffermi et lisse les rides`,
      },
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
        notes: 'Acide hyaluronique acétylé, hydratation durable et lissage',
      },
      {
        slug: INGREDIENT_SLUGS.GLEDITSIA_TRIACANTHOS_SEED_EXTRACT,
        notes: 'Extrait botanique tenseur de Gleditsia, effet lifting immédiat',
      },
      {
        slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
        notes: 'Vitamine C stable, éclat et action anti-taches',
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge, lisse les rides et soutient la fermeté',
      },
    ],
  },

  {
    slug: 'loccitane-immortelle-serum-reset-nuit-50ml',
    name: 'Sérum Visage Reset Nuit',
    brand: `L'Occitane`,
    kind: 'serum',
    unit: 'pump',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 9500,
    description: `Sérum de nuit qui réveille l'éclat. Une peau revitalisée, reposée et lumineuse en 1 nuit. L'extrait de gardénia aide la peau à se rétablir, l'extrait d'Acmella Oleracea lisse instantanément et l'Immortelle protège contre le stress oxydant.`,
    notes: `Formule enrichie en extrait pro-sève d'Immortelle (technologie Bio-inspiration végétale), extrait de gardénia et extrait d'Acmella Oleracea. Huiles encapsulées pour une sensorialité unique. Appliquer le soir après nettoyage.`,
    inci: 'WATER, GLYCERIN, PROPANEDIOL, COCO-CAPRYLATE/CAPRATE, BUTYLENE GLYCOL, PENTYLENE GLYCOL, DEXTRIN PALMITATE, LIMNANTHES ALBA (MEADOWFOAM) SEED OIL, 1,2-HEXANEDIOL, ACMELLA OLERACEA EXTRACT, HELICHRYSUM ITALICUM EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, GARDENIA FLORIDA FRUIT EXTRACT, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, ADENOSINE, BETAINE, CAPRYLYL GLYCOL, CARBOMER, FRUCTOSE, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, SODIUM HYDROXIDE, CELLULOSE GUM, AMODIMETHICONE, TOCOPHEROL, MALTODEXTRIN, PARFUM/FRAGRANCE, CI 40800/BETA-CAROTENE',
    url: 'https://fr.loccitane.com/serum-visage-reset-nuit.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.TEINT_TERNE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Extrait pro-sève d'Immortelle (technologie Bio-inspiration végétale), apaise et régénère`,
      },
      {
        slug: INGREDIENT_SLUGS.GARDENIA_FRUIT_EXTRACT,
        notes: 'Extrait de gardénia, aide la peau à se rétablir la nuit pour un teint lissé',
      },
      {
        slug: INGREDIENT_SLUGS.ACMELLA_OLERACEA_EXTRACT,
        notes: `Extrait d'Acmella Oleracea, lisse instantanément la peau`,
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge, lisse et régénère pendant le sommeil',
      },
    ],
  },

  // ── FACE OIL ────────────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-huile-jeunesse-30ml',
    name: 'Huile Jeunesse Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'oil',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 9500,
    description: `Huile sèche visage multi-usage qui nourrit intensément la peau et agit contre les signes visibles de l'âge. Alternative naturelle au rétinol, une seule goutte rend le teint radieux. Peut être utilisée seule, avant ou après la crème, ou mélangée à votre soin.`,
    notes: `Enrichie en super extrait d'Immortelle bio de Corse, huile de bourrache, huile de caméline, huile d'onagre et huile d'argousier. Formule sans eau, 100% huiles précieuses.`,
    inci: 'CAPRYLIC/CAPRIC TRIGLYCERIDE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, OCTYLDODECANOL, COCO-CAPRYLATE/CAPRATE, SQUALANE, BORAGO OFFICINALIS SEED OIL, ARGANIA SPINOSA KERNEL OIL, HELICHRYSUM ITALICUM EXTRACT, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, CAMELINA SATIVA SEED OIL, PRUNUS ARMENIACA (APRICOT) KERNEL OIL, ROSA MOSCHATA SEED OIL, OENOTHERA BIENNIS (EVENING PRIMROSE) OIL, ECHIUM PLANTAGINEUM SEED OIL, HIPPOPHAE RHAMNOIDES FRUIT OIL, TOCOPHEROL, CITRUS AURANTIUM DULCIS (ORANGE) OIL, HELICHRYSUM ITALICUM FLOWER OIL, PELARGONIUM GRAVEOLENS OIL, MYRTUS COMMUNIS OIL, PARFUM/FRAGRANCE, LIMONENE, LINALOOL, GERANIOL, CITRAL, COUMARIN, BENZYL SALICYLATE, CITRONELLOL',
    url: 'https://fr.loccitane.com/huile-jeunesse-immortelle-divine-27DH030I22.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.HUILE_VISAGE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Super extrait d'Immortelle bio : alternative naturelle au rétinol, anti-âge global`,
      },
      {
        slug: INGREDIENT_SLUGS.BOURRACHE,
        notes: 'Huile de bourrache riche en GLA (oméga-6), nourrit et régénère',
      },
      {
        slug: INGREDIENT_SLUGS.CAMELINA_SEED_OIL,
        notes: 'Huile de caméline riche en oméga-3 et vitamine E',
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
        notes: `Huile d'onagre, richesse en oméga-6, équilibre et fermeté`,
      },
      {
        slug: INGREDIENT_SLUGS.ROSEHIP_SEED_OIL,
        notes: 'Huile de rose musquée rénovatrice, lisse et unifie',
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER,
        notes: `Huile d'argousier, éclat et protection`,
      },
    ],
  },

  // ── MOISTURISERS ────────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-creme-jeunesse-50ml',
    name: 'Crème Jeunesse Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 9500,
    description: `Soin anti-âge global enrichi en extrait d'Immortelle bio de Corse, alternative naturelle au Rétinol. Aide à combattre les 7 signes visibles de l'âge. -19% de rides après 28 jours, 85% des utilisateurs trouvent leurs taches brunes moins visibles.`,
    notes: `Reformulée avec extrait de pâquerette et extrait de Lansium pour l'uniformité du teint. Texture cachemire. 100% des femmes déclarent la crème enveloppe d'un voile de douceur. Packaging en verre composé à 40% de verre recyclé.`,
    inci: 'WATER, C12-15 ALKYL BENZOATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLYCERIN, OENOTHERA BIENNIS (EVENING PRIMROSE) OIL, PENTYLENE GLYCOL, CETEARYL ALCOHOL, DIMETHICONE, TAPIOCA STARCH, ASCORBYL GLUCOSIDE, GLYCERYL STEARATE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, CAMELINA SATIVA SEED OIL, CETYL ALCOHOL, BELLIS PERENNIS (DAISY) FLOWER EXTRACT, LANSIUM DOMESTICUM LEAF EXTRACT, HELICHRYSUM ITALICUM EXTRACT, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, ECHIUM PLANTAGINEUM SEED OIL, HELICHRYSUM ITALICUM FLOWER OIL, MYRTUS COMMUNIS OIL, BORAGO OFFICINALIS SEED OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, ADENOSINE, SODIUM HYALURONATE, PEG-100 STEARATE, SUCROSE PALMITATE, CETEARYL GLUCOSIDE, TOCOPHERYL ACETATE, SODIUM CITRATE, SODIUM HYDROXIDE, MALTODEXTRIN, ETHYLHEXYLGLYCERIN, GLYCERYL LINOLEATE, STEARIC ACID, PALMITIC ACID, DISODIUM EDTA, SORBITAN ISOSTEARATE, POLYSORBATE 60, ZINC GLUCONATE, MAGNESIUM ASPARTATE, CITRIC ACID, COPPER GLUCONATE, TOCOPHEROL, POTASSIUM PHOSPHATE, POTASSIUM CHLORIDE, DISODIUM PHOSPHATE, SODIUM CHLORIDE, POTASSIUM SORBATE, SODIUM BENZOATE, CHLORPHENESIN, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/creme-jeunesse-immortelle-divine-27DC050I23.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ANTI_TACHES],
      secondary: [
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.GRAIN_PEAU,
        TAG_SLUGS.HYPERPIGMENTATION,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Super extrait d'Immortelle bio, combat les 7 signes visibles de l'âge`,
      },
      {
        slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
        notes: 'Vitamine C stable, uniformité du teint et action anti-taches brunes',
      },
      {
        slug: INGREDIENT_SLUGS.PAQUERETTE,
        notes: 'Extrait de pâquerette, atténue les taches et uniformise le teint',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Acide hyaluronique, hydratation intense',
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
        notes: `Huile d'onagre, nourrit et améliore l'élasticité`,
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-rides et anti-âge, améliore la fermeté',
      },
    ],
  },

  {
    slug: 'loccitane-immortelle-creme-visage-precieuse-50ml',
    name: 'Crème Visage Précieuse',
    brand: `L'Occitane`,
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 6400,
    description: `Crème visage qui repulpe la peau et agit contre les premiers signes de l'âge. Nourrit et hydrate 24h, -39% de ridules, -14% d'apparence des pores. Pour une peau lissée, rebondie et éclatante.`,
    notes: `Enrichie en huile essentielle d'Immortelle, super extrait aqueux d'Immortelle et extrait de lentille. 95% d'ingrédients d'origine naturelle. Adaptée aux peaux normales à sèches. Existe aussi en texture émulsion plus légère.`,
    inci: 'WATER, GLYCERIN, CETEARYL ALCOHOL, DICAPRYLYL ETHER, CETYL ALCOHOL, CETYL PALMITATE, OCTYLDODECYL MYRISTATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, TAPIOCA STARCH, MYRISTYL ALCOHOL, METHYLPROPANEDIOL, DIMETHICONE, HELICHRYSUM ITALICUM FLOWER OIL, HELICHRYSUM ITALICUM EXTRACT, LENS ESCULENTA (LENTIL) FRUIT EXTRACT, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, ADENOSINE, HYALURONIC ACID, SILANETRIOL, CETEARYL GLUCOSIDE, MYRISTYL GLUCOSIDE, CARBOMER, CAPRYLYL GLYCOL, PENTYLENE GLYCOL, ETHYLHEXYLGLYCERIN, XANTHAN GUM, SODIUM HYDROXIDE, TOCOPHEROL, CITRIC ACID, CHLORPHENESIN, SODIUM BENZOATE, POTASSIUM SORBATE, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/creme-visage-precieuse-27CP050I22.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.PORES_DILATES,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Huile essentielle d'Immortelle bio, antioxydante et anti-âge`,
      },
      {
        slug: INGREDIENT_SLUGS.LENS_ESCULENTA_SEED_EXTRACT,
        notes: `Extrait de lentille, renforce la résistance cutanée et améliore l'éclat`,
      },
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
        notes: 'Acide hyaluronique, repulpe et hydrate 24h',
      },
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité, nourrit et protège les peaux normales à sèches',
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge, -39% de ridules',
      },
    ],
  },

  // ── EYE / LIP CARE ──────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-baume-regard-15ml',
    name: 'Baume Regard Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'eye-cream',
    unit: 'jar',
    totalAmount: 15,
    amountUnit: 'ml',
    priceCents: 6900,
    description:
      'Baume contour des yeux qui lisse et comble visiblement les rides et ridules, réduit les poches et les cernes pour révéler la jeunesse du regard sous tous les angles. Recommandé par 9 femmes sur 10. 3 brevets déposés en France.',
    notes: `Enrichi en beurre de karité et 4 extraits d'Immortelle bio de Corse (HE, extrait aqueux, extrait huileux, super extrait). Texture riche et fondante. Agit sur rides, poches, cernes, fermeté, uniformité et éclat après 28 applications.`,
    inci: 'WATER, BUTYROSPERMUM PARKII (SHEA) BUTTER, COCO-CAPRYLATE/CAPRATE, GLYCERIN, ROSA CENTIFOLIA FLOWER WATER, CETEARYL ALCOHOL, SILICA, OENOTHERA BIENNIS (EVENING PRIMROSE) OIL, GLYCERYL STEARATE, PEG-100 STEARATE, CAMELINA SATIVA SEED OIL, HELICHRYSUM ITALICUM FLOWER OIL, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, HELICHRYSUM ITALICUM EXTRACT, ECHIUM PLANTAGINEUM SEED OIL, BORAGO OFFICINALIS SEED OIL, MYRTUS COMMUNIS OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, ADENOSINE, HYALURONIC ACID, ESCIN, METHYL METHACRYLATE CROSSPOLYMER, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, CETEARETH-33, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, TOCOPHEROL, XANTHAN GUM, DISODIUM EDTA, SORBITAN ISOSTEARATE, POLYSORBATE 60, CAPRYLIC/CAPRIC TRIGLYCERIDE, SUCROSE PALMITATE, SODIUM HYDROXIDE, GLYCERYL LINOLEATE, CITRIC ACID, SODIUM BENZOATE, PHENOXYETHANOL, POTASSIUM SORBATE',
    url: 'https://fr.loccitane.com/baume-regard-immortelle-divine.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.CERNES_POCHES],
      secondary: [
        TAG_SLUGS.SOIN_YEUX,
        TAG_SLUGS.CONTOUR_YEUX,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.ZONE_YEUX,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `HE d'Immortelle bio : agit contre la perte de fermeté et l'apparence des rides`,
      },
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: `Beurre de karité, nourrit et réconforte le contour délicat de l'œil`,
      },
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
        notes: 'Acide hyaluronique, comble les rides et ridules',
      },
      {
        slug: INGREDIENT_SLUGS.ESCIN,
        notes: 'Escine décongestionnante pour réduire poches et cernes',
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: `Anti-âge, améliore la fermeté du contour de l'œil`,
      },
    ],
  },

  {
    slug: 'loccitane-immortelle-contour-yeux-levres-15ml',
    name: 'Contour Yeux et Lèvres Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'eye-cream',
    unit: 'tube',
    totalAmount: 15,
    amountUnit: 'ml',
    priceCents: 6400,
    description: `Soin double-action contour des yeux et des lèvres qui hydrate et lutte contre les signes visibles de l'âge et le relâchement de la peau. Enrichi en super extrait d'Immortelle bio de Corse, alternative naturelle au Rétinol.`,
    notes: `Contient 4 extraits d'Immortelle, huile végétale d'onagre (riche en oméga-6), extrait d'Acmella Oleracea lissant et escin pour les poches. Actifs pour le contour des yeux et des lèvres en un seul soin.`,
    inci: 'WATER, ROSA CENTIFOLIA FLOWER WATER, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, BUTYLENE GLYCOL, SILICA, PROPANEDIOL, POLYGLYCERYL-6 DISTEARATE, OENOTHERA BIENNIS (EVENING PRIMROSE) OIL, BUTYROSPERMUM PARKII (SHEA) BUTTER, HELICHRYSUM ITALICUM FLOWER OIL, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, HELICHRYSUM ITALICUM EXTRACT, CAMELINA SATIVA SEED OIL, BORAGO OFFICINALIS SEED OIL, ACMELLA OLERACEA EXTRACT, ECHIUM PLANTAGINEUM SEED OIL, IRIS FLORENTINA ROOT EXTRACT, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, MYRTUS COMMUNIS OIL, ADENOSINE, ESCIN, JOJOBA ESTERS, SODIUM POLYACRYLATE, METHYL METHACRYLATE CROSSPOLYMER, POLYGLYCERYL-3 BEESWAX, CETYL ALCOHOL, TOCOPHERYL ACETATE, SODIUM STEAROYL GLUTAMATE, ETHYLHEXYLGLYCERIN, SUCROSE PALMITATE, DISODIUM EDTA, GLYCERYL LINOLEATE, SODIUM BENZOATE, CITRIC ACID, TOCOPHEROL, CHLORPHENESIN, POTASSIUM SORBATE, LIMONENE',
    url: 'https://fr.loccitane.com/contour-yeux-levres-immortelle-divine.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.SOIN_YEUX,
        TAG_SLUGS.CONTOUR_YEUX,
        TAG_SLUGS.SOIN_LEVRES,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.ZONE_YEUX,
        TAG_SLUGS.ZONE_LEVRES,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `HE d'Immortelle bio, antioxydante et anti-âge`,
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
        notes: `Huile d'onagre riche en oméga-6, nourrit et renforce la barrière`,
      },
      {
        slug: INGREDIENT_SLUGS.ACMELLA_OLERACEA_EXTRACT,
        notes: 'Lissant immédiat du contour des yeux et des lèvres',
      },
      {
        slug: INGREDIENT_SLUGS.ESCIN,
        notes: 'Décongestionnant pour les poches sous les yeux',
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge pour le contour des yeux et des lèvres',
      },
    ],
  },

  // ── NECK ────────────────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-creme-cou-lissante-50ml',
    name: 'Crème Cou Lissante Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'moisturizer',
    unit: 'tube',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 6900,
    description: `Crème cou spécialisée qui nourrit la peau, améliore l'élasticité et la fermeté, et réduit visiblement l'apparence des plis du cou. Un aspect plus lisse, une sensation plus ferme, une confiance renforcée.`,
    notes: `Formule avec peptides de matrikines (palmitoyl tripeptide-1 et tétrapeptide-7) pour le lissage et la fermeté. Enrichie en acide hyaluronique, extrait d'avoine et Immortelle bio de Corse.`,
    inci: 'WATER, GLYCERIN, BUTYROSPERMUM PARKII (SHEA) BUTTER, TAPIOCA STARCH, COCO-CAPRYLATE/CAPRATE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, AVENA SATIVA (OAT) KERNEL EXTRACT, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, MYRTUS COMMUNIS OIL, HYALURONIC ACID, PALMITOYL TRIPEPTIDE-1, PALMITOYL TETRAPEPTIDE-7, BUTYLENE GLYCOL, CAPRYLYL GLYCOL, ARACHIDYL ALCOHOL, XANTHAN GUM, ETHYLHEXYLGLYCERIN, BEHENYL ALCOHOL, SODIUM GLUCONATE, POLYSORBATE 60, SORBITAN ISOSTEARATE, ARACHIDYL GLUCOSIDE, CAPRYLIC/CAPRIC TRIGLYCERIDE, SODIUM LACTATE, CARBOMER, TOCOPHEROL, PENTYLENE GLYCOL, MAGNESIUM ASPARTATE, ZINC GLUCONATE, SODIUM HYDROXIDE, POLYSORBATE 20, COPPER GLUCONATE, CHLORPHENESIN, SODIUM BENZOATE, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/creme-cou-lissante-immortelle-divine.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPULPANT],
      secondary: [
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Extrait d'Immortelle bio, antioxydant et anti-âge`,
      },
      {
        slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
        notes: 'Peptide de matrikine qui favorise le lissage et renforce la fermeté',
      },
      {
        slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
        notes: 'Peptide de matrikine qui améliore la densité de la peau du cou',
      },
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
        notes: 'Acide hyaluronique, hydrate et repulpe les plis du cou',
      },
      {
        slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
        notes: `Extrait d'avoine, apaisant et nourrissant`,
      },
    ],
  },

  // ── BODY ────────────────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-huile-corps-raffermissante-100ml',
    name: 'Huile Corps Raffermissante Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'body-oil',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 6900,
    description: `Huile corps qui allie la puissance d'un sérum pro-jeunesse avec les propriétés nourrissantes d'une huile. Améliore l'aspect froissé et renforce la barrière cutanée pour une peau visiblement plus ferme et éclatante. Des résultats similaires à ceux du rétinol.`,
    notes: `Texture légère rapidement absorbée, sans effet gras. Enrichie en huile de rose musquée, huile d'argousier et super extrait d'Immortelle bio de Corse.`,
    inci: 'PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, DICAPRYLYL CARBONATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, BUTYROSPERMUM PARKII (SHEA) OIL, SQUALANE, CORYLUS AVELLANA (HAZELNUT) SEED OIL, ROSA RUBIGINOSA SEED OIL, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, HIPPOPHAE RHAMNOIDES FRUIT OIL, TOCOPHEROL, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/huile-corps-raffermissante-immortelle-divine-27HC100IK26.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPULPANT],
      secondary: [
        TAG_SLUGS.HUILE_CORPS,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.ZONE_CORPS,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Super extrait d'Immortelle, alternative naturelle au rétinol pour le corps`,
      },
      {
        slug: INGREDIENT_SLUGS.ROSEHIP_SEED_OIL,
        notes: 'Huile de rose musquée, régénérante, améliore la fermeté et la texture',
      },
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Huile de karité, nourrit et protège la barrière cutanée',
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER,
        notes: `Huile d'argousier, riche en caroténoïdes, éclat et tonus`,
      },
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Squalane, hydratant et émollient léger sans film gras',
      },
    ],
  },

  {
    slug: 'loccitane-immortelle-baume-corps-pro-jeunesse-200ml',
    name: 'Baume Corps Pro-Jeunesse Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'body-lotion',
    unit: 'jar',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 6900,
    description: `Baume corps qui hydrate la peau tout en réduisant jour après jour les signes visibles de l'âge : sécheresse, irrégularités de texture, perte de fermeté et de luminosité. Pour une peau divinement lisse, uniforme et ferme.`,
    notes: `Texture onctueuse et fondante, absorption rapide. Enrichi en beurre de karité, extrait de pois, adénosine et super extrait d'Immortelle bio.`,
    inci: 'WATER, CAPRYLIC/CAPRIC TRIGLYCERIDE, COCO-CAPRYLATE/CAPRATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, GLYCERIN, OCTYLDODECANOL, CETYL PALMITATE, PENTYLENE GLYCOL, CETEARYL ALCOHOL, TAPIOCA STARCH, CETYL ALCOHOL, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, GLYCERYL STEARATE SE, PISUM SATIVUM (PEA) EXTRACT, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, ADENOSINE, CETEARYL GLUCOSIDE, HEXYLRESORCINOL, SODIUM STEAROYL GLUTAMATE, ETHYLHEXYLGLYCERIN, PALMITIC ACID, STEARIC ACID, CYCLODEXTRIN, SODIUM GLUCONATE, TOCOPHEROL, POLYSORBATE 60, SORBITAN ISOSTEARATE, CITRIC ACID, CHLORPHENESIN, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/baume-corps-pro-jeunesse-immortelle-divine-27CCJ200IK26.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.CREME_CORPS,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.ZONE_CORPS,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `Super extrait d'Immortelle, anti-âge pour le corps`,
      },
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité, nutrition intense et confort',
      },
      {
        slug: INGREDIENT_SLUGS.PEA_EXTRACT,
        notes: `Extrait de pois, améliore la fermeté et l'élasticité du corps`,
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: 'Anti-âge, réduit les irrégularités de texture',
      },
      {
        slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
        notes: 'Uniformise le teint et atténue les taches sur le corps',
      },
    ],
  },

  // ── HANDS ───────────────────────────────────────────────────────────────────

  {
    slug: 'loccitane-immortelle-serum-creme-mains-75ml',
    name: 'Sérum-en-Crème Mains Immortelle Divine',
    brand: `L'Occitane`,
    kind: 'hand-cream',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 2900,
    description: `Soin jeunesse pour les mains qui améliore l'apparence des signes visibles de l'âge : sécheresse, manque d'uniformité et perte d'élasticité. Pour une peau divinement lisse, uniforme et ferme.`,
    notes:
      'Enrichi en Immortelle bio, beurre de karité, adénosine et hexylrésorcinol. Formule avec actifs anti-taches et pro-fermeté.',
    inci: 'WATER, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, BUTYROSPERMUM PARKII (SHEA) BUTTER, TAPIOCA STARCH, CETEARYL ALCOHOL, ARACHIDYL ALCOHOL, GLYCERYL STEARATE SE, BRASSICA CAMPESTRIS (RAPESEED) STEROLS, HIBISCUS SABDARIFFA FLOWER EXTRACT, HELICHRYSUM ITALICUM FLOWER OIL, HELICHRYSUM ITALICUM FLOWER/STEM EXTRACT, ADENOSINE, HEXYLRESORCINOL, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, BEHENYL ALCOHOL, ARACHIDYL GLUCOSIDE, CAPRYLYL GLYCOL, XANTHAN GUM, SODIUM GLUCONATE, SORBITAN ISOSTEARATE, POLYSORBATE 60, MAGNESIUM HYDROXIDE, SODIUM HYDROXIDE, TOCOPHEROL, CHLORPHENESIN, PARFUM/FRAGRANCE',
    url: 'https://fr.loccitane.com/serum-en-creme-mains-immortelle-divine-27CMJ075IK26.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ANTI_TACHES],
      secondary: [
        TAG_SLUGS.CREME_MAINS,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.HYPERPIGMENTATION,
        TAG_SLUGS.ZONE_MAINS,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
        notes: `HE d'Immortelle bio, antioxydante et pro-jeunesse`,
      },
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité, nourrit intensément les mains sèches',
      },
      {
        slug: INGREDIENT_SLUGS.ADENOSINE,
        notes: `Anti-âge, améliore la texture et l'élasticité des mains`,
      },
      {
        slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
        notes: 'Atténue les taches de vieillesse et uniformise le teint des mains',
      },
      {
        slug: INGREDIENT_SLUGS.HIBISCUS_SABDARIFFA,
        notes: `Extrait d'hibiscus, riche en acides de fruits AHA naturels`,
      },
    ],
  },
]
