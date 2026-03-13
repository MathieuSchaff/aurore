// ─── Slugs ────────────────────────────────────────────────

export const AZELAIQUE_PRODUCT_SLUGS = {
  NINE_LESS_A_CONTROL_10: 'nine-less-a-control-10-azelaic-acid-serum',
  PURITO_AZELAIC_KOJIC_TEA_TREE: 'purito-azelaic-kojic-tea-tree-serum',
  NOOANCE_AZELAIC_15: 'nooance-serum-acide-azelaique-15-pourcent',
  ALLIES_OF_SKIN_AZELAIC_KOJIC: 'allies-of-skin-azelaic-kojic-advanced-clarifying-serum',
  DR_SAM_FLAWLESS_BRIGHTLY: 'dr-sam-flawless-brightly-10-azelaic-acid-serum',
  TYPOLOGY_AZELAIC_SERUM_L35: 'typology-azelaic-serum-l35',

  // Q+A
  QA_AZELAIC_ACID_BALANCING_SERUM: 'qa-azelaic-acid-balancing-serum',

  // The Inkey List
  INKEY_LIST_AZELAIC_ACID_SERUM: 'inkey-list-azelaic-acid-serum',

  // Apis Natural Cosmetics
  APIS_TERAPIS_AZELAIC_ACID_30: 'apis-terapis-azelaic-acid-30',

  // TIRTIR
  TIRTIR_AZELAIC_ACID_12_SERUM: 'tirtir-azelaic-acid-12-serum',

  // VT
  VT_AZELAIC_AMPOULE_A1: 'vt-azelaic-ampoule-a1',

  // Ducray
  DUCRAY_KERACNYL_AZELAIC_SERUM: 'ducray-keracnyl-azelaic-serum',

  // Medicube
  MEDICUBE_AZELAIC_ACID_16_BB_SERUM: 'medicube-azelaic-acid-16-bb-serum',

  // Cos De BAHA
  COS_DE_BAHA_AZELAIC_ACID_10_SERUM: 'cos-de-baha-azelaic-acid-10-serum',

  // ACM
  ACM_AZEANE_CREME_15: 'acm-azeane-creme-15',
}

// ─── Data ─────────────────────────────────────────────────

export const AZELAIC_PRODUCT_DATA = [
  {
    name: 'A-Control 10% Azelaic Acid Serum',
    brand: 'Nine Less',
    kind: 'skincare',
    unit: 'pump',
    slug: AZELAIQUE_PRODUCT_SLUGS.NINE_LESS_A_CONTROL_10,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1158,
    description:
      "Sérum budget 10% acide azélaïque + mucine d'escargot + peptide + 3x centella. Réduit imperfections, hydrate, régénère.",
    notes:
      'Meilleur budget : prix imbattable, mucine escargot boost collagène, peptide anti-âge. Attention acide lactique + saule (légers exfoliants, introduire progressivement avec rétinal).',
    inci: 'AQUA (WATER), AZELAIC ACID (10%), GLYCERETH-26, GLYCERIN, DIPROPYLENE GLYCOL, NIACINAMIDE, BUTYLENE GLYCOL, 1,2-HEXANEDIOL, PANTHENOL, CENTELLA ASIATICA LEAF EXTRACT, CENTELLA ASIATICA EXTRACT, CENTELLA ASIATICA ROOT EXTRACT, LACTIC ACID, PROPANEDIOL, POLYGLYCERYL-10 LAURATE, CELLULOSE GUM, SODIUM POLYACRYLATE, DISODIUM EDTA, SNAIL SECRETION FILTRATE, DECYL GLUCOSIDE, SALIX ALBA (WILLOW) BARK EXTRACT, CLADOSIPHON OKAMURANUS EXTRACT, CAMELLIA SINENSIS LEAF EXTRACT, ASIATIC ACID, ASIATICOSIDE, ACETYL HEXAPEPTIDE-8, MADECASSIC ACID, MADECASSOSIDE, COFFEA ARABICA (COFFEE) SEED EXTRACT, CITRUS AURANTIUM BERGAMIA (BERGAMOT) LEAF EXTRACT, PINUS DENSIFLORA LEAF EXTRACT',
    url: 'https://www.yesstyle.com',
  },
  {
    name: 'Azelaic Kojic Tea Tree Serum',
    brand: 'Purito Seoul',
    kind: 'skincare',
    unit: 'pump',
    slug: AZELAIQUE_PRODUCT_SLUGS.PURITO_AZELAIC_KOJIC_TEA_TREE,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1449,
    description:
      'Sérum 10% azélaïque + kojique + tea tree. Éclaircissant, anti-imperfections, séborégulateur.',
    notes:
      'Triple éclaircissant (azélaïque + kojique + glutathione), CoQ10 + adénosine anti-âge. Attention : tea tree irritant post-IPL, délai livraison 21j.',
    inci: 'WATER, AZELAIC ACID (10%), MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF WATER, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, HYDROXYPROPYL CYCLODEXTRIN, DISODIUM PHOSPHATE, 1,2-HEXANEDIOL, GLYCERIN, NIACINAMIDE, MALTODEXTRIN, HYDROXYETHYLCELLULOSE, COPTIS JAPONICA ROOT EXTRACT, AGAR, GELLAN GUM, KOJIC ACID, ETHYLHEXYLGLYCERIN, HYDROXYDECYL UBIQUINONE (COQ10), ADENOSINE, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, MALACHITE EXTRACT, MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF OIL, ARGININE, XANTHAN GUM, TOCOPHEROL, GLUTATHIONE, BISABOLOL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, XANTHOPHYLLS',
    url: 'https://purito.com',
  },
  {
    name: 'Sérum Acide Azélaïque 15%',
    brand: 'Nooance',
    kind: 'skincare',
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.NOOANCE_AZELAIC_15,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 6500,
    description:
      'Sérum premium 15% acide azélaïque + carnosine + céramides. Concentration max, anti-glycation, réparation barrière.',
    notes:
      '15% azélaïque (max cosmétique) + carnosine unique anti-glycation + céramides + EGCG. Texture laiteuse agréable, adapté peaux sensibles/post-IPL.',
    inci: 'AQUA, AZELAIC ACID (15%), CARNOSINE, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, EGCG, AVENA SATIVA (OAT) KERNEL EXTRACT, PERSEA GRATISSIMA (AVOCADO) OIL ESTERS, GLYCERIN, BUTYLENE GLYCOL, PENTYLENE GLYCOL, SODIUM HYDROXIDE, XANTHAN GUM, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL',
    url: 'https://nooance-paris.com',
  },
  {
    name: 'Azelaic & Kojic Advanced Clarifying Serum',
    brand: 'Allies of Skin',
    kind: 'skincare',
    unit: 'pump',
    slug: AZELAIQUE_PRODUCT_SLUGS.ALLIES_OF_SKIN_AZELAIC_KOJIC,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 11000,
    description:
      'Sérum luxe 10% azélaïque + kojique + hexylrésorcinol 3%. Éclaircissement puissant, anti-imperfections, anti-âge.',
    notes:
      'Triple éclaircissant + bakuchiol + ribose. Études cliniques (45% amélioration teint). Ultra-clean, prix très élevé.',
    inci: 'AQUA (WATER), AZELAIC ACID (10%), BUTYLENE GLYCOL, ALOE BARBADENSIS LEAF JUICE, PROPANEDIOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, KOJIC ACID (1%), POLYSORBATE 20, GLYCERIN, CAPRYLYL GLYCOL, HEXYLRESORCINOL (3%), ETHYL LINOLEATE, LEUCONOSTOC/RADISH ROOT FERMENT FILTRATE, DODECANE, HYDROXYETHYLCELLULOSE, XANTHAN GUM, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, SQUALANE, BISABOLOL, GLYCERYL LAURATE, GLYCERYL UNDECYLENATE, ALLANTOIN, RIBOSE, SODIUM ACETATE, BAKUCHIOL, GLYCYRRHIZA GLABRA (LICORICE) ROOT EXTRACT, CELLULOSE, PHENOXYETHANOL',
    url: 'https://allies.shop',
  },
  {
    name: 'Flawless Brightly 10% Azelaic Acid Serum',
    brand: 'Sonya Driver',
    kind: 'skincare',
    unit: 'pump',
    slug: AZELAIQUE_PRODUCT_SLUGS.DR_SAM_FLAWLESS_BRIGHTLY,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 6000,
    description:
      'Sérum 10% azélaïque + niacinamide + vitamine C + bakuchiol. Éclaircissant tout-en-un pour teint terne.',
    notes:
      'Texture émulsion confortable, vegan/cruelty-free. Redondance niacinamide/vit C dans une routine, prix élevé pour formule basique.',
    inci: 'AQUA (WATER), AZELAIC ACID (10%), CAPRYLIC/CAPRIC TRIGLYCERIDE, NIACINAMIDE, DICAPRYLYL CARBONATE, ASCORBYL GLUCOSIDE, CETEARYL ALCOHOL, GLYCERIN, GLYCERYL STEARATE SE, CETEARYL OLIVATE, BAKUCHIOL, SORBITAN OLIVATE, BENZYL ALCOHOL, XANTHAN GUM, PHENOXYETHANOL, SODIUM HYDROXIDE, DISODIUM EDTA, DEHYDROACETIC ACID',
    url: 'https://drsambunting.com',
  },

  {
    name: 'Sérum Matifiant L35 — Acide Azélaïque 10% + Extrait de Bambou',
    brand: 'Typology',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.TYPOLOGY_AZELAIC_SERUM_L35,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3300,
    description:
      "Sérum matifiant concentré en acide azélaïque 10% d'origine végétale et extrait de bambou bio. Réduit l'excès de sébum, matifie les peaux grasses et régule la production de sébum sans dessécher.",
    notes:
      "97% d'ingrédients d'origine naturelle. 10 ingrédients. Formule minimaliste ciblée peaux mixtes à grasses et tendance acnéique.",
    inci: 'Aqua (Water) • Azelaic Acid • Glycerin • Bambusa Arundinacea Juice • 1,2-Hexanediol • Xanthan Gum • Zinc PCA • Sodium Benzoate • Citric Acid • Sodium Hydroxide',
    url: 'https://www.typology.com',
  },

  // ─────────────────────────────────────────────
  // Q+A
  // ─────────────────────────────────────────────
  {
    name: 'Q+A Azelaic Acid Balancing Serum',
    brand: 'Q+A',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.QA_AZELAIC_ACID_BALANCING_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 900,
    description:
      "Sérum équilibrant à l'acide azélaïque enrichi en Zinc PCA pour minimiser les pores et en antioxydants pour une peau plus lisse et fraîche. Idéal pour les peaux à tendance acnéique.",
    notes:
      "Formule avec jus d'aloe vera et extraits de graines de céréales (épeautre, khorasan, teff, quinoa) pour un soin nourrissant et antioxydant.",
    inci: "Aqua (Eau) • Jus de feuille d'Aloe Barbadensis (Aloe Vera) • Propylène Glycol • Acide Azélaïque • Bétaïne • Zinc PCA • Gomme Biosaccharide 1 • Glycérine • Extrait de Graines de Triticum Spelta (Épeautre) • Extrait de Graines de Triticum Turanicum (Khorasan) • Extrait de Graines Eragrostis Tef (Teff) • Chenopodium Quinoa (Extrait de Graines de Quinoa) • Gomme Xanthane • Lévulinate de Sodium • Glycéryl Caprylate • Anisate de Sodium • Caprylyl Glycol • Gluconate de Sodium • Alcool Benzylique • Acide Déshydroacétique • Benzoate de Sodium • Phénoxyéthanol • Hydroxyde de Sodium • Acide Citrique",
    url: 'https://www.qandskincare.com',
  },

  // ─────────────────────────────────────────────
  // THE INKEY LIST
  // ─────────────────────────────────────────────
  {
    name: 'Solution Anti-Rougeurs Acide Azélaïque 10% — The Inkey List',
    brand: 'The Inkey List',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.INKEY_LIST_AZELAIC_ACID_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1900,
    description:
      "Développé en collaboration avec des dermatologues, ce sérum d'absorption rapide à l'acide azélaïque 10% réduit l'apparence des rougeurs, unifie le teint et apaise immédiatement la peau. Ses particules vertes fines masquent instantanément les rougeurs.",
    notes:
      "Formule non-peluchante, sans occlusion. Contient de l'allantoin et de l'extrait de Gardenia Florida pour apaiser et protéger.",
    inci: 'Aqua (Water) • Azelaic Acid • Propanediol • Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer • Phenoxyethanol • Acacia Senegal Gum • Xanthan Gum • Allantoin • Glycerin • Ethylhexylglycerin • Polysorbate 60 • Sorbitan Isostearate • Maltodextrin • Sodium Hydroxide • Hydrolyzed Gardenia Florida Extract • Gardenia Florida Fruit Extract • Polylysine',
    url: 'https://www.sephora.fr/marques/de-a-a-z/the-inkey-list-inkey/',
  },

  // ─────────────────────────────────────────────
  // APIS NATURAL COSMETICS
  // ─────────────────────────────────────────────
  {
    name: 'TerApis 30% Azelaic Acid Serum Peeling Exfoliant',
    brand: 'Apis Natural Cosmetics',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.APIS_TERAPIS_AZELAIC_ACID_30,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1000,
    description:
      "Sérum peeling exfoliant à haute concentration en acide azélaïque 30%. Exfolie délicatement, stimule le renouvellement cellulaire et réduit efficacement l'hyperpigmentation. Adapté aux peaux acnéiques, atopiques, avec érythème, rosacée, psoriasis et folliculite.",
    notes:
      "Formule minimaliste à 30% d'acide azélaïque — concentration professionnelle. Usage en soin ciblé pour hyperpigmentation et décoloration.",
    inci: 'Aqua • Polyethylene Glycol 400 • Azelaic Acid • Carbomer • Phenoxyethanol • Caprylyl Glycol',
    url: 'https://www.notino.fr/apis-natural-cosmetics/',
  },

  // ─────────────────────────────────────────────
  // TIRTIR
  // ─────────────────────────────────────────────
  {
    name: 'TIRTIR Azelaic Acid 12% Serum',
    brand: 'TIRTIR',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.TIRTIR_AZELAIC_ACID_12_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2995,
    description:
      "Sérum coréen à l'acide azélaïque 12% enrichi en céramides, zinc PCA, acide hyaluronique et extraits de plantes marines. Apaise les rougeurs, régule le sébum et renforce la barrière cutanée pour une peau nette et hydratée.",
    notes:
      'Formule K-beauty multi-active avec Chondrus Crispus (algue rouge), Chlorella Vulgaris, extrait de canne à sucre et Ceramide NP pour renforcement de la barrière.',
    inci: 'Aqua/Water/Eau • Azelaic Acid • Propylene Glycol • Sodium Hydroxide • Pentylene Glycol • Panthenol • Sorbitol • Chondrus Crispus Extract • Hydroxyethylcellulose • Glucose • Chlorella Vulgaris Extract • Saccharum Officinarum Extract (Sugar Cane Extract) • 1,2-Hexanediol • Fructooligosaccharides • Fructose • Butylene Glycol • Ethylhexylglycerin • Biosaccharide Gum-1 • Xanthan Gum • Tromethamine • Tocopherol • Zinc PCA • Betaine • Dipropylene Glycol • Hyaluronic Acid/Polyisopropylacrylamide Copolymer • Caprylyl/Capryl Glucoside • Hydrogenated Lecithin • Ceramide NP',
    url: 'https://www.zalando.fr/tirtir/',
  },

  // ─────────────────────────────────────────────
  // VT
  // ─────────────────────────────────────────────
  {
    name: "VT Ampoule Apaisante à l'Acide Azélaïque A1 — 30ml",
    brand: 'VT',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.VT_AZELAIC_AMPOULE_A1,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1905,
    description:
      "Ampoule apaisante à l'acide azélaïque enrichie en exosomes de Centella Asiatica. Régule la production de sébum, calme les rougeurs et affine le grain de peau. Formule légèrement acide pour équilibrer le pH, sans fragrance artificielle.",
    notes:
      'Contient de la Cyanocobalamine (B12) et un complexe hyaluronique multi-poids (sodium hyaluronate, acide hyaluronique hydrolysé, sodium hyaluronate crosspolymer). Idéal peaux sensibles et acnéiques.',
    inci: 'Water • Propylene Glycol • Azelaic Acid • Tromethamine • 1,2-Hexanediol • Panthenol • Polyglyceryl-10 Laurate • Ethylhexylglycerin • Xanthan Gum • Cyanocobalamin • Dipotassium Glycyrrhizate • Lactobacillus/Soymilk Ferment Filtrate • Butylene Glycol • Sodium Hyaluronate • Xylitylglucoside • Anhydroxylitol • Pentylene Glycol • Xylitol • Melaleuca Alternifolia (Tea Tree) Leaf Extract • Hydroxypropyltrimonium Hyaluronate • Houttuynia Cordata Extract • Centella Asiatica Extract • Tocopherol • Madecassoside • Hydrolyzed Hyaluronic Acid • Sodium Acetylated Hyaluronate • Dextrin • Hyaluronic Acid • Asiaticoside • Hydrolyzed Sodium Hyaluronate • Sodium Hyaluronate Crosspolymer • Potassium Hyaluronate',
    url: 'https://www.zalando.fr',
  },

  // ─────────────────────────────────────────────
  // DUCRAY
  // ─────────────────────────────────────────────
  {
    name: "Ducray Keracnyl Sérum Régulateur Anti-Imperfections à l'Acide Azélaïque Myrtacine",
    brand: 'Ducray',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.DUCRAY_KERACNYL_AZELAIC_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1992,
    description:
      "Sérum dermatologique qui agit tout au long du cycle hormonal pour prévenir et traiter les imperfections. Sa synergie brevetée Myrtacine (antibactérienne) et Célastrol (anti-inflammatoire) agit à la source des boutons. Association d'acide azélaïque 8% et acide glycolique 3% pour atténuer les marques post-acné.",
    notes:
      'Formule dermo-cosmétique avec Myrtus Communis Leaf Extract (Myrtacine) et Tripterygium Wilfordii Callus Extract (Célastrol). Contient de la fragrance.',
    inci: 'Water (Aqua) • Azelaic Acid • Caprylic/Capric Triglyceride • Dicaprylyl Ether • Glycerin • Glycolic Acid • Microcrystalline Cellulose • Lauryl Glucoside • Polyglyceryl-2 Dipolyhydroxystearate • Sodium Hydroxide • Citric Acid • Fragrance (Parfum) • Glyceryl Laurate • Helianthus Annuus (Sunflower) Seed Oil • Myrtus Communis Leaf Extract • Pentylene Glycol • Potassium Cetyl Phosphate • Tocopherol • Tripterygium Wilfordii Callus Extract • Xanthan Gum',
    url: 'https://www.ducray.com',
  },

  // ─────────────────────────────────────────────
  // MEDICUBE
  // ─────────────────────────────────────────────
  {
    name: 'Medicube Azelaic Acid 16 BB Calming Serum',
    brand: 'Medicube',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.MEDICUBE_AZELAIC_ACID_16_BB_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1899,
    description:
      "Sérum apaisant tout-en-un à l'acide azélaïque 16%, niacinamide et acide pantothénique. Régule le sébum, améliore la texture cutanée et apaise les imperfections. Enrichi en extraits botaniques, panthénol et céramides pour contrer les irritations.",
    notes:
      "Testé dermatologiquement, formule peu irritante. Contient huile d'olive, squalane et beurre de karité pour équilibre lipidique. Extraits botaniques: Melia Azadirachta, Centella Asiatica, Curcuma, Corallina Officinalis.",
    inci: 'Water (Aqua) • Azelaic Acid • Butylene Glycol • Propanediol • Sodium Hydroxide • Propylene Glycol • Alcohol Denat. • 1,2-Hexanediol • Niacinamide • Citric Acid • Glyceryl Caprylate • Melia Azadirachta Leaf Extract • Melia Azadirachta Flower Extract • Coccinia Indica Fruit Extract • Aloe Barbadensis Flower Extract • Solanum Melongena (Eggplant) Fruit Extract • Ocimum Sanctum Leaf Extract • Allantoin • Centella Asiatica Extract • Panthenol • Curcuma Longa (Turmeric) Root Extract • Corallina Officinalis Extract • Pantothenic Acid • Nicotinamide Mononucleotide • Hydrolyzed Pea Protein • Phytosterols • Lecithin • Olea Europaea (Olive) Fruit Oil • Squalane • Butyrospermum Parkii (Shea) Butter • Ceramide NP',
    url: 'https://www.yesstyle.com/fr/medicube',
  },

  // ─────────────────────────────────────────────
  // COS DE BAHA
  // ─────────────────────────────────────────────
  {
    name: 'Cos De BAHA AZ Azelaic Acid 10 Serum',
    brand: 'Cos De BAHA',
    kind: 'skincare' as const,
    unit: 'bottle',
    slug: AZELAIQUE_PRODUCT_SLUGS.COS_DE_BAHA_AZELAIC_ACID_10_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 572,
    description:
      "Sérum à l'acide azélaïque 10% avec base à l'aloe vera. Estompe les cicatrices d'acné, améliore l'hyperpigmentation et traite la rosacée. Enrichi en niacinamide et extraits botaniques certifiés bio pour un teint plus lumineux et unifié.",
    notes:
      "Base à l'extrait de feuille d'Aloe Barbadensis en tête de liste INCI. Extraits bio certifiés (*): thé vert, Momordica Charantia, fleurs de sureau, Leontopodium Alpinum (edelweiss).",
    inci: '*Aloe Barbadensis Leaf Extract • Propylene Glycol • Azelaic Acid (10%) • Polysorbate 20 • 1,2-Hexanediol • Propanediol • Panthenol • Niacinamide • Sodium Hyaluronate • *Camellia Sinensis Leaf Extract • *Momordica Charantia Fruit Extract • *Sambucus Nigra Flower Extract • *Leontopodium Alpinum Extract',
    url: 'https://www.yesstyle.com/fr/cos-de-baha',
  },

  // ─────────────────────────────────────────────
  // ACM
  // ─────────────────────────────────────────────
  {
    name: 'ACM Azéane Crème Acide Azélaïque 15%',
    brand: 'ACM',
    kind: 'skincare' as const,
    unit: 'tube',
    slug: AZELAIQUE_PRODUCT_SLUGS.ACM_AZEANE_CREME_15,
    totalAmount: 30,
    amountUnit: 'g',
    priceCents: 1599,
    description:
      "Crème dermatologique à l'acide azélaïque 15% + niacinamide. Réduit taches, imperfections et rougeurs. Prouvée cliniquement : 94% des utilisateurs observent une atténuation des taches en moins de 2 semaines. Convient à tous types de peaux dès 10 ans, et aux femmes enceintes ou allaitantes.",
    notes:
      'Études cliniques réalisées par Laboratoire ACM. Association acide azélaïque 15% (antibactérien, kératolytique, anti-taches) + niacinamide (anti-inflammatoire, dépigmentant). Safe pendant la grossesse.',
    inci: 'Aqua (Water) • Azelaic Acid • Octyldodecyl Myristate • Isononyl Isononanoate • Isostearyl Isostearate • Cetyl Alcohol • Glyceryl Stearate • Ethoxydiglycol • Glycerin • Coco-Caprylate/Caprate • Niacinamide • Xylitol • PEG-75 Stearate • Pentylene Glycol • Cetearyl Alcohol • Ceteth-20 • Steareth-20 • Glyceryl Caprylate/Caprate',
    url: 'https://labo-acm.com',
  },
]
