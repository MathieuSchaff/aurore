import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const MEDICUBE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'medicube-super-cica-pads',
    name: 'Super Cica Pads',
    brand: 'Medicube',
    kind: 'patch',
    unit: 'jar',
    totalAmount: 70,
    amountUnit: 'ct',
    priceCents: 0,
    description:
      'Pads exfoliants et apaisants à la Centella Asiatica pour apaiser les peaux sensibles et irritées.',
    notes:
      'Centella Asiatica + Acide Hyaluronique + Ectoin + Acide Salicylique. Idéal pour peaux réactives et sensibles.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, PENTYLENE GLYCOL, METHYLPROPANEDIOL, DIPROPYLENE GLYCOL, CENTELLA ASIATICA EXTRACT, CENTELLA ASIATICA LEAF EXTRACT, CENTELLA ASIATICA ROOT EXTRACT, ASIATIC ACID, ASIATICOSIDE, MADECASSIC ACID, MADECASSOSIDE, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, SALICYLIC ACID, PANTHENOL, ECTOIN, GLYCERETH-25 PCA ISOSTEARATE, GLYCERETH-26, BIOSACCHARIDE GUM-1, BLETILLA STRIATA ROOT EXTRACT, BACILLUS/SOYBEAN FERMENT EXTRACT, ECHINACEA PURPUREA EXTRACT, HOUTTUYNIA CORDATA EXTRACT, PERILLA OCYMOIDES LEAF EXTRACT, MELIA AZADIRACHTA FLOWER EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, POLYGLYCERYL-10 OLEATE, AMMONIUM POLYACRYLOYLDIMETHYL TAURATE, HYDROXYETHYLCELLULOSE, TROMETHAMINE, HYDROXYACETOPHENONE, ETHYL HEXYLGLYCERIN, 12-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-super-cica-pads-5-29-oz-150-g-70-count',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/27D90EDF51FF27/large_1730180051.jpeg?1730180051',
    tags: {
      primary: [TAG_SLUGS.APAISANT, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Apaisant, cicatrisant' },
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID, notes: 'Hydratant' },
      { slug: INGREDIENT_SLUGS.ECTOIN, notes: 'Protection cellulaire' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA, exfoliant doux' },
    ],
  },
  {
    slug: 'medicube-red-cream',
    name: 'Red Cream',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Crème anti-acné au soufre colloïdal et à l"acide salicylique pour réduire les imperfections et réguler le sébum.`,
    notes:
      'Soufre Colloïdal + Acide Salicylique + Niacinamide + Tea Tree. Idéal pour peaux grasses à tendance acnéique.',
    inci: 'WATER, GLYCERIN, COLLOIDAL SULFUR, NIACINAMIDE, CETYL ALCOHOL, STEARYL ALCOHOL, MYRISTYL ALCOHOL, LAURYL ALCOHOL, GLYCERYL STEARATE, GLYCERYL STEARATE CITRATE, POLYGLYCERYL-3 DISTEARATE, HYDROGENATED POLY (C6-14 OLEFIN), CETYL ETHYLHEXANOATE, DIMETHICONE, BUTYLENE GLYCOL, PENTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, SALICYLIC ACID, SALIX ALBA (WILLOW) BARK EXTRACT, MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF OIL, CAMELLIA SINENSIS LEAF EXTRACT, CENTELLA ASIATICA LEAF EXTRACT, CITRUS AURANTIUM BERGAMIA (BERGAMOT) LEAF EXTRACT, COFFEA ARABICA (COFFEE) SEED EXTRACT, COPTIS JAPONICA EXTRACT, PINUS DENSIFLORA LEAF EXTRACT, ASPARAGUS COCHINCHINENSIS ROOT EXTRACT, CLADOSIPHON OKAMURANUS EXTRACT, LEPIDIUM MEYENII ROOT EXTRACT, AUREOBASIDIUM PULLULANS FERMENT, DIMETHYL SULFONE, RUTIN, TROXERUTIN, ZINC PCA, ADENOSINE, TOCOPHEROL, ALLANTOIN, GLUCOSE, DECYL GLUCOSIDE, C12-14 ALKETH-12, SODIUM STEAROYL GLUTAMATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, ARACHIDIC ACID, MYRISTIC ACID, STEARIC ACID, OLEIC ACID, PALMITIC ACID, HYDROXYCINNAMIC ACID, LEVULINIC ACID, LIMONENE, GERANIOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, CARBOMER, TROMETHAMINE, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-red-cream-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/F8BED66F8DC361/large_1715502141.pngpng?1715502141',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.SEBO_REGULATEUR],
      secondary: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.SOIR],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SULFUR, notes: 'Anti-acné, antibactérien' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'Exfoliant BHA' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Apaisant, régulateur' },
      { slug: INGREDIENT_SLUGS.TEA_TREE, notes: 'Antibactérien naturel' },
    ],
  },
  {
    slug: 'medicube-zero-pore-pads-2-0',
    name: 'Zero Pore Pads 2.0',
    brand: 'Medicube',
    kind: 'patch',
    unit: 'jar',
    totalAmount: 70,
    amountUnit: 'ct',
    priceCents: 0,
    description:
      'Pads tonifiants à double exfoliation pour resserrer les pores dilatés et unifier le teint.',
    notes: `Acide Lactique + Bétaïne Salicylate + Centella Asiatica + Huiles essentielles d"agrumes. Idéal pour peaux mixtes à pores dilatés.`,
    inci: 'WATER, GLYCERIN, ALCOHOL DENAT, BUTYLENE GLYCOL, METHYLPROPANEDIOL, GLYCERETH-26, BETAINE, BETAINE SALICYLATE, LACTIC ACID, SALICYLIC ACID, SALIX ALBA (WILLOW) BARK EXTRACT, CENTELLA ASIATICA EXTRACT, SODIUM HYALURONATE, PANTHENOL, TREHALOSE, LACTOBACILLUS/SOYBEAN FERMENT EXTRACT, CHAMAECYPARIS OBTUSA LEAF EXTRACT, CINNAMOMUM CASSIA BARK EXTRACT, SCUTELLARIA BAICALENSIS ROOT EXTRACT, PORTULACA OLERACEA EXTRACT, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, ORIGANUM VULGARE LEAF EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, CITRUS AURANTIFOLIA (LIME) FRUIT EXTRACT, CITRUS AURANTIUM DULCIS (ORANGE) FRUIT EXTRACT, PYRUS MALUS (APPLE) FRUIT EXTRACT, CITRUS AURANTIUM BERGAMIA (BERGAMOT) FRUIT OIL, CITRUS AURANTIUM DULCIS (ORANGE) PEEL OIL, CITRUS GRANDIS (GRAPEFRUIT) PEEL OIL, CITRUS LIMON (LEMON) FRUIT EXTRACT, CITRUS LIMON (LEMON) PEEL OIL, EUCALYPTUS GLOBULUS LEAF OIL, LAVANDULA ANGUSTIFOLIA (LAVENDER) OIL, ROSMARINUS OFFICINALIS (ROSEMARY) LEAF OIL, POLYGLYCERYL-10 LAURATE, POLYGLYCERYL-10 MYRISTATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, TROMETHAMINE, LIMONENE, ETHYL HEXANEDIOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-zero-pore-pads-2-0-5-46-oz-156-g-70-count',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/32CA87DEE2DE66/large_1677985769.jpeg?1677985769',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.GRAIN_PEAU],
      secondary: [TAG_SLUGS.PEAU_MIXTE, TAG_SLUGS.EXFOLIATION],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.LACTIC_ACID, notes: 'AHA, exfoliant' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA, exfoliant' },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Apaisant' },
    ],
  },
  {
    slug: 'medicube-zero-pore-one-day-cream',
    name: 'Zero Pore One Day Cream',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Crème hydratante aux pores affinée combinant Panthénol 5%, BHA et Niacinamide pour une peau lissée et lumineuse.',
    notes:
      'Panthénol 5% + BHA 0,1% + Niacinamide 2% + Acide Hyaluronique multi-poids. Idéal pour peaux à pores dilatés et teint terne.',
    inci: 'WATER(AQUA), GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, CYCLOPENTASILOXANE, ISODODECANE, ISOHEXADECANE, HYDROGENATED POLYISOBUTENE, HYDROGENATED POLY(C6-14 OLEFIN), CETYL ETHYLHEXANOATE, ETHYLHEXYL PALMITATE, OCTYLDODECANOL, DEXTRIN, NIACINAMIDE, PANTHENOL, SALICYLIC ACID, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, HYDROLYZED SODIUM HYALURONATE, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, HYDROXYPROPYLTRIMONIUM HYALURONATE, BETA-GLUCAN, DIMETHYL SULFONE, ADENOSINE, ALLANTOIN, RUTIN, PALMITOYL TRIPEPTIDE-5, CAMELLIA SINENSIS LEAF EXTRACT, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, GARDENIA FLORIDA FRUIT EXTRACT, DIOSPYROS KAKI FRUIT EXTRACT, CASTANEA CRENATA (CHESTNUT) SHELL EXTRACT, GLYCERYL STEARATE, GLYCERYL STEARATE CITRATE, POLYGLYCERYL-3 DISTEARATE, POLYGLYCERYL-10 LAURATE, SODIUM STEAROYL GLUTAMATE, SORBITAN ISOSTEARATE, SORBITAN OLIVATE, CETEARYL OLIVATE, CETYL ALCOHOL, STEARYL ALCOHOL, LAURYL ALCOHOL, MYRISTYL ALCOHOL, POLYACRYLATE-13, SODIUM POLYACRYLOYLDIMETHYL TAURATE, SODIUM CITRATE, TRISODIUM PHOSPHATE, TROMETHAMINE, PULLULAN, HYDROXYCINNAMIC ACID, FRAGRANCE, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-zero-pore-one-day-cream-panthenol-5-bha-0-1-niacinamide-2-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/3723493C322206/large_1749886123.pngpng?1749886123',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.HYDRATATION],
      secondary: [TAG_SLUGS.PEAU_MIXTE, TAG_SLUGS.ECLAT],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PANTHENOL, concentrationValue: 5, concentrationUnit: '%', notes: 'Apaisant, hydratant' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, concentrationValue: 0.1, concentrationUnit: '%', notes: 'BHA, exfoliant' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, concentrationValue: 2, concentrationUnit: '%', notes: 'Régulateur, éclaircissant' },
    ],
  },
  {
    slug: 'medicube-zero-pore-pad-2-0',
    name: 'Zero Pore Pad 2.0',
    brand: 'Medicube',
    kind: 'patch',
    unit: 'jar',
    totalAmount: 70,
    amountUnit: 'ct',
    priceCents: 0,
    description: `Pads exfoliants à l"acide lactique et au bétaïne salicylate pour minimiser les pores et affiner le grain de peau.`,
    notes:
      'Bétaïne Salicylate + Acide Lactique + Centella Asiatica + Extraits botaniques. Idéal pour peaux mixtes à grasses avec pores visibles.',
    inci: 'WATER, GLYCERIN, ALCOHOL DENAT., BUTYLENE GLYCOL, METHYLPROPANEDIOL, GLYCERETH-26, BETAINE, BETAINE SALICYLATE, LACTIC ACID, SALICYLIC ACID, SALIX ALBA (WILLOW) BARK EXTRACT, CENTELLA ASIATICA EXTRACT, SODIUM HYALURONATE, PANTHENOL, TREHALOSE, LACTOBACILLUS/SOYBEAN FERMENT EXTRACT, CHAMAECYPARIS OBTUSA LEAF EXTRACT, CINNAMOMUM CASSIA BARK EXTRACT, SCUTELLARIA BAICALENSIS ROOT EXTRACT, PORTULACA OLERACEA EXTRACT, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, ORIGANUM VULGARE LEAF EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, CITRUS AURANTIFOLIA (LIME) FRUIT EXTRACT, CITRUS AURANTIUM DULCIS (ORANGE) FRUIT EXTRACT, PYRUS MALUS (APPLE) FRUIT EXTRACT, CITRUS AURANTIUM BERGAMIA (BERGAMOT) FRUIT OIL, CITRUS AURANTIUM DULCIS (ORANGE) PEEL OIL, CITRUS GRANDIS (GRAPEFRUIT) PEEL OIL, CITRUS LIMON (LEMON) FRUIT EXTRACT, CITRUS LIMON (LEMON) PEEL OIL, EUCALYPTUS GLOBULUS LEAF OIL, LAVANDULA ANGUSTIFOLIA (LAVENDER) OIL, ROSMARINUS OFFICINALIS (ROSEMARY) LEAF OIL, POLYGLYCERYL-10 LAURATE, POLYGLYCERYL-10 MYRISTATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, TROMETHAMINE, LIMONENE, ETHYL HEXANEDIOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-zero-pore-pad-2-0-5-46-oz-155-g-70-count-0',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/4F4864FEC4C022/large_1747549943.pngpng?1747549943',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.EXFOLIATION],
      secondary: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.GRAIN_PEAU],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.LACTIC_ACID, notes: 'AHA' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA' },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Apaisant' },
    ],
  },
  {
    slug: 'medicube-triple-deep-erasing-cream',
    name: 'Triple Deep Erasing Cream',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 60,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Crème anti-taches multi-actifs à la vitamine C stabilisée, Niacinamide et peptides pour corriger les hyperpigmentations.',
    notes:
      '3-O-Éthyl Ascorbique + Ascorbyl Glucoside + Niacinamide + Palmitoyl Peptides. Idéal pour peaux matures avec taches et rides.',
    inci: 'WATER/AQUA/EAU, GLYCERIN, BUTYLENE GLYCOL, METHYLPROPANEDIOL, DIPROPYLENE GLYCOL, HEXYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, ISONONYL ISONONANOATE, TRIETHYLHEXANOIN, HYDROGENATED POLYDECENE, HYDROGENATED POLYISOBUTENE, HYDROGENATED POLY(C6-14 OLEFIN), SQUALANE, C12-16 ALCOHOLS, CETEARYL ALCOHOL, CETEARYL GLUCOSIDE, CETEARYL OLIVATE, SORBITAN OLIVATE, GLYCERYL STEARATE, GLYCERYL STEARATE SE, PEG-100 STEARATE, POLYSORBATE 60, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, POLYGLYCERYL-10 STEARATE, HYDROGENATED LECITHIN, INULIN LAURYL CARBAMATE, MICROCRYSTALLINE CELLULOSE, CELLULOSE GUM, NIACINAMIDE, 3-O-ETHYL ASCORBIC ACID, ASCORBYL GLUCOSIDE, PALMITIC ACID, STEARIC ACID, PALMITIC ACID, PALMITOYL PENTAPEPTIDE-4, PALMITOYL TRIPEPTIDE-5, ADENOSINE, ALLANTOIN, BISABOLOL, FOLIC ACID, BETA-GLUCAN, SARCOSINE, ZINC PCA, CERAMIDE NP, CHOLESTEROL, TOCOPHEROL, OLEANOLIC ACID, CENTELLA ASIATICA EXTRACT, DIOSCOREA JAPONICA ROOT EXTRACT, AESCULUS HIPPOCASTANUM (HORSE CHESTNUT) EXTRACT, PANAX GINSENG BERRY EXTRACT, NELUMBO NUCIFERA LEAF EXTRACT, OLEA EUROPAEA (OLIVE) LEAF EXTRACT, LUPINUS ALBUS SEED EXTRACT, PIPER METHYSTICUM LEAF/ROOT/STEM EXTRACT, CINNAMOMUM ZEYLANICUM BARK EXTRACT, CRYPTOMERIA JAPONICA LEAF EXTRACT, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, PSEUDOALTEROMONAS FERMENT EXTRACT, SACCHAROMYCES FERMENT FILTRATE, BIOSACCHARIDE GUM-1, POLYQUATERNIUM-51, DESAMIDO COLLAGEN, HYDROLYZED ELASTIN, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, CYCLOPENTASILOXANE, CYCLOHEXASILOXANE, DIMETHICONE, ARGANIA SPINOSA KERNEL OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, SACCHARIDE HYDROLYSATE, GLYCOSYL TREHALOSE, HYDROGENATED STARCH HYDROLYSATE, HYDROLYZED CORN STARCH, MALTODEXTRIN, FRUCTOSE, SUCROSE, RAFFINOSE, CAPRYLOYL GLYCINE, ENANTIA CHLORANTHA BARK EXTRACT, CITRIC ACID, POTASSIUM SORBATE, CAPRYLYL GLYCOL, FRAGRANCE, HYDROXYCITRONELLAL, LIMONENE, LINALOOL',
    url: 'https://www.skinsafeproducts.com/medicube-triple-deep-erasing-cream-1-69-fl-oz-60-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/EA54A49C829C14/large_1689318243.pngpng?1689318243',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_AGE],
      secondary: [TAG_SLUGS.SOIR],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID, notes: 'Vitamine C stable' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclaircissant' },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Barrière' },
    ],
  },
  {
    slug: 'medicube-azelaic-acid-16-bb-calming-serum',
    name: 'Azelaic Acid 16 BB Calming Serum',
    brand: 'Medicube',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Sérum apaisant à l"acide azélaïque 16% pour atténuer les rougeurs, les taches et les imperfections des peaux sensibles.`,
    notes:
      'Acide Azélaïque 16% + Niacinamide + Céramide NP + Squalane. Idéal pour peaux sensibles, rosacée, ou sujettes aux rougeurs.',
    inci: 'WATER (AQUA), PROPYLENE GLYCOL, AZELAIC ACID, BUTYLENE GLYCOL, PROPANEDIOL, GLYCERYL CAPRYLATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, OLEA EUROPAEA (OLIVE) FRUIT OIL, SQUALANE, NIACINAMIDE, NICOTINAMIDE MONONUCLEOTIDE, PANTHENOL, PANTOTHENIC ACID, CERAMIDE NP, LECITHIN, HYDROLYZED PEA PROTEIN, PHYTOSTEROLS, CENTELLA ASIATICA EXTRACT, ALOE BARBADENSIS FLOWER EXTRACT, CURCUMA LONGA (TURMERIC) ROOT EXTRACT, COCCINIA INDICA FRUIT EXTRACT, CORALLINA OFFICINALIS EXTRACT, MELIA AZADIRACHTA FLOWER EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, OCIMUM SANCTUM LEAF EXTRACT, SOLANUM MELONGENA (EGGPLANT) FRUIT EXTRACT, ALLANTOIN, CITRIC ACID, SODIUM HYDROXIDE, 1,2-HEXANEDIOL, ALCOHOL DENAT',
    url: 'https://www.skinsafeproducts.com/medicube-azelaic-acid-16-bb-calming-serum-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/22A2207C9D1D05/large_1755755948.pngpng?1755755948',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.ANTI_ACNE],
      secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.TRAITEMENT],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.AZELAIC_ACID, concentrationValue: 16, concentrationUnit: '%', notes: 'Anti-rougeurs, anti-acné' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Apaisant' },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Réparateur' },
    ],
  },
  {
    slug: 'medicube-collagen-night-mask',
    name: 'Collagen Night Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Masque de nuit au collagène et à la Niacinamide pour repulper, raffermir et éclater le teint pendant le sommeil.',
    notes:
      'Collagène + Niacinamide + Céramide NP + Hyaluronate de Sodium. Idéal pour peaux déshydratées cherchant repulpage nocturne.',
    inci: 'AQUA, GLYCERIN, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, NIACINAMIDE, COLLAGEN EXTRACT, CERAMIDE NP, SODIUM HYALURONATE, HYDROGENATED LECITHIN, POLYGLYCERYL-10 LAURATE, TOCOPHEROL, CAPRYLYL GLYCOL, SODIUM STEAROYL GLUTAMATE, POLYVINYL ALCOHOL, XANTHAN GUM, FRUCTOOLIGOSACCHARIDES, FRUCTOSE, GLUCOSE, ADENOSINE, AGAVE AMERICANA STEM EXTRACT, ALTHAEA ROSEA FLOWER EXTRACT, CHLORELLA VULGARIS EXTRACT, CYNANCHUM ATRATUM EXTRACT, PANCRATIUM MARITIMUM EXTRACT, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-collagen-night-mask-2-53-fl-oz-75-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/21C0A6C2E29792/large_1754045586.pngpng?1754045586',
    tags: {
      primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.ANTI_AGE],
      secondary: [TAG_SLUGS.SLEEPING_MASK, TAG_SLUGS.SOIR],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Repulpant' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclat' },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Barrière' },
    ],
  },
  {
    slug: 'medicube-zero-pore-one-day-serum',
    name: 'Zero Pore One Day Serum',
    brand: 'Medicube',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum concentré à triple exfoliation pour minimiser les pores, lisser le grain de peau et illuminer le teint.',
    notes:
      'AHA (Glycolique + Lactique) + BHA (Salicylique) + Niacinamide + Acide Hyaluronique multi-poids. Idéal pour peaux mixtes à pores dilatés.',
    inci: 'WATER(AQUA), GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, PENTYLENE GLYCOL, NIACINAMIDE, GLYCOLIC ACID, LACTIC ACID, GLUCONOLACTONE, SALICYLIC ACID, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, HYDROLYZED SODIUM HYALURONATE, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, HYDROXYPROPYLTRIMONIUM HYALURONATE, ADENOSINE, ALLANTOIN, MADECASSOSIDE, LECITHIN, LACTOBACILLUS FERMENT LYSATE, CENTELLA ASIATICA EXTRACT, DEXTRIN, DIMETHICONE, TARAXACUM OFFICINALIS (DANDELION) LEAF EXTRACT, MYOSOTIS SYLVATICA FLOWER/LEAF/STEM EXTRACT, GARDENIA FLORIDA FRUIT EXTRACT, POLYGLYCERIN-3, C12-14 PARETH-12, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, SODIUM POLYACRYLOYLDIMETHYL TAURATE, HYDROXYETHYLCELLULOSE, SODIUM CITRATE, TRISODIUM PHOSPHATE, TROMETHAMINE, CITRIC ACID, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-zero-pore-one-day-serum-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/0C17C6E2B278B6/large_1743746010.pngpng?1743746010',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.EXFOLIATION],
      secondary: [TAG_SLUGS.SERUM, TAG_SLUGS.GRAIN_PEAU, TAG_SLUGS.ECLAT],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.GLYCOLIC_ACID, notes: 'AHA' },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID, notes: 'AHA' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA' },
      { slug: INGREDIENT_SLUGS.PHA, notes: 'Gluconolactone' },
    ],
  },
  {
    slug: 'medicube-collagen-milk-toning-wrapping-mask',
    name: 'Collagen Milk Toning Wrapping Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Masque wrap au collagène et à la protéine de lait pour repulper, unifier et illuminer le teint en profondeur.',
    notes:
      'Collagène + Alpha-Arbutine + Niacinamide + Glutathion + Haematococcus. Idéal pour peaux ternes cherchant éclat et repulpage.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, METHYLPROPANEDIOL, DIPROPYLENE GLYCOL, OCTYLDODECANOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, PENTAERYTHRITYL TETRAETHYLHEXANOATE, RICINUS COMMUNIS (CASTOR) SEED OIL, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, ZEA MAYS (CORN) GERM OIL, COLLAGEN AMINO ACIDS, COLLAGEN WATER, MILK PROTEIN EXTRACT, NIACINAMIDE, ALPHA-ARBUTIN, GLUTATHIONE, HAEMATOCOCCUS PLUVIALIS EXTRACT, CERAMIDE NP, PANTHENOL, KAOLIN, HYDRATED SILICA, MICROCRYSTALLINE CELLULOSE, CELLULOSE GUM, ALGIN, DISTEARDIMONIUM HECTORITE, GLYCERYL STEARATE, PEG-100 STEARATE, POLYSORBATE 80, POLYGLYCERYL-10 OLEATE, HYDROGENATED LECITHIN, SPHINGOMONAS FERMENT EXTRACT, CENTELLA ASIATICA EXTRACT, PAEONIA SUFFRUTICOSA ROOT EXTRACT, FICUS CARICA (FIG) FRUIT EXTRACT, PULLULAN, TITANIUM DIOXIDE, TRIETHYL CITRATE, SODIUM PHYTATE, SODIUM POLYSTYRENE SULFONATE, PENTAERYTHRITYL TETRA-DI-T-BUTYL HYDROXYHYDROCINNAMATE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, METHYL DIISOPROPYL PROPIONAMIDE, TROMETHAMINE, CYMBOPOGON CITRATUS LEAF OIL, ILLICIUM VERUM (ANISE) FRUIT/SEED OIL, CITRIC ACID, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-collagen-milk-toning-wrapping-mask-2-53-fl-oz-75-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/14167F263AEEE2/large_1757825806.pngpng?1757825806',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.REPULPANT],
      secondary: [TAG_SLUGS.MASQUE_TISSU, TAG_SLUGS.ANTI_TACHES],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN, notes: 'Éclaircissant' },
      { slug: INGREDIENT_SLUGS.GLUTATHION, notes: 'Antioxydant, éclat' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Uniformisant' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-collagen-gel-mask-4ct',
    name: 'PDRN Pink Collagen Gel Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'pack',
    totalAmount: 4,
    amountUnit: 'ct',
    priceCents: 0,
    description:
      'Masques gel au PDRN, collagène et complexe de peptides pour régénérer, repulper et raffermir intensément la peau.',
    notes:
      'ADN Sodique (PDRN) + Collagène Hydrolysé + 9 Peptides actifs + Copper Tripeptide-1. Idéal pour peaux matures ou fatiguées recherchant une régénération.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, DEXTRIN, HYDROLYZED COLLAGEN, NIACINAMIDE, PANTHENOL, SODIUM DNA, CARNOSINE, ADENOSINE, ALLANTOIN, TOCOPHEROL, ASCORBIC ACID, ASCORBIC ACID POLYPEPTIDE, CYANOCOBALAMIN, ACETYL HEXAPEPTIDE-8, ACETYL OCTAPEPTIDE-3, ACETYL TETRAPEPTIDE-2, ACETYL TETRAPEPTIDE-3, ACETYL TETRAPEPTIDE-5, ACETYL TETRAPEPTIDE-9, COPPER TRIPEPTIDE-1, PALMITOYL PENTAPEPTIDE-4, PALMITOYL TRIPEPTIDE-1, PALMITOYL TRIPEPTIDE-5, NONAPEPTIDE-1, BETAINE, HYDROXYACETOPHENONE, POLYGLYCERYL-10 LAURATE, LAURETH-21, POTASSIUM CHLORIDE, XANTHAN GUM, CERATONIA SILIQUA (CAROB) GUM, CYAMOPSIS TETRAGONOLOBA (GUAR) GUM, CHONDRUS CRISPUS POWDER, GLUCOMANNAN, CELLULOSE GUM, ACRYLATES/ETHYLHEXYL ACRYLATE COPOLYMER, FRAGRANCE(PARFUM), ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-pdrn-pink-collagen-gel-mask-0-98-oz-28-g-4-count',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/5F51D03A33C7F0/large_1753338517.pngpng?1753338517',
    tags: {
      primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.REPULPANT],
      secondary: [TAG_SLUGS.MASQUE_TISSU, TAG_SLUGS.ANTI_AGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'ADN Sodique - Régénérant' },
      { slug: INGREDIENT_SLUGS.COPPER_PEPTIDES, notes: 'Réparateur' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclat' },
    ],
  },
  {
    slug: 'medicube-triple-collagen-cream',
    name: 'Triple Collagen Cream',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Crème nourrissante à triple source de collagène pour restaurer la densité cutanée et atténuer les rides.',
    notes:
      'Collagène Extrait + Collagène Hydrolysé + Collagène Soluble + Niacinamide + Squalane. Idéal pour peaux sèches ou en perte de fermeté.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, ISONONYL ISONONANOATE, TRIETHYLHEXANOIN, HYDROGENATED POLYDECENE, HYDROGENATED POLYISOBUTENE, HYDROGENATED POLY(C6-14 OLEFIN), SQUALANE, ARGANIA SPINOSA KERNEL OIL, BUTYROSPERMUM PARKII (SHEA) BUTTER, C12-16 ALCOHOLS, CETEARYL ALCOHOL, CETEARYL GLUCOSIDE, CETEARYL OLIVATE, SORBITAN OLIVATE, SORBITAN ISOSTEARATE, GLYCERYL STEARATE, GLYCERYL STEARATE SE, PEG-100 STEARATE, POLYSORBATE 60, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, POLYGLYCERYL-10 STEARATE, HYDROGENATED LECITHIN, MICROCRYSTALLINE CELLULOSE, INULIN LAURYL CARBAMATE (removed - CELLULOSE GUM removed), COLLAGEN EXTRACT, NIACINAMIDE, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, PALMITIC ACID, STEARIC ACID, BETA-GLUCAN, FRUCTOOLIGOSACCHARIDES, FRUCTOSE, SUCROSE, HYDROLYZED CORN STARCH, HYDROLYZED ELASTIN, LAMINARIA JAPONICA EXTRACT, DIOSCOREA JAPONICA ROOT EXTRACT, AESCULUS HIPPOCASTANUM (HORSE CHESTNUT) EXTRACT, ECLIPTA PROSTRATA LEAF EXTRACT, LEUCONOSTOC/RADISH ROOT FERMENT FILTRATE, ADENOSINE, TOCOPHEROL, POTASSIUM SORBATE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, CYCLOHEXASILOXANE, CYCLOPENTASILOXANE, DIMETHICONE, CITRIC ACID, HYDROXYCITRONELLAL, LIMONENE, LINALOOL, BENZYL SALICYLATE, FRAGRANCE, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA, ALCOHOL',
    url: 'https://www.skinsafeproducts.com/medicube-triple-collagen-cream-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/EC68A704A59410/large_1747642414.pngpng?1747642414',
    tags: {
      primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.HYDRATATION],
      secondary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.ANTI_AGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Triple collagène' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclat' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Émollient' },
    ],
  },
  {
    slug: 'medicube-kojic-acid-turmeric-night-wrapping-mask',
    name: 'Kojic Acid Turmeric Night Wrapping Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Masque de nuit éclaircissant à l"acide kojique et au curcuma pour atténuer les taches et unifier le teint.`,
    notes:
      'Acide Kojique + Curcuma + Niacinamide + Rétinol + Collagène. Idéal pour peaux à taches et teint irrégulier.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, ISOPENTYLDIOL, COLLAGEN EXTRACT, NIACINAMIDE, KOJIC ACID, CURCUMA LONGA (TURMERIC) ROOT EXTRACT, RETINOL, ASCORBIC ACID, ADENOSINE, SODIUM HYALURONATE, GLYCERYL GLUCOSIDE, GLYCINE SOJA (SOYBEAN) OIL, GLUCOSE, POLYGLYCERYL-10 LAURATE, POLYVINYL ALCOHOL, XANTHAN GUM, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-kojic-acid-turmeric-night-wrapping-mask-2-53-fl-oz-75-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/B0F4E24495BF49/large_1755514906.pngpng?1755514906',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ECLAT],
      secondary: [TAG_SLUGS.SLEEPING_MASK, TAG_SLUGS.SOIR],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.KOJIC_ACID, notes: 'Éclaircissant' },
      { slug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT, notes: 'Antioxydant' },
      { slug: INGREDIENT_SLUGS.RETINOL, notes: 'Anti-âge' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-glutathione-serum-mist',
    name: 'PDRN Pink Glutathione Serum Mist',
    brand: 'Medicube',
    kind: 'mist',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Brume sérum au glutathion et aux peptides pour illuminer le teint, renforcer la densité cutanée et hydrater en continu.',
    notes:
      'Glutathion + ADN Sodique + Niacinamide + Complexe Peptides (Hexapeptide-2, Hexapeptide-9). Idéal pour peaux ternes recherchant éclat et anti-âge.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, GLYCERETH-26, HYDROXYETHYL UREA, SORBITOL, SODIUM CHLORIDE, NIACINAMIDE, GLUTATHIONE, SODIUM DNA, BIOTIN, BIOTINOYL TRIPEPTIDE-1, ACETYL HEXAPEPTIDE-8, HEXAPEPTIDE-2, HEXAPEPTIDE-9, MYRISTOYL PENTAPEPTIDE-17, TRIPEPTIDE-1, TRIPEPTIDE-3, ECLIPTA PROSTRATA EXTRACT, PAEONIA LACTIFLORA ROOT EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, ROSA DAMASCENA FLOWER WATER (ROSE DISTILLATE), COLLAGEN WATER, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, MORINGA OLEIFERA SEED OIL, RICINUS COMMUNIS (CASTOR) SEED OIL, C13-15 ALKANE, CANDIDA BOMBICOLA/GLUCOSE/METHYL RAPESEEDATE FERMENT, FRAGRANCE, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-pdrn-pink-glutathione-serum-mist-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/4F18AAFE5EDA21/large_1755049630.jpeg?1755049630',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.HYDRATATION],
      secondary: [TAG_SLUGS.BRUME, TAG_SLUGS.ANTI_AGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.GLUTATHION, notes: 'Éclaircissant' },
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'Régénérant' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Apaisant' },
    ],
  },
  {
    slug: 'medicube-zero-pore-pad-toner',
    name: 'Zero Pore Pad (Toner)',
    brand: 'Medicube',
    kind: 'toner',
    unit: 'jar',
    totalAmount: 70,
    amountUnit: 'ct',
    priceCents: 0,
    description: `Pads tonifiants bi-texturés à l"acide lactique pour exfolier en douceur et resserrer les pores visibles.`,
    notes:
      'Bétaïne Salicylate + Acide Lactique + Centella Asiatica + Extraits botaniques coréens. Idéal pour peaux mixtes avec pores dilatés.',
    inci: 'WATER, GLYCERIN, ALCOHOL DENAT, BUTYLENE GLYCOL, METHYLPROPANEDIOL, GLYCERETH-26, BETAINE, BETAINE SALICYLATE, LACTIC ACID, SALICYLIC ACID, SALIX ALBA (WILLOW) BARK EXTRACT, CENTELLA ASIATICA EXTRACT, SODIUM HYALURONATE, PANTHENOL, TREHALOSE, LACTOBACILLUS/SOYBEAN FERMENT EXTRACT, CHAMAECYPARIS OBTUSA LEAF EXTRACT, CINNAMOMUM CASSIA BARK EXTRACT, SCUTELLARIA BAICALENSIS ROOT EXTRACT, PORTULACA OLERACEA EXTRACT, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, ORIGANUM VULGARE LEAF EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, CITRUS AURANTIFOLIA (LIME) FRUIT EXTRACT, CITRUS AURANTIUM DULCIS (ORANGE) FRUIT EXTRACT, PYRUS MALUS (APPLE) FRUIT EXTRACT, CITRUS AURANTIUM BERGAMIA (BERGAMOT) FRUIT OIL, CITRUS AURANTIUM DULCIS (ORANGE) PEEL OIL, CITRUS GRANDIS (GRAPEFRUIT) PEEL OIL, CITRUS LIMON (LEMON) FRUIT EXTRACT, CITRUS LIMON (LEMON) PEEL OIL, EUCALYPTUS GLOBULUS LEAF OIL, LAVANDULA ANGUSTIFOLIA (LAVENDER) OIL, ROSMARINUS OFFICINALIS (ROSEMARY) LEAF OIL, POLYGLYCERYL-10 LAURATE, POLYGLYCERYL-10 MYRISTATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, TROMETHAMINE, LIMONENE, ETHYL HEXANEDIOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-zero-pore-pad-5-46-oz-155-g-count-70',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/0C4D0D724AD926/large_1749795879.pngpng?1749795879',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.EXFOLIATION],
      secondary: [TAG_SLUGS.PEAU_MIXTE, TAG_SLUGS.TONIQUE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.LACTIC_ACID, notes: 'AHA' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA' },
    ],
  },
  {
    slug: 'medicube-kojic-acid-turmeric-brightening-gel-mask',
    name: 'Kojic Acid Turmeric Brightening Gel Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'pack',
    totalAmount: 4,
    amountUnit: 'ct',
    priceCents: 0,
    description: `Masques gel éclaircissants à l"acide kojique et au curcuma pour corriger les taches et illuminer le teint en une seule application.`,
    notes:
      'Acide Kojique + Curcuma + Niacinamide + Rétinol + Collagène Hydrolysé. Idéal pour peaux à hyperpigmentation et teint irrégulier.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, DEXTRIN, HYDROLYZED COLLAGEN, NIACINAMIDE, KOJIC ACID, CURCUMA LONGA (TURMERIC) ROOT EXTRACT, RETINOL, ASCORBIC ACID, TOCOPHEROL, ADENOSINE, CERAMIDE NP, CORALLINA OFFICINALIS EXTRACT, MELIA AZADIRACHTA FLOWER EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, OCIMUM SANCTUM LEAF EXTRACT, LACTOBACILLUS FERMENT, LINOLEIC ACID, BETAINE, HYDROXYACETOPHENONE, POLYGLYCERYL-10 LAURATE, LAURETH-21, POTASSIUM CHLORIDE, ALLANTOIN, XANTHAN GUM, CERATONIA SILIQUA (CAROB) GUM, CYAMOPSIS TETRAGONOLOBA (GUAR) GUM, CHONDRUS CRISPUS POWDER, GLUCOMANNAN, CELLULOSE GUM, ACRYLATES/ETHYLHEXYL ACRYLATE COPOLYMER, FRAGRANCE (PARFUM), ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-kojic-acid-turmeric-brightening-gel-mask-0-98-oz-28-g-pack-of-4',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/981708488F9873/large_1748169967.pngpng?1748169967',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ECLAT],
      secondary: [TAG_SLUGS.MASQUE_TISSU, TAG_SLUGS.HYPERPIGMENTATION],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.KOJIC_ACID, notes: 'Éclaircissant' },
      { slug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT, notes: 'Antioxydant' },
      { slug: INGREDIENT_SLUGS.RETINOL, notes: 'Anti-âge' },
    ],
  },
  {
    slug: 'medicube-age-r-glutathione-glow-toner',
    name: 'AGE-R Glutathione Glow Toner',
    brand: 'Medicube',
    kind: 'toner',
    unit: 'bottle',
    totalAmount: 140,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Toner éclat au glutathion et à l"alpha-arbutine pour corriger les taches, illuminer le teint et préparer la peau aux soins suivants.`,
    notes:
      'Glutathion + Alpha-Arbutine + Niacinamide + Acide Alpha-Lipoïque + Peptides. Idéal pour peaux ternes avec imperfections et taches.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, METHYLPROPANEDIOL, TRIETHYLHEXANOIN, HYDROGENATED POLY(C6-14 OLEFIN), PHENYL TRIMETHICONE, NIACINAMIDE, GLUTATHIONE, ALPHA-ARBUTIN, GLUCONOLACTONE, CELLULOSE GUM, POLYGLYCERYL-10 MYRISTATE, HYDROGENATED LECITHIN, THIOCTIC ACID, ADENOSINE, ALLANTOIN, BIOTIN, BIOTINOYL TRIPEPTIDE-1, ACETYL HEXAPEPTIDE-8, HEXAPEPTIDE-9, MYRISTOYL PENTAPEPTIDE-17, TRIPEPTIDE-1, TRIPEPTIDE-3, CURCUMA LONGA (TURMERIC) ROOT EXTRACT, CORALLINA OFFICINALIS EXTRACT, MELIA AZADIRACHTA FLOWER EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, OCIMUM SANCTUM LEAF EXTRACT, CARUM PETROSELINUM (PARSLEY) EXTRACT, BORAGO OFFICINALIS EXTRACT, CHAMOMILLA RECUTITA (MATRICARIA) FLOWER/LEAF EXTRACT, CENTAUREA CYANUS FLOWER EXTRACT, CORCHORUS OLITORIUS LEAF EXTRACT, HIBISCUS ESCULENTUS FRUIT EXTRACT, HYACINTHUS ORIENTALIS (HYACINTH) EXTRACT, SALVIA SCLAREA (CLARY) EXTRACT, HIPPOPHAE RHAMNOIDES OIL, LAVANDULA ANGUSTIFOLIA (LAVENDER) FLOWER WATER, SODIUM GLUCONATE, DIETHOXYETHYL SUCCINATE, FRAGRANCE, HEXYL CINNAMAL, LIMONENE, LINALOOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-age-r-glutathione-glow-toner-4-73-fl-oz-140-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/738B9E4F68B209/large_1744688832.pngpng?1744688832',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES],
      secondary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.TEINT_TERNE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.GLUTATHION, notes: 'Antioxydant' },
      { slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN, notes: 'Éclaircissant' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Apaisant' },
    ],
  },
  {
    slug: 'medicube-one-day-exosome-shot-2000',
    name: 'One Day Exosome Shot 2000',
    brand: 'Medicube',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum booster aux exosomes de Lactobacillus pour régénérer, réparer et renforcer la barrière cutanée en cure intensive.',
    notes:
      'Exosomes Lactobacillus (2000 ppm) + Niacinamide + Gluconolactone + Panthénol. Idéal pour peaux sensibles ou abîmées nécessitant une régénération.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, HYDROGENATED POLYDECENE, ETHYL HEXYL PALMITATE, NIACINAMIDE, PANTHENOL, GLUCONOLACTONE, LACTOBACILLUS EXTRACELLULAR VESICLES, HYDROLYZED SPONGE, BETAINE SALICYLATE, ADENOSINE, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, CAMPSIS GRANDIFLORA FLOWER EXTRACT, C12-14 ALKETH-12, CAPRYLYL/CAPRYL GLUCOSIDE, SODIUM POLYACRYLATE, SODIUM SILICATE, CALCIUM SILICATE, CITRIC ACID, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-one-day-exosome-shot-2000-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/6349C742857F2B/large_1744089187.jpeg?1744089187',
    tags: {
      primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SERUM],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PROBIOTICS, concentrationValue: 2000, concentrationUnit: 'ppm', notes: 'Exosomes Lactobacillus' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Apaisant' },
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Hydratant' },
    ],
  },
  {
    slug: 'medicube-zero-pore-pad-pore-cleansing',
    name: 'Zero Pore Pad (Pore Cleansing)',
    brand: 'Medicube',
    kind: 'patch',
    unit: 'jar',
    totalAmount: 70,
    amountUnit: 'ct',
    priceCents: 0,
    description:
      'Pads à la Gluconolactone et à la Madecassoside pour purifier, hydrater et refiner le grain de peau en douceur.',
    notes:
      'Gluconolactone (PHA) + Madecassoside + Acide Hyaluronique multi-poids + Eau de Rose. Idéal pour peaux sensibles cherchant exfoliation douce et hydratation.',
    inci: 'WATER (AQUA), GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, PENTYLENE GLYCOL, GLYCERETH-26, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, HYDROLYZED SODIUM HYALURONATE, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, HYDROXYPROPYLTRIMONIUM HYALURONATE, GLUCONOLACTONE, MADECASSOSIDE, SACCHARIDE HYDROLYSATE, PANTHENOL, CAMELLIA SINENSIS LEAF EXTRACT, CASTANEA CRENATA (CHESTNUT) SHELL EXTRACT, CENTELLA ASIATICA EXTRACT, CYNANCHUM ATRATUM EXTRACT, CUCUMIS MELO (MELON) FRUIT EXTRACT, DIOSPYROS KAKI FRUIT EXTRACT, HEDERA HELIX (IVY) LEAF/STEM EXTRACT, HOUTTUYNIA CORDATA EXTRACT, IRIS FLORENTINA ROOT EXTRACT, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, PYRUS COMMUNIS (PEAR) FRUIT EXTRACT, SALVIA HISPANICA SEED EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, ROSA DAMASCENA FLOWER WATER, TROMETHAMINE, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-zero-pore-pad-5-46-oz-155g-count-70',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/5A155D659136C0/large_1744093133.pngpng?1744093133',
    tags: {
      primary: [TAG_SLUGS.PURIFIANT, TAG_SLUGS.GRAIN_PEAU],
      secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.EXFOLIATION],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PHA, notes: 'Gluconolactone' },
      { slug: INGREDIENT_SLUGS.MADECASSOSIDE, notes: 'Apaisant' },
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID, notes: 'Hydratant' },
    ],
  },
  {
    slug: 'medicube-zero-foam-cleanser',
    name: 'Zero Foam Cleanser',
    brand: 'Medicube',
    kind: 'cleanser',
    unit: 'tube',
    totalAmount: 120,
    amountUnit: 'g',
    priceCents: 0,
    description: `Nettoyant moussant doux à base d"acides d'olive et de coco pour nettoyer en profondeur sans agresser le film hydrolipidique.`,
    notes:
      'Potassium Cocoate + Sodium Cocoyl Isethionate + Extrait de Portulaca + Lécithine. Idéal pour tous types de peau, y compris sensibles.',
    inci: 'WATER (AQUA), GLYCERIN, PROPANEDIOL, POTASSIUM COCOATE, SODIUM COCOYL ISETHIONATE, POTASSIUM COCOYL GLYCINATE, SODIUM ISETHIONATE, COCONUT ACID, LAURIC ACID, MYRISTIC ACID, STEARIC ACID, PALMITIC ACID, SORBITOL, DIISOPROPYL ADIPATE, LECITHIN, GLYCERYL CAPRYLATE, CETEARYL OLIVATE, SORBITAN OLIVATE, CAMELLIA JAPONICA FLOWER EXTRACT, CHAENOMELES SINENSIS FRUIT EXTRACT, CITRUS AURANTIUM DULCIS (ORANGE) FLOWER EXTRACT, GAULTHERIA PROCUMBENS (WINTERGREEN) LEAF EXTRACT, MELISSA OFFICINALIS EXTRACT, PORTULACA OLERACEA EXTRACT, SAPONARIA OFFICINALIS LEAF EXTRACT, DIMETHYLMETHOXY CHROMANOL, ACRYLIC ACID/ACRYLAMIDOMETHYL PROPANE SULFONIC ACID COPOLYMER, SODIUM POLYACRYLATE, XANTHAN GUM, POTASSIUM HYDROXIDE, CITRIC ACID, POTASSIUM SORBATE, SODIUM BENSONATE, BUTYLENE GLYCOL, FRAGRANCE(PARFUM), HYDROXYCITRONELLAL, LIMONENE, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-zero-foam-cleanser-4-23-oz-120-g',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/B699359C0D4B71/large_1744092400.pngpng?1744092400',
    tags: {
      primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.MOUSSE_NETTOYANTE],
      secondary: [TAG_SLUGS.PEAU_TOUS_TYPES, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE, notes: 'Nettoyant doux' },
      { slug: INGREDIENT_SLUGS.PORTULACA_OLERACEA, notes: 'Apaisant' },
    ],
  },
  {
    slug: 'medicube-collagen-night-wrapping-mask-75ml',
    name: 'Collagen Night Wrapping Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Masque de nuit enveloppant au collagène pour nourrir, réparer et booster l"éclat cutané pendant le sommeil.`,
    notes:
      'Collagène Extrait + Niacinamide + Céramide NP + Hyaluronate de Sodium. Idéal pour peaux déshydratées ou en manque de fermeté.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, NIACINAMIDE, COLLAGEN EXTRACT, CERAMIDE NP, SODIUM HYALURONATE, HYDROGENATED LECITHIN, POLYGLYCERYL-10 LAURATE, TOCOPHEROL, CAPRYLYL GLYCOL, SODIUM STEAROYL GLUTAMATE, POLYVINYL ALCOHOL, XANTHAN GUM, FRUCTOOLIGOSACCHARIDES, FRUCTOSE, GLUCOSE, ADENOSINE, AGAVE AMERICANA STEM EXTRACT, ALTHAEA ROSEA FLOWER EXTRACT, CHLORELLA VULGARIS EXTRACT, CYNANCHUM ATRATUM EXTRACT, PANCRATIUM MARITIMUM EXTRACT, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-collagen-night-wrapping-mask-2-53-fl-oz-75-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/B4B8DD9FE42AC7/large_1714297053.pngpng?1714297053',
    tags: {
      primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [TAG_SLUGS.SLEEPING_MASK, TAG_SLUGS.SOIR],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Fermeté' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclat' },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Barrière' },
    ],
  },
  {
    slug: 'medicube-one-day-exosome-shot-7500',
    name: 'One Day Exosome Shot 7500',
    brand: 'Medicube',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum booster haute concentration aux exosomes de Lactobacillus pour une régénération cellulaire accélérée et une réparation cutanée intensive.',
    notes:
      'Exosomes Lactobacillus (7500 ppm) + Niacinamide + Gluconolactone + Panthénol. Idéal pour peaux abîmées, post-procédure ou en besoin de régénération intense.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, HYDROGENATED POLYDECENE, ETHYLHEXYL PALMITATE, NIACINAMIDE, PANTHENOL, GLUCONOLACTONE, LACTOBACILLUS EXTRACELLULAR VESICLES, HYDROLYZED SPONGE, BETAINE SALICYLATE, ADENOSINE, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, CAMPSIS GRANDIFLORA FLOWER EXTRACT, C12-14 ALKETH-12, CAPRYLYL/CAPRYL GLUCOSIDE, SODIUM POLYACRYLATE, SODIUM SILICATE, CALCIUM SILICATE, CITRIC ACID, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-one-day-exosome-shot-7500-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/25F9443ADBE139/large_1726179087.jpeg?1726179087',
    tags: {
      primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.SERUM],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PROBIOTICS, concentrationValue: 7500, concentrationUnit: 'ppm', notes: 'Exosomes Lactobacillus' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Apaisant' },
      { slug: INGREDIENT_SLUGS.PHA, notes: 'Gluconolactone' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-collagen-exosome-shot-2000-serum',
    name: 'PDRN Pink Collagen Exosome Shot 2000 Serum',
    brand: 'Medicube',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Sérum régénérant au PDRN, exosomes de lait et collagène pour restaurer la densité cutanée et lisser les signes de l"âge.`,
    notes:
      'ADN Sodique (PDRN) + Exosomes de Lait + Collagène + Rétinol + Peptides (Palmitoyl Pentapeptide-4, Palmitoyl Tripeptide-5). Idéal pour peaux matures ou après des procédures esthétiques.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, MACADAMIA TERNIFOLIA SEED OIL, COLLAGEN EXTRACT, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, HYDROLYZED SODIUM HYALURONATE, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, HYDROXYPROPYLTRIMONIUM HYALURONATE, SODIUM DNA, MILK EXOSOMES, LACTOBACILLUS EXTRACELLULAR VESICLES, HYDROLYZED SPONGE, NIACINAMIDE, PANTHENOL, RETINOL, PALMITOYL PENTAPEPTIDE-4, PALMITOYL TRIPEPTIDE-5, ACETYL TETRAPEPTIDE-5, CYANOCOBALAMIN, BRASSICA CAMPESTRIS (RAPESEED) STEROLS, CHOLESTEROL, HYDROGENATED LECITHIN, HYDROLYZED ELASTIN, CHONDRUS CRISPUS EXTRACT, GLYCERYL ACRYLATE/ACRYLIC ACID COPOLYMER, PVM/MA COPOLYMER, PHENYL TRIMETHICONE, POLYGLYCERYL-10 LAURATE, POLYSORBATE 20, POTASSIUM CETYL PHOSPHATE, POTASSIUM HYALURONATE, CETETH-3, CETETH-5, SORBITAN OLIVATE, CETEARYL OLIVATE, SODIUM POLYACRYLATE, CAPRYLYL GLYCOL, TOCOPHERYL ACETATE, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA, ALCOHOL',
    url: 'https://www.skinsafeproducts.com/medicube-pdrn-pink-collagen-exosome-shot-2000-serum-1-01-fl-oz-30-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/AD0438B66517FC/large_1753977061.jpeg?1753977061',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPULPANT],
      secondary: [TAG_SLUGS.SERUM],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'Régénérant' },
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Fermeté' },
      { slug: INGREDIENT_SLUGS.RETINOL, notes: 'Anti-rides' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-collagen-capsule-cream',
    name: 'PDRN Pink Collagen Capsule Cream',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 55,
    amountUnit: 'g',
    priceCents: 0,
    description:
      'Crème capsule riche au PDRN, glutathion et collagène hydrolysé pour régénérer, raffermir et illuminer intensément la peau.',
    notes:
      'ADN Sodique + Glutathion + Collagène Hydrolysé + Copper Tripeptide-1 + Acide Alpha-Lipoïque. Idéal pour peaux matures cherchant repulpage et éclat.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, METHYLPROPANEDIOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, ETHYLHEXYL PALMITATE, OCTYLDODECANOL, MORINGA OLEIFERA SEED OIL, GLYCERETH-26, HYDROLYZED COLLAGEN EXTRACT, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, HYDROLYZED SODIUM HYALURONATE, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, HYDROXYPROPYLTRIMONIUM HYALURONATE, SODIUM DNA, SALMON EGG EXTRACT, NIACINAMIDE, GLUTATHIONE, CERAMIDE NP, ACETYL HEXAPEPTIDE-8, COPPER TRIPEPTIDE-1, PALMITOYL HEXAPEPTIDE-12, PALMITOYL PENTAPEPTIDE-4, THIOCTIC ACID, ECLIPTA PROSTRATA EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, HYDROGENATED LECITHIN, HYDROLYZED SCLEROTIUM GUM, GLYCERYL STEARATE, POLYACRYLATE-13, POLYISOBUTENE, POLYSORBATE 20, SORBITAN OLIVATE, SORBITAN ISOSTEARATE, POTASSIUM HYALURONATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, CARBOMER, ARGININE, SIMETHICONE, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-pdrn-pink-collagen-capsule-cream-1-94-oz-55-g',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/17FA32C45EC237/large_1755451142.jpeg?1755451142',
    tags: {
      primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.ECLAT],
      secondary: [TAG_SLUGS.CREME_HYDRATANTE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'Régénérant' },
      { slug: INGREDIENT_SLUGS.GLUTATHION, notes: 'Antioxydant' },
      { slug: INGREDIENT_SLUGS.COPPER_PEPTIDES, notes: 'Fermeté' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-niacinamide-milky-toner',
    name: 'PDRN Pink Niacinamide Milky Toner',
    brand: 'Medicube',
    kind: 'toner',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Toner lacté au PDRN, Niacinamide et complexe céramides pour hydrater profondément, renforcer la barrière et illuminer le teint.',
    notes:
      'ADN Sodique (PDRN) + Niacinamide + Céramides (AP, EOP, NP, NS) + Protéines hydrolysées (Riz, Blé, Soja). Idéal pour peaux sèches ou sensibles cherchant hydratation et éclat.',
    inci: 'WATER(AQUA), GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, DIPROPYLENE GLYCOL, PENTYLENE GLYCOL, METHYLPROPANEDIOL, OCTYLDODECANOL, ETHYLHEXYL PALMITATE, PENTAERYTHRITYL TETRAETHYLHEXANOATE, DIISOSTEARYL MALATE, CETYL ETHYLHEXANOATE, ORYZA SATIVA (RICE) BRAN OIL, PRUNUS AMYGDALUS AMARA (BITTER ALMOND) KERNEL OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, GLYCERYL STEARATE, GLYCERYL STEARATE CITRATE, POLYGLYCERYL-3 DISTEARATE, POLYGLYCERYL-10 OLEATE, SUCROSE STEARATE, LECITHIN, HYDROGENATED LECITHIN, NIACINAMIDE, SODIUM DNA, CERAMIDE AP, CERAMIDE EOP, CERAMIDE NP, CERAMIDE NS, MILK PROTEIN EXTRACT, HYDROLYZED CORN PROTEIN, HYDROLYZED RICE BRAN PROTEIN, HYDROLYZED RICE PROTEIN, HYDROLYZED SOY PROTEIN, HYDROLYZED WHEAT PROTEIN, OLIGOPEPTIDE-1, OLIGOPEPTIDE-3, PALMITOYL PENTAPEPTIDE-4, HEXAPEPTIDE-11, FOLIC ACID, CYANOCOBALAMIN, BETA-CAROTENE, ACETYL GLUTAMINE, CENTELLA ASIATICA EXTRACT, CENTELLA ASIATICA LEAF EXTRACT, CENTELLA ASIATICA ROOT EXTRACT, ASIATIC ACID, ASIATICOSIDE, MADECASSIC ACID, MADECASSOSIDE, BACILLUS/SOYBEAN FERMENT EXTRACT, CAMELLIA SINENSIS LEAF EXTRACT, EQUISETUM ARVENSE EXTRACT, LYCOPODIUM CLAVATUM EXTRACT, PHRAGMITES COMMUNIS EXTRACT, PUERARIA LOBATA ROOT EXTRACT, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) FRUIT EXTRACT, PYRUS MALUS (APPLE) LEAF EXTRACT, SACCHARIDE HYDROLYSATE, TABEBUIA IMPETIGINOSA BARK EXTRACT, TREMELLA FUCIFORMIS (MUSHROOM) EXTRACT, TRIFOLIUM PRATENSE (CLOVER) EXTRACT, VACCINIUM MYRTILLUS FRUIT EXTRACT, VANILLA PLANIFOLIA FRUIT EXTRACT, JASMINUM OFFICINALIS (JASMINE) FLOWER WATER, ORYZA SATIVA (RICE) BRAN WATER, SORBITOL, TREHALOSE, XYLITOL, XYLITYLGLUCOSIDE, ANHYDROXYLITOL, SODIUM HYALURONATE, TOCOPHEROL, ADENOSINE, C12-14 ALKETH-12, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, TROMETHAMINE, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-pdrn-pink-niacinamide-milky-toner-5-07-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/238D7EEF562D2F/large_1754788578.jpeg?1754788578',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.PEAU_SECHE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'Régénérant' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Uniformisant' },
      { slug: INGREDIENT_SLUGS.CERAMIDES, notes: 'Complexe barrière' },
    ],
  },
  {
    slug: 'medicube-age-r-glutathione-glow-serum',
    name: 'AGE-R Glutathione Glow Serum',
    brand: 'Medicube',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Sérum éclat anti-âge au glutathion, collagène soluble et céramides pour corriger les taches et renforcer la barrière cutanée.',
    notes:
      'Glutathion + Glucosylrutine + Niacinamide + Collagène Soluble + Céramide NP. Idéal pour peaux matures ou ternes cherchant éclat et anti-oxydation.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, GLYCERETH-26, CAPRYLIC/CAPRIC TRIGLYCERIDE, SQUALANE, METHYL GLUCETH-20, PEG-8, NIACINAMIDE, GLUTATHIONE, GLUCOSYLRUTIN, CERAMIDE NP, SOLUBLE COLLAGEN, HYALURONIC ACID, SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, HYDROXYPROPYLTRIMONIUM HYALURONATE, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, BETA-GLUCAN, DEXTRIN, PANTHENOL, ADENOSINE, TOCOPHEROL, BIFIDA FERMENT LYSATE, HYDROLYZED GLYCOSAMINOGLYCANS, THEOBROMA CACAO (COCOA) EXTRACT, HYDROGENATED LECITHIN, SODIUM STEAROYL GLUTAMATE, SODIUM PHYTATE, XANTHAN GUM, CARBOMER, BIS-PEG-18 METHYL ETHER DIMETHYL SILANE, TROMETHAMINE, FRAGRANCE(PARFUM), CYANOCOBALAMIN, BENZYL GLYCOL, ETHYLHEXYLGLYCERIN, 1.2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-age-r-glutathione-glow-serum-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/6D0477A1D864F2/large_1748671466.jpeg?1748671466',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_AGE],
      secondary: [TAG_SLUGS.SERUM, TAG_SLUGS.ANTI_TACHES],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.GLUTATHION, notes: 'Antioxydant' },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclaircissant' },
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Fermeté' },
    ],
  },
  {
    slug: 'medicube-collagen-jelly-cream-110ml',
    name: 'Collagen Jelly Cream',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 110,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Crème gel texture jelly au triple collagène, squalane et extraits de légumes verts pour hydrater et raffermir le teint.',
    notes:
      'Collagène (Extrait + Hydrolysé + Soluble) + Niacinamide + Squalane + ADN Sodique. Idéal pour toutes peaux cherchant hydratation fraîche et repulpage.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, ETHOXYDIGLYCOL, METHYLPROPANEDIOL, COLLAGEN, HYDROLYZED COLLAGEN, SOLUBLE COLLAGEN, SOLUBLE PROTEOGLYCAN, HYDROLYZED ELASTIN, NIACINAMIDE, SQUALANE, SODIUM DNA, SALMON EGG EXTRACT, CAMELLIA SINENSIS SEED EXTRACT, AVENA SATIVA (OAT) KERNEL EXTRACT, ALLIUM SATIVUM (GARLIC) BULB EXTRACT, ALTHAEA ROSEA FLOWER EXTRACT, BERTHOLLETIA EXCELSA SEED EXTRACT, BRASSICA OLERACEA ITALICA (BROCCOLI) EXTRACT, CHLORELLA VULGARIS EXTRACT, CYNANCHUM ATRATUM EXTRACT, SOLANUM LYCOPERSICUM (TOMATO) FRUIT EXTRACT, SPINACIA OLERACEA (SPINACH) LEAF EXTRACT, VACCINIUM ANGUSTIFOLIUM (BLUEBERRY) FRUIT EXTRACT, WINE EXTRACT, HYDROXYPROPYLTRIMONIUM HYALURONATE, PULLULAN, FRUCTOOLIGOSACCHARIDES, FRUCTOSE, GLUCOSE, TREHALOSE, SUCROSE, TOCOPHEROL, ADENOSINE, CYANOCOBALAMIN, POLYGLYCERYL-10 ISOSTEARATE, POLYGLYCERYL-10 OLEATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/BEHENETH-25 METHACRYLATE CROSSPOLYMER, CARBOMER, TROMETHAMINE, SODIUM PHYTATE, DIETHOXYETHYL SUCCINATE, FRAGRANCE(PARFUM), ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-collagen-jelly-cream-3-71-fl-oz-110-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/B9DE620778E271/large_1744777731.jpegjpeg?1744777731',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.REPULPANT],
      secondary: [TAG_SLUGS.GEL_CREME, TAG_SLUGS.PEAU_TOUS_TYPES],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Triple collagène' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Hydratant' },
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'ADN Sodique' },
    ],
  },
  {
    slug: 'medicube-collagen-jelly-cream-50ml',
    name: 'Collagen Jelly Cream 50ml',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Crème gel jelly légère au triple collagène et aux extraits végétaux pour hydrater, raffermir et illuminer le teint au quotidien.',
    notes:
      'Collagène (Extrait + Hydrolysé + Soluble) + Niacinamide + Squalane + ADN Sodique. Idéal pour peaux normales à mixtes cherchant hydratation et légèreté.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, ETHOXYDIGLYCOL, METHYLPROPANEDIOL, COLLAGEN, HYDROLYZED COLLAGEN, SOLUBLE COLLAGEN, SOLUBLE PROTEOGLYCAN, HYDROLYZED ELASTIN, NIACINAMIDE, SQUALANE, SODIUM DNA, SALMON EGG EXTRACT, CAMELLIA SINENSIS SEED EXTRACT, AVENA SATIVA (OAT) KERNEL EXTRACT, ALLIUM SATIVUM (GARLIC) BULB EXTRACT, ALTHAEA ROSEA FLOWER EXTRACT, BERTHOLLETIA EXCELSA SEED EXTRACT, BRASSICA OLERACEA ITALICA (BROCCOLI) EXTRACT, CHLORELLA VULGARIS EXTRACT, CYNANCHUM ATRATUM EXTRACT, SOLANUM LYCOPERSICUM (TOMATO) FRUIT EXTRACT, SPINACIA OLERACEA (SPINACH) LEAF EXTRACT, VACCINIUM ANGUSTIFOLIUM (BLUEBERRY) FRUIT EXTRACT, WINE EXTRACT, HYDROXYPROPYLTRIMONIUM HYALURONATE, PULLULAN, FRUCTOOLIGOSACCHARIDES, FRUCTOSE, GLUCOSE, TREHALOSE, SUCROSE, TOCOPHEROL, ADENOSINE, CYANOCOBALAMIN, POLYGLYCERYL-10 ISOSTEARATE, POLYGLYCERYL-10 OLEATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/BEHENETH-25 METHACRYLATE CROSSPOLYMER, CARBOMER, TROMETHAMINE, SODIUM PHYTATE, DIETHOXYETHYL SUCCINATE, FRAGRANCE(PARFUM), ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-collagen-jelly-cream-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/0CC045E521162E/large_1744088991.jpeg?1744088991',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.REPULPANT],
      secondary: [TAG_SLUGS.GEL_CREME, TAG_SLUGS.PEAU_MIXTE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Triple collagène' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Hydratant' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-collagen-facial-mask',
    name: 'PDRN Pink Collagen Facial Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'pack',
    totalAmount: 4,
    amountUnit: 'ct',
    priceCents: 0,
    description:
      'Masques gel au PDRN, collagène et complexe de 9 peptides actifs pour booster la régénération et la fermeté cutanée.',
    notes:
      'ADN Sodique (PDRN) + Collagène Hydrolysé + Copper Tripeptide-1 + Palmitoyl Pentapeptide-4. Idéal pour peaux matures ou en besoin de régénération intensive.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, DEXTRIN, HYDROLYZED COLLAGEN, NIACINAMIDE, PANTHENOL, SODIUM DNA, CARNOSINE, ADENOSINE, ALLANTOIN, TOCOPHEROL, ASCORBIC ACID, ASCORBIC ACID POLYPEPTIDE, CYANOCOBALAMIN, ACETYL HEXAPEPTIDE-8, ACETYL OCTAPEPTIDE-3, ACETYL TETRAPEPTIDE-2, ACETYL TETRAPEPTIDE-3, ACETYL TETRAPEPTIDE-5, ACETYL TETRAPEPTIDE-9, COPPER TRIPEPTIDE-1 (COPPER PEPTIDE), PALMITOYL PENTAPEPTIDE-4, PALMITOYL TRIPEPTIDE-1, PALMITOYL TRIPEPTIDE-5, NONAPEPTIDE-1, BETAINE, HYDROXYACETOPHENONE, POLYGLYCERYL-10 LAURATE, LAURETH-21, POTASSIUM CHLORIDE, XANTHAN GUM, CERATONIA SILIQUA (CAROB) GUM, CYAMOPSIS TETRAGONOLOBA (GUAR) GUM, CHONDRUS CRISPUS POWDER, GLUCOMANNAN (KONJAC GUM), CELLULOSE GUM, ACRYLATES/ETHYLHEXYL ACRYLATE COPOLYMER, FRAGRANCE PARFUM, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-facial-mask-pdrn-pink-collagen-0-98-oz-28-g-4-count',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/3338FCEE6E14A3/large_1744088861.jpeg?1744088861',
    tags: {
      primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.REPARATEUR],
      secondary: [TAG_SLUGS.MASQUE_TISSU],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'ADN Sodique' },
      { slug: INGREDIENT_SLUGS.COPPER_PEPTIDES, notes: 'Réparateur' },
      { slug: INGREDIENT_SLUGS.PALMITOYL_PENTAPEPTIDE_4, notes: 'Anti-âge' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-cica-soothing-toner',
    name: 'PDRN Pink Cica Soothing Toner',
    brand: 'Medicube',
    kind: 'toner',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Toner apaisant au PDRN et à la Centella Asiatica pour calmer les rougeurs, renforcer la barrière et hydrater durablement.',
    notes:
      'ADN Sodique (PDRN) + Centella Asiatica + Gluconolactone + Copper Tripeptide-1 + Niacinamide. Idéal pour peaux sensibles, réactives ou rougissantes.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, SODIUM HYALURONATE, XYLITOL, NIACINAMIDE, SODIUM DNA, GLUCONOLACTONE, CENTELLA ASIATICA EXTRACT, CENTELLA ASIATICA LEAF EXTRACT, CARICA PAPAYA (PAPAYA) FRUIT EXTRACT, PRUNUS MUME FRUIT EXTRACT, PYRUS MALUS (APPLE) FRUIT EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, ZEA MAYS (CORN) LEAF EXTRACT, ACETYL HEXAPEPTIDE-8, COPPER TRIPEPTIDE-1, PALMITOYL PENTAPEPTIDE-4, PALMITOYL TETRAPEPTIDE-7, PALMITOYL TRIPEPTIDE-1, ARGININE, GLUTAMIC ACID, GLYCINE, CAPRYLYL GLYCOL, CAPRYLYL/CAPRYL GLUCOSIDE, POLYGLYCERYL-10 LAURATE, POLYGLYCERYL-4 LAURATE, SODIUM CITRATE, CITRIC ACID, ADENOSINE, ALLANTOIN, CYANOCOBALAMIN, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-pdrn-pink-cica-soothing-toner-8-45-fl-oz-250-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/66E9B20162737A/large_1744088794.jpeg?1744088794',
    tags: {
      primary: [TAG_SLUGS.APAISANT, TAG_SLUGS.ANTI_ROUGEURS],
      secondary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.PEAU_REACTIVE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'ADN Sodique' },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Apaisant' },
      { slug: INGREDIENT_SLUGS.PHA, notes: 'Gluconolactone' },
    ],
  },
  {
    slug: 'medicube-pdrn-pink-collagen-gel-mask-single',
    name: 'PDRN Pink Collagen Gel Mask (Single)',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'pack',
    totalAmount: 28,
    amountUnit: 'g',
    priceCents: 0,
    description:
      'Masque gel unitaire au PDRN et collagène pour une cure anti-âge ciblée, repulpante et régénérante.',
    notes:
      'ADN Sodique (PDRN) + Collagène Hydrolysé + 9 Peptides Actifs + Niacinamide + Panthénol. Idéal pour peaux matures cherchant repulpage et éclat express.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, METHYLPROPANEDIOL, DEXTRIN, HYDROLYZED COLLAGEN, NIACINAMIDE, PANTHENOL, SODIUM DNA, CARNOSINE, ADENOSINE, ALLANTOIN, TOCOPHEROL, ASCORBIC ACID, ASCORBIC ACID POLYPEPTIDE, CYANOCOBALAMIN, ACETYL HEXAPEPTIDE-8, ACETYL OCTAPEPTIDE-3, ACETYL TETRAPEPTIDE-2, ACETYL TETRAPEPTIDE-3, ACETYL TETRAPEPTIDE-5, ACETYL TETRAPEPTIDE-9, COPPER TRIPEPTIDE-1, PALMITOYL PENTAPEPTIDE-4, PALMITOYL TRIPEPTIDE-1, PALMITOYL TRIPEPTIDE-5, NONAPEPTIDE-1, BETAINE, HYDROXYACETOPHENONE, POLYGLYCERYL-10 LAURATE, LAURETH-21, POTASSIUM CHLORIDE, XANTHAN GUM, CERATONIA SILIQUA (CAROB) GUM, CYAMOPSIS TETRAGONOLOBA (GUAR) GUM, CHONDRUS CRISPUS POWDER, GLUCOMANNAN, CELLULOSE GUM, ACRYLATES/ETHYLHEXYL ACRYLATE COPOLYMER, FRAGRANCE (PARFUM), ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-pdrn-pink-collagen-gel-mask-0-98-oz-28-g',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/0AF2CCA1745E08/large_1732388398.jpeg?1732388398',
    tags: {
      primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.ANTI_AGE],
      secondary: [TAG_SLUGS.MASQUE_TISSU, TAG_SLUGS.ECLAT],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PDRN, notes: 'ADN Sodique' },
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID, notes: 'Hydratant' },
    ],
  },
  {
    slug: 'medicube-collagen-jelly-cream-110ml-v2',
    name: 'Collagen Jelly Cream (V2)',
    brand: 'Medicube',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 110,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Grande taille de la crème gel jelly au triple collagène pour une hydratation continue, un raffermissement et un éclat durable.',
    notes:
      'Collagène (Extrait + Hydrolysé + Soluble) + Niacinamide + Squalane + ADN Sodique. Idéal pour toutes peaux cherchant un soin complet hydratant et raffermissant.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, ETHOXYDIGLYCOL, METHYLPROPANEDIOL, COLLAGEN, HYDROLYZED COLLAGEN, SOLUBLE COLLAGEN, SOLUBLE PROTEOGLYCAN, HYDROLYZED ELASTIN, NIACINAMIDE, SQUALANE, SODIUM DNA, SALMON EGG EXTRACT, CAMELLIA SINENSIS SEED EXTRACT, AVENA SATIVA (OAT) KERNEL EXTRACT, ALLIUM SATIVUM (GARLIC) BULB EXTRACT, ALTHAEA ROSEA FLOWER EXTRACT, BERTHOLLETIA EXCELSA SEED EXTRACT, BRASSICA OLERACEA ITALICA (BROCCOLI) EXTRACT, CHLORELLA VULGARIS EXTRACT, CYNANCHUM ATRATUM EXTRACT, SOLANUM LYCOPERSICUM (TOMATO) FRUIT EXTRACT, SPINACIA OLERACEA (SPINACH) LEAF EXTRACT, VACCINIUM ANGUSTIFOLIUM (BLUEBERRY) FRUIT EXTRACT, WINE EXTRACT, HYDROXYPROPYLTRIMONIUM HYALURONATE, PULLULAN, FRUCTOOLIGOSACCHARIDES, FRUCTOSE, GLUCOSE, TREHALOSE, SUCROSE, TOCOPHEROL, ADENOSINE, CYANOCOBALAMIN, POLYGLYCERYL-10 ISOSTEARATE, POLYGLYCERYL -10 OLEATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/BEHENETH-25 METHACRYLATE CROSSPOLYMER, CARBOMER, TROMETHAMINE, SODIUM PHYTATE, DIETHOXYETHYL SUCCINATE, FRAGRANCE(PARFUM), ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL',
    url: 'https://www.skinsafeproducts.com/medicube-jelly-cream-collagen-3-71-fl-oz-110-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/A83CD1E9CE2015/large_1720422358.pngpng?1720422358',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.REPULPANT],
      secondary: [TAG_SLUGS.GEL_CREME, TAG_SLUGS.ECLAT],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS, notes: 'Triple collagène' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Hydratant' },
    ],
  },
  {
    slug: 'medicube-zero-pore-pad-2-0-bha',
    name: 'Zero Pore Pad 2.0 (BHA)',
    brand: 'Medicube',
    kind: 'exfoliant',
    unit: 'jar',
    totalAmount: 70,
    amountUnit: 'ct',
    priceCents: 0,
    description: `Pads exfoliants à l"acide lactique et au panthénol pour lisser le grain de peau, resserrer les pores et renforcer la barrière hydratante.`,
    notes:
      'Acide Lactique + Bétaïne Salicylate + Panthénol + Centella Asiatica. Idéal pour peaux mixtes à sensibles avec pores dilatés.',
    inci: 'WATER, GLYCERIN, ALCOHOL DENAT, BUTYLENE GLYCOL, METHYLPROPANEDIOL, GLYCERETH-26, BETAINE, BETAINE SALICYLATE, LACTIC ACID, SALICYLIC ACID, SALIX ALBA (WILLOW) BARK EXTRACT, CENTELLA ASIATICA EXTRACT, SODIUM HYALURONATE, PANTHENOL, TREHALOSE, LACTOBACILLUS/SOYBEAN FERMENT EXTRACT, CHAMAECYPARIS OBTUSA LEAF EXTRACT, CINNAMOMUM CASSIA BARK EXTRACT, SCUTELLARIA BAICALENSIS ROOT EXTRACT, PORTULACA OLERACEA EXTRACT, OENOTHERA BIENNIS (EVENING PRIMROSE) FLOWER EXTRACT, ORIGANUM VULGARE LEAF EXTRACT, PINUS PALUSTRIS LEAF EXTRACT, PUERARIA LOBATA ROOT EXTRACT, ULMUS DAVIDIANA ROOT EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, CITRUS AURANTIFOLIA (LIME) FRUIT EXTRACT, CITRUS AURANTIUM DULCIS (ORANGE) FRUIT EXTRACT, PYRUS MALUS (APPLE) FRUIT EXTRACT, CITRUS AURANTIUM BERGAMIA (BERGAMOT) FRUIT OIL, CITRUS AURANTIUM DULCIS (ORANGE) PEEL OIL, CITRUS GRANDIS (GRAPEFRUIT) PEEL OIL, CITRUS LIMON (LEMON) FRUIT EXTRACT, CITRUS LIMON (LEMON) PEEL OIL, EUCALYPTUS GLOBULUS LEAF OIL, LAVANDULA ANGUSTIFOLIA (LAVENDER) OIL, ROSMARINUS OFFICINALIS (ROSEMARY) LEAF OIL, POLYGLYCERYL-10 LAURATE, POLYGLYCERYL-10 MYRISTATE, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, TROMETHAMINE, LIMONENE, ETHYL HEXANEDIOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-zero-pore-pad-2-0-lactic-acid-panthenol-5-46-oz-155-g-70-count',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/FF87C8E20B4E7E/large_1731061501.pngpng?1731061501',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.EXFOLIATION],
      secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.GRAIN_PEAU],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.LACTIC_ACID, notes: 'AHA' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA' },
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Apaisant' },
    ],
  },
  {
    slug: 'medicube-deep-peptide-radiance-mask',
    name: 'Deep Peptide Radiance Mask',
    brand: 'Medicube',
    kind: 'mask',
    unit: 'pack',
    totalAmount: 27,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Masque en tissu au complexe de peptides et à la Centella Asiatica pour lisser, raffermir et illuminer intensément la peau.',
    notes:
      'Palmitoyl Tripeptide-5 + Acetyl Dipeptide-1 Cetyl Ester + Centella Asiatica + Bifida Ferment Lysate + Céramide NP. Idéal pour peaux matures ou fatiguées.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, DIPROPYLENE GLYCOL, CETYL ETHYLHEXANOATE, BEHENYL ALCOHOL, HYDROGENATED VEGETABLE OIL, HYDROGENATED LECITHIN, NIACINAMIDE, PANTHENOL, XYLITOL, ADENOSINE, ALLANTOIN, BETA-GLUCAN, CERAMIDE NP, TOCOPHEROL, PALMITOYL TRIPEPTIDE-5, ACETYL DIPEPTIDE-1 CETYL ESTER, ACETYL HEXAPEPTIDE-1, ACETYL OCTAPEPTIDE-3, ASIATIC ACID, ASIATICOSIDE, MADECASSIC ACID, CENTELLA ASIATICA LEAF EXTRACT, BIFIDA FERMENT LYSATE, LACTOBACILLUS FERMENT LYSATE, LACTOCOCCUS FERMENT LYSATE, HYDROLYZED HYALURONIC ACID, ARGININE, HYDROGENATED LECITHIN, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, SORBITAN LAURATE, HYDROXYETHYLCELLULOSE, CARBOMER, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, 1,2-HEXANEDIOL, DISODIUM EDTA',
    url: 'https://www.skinsafeproducts.com/medicube-deep-peptide-radiance-mask-0-91-fl-oz-27-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/BB610CF94B6290/large_1695355442.pngpng?1695355442',
    tags: {
      primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.ECLAT],
      secondary: [TAG_SLUGS.MASQUE_TISSU, TAG_SLUGS.ANTI_AGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1, notes: 'Peptide complex' },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Apaisant' },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Barrière' },
    ],
  },
]
