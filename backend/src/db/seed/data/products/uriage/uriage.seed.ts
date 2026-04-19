import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

export const URIAGE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'uriage-xemose-c8-plus-creme-relipidante-anti-grattage',
    name: 'Xémose C8+ Crème Relipidante Anti-grattage',
    brand: 'Uriage',
    kind: 'body-lotion',
    unit: 'pump',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 1234,
    description: 'Crème relipidante anti-grattage 48h pour visage et corps, peaux très sèches à tendance atopique (dès la naissance).',
    notes: 'Texture fraîche légère, absorption rapide non grasse. 8 céramides + 10% karité, anti-démangeaisons et anti-rechute.',
    inci: 'WATER, BUTYROSPERMUM PARKII (SHEA) BUTTER, ETHYLHEXYL PALMITATE, OCTYLDODECANOL, DICAPRYLYL ETHER, GLYCERIN, POLYSORBATE 60, BEHENYL ALCOHOL, PROPANEDIOL, SQUALANE, GLYCERYL STEARATE, PEG-100 STEARATE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, CHLORPHENESIN, TOCOPHERYL ACETATE, PIROCTONE OLAMINE, XANTHAN GUM, CETRIMONIUM BROMIDE, O-CYMEN-5-OL, SAFFLOWER OIL/PALM OIL AMINOPROPANEDIOL ESTERS, SODIUM HYDROXIDE, BORAGE SEED OIL AMINOPROPANEDIOL AMIDES, POLYGLYCERYL-10 STEARATE, ASIATICOSIDE, PHYTOSPHINGOSINE, TRIETHYL CITRATE, TOCOPHEROL, POLYGLYCERYL-6 BEHENATE, BEHENIC ACID, CERAMIDE NP, CETEARYL ALCOHOL, CHOLESTEROL, LACTIC ACID, CERAMIDE NS, CERAMIDE EOP, CERAMIDE AP, SODIUM CETEARYL SULFATE',
    url: 'https://www.uriage.fr',
    tags: {
      primary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.ECZEMA],
      secondary: [
        TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.CREME_CORPS,
        TAG_SLUGS.ZONE_CORPS,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramide NP — restaure la barrière lipidique',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NS,
        notes: 'Céramide NS — cohésion intercellulaire',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
        notes: 'Céramide EOP — barrière et rétention hydrique',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_AP,
        notes: 'Céramide AP — intégrité de la barrière cutanée',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDES,
        notes: '4 céramides biomimétiques (NP/NS/EOP/AP)',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité relipidant (10%)',},
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
        notes: 'Lipide barrière biomimétique',},
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
        notes: 'Sphingolipide anti-inflammatoire barrière',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Lipide occlusif émollient',},
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Asiaticoside apaisant anti-grattage',},
      {
        slug: INGREDIENT_SLUGS.LACTIC_ACID,
        notes: 'AHA doux NMF hydratant',},
    ],
  },
  {
    slug: 'uriage-xemose-c8-plus-soin-visage-nourrissant-apaisant',
    name: 'Xémose C8+ Soin Visage Nourrissant Apaisant',
    brand: 'Uriage',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1300,
    description: 'Soin visage nourrissant apaisant pour peaux très sèches à tendance atopique (toute la famille, dès la naissance).',
    notes: '8 céramides biomimétiques + 10% beurre de karité + squalane. Répare les 3 barrières cutanées, apaise dès la 1ère application, anti-rechute.',
    inci: 'WATER, BUTYROSPERMUM PARKII (SHEA) BUTTER, SQUALANE, DICAPRYLYL ETHER, GLYCERIN, POLYSORBATE 60, CAPRYLIC/CAPRIC TRIGLYCERIDE, SORBITAN STEARATE, 1,2-HEXANEDIOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, BEHENYL ALCOHOL, HYDROXYACETOPHENONE, POTASSIUM CETYL PHOSPHATE, SHOREA STENOPTERA SEED BUTTER, SODIUM POLYACRYLATE, SAFFLOWER OIL/PALM OIL AMINOPROPANEDIOL ESTERS, TOCOPHERYL ACETATE, XANTHAN GUM, SODIUM HYDROXIDE, POLYGLYCERYL-10 STEARATE, BORAGE SEED OIL AMINOPROPANEDIOL AMIDES, TRIETHYL CITRATE, POLYGLYCERYL-6 BEHENATE, ASIATICOSIDE, PHYTOSPHINGOSINE, BEHENIC ACID, CERAMIDE NP, CETEARYL ALCOHOL, CHOLESTEROL, GLYCERYL STEARATE, LACTIC ACID, TOCOPHEROL, CERAMIDE NS, CERAMIDE EOP, CERAMIDE AP, SODIUM CETEARYL SULFATE',
    url: 'https://www.uriage.fr',
    tags: {
      primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NS,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_AP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité (10%)',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Émollient occlusif',},
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
        notes: 'Précurseur de céramides, apaisant',},
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
        notes: 'Composant lipidique de la barrière cutanée',},
      {
        slug: INGREDIENT_SLUGS.ASIATICOSIDE,
        notes: 'Centella Asiatica réparatrice',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante',},
    ],
  },
  {
    slug: 'uriage-hyseac-serum-peau-neuve-booster-anti-imperfections',
    name: 'HYSEAC Sérum Peau Neuve Booster Anti-Imperfections',
    brand: 'Uriage',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2370,
    description: `Sérum anti-stress des peaux adultes à tendance acnéique. Casse le cercle vicieux de l'acné hormonale.`,
    notes: `5,8% AHA purs (glycolique, malique, lactique) + Zinc + Eau Thermale d'Uriage. Technologie anti-stress NEUROBIOX + ENDO REGUL. Matifie, affine et resserre les pores, anti-marques. Non comédogène.`,
    inci: 'WATER, 1,2-HEXANEDIOL, ALGIN, ASIATICOSIDE, BUTYLENE GLYCOL, DIGLYCERIN, GLUCOSE, GLUCURONIC ACID, GLYCOLIC ACID, GLYCYRRHIZA INFLATA ROOT EXTRACT, LACTIC ACID, MALIC ACID, PARFUM (FRAGRANCE), PENTYLENE GLYCOL, PHYTOSPHINGOSINE, PROPANEDIOL, RHAMNOSE, SODIUM HYDROXIDE, XANTHAN GUM, ZINC LACTATE, ALCOHOL DENAT, POLYGLYCERYL-4 CAPRATE, SCLEROTIUM GUM, ACHILLEA MILLEFOLIUM EXTRACT',
    url: 'https://www.uriage.fr/produits/hyseac-serum',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE],
      secondary: [
        TAG_SLUGS.POST_ACNE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
        notes: '5,8% AHA purs (glycolique + malique + lactique)',},
      {
        slug: INGREDIENT_SLUGS.LACTIC_ACID,
        notes: 'AHA pur, exfoliant doux',},
      {
        slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
        notes: 'Sébum-régulateur, anti-imperfections',},
      {
        slug: INGREDIENT_SLUGS.ASIATICOSIDE,
        notes: 'Apaisant',},
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
        notes: 'Apaisant, anti-bactérien',},
      {
        slug: INGREDIENT_SLUGS.RHAMNOSE,
        notes: 'Technologie NEUROBIOX anti-stress',},
      {
        slug: INGREDIENT_SLUGS.REGLISSE,
        notes: 'Anti-inflammatoire, apaisant',},
    ],
  },
  {
    slug: 'uriage-cica-daily-serum-reparateur-intense',
    name: 'Cica Daily Sérum Réparateur Intense',
    brand: 'Uriage',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3500,
    description: 'Sérum ultra-fluide réparateur et régénérant. Renforce les défenses cutanées face aux agressions du quotidien.',
    notes: '10,5% Thermal-Biotic (Eau Thermale + Inuline prébiotique) + Centella Asiatica + Acide Hyaluronique + Vitamine B5 + Dipeptide. 1 shot - 3 résultats : régénère, renforce, unifie.',
    inci: 'WATER, GLYCERIN, DIGLYCERIN, 1,2-HEXANEDIOL, INULIN, PANTHENOL, SODIUM POLYACRYLOYLDIMETHYL TAURATE, XANTHAN GUM, SODIUM HYALURONATE, PROPANEDIOL, CENTELLA ASIATICA LEAF EXTRACT, CITRIC ACID, ZINC GLUCONATE, GLUTAMYLAMIDOETHYL INDOLE',
    url: 'https://www.uriage.fr/produits/cica-daily-serum-reparateur-intense',
    tags: {
      primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Réparateur, régénérant',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Hydratant, repulpant',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Vitamine B5, apaisant et unifiant',},
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
        notes: 'Humectant',},
      {
        slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
        notes: 'Anti-imperfections, purifiant',},
    ],
  },
  {
    slug: 'uriage-roseliane-serum-lissant-correcteur-anti-rougeurs',
    name: 'Roséliane Sérum Lissant Correcteur Anti-Rougeurs',
    brand: 'Uriage',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2830,
    description: 'Sérum anti-inflammaging des peaux sensibles à tendance couperosique et rosacée. Texture verte neutralisant les rougeurs.',
    notes: `Hespéridine + Enoxolone + Niacinamide + Squalane. Complexe TLR2-Regul + SK5R régulent la Kallikréine-5. Non parfumé, 97% d'origine naturelle.`,
    inci: 'WATER, DICAPRYLYL ETHER, DIGLYCERIN, GLYCERIN, PROPANEDIOL, 1,2-HEXANEDIOL, NIACINAMIDE, MICROCRYSTALLINE CELLULOSE, HYDROXYACETOPHENONE, SODIUM STEAROYL GLUTAMATE, XANTHAN GUM, CHONDRUS CRISPUS POWDER, CELLULOSE GUM, CI 77891 (TITANIUM DIOXIDE), MICA, GLYCYRRHETINIC ACID, TOCOPHERYL ACETATE, MALTODEXTRIN, ASIATICOSIDE, PHYTOSPHINGOSINE, PANAX GINSENG ROOT EXTRACT, ASCOPHYLLUM NODOSUM EXTRACT, GLUCOSYL HESPERIDIN, TOCOPHEROL, SILICA, CI 19140 (YELLOW 5), CI 42090 (BLUE 1)',
    url: 'https://www.uriage.fr/produits/roseliane-serum-lissant-correcteur-anti-rougeurs',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.ANTI_AGE,
        TAG_SLUGS.PIGMENTS_VERTS,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Anti-inflammatoire, anti-rougeurs, unifiant',},
      {
        slug: INGREDIENT_SLUGS.REGLISSE,
        notes: 'Enoxolone — anti-inflammatoire, apaisant',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Émollient apaisant',},
      {
        slug: INGREDIENT_SLUGS.ASIATICOSIDE,
        notes: 'Réparateur',},
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      },
      {
        slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
        notes: 'Algue brune, complexe SK5R anti-rougeurs',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Antioxydant',},
    ],
  },
  {
    slug: 'uriage-depiderm-serum-anti-taches-booster-eclat',
    name: 'Dépiderm Sérum Anti-Taches Booster Éclat',
    brand: 'Uriage',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3200,
    description: `Sérum anti-taches à 94% d'ingrédients d'origine naturelle. Réduit les taches, unifie et illumine le teint.`,
    notes: 'Mela Technology + 20% complexe Vitamine C + Niacinamide + Enoxolone. Corrige et prévient les taches (soleil, acné, âge, mélasma). Non parfumé, non comédogène.',
    inci: 'WATER, DI-C12-13 ALKYL MALATE, DICAPRYLYL ETHER, GLYCERIN, SQUALANE, ASCORBYL TETRAISOPALMITATE, GLYCOLIC ACID, STEARETH-2, STEARETH-21, LACTIC ACID, SODIUM HYDROXIDE, MALTODEXTRIN, 1,2-HEXANEDIOL, GLYCYRRHETINIC ACID, SODIUM POLYACRYLOYLDIMETHYL TAURATE, SUCROSE DILAURATE, JOJOBA ESTERS, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, GLYCERYL BEHENATE, GLYCERYL STEARATE, PEG-100 STEARATE, HELIANTHUS ANNUUS SEED CERA (HELIANTHUS ANNUUS (SUNFLOWER) SEED WAX), BENZOIC ACID, NIACINAMIDE, XANTHAN GUM, SODIUM COCOYL GLUTAMATE, TOCOPHERYL ACETATE, PISUM SATIVUM EXTRACT (PISUM SATIVUM (PEA) EXTRACT), POLYGLYCERIN-3, TOCOPHEROL',
    url: 'https://www.uriage.fr/produits/serum-anti-taches',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.POST_ACNE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.THD_ASCORBATE,
        notes: 'Complexe 20% Vitamine C (ascorbyl tetraisopalmitate), unifiant et éclatant',},
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Anti-taches, unifiant',},
      {
        slug: INGREDIENT_SLUGS.REGLISSE,
        notes: 'Enoxolone — anti-inflammatoire, prévention des taches post-acnéiques',},
      {
        slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
        notes: 'AHA exfoliant, éclat',},
      {
        slug: INGREDIENT_SLUGS.LACTIC_ACID,
        notes: 'AHA doux, unifiant',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Émollient',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante',},
    ],
  },
  {
    slug: 'uriage-xemose-c8-plus-huile-lavante-anti-grattage',
    name: 'Xémose C8+ Huile Lavante Anti-Grattage',
    brand: 'Uriage',
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1750,
    description: 'Huile lavante gel-en-huile nettoyant pour peaux très sèches à tendance eczéma atopique. Apaise dès la première douche.',
    notes: '8 céramides biomimétiques + karité. Agit sur les 3 barrières cutanées. Convient à toute la famille dès la naissance.',
    inci: 'WATER, SORBITOL, GLYCERIN, SODIUM LAURETH SULFATE, COCO-GLUCOSIDE, SODIUM COCOAMPHOACETATE, SODIUM METHYL COCOYL TAURATE, CAPRYLYL GLYCOL, CITRIC ACID, SODIUM BENZOATE, GLYCERYL OLEATE, POLYQUATERNIUM-10, PEG-75 SHEA BUTTER GLYCERIDES, SAFFLOWER OIL/PALM OIL AMINOPROPANEDIOL ESTERS, POLYGLYCERYL-10 STEARATE, TOCOPHEROL, TRIETHYL CITRATE, POLYGLYCERYL-6 BEHENATE, HYDROGENATED VEGETABLE GLYCERIDES CITRATE, BEHENIC ACID, CERAMIDE NP, CETEARYL ALCOHOL, CHOLESTEROL, GLYCERYL STEARATE, LACTIC ACID, CERAMIDE NS, CERAMIDE EOP, CERAMIDE AP, SODIUM CETEARYL SULFATE',
    url: 'https://www.uriage.fr/produits/xemose-huile-nettoyante-apaisante',
    tags: {
      primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_ATOPIQUE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.HUILE_NETTOYANTE,
        TAG_SLUGS.SANS_SAVON,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.DOUBLE_NETTOYAGE_1,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NS,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_AP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
      },
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Relipidant, nourrissant',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Antioxydant',},
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      },
    ],
  },
  {
    slug: 'uriage-xemose-c8-plus-baume-relipidant-anti-grattage',
    name: 'Xémose C8+ Baume Relipidant Anti-Grattage',
    brand: 'Uriage',
    kind: 'balm',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 2100,
    description: 'Baume-en-huile relipidant anti-grattage pour peaux très sèches à tendance eczéma atopique. Répare et apaise dès la 1ère application.',
    notes: `8 céramides biomimétiques + 10% karité + huile d'illipé. Brevets CHRONOXINE + TLR2-REGUL. 93% d'ingrédients naturels. Non parfumé. Toute la famille dès la naissance.`,
    inci: 'WATER, BUTYROSPERMUM PARKII (SHEA) BUTTER, CETEARYL ETHYLHEXANOATE, ISONONYL ISONONANOATE, BEHENETH-25, BUTYLENE GLYCOL, GLYCERIN, 1,2-HEXANEDIOL, SHOREA STENOPTERA SEED BUTTER, BRASSICA CAMPESTRIS (RAPESEED) STEROLS, CHLORPHENESIN, XANTHAN GUM, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, SODIUM POLYACRYLATE, O-CYMEN-5-OL, TOCOPHERYL ACETATE, RASPBERRY SEED OIL/PALM OIL AMINOPROPANEDIOL ESTERS, SODIUM HYDROXIDE, ASIATICOSIDE, PHYTOSPHINGOSINE, BORAGE SEED OIL AMINOPROPANEDIOL AMIDES, CITRIC ACID, DICAPRYLYL ETHER, PROPANEDIOL, HYDROXYACETOPHENONE, SAFFLOWER OIL/PALM OIL AMINOPROPANEDIOL ESTERS, TOCOPHERYL ACETATE, POLYGLYCERYL-10 STEARATE, TOCOPHEROL, TRIETHYL CITRATE, POLYGLYCERYL-6 BEHENATE, BEHENIC ACID, CERAMIDE NP, CETEARYL ALCOHOL, CHOLESTEROL, GLYCERYL STEARATE, LACTIC ACID, CERAMIDE NS, CERAMIDE EOP, CERAMIDE AP, SODIUM CETEARYL SULFATE',
    url: 'https://www.uriage.fr/produits/xemose-baume-oleo-apaisant-anti-grattage',
    tags: {
      primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_ATOPIQUE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.OCCLUSIF,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.BAUME,
        TAG_SLUGS.OCCLUSION,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NS,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_AP,
        notes: '8 céramides biomimétiques C8+',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Relipidant majeur (10%)',},
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
      },
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      },
      {
        slug: INGREDIENT_SLUGS.ASIATICOSIDE,
        notes: 'Apaisant, réparateur',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Antioxydant',},
    ],
  },
  {
    slug: 'uriage-gel-surgras-dermatologique',
    name: 'Gel Surgras Dermatologique',
    brand: 'Uriage',
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 950,
    description: 'Gel surgras liquide dermatologique frais et extra-doux. Nettoie sans agresser et apporte un confort cutané.',
    notes: 'Base lavante douce sans savon. Actifs surgraissants et hydratants. Convient à toute la famille.',
    inci: 'WATER, SODIUM LAURETH SULFATE, PEG-80 GLYCERYL COCOATE, GLYCERIN, SODIUM CHLORIDE, SODIUM COCOAMPHOACETATE, SODIUM LAURETH-8 SULFATE, SODIUM METHYL COCOYL TAURATE, PARFUM (FRAGRANCE), COCO-GLUCOSIDE, GLYCERYL OLEATE, CAPRYLYL GLYCOL, CITRIC ACID, SODIUM BENZOATE, MAGNESIUM LAURETH SULFATE, SODIUM OLETH SULFATE, MAGNESIUM LAURETH-8 SULFATE, MAGNESIUM OLETH SULFATE, TOCOPHEROL, HYDROGENATED VEGETABLE GLYCERIDES CITRATE',
    url: 'https://www.uriage.fr/produits/surgras-liquide-dermatologique-500ml',
    tags: {
      primary: [TAG_SLUGS.PEAU_SENSIBLE],
      secondary: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.GEL_NETTOYANT,
        TAG_SLUGS.SANS_SAVON,
        TAG_SLUGS.DOUBLE_NETTOYAGE_2,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
        notes: 'Humectant, améliore le confort cutané',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante',},
    ],
  },
  {
    slug: 'uriage-roseliane-soin-anti-rougeurs-creme',
    name: 'Roséliane Soin Anti-Rougeurs',
    brand: 'Uriage',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1300,
    description: 'Soin anti-rougeurs qui atténue les rougeurs et prévient leur réapparition. Texture légère aux nacres vertes neutralisantes.',
    notes: `Formulé avec de l\"algue rouge (Asparagopsis Armata) et des céramides. Complexes brevetés TLR2-Regul + SK5R. N°1 anti-rougeurs en pharmacie.`,
    inci: 'WATER, SQUALANE, DICAPRYLYL ETHER, BUTYROSPERMUM PARKII (SHEA) BUTTER, DIGLYCERIN, PROPANEDIOL, CETYL ALCOHOL, PENTAERYTHRITYL DISTEARATE, 1,2-HEXANEDIOL, STEARETH-2, STEARETH-21, DIMETHICONE, GLYCERYL STEARATE, PEG-100 STEARATE, SODIUM POLYACRYLATE, PARFUM (FRAGRANCE), CI 77891 (TITANIUM DIOXIDE), CHLORPHENESIN, MICA, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, TOCOPHERYL ACETATE, XANTHAN GUM, O-CYMEN-5-OL, MALTODEXTRIN, ASIATICOSIDE, ASPARAGOPSIS ARMATA EXTRACT, PANAX GINSENG ROOT EXTRACT, POLYGLYCERYL-10 STEARATE, SODIUM BENZOATE, POTASSIUM SORBATE, ASCOPHYLLUM NODOSUM EXTRACT, TRIETHYL CITRATE, POLYGLYCERYL-6 BEHENATE, CI 77491 (IRON OXIDES), SILICA, BEHENIC ACID, CERAMIDE NP, CETEARYL ALCOHOL, CHOLESTEROL, LACTIC ACID, CERAMIDE NS, TOCOPHEROL, CERAMIDE EOP, CERAMIDE AP, SODIUM CETEARYL SULFATE, SODIUM HYDROXIDE, GLYCERIN',
    url: 'https://www.uriage.fr/produits/roseliane-creme-anti-rougeurs',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.PIGMENTS_VERTS,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ASPARAGOPSIS_ARMATA_EXTRACT, notes: 'Algue rouge : renforce les parois vasculaires',},
      { slug: INGREDIENT_SLUGS.PANAX_GINSENG, notes: 'Tonifiant vasculaire',},
      { slug: INGREDIENT_SLUGS.URIAGE_THERMAL_SPRING_WATER, notes: `Eau thermale d\"Uriage apaisante`,},
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Complexe de céramides réparateurs',},
      { slug: INGREDIENT_SLUGS.ASIATICOSIDE, notes: 'Apaisant et réparateur',},
    ],
  },
  {
    slug: 'uriage-roseliane-soin-teinte-anti-rougeurs-spf50',
    name: 'Roséliane Soin Teinté Anti-Rougeurs SPF50+',
    brand: 'Uriage',
    kind: 'sunscreen',
    unit: 'pump',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1400,
    description: 'Soin teinté anti-rougeurs SPF50+ teinte claire. Corrige le teint, diminue les rougeurs et protège des UV.',
    notes: 'Vitamine E + Céramides. Complexe TLR2-Regul + extraits de ginseng et algues rouges. Remplace la crème hydratante. Non comédogène.',
    inci: 'WATER, CI 77891 (TITANIUM DIOXIDE), ETHYLHEXYL METHOXYCINNAMATE, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENSONATE, DICAPRYLYL CARBONATE, ETHYLHEXYL SALICYLATE, ETHYLHEXYL TRIAZONE, DIMETHICONE, POLYMETHYL METHACRYLATE, C20-22 ALKYL PHOSPHATE, C20-22 ALCOHOLS, HYDROGENATED PALM KERNEL GLYCERIDES, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, DIISOPROPYL SEBACATE, PROPYLENE GLYCOL DICAPRYLATE/DICAPRATE, C12-15 ALKYL BENZOATE, DIISOPROPYL ADIPATE, PROPANEDIOL, CI 77492 (IRON OXIDES), BUTYLENE GLYCOL, PHENOXYETHANOL, DECYL GLUCOSIDE, TRIACONTANYL PVP, HYDROGENATED PALM GLYCERIDES, PARFUM (FRAGRANCE), CHLORPHENESIN, XANTHAN GUM, CI 77491 (IRON OXIDES), MICA, TRIETHOXYCAPRYLYLSILANE, BRASSICA CAMPESTRIS STEROLS, O-CYMEN-5-OL, TOCOPHERYL ACETATE, SODIUM HYDROXIDE, CI 77499 (IRON OXIDES), PHYTOSPHINGOSINE, RASPBERRY SEED OIL/PALM OIL AMINOPROPANEDIOL ESTERS, SILICA, SORBITOL, ASIATICOSIDE, BHT, MALTODEXTRIN, ASPARAGOPSIS ARMATA EXTRACT, PANAX GINSENG ROOT EXTRACT, TOCOPHEROL, ASCOPHYLLUM NODOSUM EXTRACT, TIN OXIDE, POTASSIUM SORBATE',
    url: 'https://www.uriage.fr/produits/roseliane-cc-cream-spf50',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.PROTECTION_SOLAIRE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.PIGMENTS_VERTS,
        TAG_SLUGS.CREME_SOLAIRE_TEINTEE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
        notes: 'Filtre UV large spectre (Tinosorb S)',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      },
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      },
      {
        slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      },
      {
        slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
        notes: 'Algue brune, complexe SK5R anti-rougeurs',},
    ],
  },
  {
    slug: 'uriage-keratosane-30-gel-creme',
    name: 'Kératosane 30 Gel Crème Anti-Callosités',
    brand: 'Uriage',
    kind: 'body-lotion',
    unit: 'tube',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 749,
    description: `Gel-crème haute tolérance au pouvoir kératolytique intensif. Exfolie les zones rugueuses et épaissies grâce à sa concentration optimale en urée. Enrichi en Eau Thermale d'Uriage pour apaiser et protéger la peau sensible.`,
    notes: `30% d'urée pure + Glycocolle + Sulfate de dextran. Testé sous contrôle dermatologique. Non comédogène, sans parfum. Peut provoquer des picotements passagers sur peaux sensibles.`,
    inci: 'WATER, UREA, GLYCERIN, GLYCINE, PARAFFINUM LIQUIDUM, SQUALANE, SORBITAN STEARATE, ALGIN, POLYSORBATE 60, PHENOXYETHANOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, CHOLESTEROL, SODIUM DEXTRAN SULFATE, SODIUM HYDROXIDE',
    url: 'https://www.uriage.fr/produits/keratosane-30',
    tags: {
      primary: [TAG_SLUGS.KERATOSE_PILAIRE, TAG_SLUGS.GRAIN_PEAU],
      secondary: [
        TAG_SLUGS.GEL_CREME,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.SOIN_LOCALISE,
        TAG_SLUGS.PROTECTION_CUTANEE,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TEXTURE_LEGERE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.UREA,
        notes: '30% — action kératolytique puissante',},
      {
        slug: INGREDIENT_SLUGS.GLYCINE,
        notes: 'Acide aminé apaisant',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Émollient mimétique du sébum',},
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
        notes: 'Lipide réparateur',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_DEXTRAN_SULFATE,
        notes: 'Agent apaisant anti-inflammatoire',},
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
        notes: 'Humectant',},
    ],
  },
]
