import { TAG_SLUGS } from "../../tags/seed-tags";
import { INGREDIENT_SLUGS } from "../../ingredients/ingredient-slugs";
import type { UnifiedProductSeed } from "../unified-types";

export const DR_IDRISS_SEED: UnifiedProductSeed[] = [
  {
    slug: "dr-idriss-the-depuffer-serum-roller-anti-gonflements",
    name: 'The Depuffer - Serum Roller Anti-gonflements',
    brand: 'Dr. Idriss',
    kind: 'skincare',
    unit: "roller",
    totalAmount: 40,
    amountUnit: "ml",
    priceCents: 4500,
    description: 'Premier rouleau facial actif anti-rougeurs et dégonflant, soulage les rougeurs transitoires et minimise les poches sous-oculaires.',
    notes: 'Testé cliniquement, sans parfum et non irritant. Contient arnica pour réduire les gonflements et centella asiatica pour soulager les rougeurs.',
    inci: 'WATER, NIACINAMIDE, GLYCERIN, DIMETHICONE, PENTYLENE GLYCOL, BUTYLENE GLYCOL, PROPANEDIOL, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, SQUALANE, ARNICA MONTANA FLOWER EXTRACT, CENTELLA ASIATICA LEAF EXTRACT, FRAXINUS EXCELSIOR BARK EXTRACT, AGASTACHE MEXICANA FLOWER/LEAF/STEM EXTRACT, AVENA SATIVA (OAT) KERNEL EXTRACT, CAMELLIA SATIVA LEAF EXTRACT, HYDROXYPHENYL PROPAMIDOBENZOIC ACID, MALTODEXTRIN, DIMETHICONE CROSSPOLYMER, SILANETRIOL, SORBITAN ISOSTEARATE, POLYSORBATE 60, CAPRYLYL GLYCOL, HEXYLENE GLYCOL, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL',
    url: 'https://www.dridris.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.CERNES_POCHES, TAG_SLUGS.FLUSHS],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.SOIN_YEUX,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.ZONE_YEUX,
        TAG_SLUGS.MATIN,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Anti-rougeurs et anti-cernes',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Hydratant lipidique doux',},
      {
        slug: INGREDIENT_SLUGS.ARNICA,
        notes: 'Arnica Montana – réduit les gonflements et ecchymoses, drainant',},
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Centella Asiatica – apaise les rougeurs visibles',},
      {
        slug: INGREDIENT_SLUGS.AVENA_SATIVA,
        notes: `Extrait d'avoine – apaisant, barrière`,},
    ],
  },
  {
    slug: "dr-idriss-major-fade-hyper-serum-anti-taches-eclat",
    name: 'Major Fade Hyper Serum - Sérums Anti-taches',
    brand: 'Dr. Idriss',
    kind: 'skincare',
    unit: "cartridge",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 8000,
    description: 'Sérum illuminant qui aide à estomper les taches brunes tenaces et améliore le teint inégal.',
    notes: 'Livré avec deux cartouches pour assurer la fraîcheur des actifs. Sans parfum et non irritant.',
    inci: 'WATER, NIACINAMIDE, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, PENTYLENE GLYCOL, ALPHA-ARBUTIN, BUTYROSPERMUM PARKII (SHEA) BUTTER, SQUALANE, CETEARYL OLIVATE, DIMETHICONE, CETYL ALCOHOL, SORBITAN OLIVATE, KOJIC ACID, DIGLUCOSYL GALLIC ACID, GLYCYRRHIZA GLABRA (LICORICE) ROOT EXTRACT, PERSEA GRATISSIMA (AVOCADO) OIL, SCLEROTIUM GUM, XANTHAN GUM, CITRIC ACID, SODIUM PHYTATE, CAPRYLYL GLYCOL, HEXYLENE GLYCOL, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL, MICA, TITANIUM DIOXIDE (CI 77891)',
    url: 'https://www.dridris.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Inhibe le transfert des mélanosomes, anti-taches, barrière',},
      {
        slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN,
        notes: 'Inhibiteur de tyrosinase – anti-taches puissant',},
      {
        slug: INGREDIENT_SLUGS.KOJIC_ACID,
        notes: 'Chélateur du cuivre / inhibiteur de tyrosinase – dépigmentant',},
      {
        slug: INGREDIENT_SLUGS.REGLISSE,
        notes: 'Extrait de réglisse – anti-inflammatoire, dépigmentant doux',},
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Émollient barrière',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – émollient nourrissant',},
      {
        slug: INGREDIENT_SLUGS.AVOCADO_OIL,
        notes: `Huile d'avocat – émollient`,},
    ],
  },
  {
    slug: "dr-idriss-major-fade-active-seal-anti-taches-vitamine-c",
    name: 'Major Fade Active Seal - Sérums Anti-taches Vitamine C',
    brand: 'Dr. Idriss',
    kind: 'skincare',
    unit: "bottle",
    totalAmount: 50,
    amountUnit: "ml",
    priceCents: 6900,
    description: 'Sceau actif formulé avec de la vitamine C estérifiée pour estomper la décoloration et réduire les ridules.',
    notes: 'Contient du 4-butylrésorcinol et hexapeptide-2. Hydrate avec la glycérine.',
    inci: 'WATER, GLYCERIN, TETRAHEXYLDECYL ASCORBATE, SQUALANE, CAPRYLIC/CAPRIC TRIGLYCERIDE, BIS-PEG-18 METHYL ETHER DIMETHYL SILANE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, TRIHEPTANOIN, PENTYLENE GLYCOL, PHENYL TRIMETHICONE, OXIDIZED GLUTATHIONE, 4-BUTYLRESORCINOL, HEXAPEPTIDE-2, HYDROLYZED BRASSICA NAPUS SEEDCAKE EXTRACT, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, TOCOPHEROL, BUTYLENE GLYCOL, CETEARYL OLIVATE, COCO-CAPRYLATE/CAPRATE, SORBITAN OLIVATE, ETHYLHEXYLGLYCERIN, POLYSORBATE 60, XANTHAN GUM, DILINOLEIC ACID/BUTANEDIOL COPOLYMER, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, CHOLESTEROL, PHYTOSPHINGOSINE, DIPOTASSIUM GLYCYRRHIZATE, SODIUM LAUROYL LACTYLATE, CARBOMER, SODIUM HYDROXIDE, TETRASODIUM GLUTAMATE DIACETATE, SORBITAN ISOSTEARATE, CASTOR OIL/IPDI COPOLYMER, SODIUM BENZOATE, POTASSIUM SORBATE, PHENOXYETHANOL',
    url: 'https://www.dridris.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.REPULPANT,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.THD_ASCORBATE,
        notes: 'Tetrahexyldecyl Ascorbate – vitamine C liposoluble stable, anti-taches, collagène',},
      {
        slug: INGREDIENT_SLUGS.BUTYLRESORCINOL,
        notes: '4-Butylresorcinol – inhibiteur puissant de tyrosinase, anti-taches',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramides (NP/AP/EOP) – reconstruction de la barrière cutanée',},
      { slug: INGREDIENT_SLUGS.CERAMIDE_AP },
      { slug: INGREDIENT_SLUGS.CERAMIDE_EOP },
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
        notes: 'Lipide barrière biomimétique',},
      {
        slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
        notes: 'Précurseur de céramides – renforce la barrière',},
      {
        slug: INGREDIENT_SLUGS.GLUTATHION,
        notes: 'Glutathion oxydé – antioxydant, éclaircissant',},
    ],
  },
  {
    slug: "dr-idriss-major-fade-disco-block-spf50-teintee",
    name: 'Major Fade Disco Block SPF 50 - Crème solaire teintée',
    brand: 'Dr. Idriss',
    kind: 'sunscreen',
    unit: "pump",
    totalAmount: 40,
    amountUnit: "ml",
    priceCents: 7500,
    description: `Protection UVA/UVB SPF 50 qui illumine instantanément et réduit l'apparence des dommages solaires.`,
    notes: 'Texture légère en nuage avec un fini glow naturel sans blancheur. Contient hexylrésorcinol et céramides.',
    inci: 'WATER, BUTYLOCTYL SALICYLATE, GLYCERIN, CANDELILLA/JOJOBA/RICE BRAN POLYGLYCERYL-3 ESTERS, CAPRYLOYL GLYCERIN/SEBACIC ACID COPOLYMER, COCO-CAPRYLATE/CAPRATE, PROPANEDIOL, GLYCERYL STEARATE, CETEARYL ALCOHOL, GLYCERYL CITRATE/LACTATE/LINOLEATE/OLEATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, 1,2-HEXANEDIOL, HEXYLRESORCINOL, SODIUM STEAROYL LACTYLATE, ECLIPTA PROSTRATA EXTRACT, SODIUM POLYACRYLATE STARCH, SYNTHETIC FLUORPHLOGOPITE, BEHENYL ALCOHOL, XANTHAN GUM, MELIA AZADIRACHTA LEAF EXTRACT, CAPRYLHYDROXAMIC ACID, ALGIN, ARGANIA SPINOSA KERNEL OIL, DIMETHICONE, PERSEA GRATISSIMA (AVOCADO) OIL, SQUALANE, THEOBROMA CACAO (COCOA) SEED BUTTER, MANGIFERA INDICA (MANGO) SEED BUTTER, MELIA AZADIRACHTA FLOWER EXTRACT, CORALLINA OFFICINALIS EXTRACT, MORINGA OLEIFERA SEED OIL, COCCINIA INDICA FRUIT EXTRACT, SOLANUM MELONGENA (EGGPLANT) FRUIT EXTRACT, ALOE BARBADENSIS FLOWER EXTRACT, CERAMIDE NP, 2,3-BUTANEDIOL, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, CURCUMA LONGA (TURMERIC) ROOT EXTRACT, OCIMUM BASILICUM (BASIL) FLOWER/LEAF EXTRACT, OCIMUM SANCTUM LEAF EXTRACT, HYDROGENATED LECITHIN, LACTIC ACID, PHYLLANTHUS EMBLICA FRUIT EXTRACT, SODIUM BENZOATE, TOCOPHEROL, POTASSIUM SORBATE, CERAMIDE AP, CERAMIDE AS, CERAMIDE NS, CHOLESTEROL, CITRIC ACID, CERAMIDE EOP, AVOBENZONE 3%, HOMOSALATE 7%, OCTOCRYLENE 10%, OCTISALATE 5%',
    url: 'https://www.dridris.com',
    tags: {
      primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.CREME_SOLAIRE_TEINTEE,
        TAG_SLUGS.SANS_SAVON,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
        notes: 'Hexylrésorcinol – éclaircissant, inhibiteur de tyrosinase, anti-taches',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Complexe céramides (NP/AP/NS/AS/EOP) – renfort de la barrière solaire',},
      {
        slug: INGREDIENT_SLUGS.CHOLESTEROL,
        notes: 'Lipide barrière',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité – émollient protecteur',},
      {
        slug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT,
        notes: 'Extrait de curcuma – antioxydant',},
      {
        slug: INGREDIENT_SLUGS.AVOBENZONE,
        notes: '3% - Filtre UVA chimique',},
      {
        slug: INGREDIENT_SLUGS.HOMOSALATE,
        notes: '7% - Filtre UVB chimique',},
      {
        slug: INGREDIENT_SLUGS.OCTOCRYLENE,
        notes: '10% - Filtre UVB chimique stabilisant',},
      {
        slug: INGREDIENT_SLUGS.ETHYLHEXYL_SALICYLATE,
        notes: '5% - Octisalate – filtre UVB chimique',},
    ],
  },
  {
    slug: "dr-idriss-major-fade-flash-mask-exfoliant-acides",
    name: 'Major Fade Flash Mask - Masque exfoliant acides',
    brand: 'Dr. Idriss',
    kind: 'mask',
    unit: "tube",
    totalAmount: 50,
    amountUnit: "ml",
    priceCents: 5700,
    description: `Masque exfoliant puissant avec 15% d'acide glycolique et 3% d'acide lactique pour une peau plus lisse.`,
    notes: `Contient de l'acide tranexamique pour uniformiser le teint. Hydrate avec la glycérine.`,
    inci: 'WATER, GLYCOLIC ACID, TRANEXAMIC ACID, GLYCERIN, HYDROXYPROPYL STARCH PHOSPHATE, LACTIC ACID, SODIUM HYDROXIDE, PENTYLENE GLYCOL, PANTHENOL, PROPANEDIOL, 1,2-HEXANEDIOL, SCLEROTIUM GUM, COCCINIA INDICA FRUIT EXTRACT, ECLIPTA PROSTRATA EXTRACT, GLYCERYL POLYACRYLATE, CAPRYLHYDROXAMIC ACID, AMYLOPECTIN, ANNATTO (CI 75120)',
    url: 'https://www.dridris.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.TEINT_TERNE],
      secondary: [
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.MASQUE_HYDRATANT,
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.MASQUE_HEBDO,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
        notes: '15% - AHA exfoliant puissant – renouvellement cellulaire, anti-taches',},
      {
        slug: INGREDIENT_SLUGS.LACTIC_ACID,
        notes: '3% - AHA doux – exfoliant et hydratant',},
      {
        slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
        notes: 'Acide tranexamique – anti-taches, anti-inflammatoire, unifie le teint',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: `Provitamine B5 – réduit l'irritation post-exfoliation`,},
    ],
  },
  {
    slug: "dr-idriss-left-un-red-reducer-serum-anti-rougeurs",
    name: 'Left Un-Red Reducer Serum - Sérum anti-rougeurs azelique',
    brand: 'Dr. Idriss',
    kind: 'serum',
    unit: "bottle",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 6000,
    description: `Formule alimentée par un complexe d'acide azélaïque 10% pour réduire les rougeurs visibles.`,
    notes: 'Accepté par la National Rosacea Society. Idéal pour la rosacée.',
    inci: 'WATER, AZELAIC ACID, PENTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, BUTYROSPERMUM PARKII (SHEA) BUTTER, DIPROPYLENE GLYCOL, CETEARYL OLIVATE, CETYL ALCOHOL, SORBITAN OLIVATE, SODIUM ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, DIMETHICONE, SODIUM HYDROXIDE, GLYCYRRHETINIC ACID, HYDROXYPHENYL PROPAMIDOBENZOIC ACID, SALIX ALBA (WILLOW) BARK EXTRACT, APRICOT KERNEL OIL POLYGLYCERYL-6 ESTERS, PROLINE, MAGNOLOL, HONOKIOL, SODIUM PHYTATE, ASCORBYL PALMITATE, BISABOLOL, CAPRYLOYL GLYCINE, ETHYLHEXYLGLYCERIN, BUTYLENE GLYCOL, SORBITAN OLEATE, POLYGLYCERYL-6 CAPRYLATE, XANTHAN GUM, POLYSORBATE 80, POLYGLYCERY-10 OLEATE, ISOHEXADECANE, SORBITAN PALMITATE, SODIUM BICARBONATE, PHENOXYETHANOL, YELLOW 5 (CI 19140), BLUE 1 (CI 42090)',
    url: 'https://www.dridris.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.FLUSHS],
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
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        notes: '10% - Acide azélaïque – séborégulateur, anti-rougeurs, anti-rosacée',},
      {
        slug: INGREDIENT_SLUGS.ENOXOLONE,
        notes: 'Acide glycyrrhétinique – anti-inflammatoire puissant, calme les rougeurs',},
      {
        slug: INGREDIENT_SLUGS.BISABOLOL,
        notes: `Bisabolol – apaisant, réduit l'irritation`,},
      {
        slug: INGREDIENT_SLUGS.ASCORBYL_PALMITATE,
        notes: 'Vitamine C liposoluble – antioxydant stabilisateur',},
    ],
  },
  {
    slug: "dr-idriss-left-un-red-calmback-cream-apaisante",
    name: 'Left Un-Red CalmBack Cream - Crème apaisante barrière',
    brand: 'Dr. Idriss',
    kind: 'moisturizer',
    unit: "jar",
    totalAmount: 50,
    amountUnit: "ml",
    priceCents: 5000,
    description: `Mélange apaisant de zinc PCA, flocons d'avoine colloïdaux et céramides pour soulager la peau réactive.`,
    notes: 'Améliore la fonction de la barrière cutanée. Accepté par la National Rosacea Society.',
    inci: 'WATER, PHYTOSTERYL/ISOSTEARYL/CETYL/STEARYL/BEHENYL DIMER DILINOLEATE, GLYCERIN, COCO-CAPRYLATE/CAPRATE, DIMETHICONE, PROPANEDIOL, CETEARYL OLIVATE, CETYL LACTATE, CETEARYL ALCOHOL, THEOBROMA GRANDIFLORUM SEED BUTTER, ALPHA-GLUCAN OLIGOSACCHARIDE, PHYTOSTERYL/BEHENYL/OCTYLDODECYL LAUROYL GLUTAMATE, SORBITAN OLIVATE, PANTHENOL, ZINC PCA, COLLOIDAL OATMEAL, GLYCERYL STEARATE CITRATE, ACETYL TETRAPEPTIDE-40, CERAMIDE NP, TOCOPHEROL, ZINC GLUCONATE, SODIUM PHYTATE, CETEARYL GLUCOSIDE, CITRIC ACID, CAPRYLYL GLYCOL, SORBITAN ISOSTEARATE, ETHYLHEXYLGLYCERIN, POLYSORBATE 60, PENTAERYTHRITYL TETRA-DI-T-BUTYL HYDROXYHYDROCINNAMATE, ISOHEXADECANE, SODIUM HYDROXIDE, BEHENYL ALCOHOL, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, PHENOXYETHANOL, YELLOW 5 (CI 19140), BLUE 1 (CI 42090)',
    url: 'https://www.dridris.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.ZINC_PCA,
        notes: 'Zinc PCA – séborégulateur, apaisant, anti-rougeurs',},
      {
        slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
        notes: `Flocons d'avoine colloïdaux – calmant, anti-démangeaisons, barrière`,},
      {
        slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
        notes: 'BioEcolia® – prébiotique, équilibre le microbiome',},
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Céramide NP – renforce la barrière cutanée',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Provitamine B5 – apaisant, hydratant',},
      {
        slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
        notes: 'Zinc gluconate – apaisement complémentaire',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E – antioxydant',},
    ],
  },
];
