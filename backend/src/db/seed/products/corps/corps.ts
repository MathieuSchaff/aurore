// ─── Slugs ────────────────────────────────────────────────

export const CORPS_PRODUCT_SLUGS = {
  CERAVE_SA_ANTI_RUGOSITES: 'cerave-creme-sa-anti-rugosites',
  CERAVE_BAUME_HYDRATANT: 'cerave-baume-hydratant',
  CERAVE_CREME_HYDRATANTE: 'cerave-creme-hydratante',
  CERAVE_LAIT_HYDRATANT: 'cerave-lait-hydratant',
  EUCERIN_UREAREPAIR_LOTION_10: 'eucerin-urearepair-plus-lotion-10',
  EUCERIN_UREAREPAIR_CREME_5: 'eucerin-urearepair-plus-creme-5',
  EUCERIN_ATOPICONTROL_BAUME: 'eucerin-atopicontrol-baume',
  AMLACTIN_DAILY_NOURISH_12_AHA: 'amlactin-dayli-nourish-12-aha',
  PAULAS_CHOICE_LAIT_CORPS_10_AHA: 'paula-choice-lait-corps-10-aha',
  REMEDY_KP_BODY_MOISTURIZER: 'remedy-kp-body-moisturizer',
  BYOMA_BLEMISH_CONTROL_BODY_LOTION: 'byoma-blemish-control-body-lotion',

  // ── Laboratoire SVR / Genové ────────────────────────────────────────────────
  XEROLYS_50: 'xerolys-50-soin-callosites',

  // ── Uriage ──────────────────────────────────────────────────────────────────
  URIAGE_KERATOSANE_30: 'uriage-keratosane-30-gel-creme',

  // ── Isispharma ─────────────────────────────────────────────────────────────
  ISISPHARMA_URELIA_50: 'isispharma-urelia-50-baume-keratolytique',

  // ── Topicrem ────────────────────────────────────────────────────────────────
  TOPICREM_UR_10: 'topicrem-ur-10-creme-lissante-500ml',
  TOPICREM_ULTRA_HYDRATANT_RICHE: 'topicrem-ultra-hydratant-creme-riche',

  // ── SkinCeuticals ───────────────────────────────────────────────────────────
  SKINCEUTICALS_LIP_REPAIR: 'skinceuticals-lip-repair-serum-gel',

  // ── The Inkey List ──────────────────────────────────────────────────────────
  THE_INKEY_LIST_UREA_10: 'the-inkey-list-urea-10-hydratant',

  // ── ISDIN ───────────────────────────────────────────────────────────────────
  ISDIN_UREADIN_ULTRA_20: 'isdin-ureadin-ultra-20-creme',
  ISDIN_UREADIN_ULTRA_30: 'isdin-ureadin-ultra-30-creme-emolliente',
  ISDIN_UREADIN_ULTRA_10_LOTION: 'isdin-ureadin-ultra-10-lotion-plus',

  // ── Eucerin ─────────────────────────────────────────────────────────────────
  EUCERIN_UREAREPAIR_30: 'eucerin-urearepair-30-creme-corps',
}

// ─── Data ─────────────────────────────────────────────────

export const CORPS_PRODUCT_DATA = [
  {
    name: 'KP Exfoliating Body Moisturizer',
    brand: 'Remedy Science',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.REMEDY_KP_BODY_MOISTURIZER,
    totalAmount: 163,
    amountUnit: 'ml',
    priceCents: 3095,
    description:
      'Lotion corporelle ciblée contre la kératose pilaire combinant urée, acide lactique et rétinol encapsulé pour exfolier, hydrater et améliorer la texture de la peau.',
    notes:
      '10% urée kératolytique + 5% acide lactique (AHA) pour exfoliation et hydratation. Contient 0.1% rétinol encapsulé, céramide NP et squalane pour soutenir la barrière cutanée et lisser la peau.',
    inci: 'AQUA / WATER, UREA, LACTIC ACID, BUTYROSPERMUM PARKII BUTTER, MYRISTYL MYRISTATE, HYDROXYETHYL ACRYLATE / SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, SODIUM HYDROXIDE, DIMETHICONE, SQUALANE, RETINOL, TRIETHYL CITRATE, GLYCERIN, MICROCRYSTALLINE CELLULOSE, POLYSORBATE 80, SODIUM STEAROYL GLUTAMATE, POLYSORBATE 20, CELLULOSE GUM, CAPRYLYL GLYCOL, CAPRYLIC / CAPRIC TRIGLYCERIDE, POLYGLYCERYL-10 DIOLEATE, SORBITAN ISOSTEARATE, ETHYLHEXYLGLYCERIN, HEXYLENE GLYCOL, SODIUM CITRATE, POLYGLYCERYL-10 DIPALMITATE, GLYCERIN, CERAMIDE NP, CURCUMA LONGA ROOT EXTRACT, PHENOXYETHANOL',
    url: 'https://remedyskin.com',
  },
  {
    name: 'Blemish Control Body Lotion',
    brand: 'BYOMA',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.BYOMA_BLEMISH_CONTROL_BODY_LOTION,
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 2000,
    description:
      'Lotion corporelle légère anti-imperfections avec acide salicylique pour désobstruer les pores, réduire les rougeurs et lisser la texture de la peau.',
    notes:
      'Contient BHA (salicylic acid), céramide NP et phytosphingosine pour soutenir la barrière cutanée, bakuchiol et antioxydants (vitamine E, rutin). Huiles nourrissantes de carthame et soja.',
    inci: 'AQUA / WATER, CETEARYL ALCOHOL, CAPRYLIC / CAPRIC TRIGLYCERIDE, GLYCERIN, HAMAMELIS VIRGINIANA WATER, GLYCERYL STEARATE SE, GLYCINE SOJA OIL, ETHYL LINOLEATE, CARTHAMUS TINCTORIUS SEED OIL, PHENOXYETHANOL, AMMONIUM POLYACRYLOYLDIMETHYL TAURATE, SALICYLIC ACID, SODIUM HYDROXIDE, ETHYLHEXYLGLYCERIN, TOCOPHEROL, PHYTOSPHINGOSINE, CERAMIDE NP, BAKUCHIOL, PROPANEDIOL, RUTIN, HYDROXYCINNAMIC ACID',
    url: 'https://www.byoma.com',
  },
  {
    name: 'Lait Corps Sublimateur 10% AHA',
    brand: 'Paula’s Choice',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.PAULAS_CHOICE_LAIT_CORPS_10_AHA,
    totalAmount: 210,
    amountUnit: 'ml',
    priceCents: 3120,
    description:
      'Lait corps exfoliant au glycolic acid (10% AHA) qui élimine les cellules mortes, lisse la peau et améliore l’apparence de la kératose pilaire, des taches et de la peau sèche.',
    notes:
      '10% acide glycolique (AHA) pour exfoliation chimique. Contient beurre de karité, antioxydants (vitamine C, vitamine E, thé vert) et agents apaisants (allantoïne, camomille).',
    inci: 'AQUA / WATER, GLYCOLIC ACID, CYCLOPENTASILOXANE, DIMETHICONE, GLYCERIN, GLYCERYL STEARATE, CETYL ALCOHOL, BUTYROSPERMUM PARKII BUTTER, STEARIC ACID, SODIUM HYDROXIDE, PEG-100 STEARATE, XANTHAN GUM, TETRAHEXYLDECYL ASCORBATE, TOCOPHERYL ACETATE, DISODIUM EDTA, BUTYLENE GLYCOL, ALLANTOIN, CHAMOMILLA RECUTITA FLOWER EXTRACT, VITIS VINIFERA SEED OIL, CAMELLIA OLEIFERA LEAF EXTRACT, EPILOBIUM ANGUSTIFOLIUM EXTRACT, METHYLPARABEN, BUTYLPARABEN, ETHYLPARABEN, PROPYLPARABEN, PHENOXYETHANOL, SODIUM BENZOATE',
    url: 'https://www.paulaschoice.com',
  },
  {
    name: 'Daily Nourish Lotion 12% AHA',
    brand: 'AmLactin',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.AMLACTIN_DAILY_NOURISH_12_AHA,
    totalAmount: 225,
    amountUnit: 'ml',
    priceCents: 1600,
    description:
      'Lotion exfoliante hydratante au lactate d’ammonium (12% AHA) pour peaux sèches, rugueuses ou kératose pilaire. Exfolie en douceur et améliore la texture.',
    notes:
      '12% acide lactique sous forme ammonium lactate. Exfolie + hydrate (AHA humectant). Sans parfum, sans parabènes, sans phtalates. Texture légère non grasse.',
    inci: 'WATER, AMMONIUM LACTATE, MINERAL OIL, GLYCERIN, CETEARYL ALCOHOL, DIMETHICONE, GLYCERYL STEARATE SE, STEARETH-2, STEARYL ALCOHOL, XANTHAN GUM, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN',
    url: 'https://www.amlactin.com',
  },
  {
    name: 'Crème SA Anti-Rugosités',
    brand: 'CeraVe',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.CERAVE_SA_ANTI_RUGOSITES,
    totalAmount: 177,
    amountUnit: 'ml',
    priceCents: 1750,
    description:
      'Crème exfoliante hydratante pour peaux rugueuses et kératose pilaire. 10% urée + acide salicylique, lisse et restaure barrière.',
    notes:
      "3 céramides + niacinamide + HA + MVE tech. Sans parfum. Réduit rugosités jusqu'à -76% en 8 semaines.",
    inci: 'AQUA / WATER, UREA, CETYL ALCOHOL, GLYCERYL STEARATE SE, CETEARYL ALCOHOL, NIACINAMIDE, BUTYROSPERMUM PARKII BUTTER / SHEA BUTTER, GLYCERIN, PEG-100 STEARATE, C12-13 ALKYL LACTATE, BEHENTRIMONIUM METHOSULFATE, DIMETHICONE, TRIACETIN, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, CARBOMER, SODIUM LACTATE, SALICYLIC ACID, SODIUM HYDROXIDE, SODIUM LAUROYL LACTYLATE, SODIUM HYALURONATE, CHOLESTEROL, PHENOXYETHANOL, DISODIUM EDTA, CAPRYLOYL SALICYLIC ACID, HYDROXYACETOPHENONE, CITRIC ACID, LACTIC ACID, PHYTOSPHINGOSINE, XANTHAN GUM, ETHYLHEXYLGLYCERIN',
    url: 'https://www.cerave.fr',
  },
  {
    name: 'Baume Hydratant',
    brand: 'CeraVe',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.CERAVE_BAUME_HYDRATANT,
    totalAmount: 454,
    amountUnit: 'g',
    priceCents: 1800,
    description:
      'Baume réparateur riche pour peaux sèches à très sèches. Hydratation 48h, restaure barrière avec 3 céramides + HA.',
    notes: 'Technologie MVE. Sans parfum. Convient visage/corps, toute la famille.',
    inci: 'AQUA / WATER, GLYCERIN, CETEARYL ALCOHOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CETYL ALCOHOL, DIMETHICONE, PHENOXYETHANOL, PETROLATUM, BEHENTRIMONIUM METHOSULFATE, POLYGLYCERYL-3 DIISOSTEARATE, SODIUM LAUROYL LACTYLATE, ETHYLHEXYLGLYCERIN, POTASSIUM PHOSPHATE, DISODIUM EDTA, DIPOTASSIUM PHOSPHATE, CERAMIDE NP, CERAMIDE AP, PHYTOSPHINGOSINE, CHOLESTEROL, XANTHAN GUM, CARBOMER, SODIUM HYALURONATE, TOCOPHEROL, CERAMIDE EOP',
    url: 'https://www.cerave.fr',
  },
  {
    name: 'Crème Hydratante',
    brand: 'CeraVe',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.CERAVE_CREME_HYDRATANTE,
    totalAmount: 340,
    amountUnit: 'g',
    priceCents: 1500,
    description:
      'Crème hydratante quotidienne pour peaux normales à sèches. Hydratation 24h, texture onctueuse non grasse.',
    notes: '3 céramides + HA + MVE. Sans parfum. Excellent rapport qualité/prix.',
    inci: 'AQUA / WATER, GLYCERIN, CETEARYL ALCOHOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CETYL ALCOHOL, CETEARETH-20, PETROLATUM, POTASSIUM PHOSPHATE, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, CARBOMER, DIMETHICONE, BEHENTRIMONIUM METHOSULFATE, SODIUM LAUROYL LACTYLATE, SODIUM HYALURONATE, CHOLESTEROL, PHENOXYETHANOL, DISODIUM EDTA, DIPOTASSIUM PHOSPHATE, TOCOPHEROL, PHYTOSPHINGOSINE, XANTHAN GUM, ETHYLHEXYLGLYCERIN',
    url: 'https://www.cerave.fr',
  },
  {
    name: 'Lait Hydratant',
    brand: 'CeraVe',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.CERAVE_LAIT_HYDRATANT,
    totalAmount: 473,
    amountUnit: 'ml',
    priceCents: 1400,
    description:
      'Lait corporel léger pour peaux normales à sèches. Absorption rapide, hydratation 24h sans fini gras.',
    notes: '3 céramides + HA + MVE. Idéal climats chauds. Sans parfum.',
    inci: 'AQUA / WATER, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, NIACINAMIDE, CETEARYL ALCOHOL, CETYL ALCOHOL, DIMETHICONE, PHENOXYETHANOL, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, CARBOMER, BEHENTRIMONIUM METHOSULFATE, SODIUM LAUROYL LACTYLATE, SODIUM HYALURONATE, CHOLESTEROL, PHENOXYETHANOL, DISODIUM EDTA, DIPOTASSIUM PHOSPHATE, TOCOPHEROL, PHYTOSPHINGOSINE, XANTHAN GUM, POTASSIUM PHOSPHATE, ETHYLHEXYLGLYCERIN',
    url: 'https://www.cerave.fr',
  },
  {
    name: 'UreaRepair PLUS Lotion 10%',
    brand: 'Eucerin',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_LOTION_10,
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 2250,
    description:
      'Lotion intensive 10% urée pour peaux très sèches, rugueuses et squameuses. Exfolie doucement, hydrate 48h, lisse visiblement.',
    notes:
      'Urée 10% + céramides + NMF. Texture fluide absorption rapide. Sans parfum. Idéal kératose pilaire, diabète, psoriasis léger.',
    inci: 'AQUA, UREA, GLYCERIN, ISOPROPYL STEARATE, DICAPRYLYL ETHER, GLYCERYL GLUCOSIDE, SODIUM LACTATE, BUTYROSPERMUM PARKII BUTTER, TAPIOCA STARCH, POLYGLYCERYL-4 DIISOSTEARATE/POLYHYDROXYSTEARATE/SEBACATE, CARNITINE, CETEARYL ALCOHOL, CERAMIDE NP, ARGININE HCL, SODIUM PCA, HISTIDINE, ALANINE, CITRULLINE, LYSINE, SERINE, LACTIC ACID, SODIUM CHLORIDE, MANNITOL, SUCROSE, GLUTAMIC ACID, THREONINE, GLYCOGEN, 1,2-HEXANEDIOL, PHENOXYETHANOL, POTASSIUM SORBATE, ARGININE, PCA',
    url: 'https://int.eucerin.com',
  },
  {
    name: 'UreaRepair PLUS Crème 5%',
    brand: 'Eucerin',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_CREME_5,
    totalAmount: 450,
    amountUnit: 'ml',
    priceCents: 1900,
    description:
      'Crème hydratante 5% urée pour peaux sèches à très sèches (visage/corps). Apaise tiraillements, lisse sans agresser.',
    notes:
      'Urée 5% + céramides + NMF. Texture onctueuse non grasse. Sans parfum. Convient visage/corps, peaux sensibles.',
    inci: 'AQUA, UREA, GLYCERIN, CETEARYL ALCOHOL, GLYCERYL GLUCOSIDE, DICAPRYLYL ETHER, SODIUM LACTATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, BUTYROSPERMUM PARKII BUTTER, CERAMIDE NP, ARGININE HCL, CARNITINE, SODIUM PCA, SERINE, GLYCOGEN, ALANINE, HISTIDINE, LYSINE, THREONINE, PROLINE, DIMETHICONOL, SODIUM CHLORIDE, CITRIC ACID, SODIUM CETEARYL SULFATE, PHENOXYETHANOL, BENZYL ALCOHOL',
    url: 'https://int.eucerin.com',
  },
  {
    name: 'AtopiControl Baume',
    brand: 'Eucerin',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.EUCERIN_ATOPICONTROL_BAUME,
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 2600,
    description:
      'Baume relipidant intensif pour peau atopique/eczéma. Apaise démangeaisons rapidement, renforce barrière, espace poussées.',
    notes:
      'Licochalcone A + céramides + oméga 6. Sans parfum. Convient dès 3 mois. Texture riche non collante.',
    inci: 'AQUA, GLYCERIN, PANTHENOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, DICAPRYLYL ETHER, OLEA EUROPAEA FRUIT OIL, RICINUS COMMUNIS SEED OIL, POLYGLYCERYL-3 POLYRICINOLEATE, GLYCERYL GLUCOSIDE, OENOTHERA BIENNIS OIL, BORAGO OFFICINALIS SEED OIL, CERAMIDE NP, GLYCYRRHIZA INFLATA ROOT EXTRACT, DECYLENE GLYCOL, GLYCINE SOJA OIL, TOCOPHEROL, ASCORBYL PALMITATE, MAGNESIUM SULFATE, SODIUM CITRATE, CITRIC ACID',
    url: 'https://int.eucerin.com',
  },

  {
    name: 'Xerolys 50 Soin pour Callosités',
    brand: 'Laboratoire SVR / Genové',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.XEROLYS_50,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 930,
    description:
      "Soin kératolytique et hydratant intensif pour les callosités localisées. Réduit l'épaisseur des hyperkératoses sur les mains, coudes, pieds et ongles. Formule brevetée URODIUM® avec 50% d'urée pour une action exfoliante et hydratante de longue durée.",
    notes:
      "Émulsion Eau dans Huile filmogène. Contient 50% d'urée pure associée à l'acide glycolique et lactique pour une synergie kératolytique optimale. Texture riche et occlusive.",
    inci: 'UREA • AQUA (WATER) • ISOSTEARYL ISOSTEARATE • PARAFFINUM LIQUIDUM (MINERAL OIL) • GLYCERIN • BUTYROSPERMUM PARKII (SHEA BUTTER) BUTTER • GLYCOLIC ACID • SODIUM CHLORIDE • POLYGLYCERYL-4-ISOSTEARATE • CETYL PEG/PPG-10/1 DIMETHICONE • HEXYL LAURATE • SODIUM HYDROXIDE • LACTIC ACID • ALLANTOIN • CYCLOPENTASILOXANE • SODIUM METHYL PARABEN • C30-45 ALKYL CETEARYL DIMETHICONE CROSSPOLYMER',
    url: 'https://pharmacie-citypharma.fr/fr/xerolys-50-soin-a-callosite-tb',
  },

  // ── Uriage Keratosane 30 ─────────────────────────────────────────────────────
  {
    name: 'Uriage Kératosane 30 Gel Crème Anti-Callosités',
    brand: 'Uriage',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.URIAGE_KERATOSANE_30,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 749,
    description:
      "Gel-crème haute tolérance au pouvoir kératolytique intensif. Exfolie les zones rugueuses et épaissies grâce à sa concentration optimale en urée. Enrichi en Eau Thermale d'Uriage pour apaiser et protéger la peau sensible.",
    notes:
      "30% d'urée pure + Glycocolle + Sulfate de dextran. Testé sous contrôle dermatologique. Non comédogène, sans parfum. Peut provoquer des picotements passagers sur peaux sensibles.",
    inci: 'AQUA (WATER, EAU) • UREA • GLYCERIN • GLYCINE • PARAFFINUM LIQUIDUM (MINERAL OIL) • SQUALANE • SORBITAN STEARATE • ALGIN • POLYSORBATE 60 • PHENOXYETHANOL • ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER • CHOLESTEROL • SODIUM DEXTRAN SULFATE • SODIUM HYDROXIDE',
    url: 'https://www.uriage.fr/produits/keratosane-30',
  },

  // ── Isispharma Urelia 50 ────────────────────────────────────────────────────
  {
    name: 'Isispharma Urelia 50 Baume Hydratant Kératolytique',
    brand: 'Isispharma',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.ISISPHARMA_URELIA_50,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1389,
    description:
      'Baume onctueux ultra-concentré en urée pour le traitement des plaques épaissies et des zones hyperkératosiques. Texture confortable respectant les peaux fragilisées. Action combinée exfoliante et réparatrice.',
    notes:
      "50% d'urée + acides glycolique et lactique. Contient un extrait fermenté marin (Pseudoalteromonas) aux propriétés régénérantes. Formule non parfumée, tolérance optimale. Association recommandée avec Urelia Gel.",
    inci: 'UREA • AQUA (WATER) • PARAFFINUM LIQUIDUM (MINERAL OIL) • GLYCERIN • CYCLOPENTASILOXANE • GLYCOLIC ACID • BUTYROSPERMUM PARKII (SHEA) BUTTER • DICAPRYLYL ETHER • CYCLOHEXASILOXANE • POLYGLYCERYL-4 ISOSTEARATE • CETYL PEG/PPG-10/1 DIMETHICONE • HEXYL LAURATE • BEHENOXY DIMETHICONE • PENTYLENE GLYCOL • DIMETHICONE • SODIUM CHLORIDE • PSEUDOALTEROMONAS FERMENT EXTRACT • LACTIC ACID • CHLORPHENESIN • XANTHAN GUM • CAPRYLYL GLYCOL • ETHYLHEXYLGLYCERIN • ALANINE • PROLINE • SERINE • SODIUM PHOSPHATE • SODIUM HYDROXIDE • TOCOPHEROL • GLYCINE SOJA (SOYBEAN) OIL • PENTAERYTHRITYL TETRADI-T-BUTYL HYDROXYHYDROCINNAMATE • CITRIC ACID',
    url: 'https://pharmacie-citypharma.fr/fr/isispharma-urelia-50-baume-hydratant-keratolytique-40ml',
  },

  // ── Topicrem UR-10 ───────────────────────────────────────────────────────────
  {
    name: 'Topicrem UR-10 Crème Lissante Anti-Rugosités',
    brand: 'Topicrem',
    kind: 'skincare',
    unit: 'pump',
    slug: CORPS_PRODUCT_SLUGS.TOPICREM_UR_10,
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1678,
    description:
      'Crème corps lissante anti-rugosités pour les "peaux de croco". Concentration modérée en urée (10%) associée à la cire d\'abeille pour rétablir l\'hydratation, restaurer le film protecteur et nourrir intensément les peaux extra-sèches.',
    notes:
      "10% d'urée - concentration adaptée pour un usage corporel régulier. Texture épaisse et nourrante. Contient parfum. Ne pas appliquer sur le visage, les lésions ou les enfants <3 ans.",
    inci: 'AQUA (WATER) • PARAFFINUM LIQUIDUM (MINERAL OIL) • UREA • CERA ALBA (BEESWAX) • CETEARYL ETHYLHEXANOATE • ISOPROPYL ISOSTEARATE • PALMITIC ACID • STEARIC ACID • ISOPROPYL MYRISTATE • PHENOXYETHANOL • GLYCERYL STEARATE • PEG-100 STEARATE • CARBOMER • CHLORPHENESIN • SODIUM HYDROXIDE • PARFUM (FRAGRANCE)',
    url: 'https://pharmacie-citypharma.fr/fr/topicrem-ur10-creme-lissante-a-rugosites-500ml',
  },

  // ── Topicrem Ultra Hydratant Crème Riche ──────────────────────────────────────
  {
    name: 'Topicrem Ultra Hydratant Crème Riche',
    brand: 'Topicrem',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.TOPICREM_ULTRA_HYDRATANT_RICHE,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1089,
    description:
      "Crème hydratante éclat 24h pour peaux sensibles sèches à très sèches. Enrichie en actif anti-pollution et agents hydratants pour protéger des agressions extérieures et révéler l'éclat du teint. Texture onctueuse non grasse.",
    notes:
      'Formulation douce avec parfum floral sans allergènes. Contient urée à concentration modérée, beurre de karité et agents émollients. Fini doux et confortable. Testée sous contrôle dermatologique.',
    inci: 'AQUA (WATER) • ISOPROPYL ISOSTEARATE • CAPRYLIC/CAPRIC TRIGLYCERIDE • GLYCERIN • PARAFFINUM LIQUIDUM (MINERAL OIL) • BUTYROSPERMUM PARKII (SHEA) BUTTER • POLYSORBATE 60 • SORBITAN STEARATE • CETYL ALCOHOL • CERA ALBA (BEESWAX) • GLYCERYL STEARATE • PEG-100 STEARATE • UREA • OCTYLDODECYL PCA • XANTHAN GUM • PHENOXYETHANOL • ETHYLHEXYLGLYCERIN • SODIUM POLYACRYLATE • TOCOPHEROL • CHLORPHENESIN • SODIUM HYDROXIDE • PARFUM (FRAGRANCE)',
    url: 'https://pharmacie-citypharma.fr/fr/topicrem-ultra-hydratant-creme-riche-40ml',
  },

  // ── SkinCeuticals Lip Repair ─────────────────────────────────────────────────
  {
    name: 'SkinCeuticals Sérum Gel Antioxydant Lip Repair',
    brand: 'SkinCeuticals',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.SKINCEUTICALS_LIP_REPAIR,
    totalAmount: 10,
    amountUnit: 'ml',
    priceCents: 4489,
    description:
      'Soin émollient ultime pour les lèvres. Neutralise les dommages environnementaux (pollution, vent) grâce à des antioxydants puissants. Hydrate intensément, lisse et repulpe les lèvres desséchées tout en prévenant le vieillissement cutané.',
    notes:
      'Formule premium avec Silymarine (extrait de chardon-Marie), Vitamine E, Acide Hyaluronique et Hydroxyethyl Urée. Contient également Allantoïne apaisante et peptides régénérants. Texture gel fondante.',
    inci: 'AQUA/WATER • HYDROGENATED POLYISOBUTENE • GLYCERIN • CERA MICROCRISTALLINA/MICROCRYSTALLINE WAX • DIMETHICONE • UNDECANE • TRIDECANE • PEG/PPG-18/18 DIMETHICONE • SILICA [NANO]/SILICA • ALCOHOL DENAT. • TOCOPHERYL ACETATE • POLYMETHYLSILSESQUIOXANE • ETHYLENE PALMITATE • PHENOXYETHANOL • LAURYL PEG-9 POLYDIMETHYLSILOXYETHYL DIMETHICONE • TOCOPHEROL • MAGNESIUM SULFATE • DISTEARDIMONIUM HECTORITE • GLUCOSAMINE HCl • TRIBEHENIN • CAPRYLYL GLYCOL • ALLANTOIN • DISODIUM EDTA • HYDROXYETHYL UREA • SORBITAN ISOSTEARATE • SODIUM HYALURONATE • FAEX EXTRACT/YEAST EXTRACT • BIOSACCHARIDE GUM-1 • PALMITOYL OLIGOPEPTIDE • SILYBUM MARIANUM EXTRACT',
    url: 'https://www.skinceuticals.fr/lip-repair',
  },

  // ── The Inkey List Urea 10% ──────────────────────────────────────────────────
  {
    name: 'The Inkey List Urea 10% Hydratant',
    brand: 'The Inkey List',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.THE_INKEY_LIST_UREA_10,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1990,
    description:
      "Soin hydratant visage à 10% d'urée développé avec des dermatologues. Cible le dessèchement sévère en apportant une hydratation immédiate. Exfolie délicatement les rugosités tout en apaisant et nourrissant la peau très sèche.",
    notes:
      'Formulation clean et minimaliste. Absorption rapide, non comédogène. Convient aux peaux sensibles. Contient huile de carthame et squalane pour renforcer la barrière cutanée. Sans parfum.',
    inci: 'AQUA (WATER) • UREA • CAPRYLIC/CAPRIC TRIGLYCERIDE • GLYCERIN • CETEARYL ALCOHOL • GLYCERYL STEARATE SE • AVENA SATIVA (OAT) KERNEL FLOUR • CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL • SQUALANE • PHENOXYETHANOL • BENZYL ALCOHOL • SODIUM CARBOMER • SODIUM STEAROYL GLUTAMATE • CITRIC ACID • ETHYLHEXYLGLYCERIN • SODIUM GLUCONATE • DEHYDROACETIC ACID',
    url: 'https://www.theinkeylist.com/products/urea',
  },

  // ── ISDIN Ureadin Ultra 20 ───────────────────────────────────────────────────
  {
    name: 'ISDIN Ureadin Ultra 20 Crème Ultra-Hydratante',
    brand: 'ISDIN',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_20,
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1600,
    description:
      "Crème réparatrice réduisant les aspérités et rugosités grâce à l'action exfoliante de l'Urée ISDIN 20%. Hydrate intensément et restaure la barrière cutanée. Texture onctueuse non grasse à absorption rapide.",
    notes:
      "Urée ISDIN 20% - concentration optimale pour l'entretien des peaux très sèches. Enrichie en huile d'avocat et Allantoïne. Système de défense cutanée renforcé. Parfum subtil présent.",
    inci: 'AQUA (WATER) • UREA • ISOPROPYL MYRISTATE • PARAFFINUM LIQUIDUM (MINERAL OIL) • GLYCERYL STEARATE • PEG-40 STEARATE • SORBITOL • CETEARYL ETHYLHEXANOATE • CETYL ALCOHOL • DIMETHICONE • GLYCINE • PHENOXYETHANOL • PERSEA GRATISSIMA (AVOCADO) OIL • CARBOMER • ALLANTOIN • PALMITIC ACID • STEARIC ACID • ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER • DISODIUM EDTA • ETHYLHEXYLGLYCERIN • PARFUM (FRAGRANCE) • SODIUM HYDROXIDE • LIMONENE • HEXYL CINNAMAL • LACTIC ACID • ALPHA-ISOMETHYL IONONE • LINALOOL • BENZYL SALICYLATE • EUGENOL • CITRAL • HYDROXYCITRONELLAL • COUMARIN',
    url: 'https://www.isdin.com/fr/ureadin-ultra-20',
  },

  // ── ISDIN Ureadin Ultra 30 ───────────────────────────────────────────────────
  {
    name: 'ISDIN Ureadin Ultra 30 Crème Émolliente',
    brand: 'ISDIN',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_30,
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1600,
    description:
      "Crème émolliente intensive pour zones épaissies et durillons. Exfolie et réduit les épaississements tout en hydratant profondément. Restaure la barrière cutanée grâce à l'Urée ISDIN 30%. Texture non grasse rapide.",
    notes:
      'Urée ISDIN 30% - concentration élevée pour traitement localisé des hyperkératoses. Contient Arginine et Acide Lactique pour synergie kératolytique. Parfum présent (allergènes potentiels listés).',
    inci: 'AQUA (EAU) • UREA • PARAFFINUM LIQUIDUM (HUILE MINÉRALE) • ISOPROPYL PALMITATE • GLYCERYL STEARATE • PEG-100 STEARATE • CETEARYL ETHYLHEXANOATE • CETYL ALCOHOL • DIMETHICONE • ARGININE • PHENOXYETHANOL • ACIDE LACTIQUE • ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER • ALLANTOÏNE • ACIDE PALMITIQUE • PARFUM (FRAGRANCE) • ACIDE STÉARIQUE • EDTA DISODIQUE • ÉTHYLHEXYLGLYCÉRINE • LIMONÈNE • HEXYL CINNAMAL • ALPHA-ISOMÉTHYL IONONE • LINALOOL • BENZYL SALICYLATE • EUGENOL • CITRAL • HYDROXYCITRONELLAL • COUMARIN • GERANIOL',
    url: 'https://www.isdin.com/fr/ureadin-ultra-30',
  },

  // ── ISDIN Ureadin Ultra 10 Lotion Plus ───────────────────────────────────────
  {
    name: 'ISDIN Ureadin Ultra 10 Lotion Plus',
    brand: 'ISDIN',
    kind: 'skincare',
    unit: 'bottle',
    slug: CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_10_LOTION,
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 1600,
    description:
      'Lotion corporelle hydratante intense pour soin quotidien des peaux très sèches qui desquament. Hydratation maximale soulageant les démangeaisons. Texture légère non grasse favorisant la restauration de la barrière cutanée.',
    notes:
      'Urée ISDIN 10% + Dexpanthénol (Provitamine B5). Concentration modérée adaptée pour usage quotidien corps entier. Adjuvant traitement xérose et peau sénile. Parfum présent avec allergènes.',
    inci: 'AQUA (EAU) • URÉE • ÉTHYLHEXANOATE DE CÉTÉARYLE • PANTHÉNOL • STÉARATE DE GLYCÉRYLE • STÉARATE DE PEG-40 • GLYCÉRINE • DIMÉTHICONE • HUILE DE PERSEA GRATISSIMA (AVOCAT) • BEURRE DE GRAINES DE SHOREA STENOPTERA • PHÉNOXYÉTHANOL • ALCOOL CÉTYLIQUE • OCTYLODODÉCANOL • CARBOMER • ACIDE PALMITIQUE • ACIDE STÉARIQUE • EDTA DISODIQUE • ÉTHYLHEXYLGLYCÉRINE • PARFUM • HYDROXYDE DE SODIUM • BHT • ACIDE LACTIQUE • LIMONÈNE • HEXYL CINNAMAL • ALPHA-ISOMÉTHYL IONONE • LINALOOL • BENZYL SALICYLATE • EUGENOL • CITRAL • HYDROXYCITRONELLAL • COUMARIN',
    url: 'https://www.isdin.com/fr/ureadin-ultra-10-lotion-plus',
  },

  // ── Eucerin UreaRepair 30 ────────────────────────────────────────────────────
  {
    name: 'Eucerin UreaRepair 30 Crème Corps',
    brand: 'Eucerin',
    kind: 'skincare',
    unit: 'tube',
    slug: CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_30,
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 1010,
    description:
      "Crème intensive pour zones cutanées extrêmement sèches, rugueuses et squameuses (coudes, genoux, mains, pieds). Exfolie en douceur grâce à l'urée 30%, répare la barrière cutanée avec des céramides et hydrate avec les NMF.",
    notes:
      'Formule Eucerin complète: 30% Urée + Céramide NP + NMF (PCA, Lactate, etc.). Sans parfum. Convient aux affections hyperkératosiques et plaques psoriasiques en complément de traitements desséchants. Résultats visibles dès 1 semaine.',
    inci: 'AQUA • UREA • OCTYLDODECANOL • CAPRYLIC/CAPRIC TRIGLYCERIDE • SODIUM LACTATE • DECYL OLEATE • POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE • ARGININE HCl • CHONDRUS CRISPUS EXTRACT • CERAMIDE NP • CHOLESTEROL • HELIANTHUS ANNUUS SEED OIL • ALANINE • CARNITINE • GLYCINE • LACTIC ACID • SODIUM PCA • SODIUM CHLORIDE • DECYLENE GLYCOL • PENTYLENE GLYCOL',
    url: 'https://www.eucerin.fr/produits/urearepair/urearepair-plus-creme-30-uree',
  },
]

// export const INGREDIENT_SLUGS = {
//   // ── Actifs principaux ─────────────────────────────────────────────────────────
//   UREA: 'UREA',
//   GLYCOLIC_ACID: 'GLYCOLIC_ACID',
//   LACTIC_ACID: 'LACTIC_ACID',
//   SODIUM_LACTATE: 'SODIUM_LACTATE',
//   HYALURONIC_ACID: 'HYALURONIC_ACID',
//   SODIUM_HYALURONATE: 'SODIUM_HYALURONATE',
//   NIACINAMIDE: 'NIACINAMIDE',

//   // ── Lipides et émolients ────────────────────────────────────────────────────────
//   SHEA_BUTTER: 'SHEA_BUTTER',
//   SQUALANE: 'SQUALANE',
//   AVOCADO_OIL: 'AVOCADO_OIL',
//   SAFFLOWER_OIL: 'SAFFLOWER_SEED_OIL',
//   SUNFLOWER_OIL: 'SUNFLOWER_SEED_OIL',
//   BEESWAX: 'BEESWAX',
//   CAPRYLIC_CAPRIC_TRIGLYCERIDE: 'CAPRYLIC_CAPRIC_TRIGLYCERIDE',
//   ISOPROPYL_PALMITATE: 'ISOPROPYL_PALMITATE',
//   ISOPROPYL_MYRISTATE: 'ISOPROPYL_MYRISTATE',
//   CETYL_ALCOHOL: 'CETYL_ALCOHOL',
//   CETEARYL_ALCOHOL: 'CETEARYL_ALCOHOL',
//   GLYCERYL_STEARATE: 'GLYCERYL_STEARATE',

//   // ── Agents de barrière et réparateurs ─────────────────────────────────────────
//   CERAMIDE_NP: 'CERAMIDE_NP',
//   CHOLESTEROL: 'CHOLESTEROL',
//   ALLANTOIN: 'ALLANTOIN',
//   PANTHENOL: 'PANTHENOL', // Provitamine B5 / Dexpanthénol
//   BISABOLOL: 'BISABOLOL',

//   // ── Acides aminés et NMF ───────────────────────────────────────────────────────
//   ARGININE: 'ARGININE',
//   GLYCINE: 'GLYCINE',
//   ALANINE: 'ALANINE',
//   PROLINE: 'PROLINE',
//   SERINE: 'SERINE',
//   SODIUM_PCA: 'SODIUM_PCA',

//   // ── Antioxydants ──────────────────────────────────────────────────────────────
//   TOCOPHEROL: 'TOCOPHEROL', // Vitamine E
//   TOCOPHERYL_ACETATE: 'TOCOPHERYL_ACETATE',
//   SILYMARIN: 'SILYMARIN', // Extrait chardon-Marie
//   VITAMIN_E_ACETATE: 'VITAMIN_E_ACETATE',

//   // ── Extraits botaniques et biotechnologiques ───────────────────────────────────
//   CENTELLA_ASIATICA: 'CENTELLA_ASIATICA',
//   OAT_KERNEL_FLOUR: 'OAT_KERNEL_FLOUR', // Avoine
//   PSEUDOALTEROMONAS_FERMENT: 'PSEUDOALTEROMONAS_FERMENT_EXTRACT',
//   YEAST_EXTRACT: 'YEAST_EXTRACT',
//   BIOSACCHARIDE_GUM_1: 'BIOSACCHARIDE_GUM_1',
//   CHONDRUS_CRISPUS: 'CHONDRUS_CRISPUS_EXTRACT', // Algue rouge

//   // ── Agents exfoliants complémentaires ──────────────────────────────────────────
//   SALICYLIC_ACID: 'SALICYLIC_ACID',
//   GLUCONOLACTONE: 'GLUCONOLACTONE',

//   // ── Agents hydratants complémentaires ───────────────────────────────────────────
//   GLYCERIN: 'GLYCERIN',
//   HYDROXYETHYL_UREA: 'HYDROXYETHYL_UREA',
//   PENTYLENE_GLYCOL: 'PENTYLENE_GLYCOL',
//   DECYLENE_GLYCOL: 'DECYLENE_GLYCOL',

//   // ── Agents structurants et émulsifiants ────────────────────────────────────────
//   DIMETHICONE: 'DIMETHICONE',
//   CYCLOPENTASILOXANE: 'CYCLOPENTASILOXANE',
//   PEG_40_STEARATE: 'PEG_40_STEARATE',
//   PEG_100_STEARATE: 'PEG_100_STEARATE',
//   POLYSORBATE_60: 'POLYSORBATE_60',
//   SORBITAN_STEARATE: 'SORBITAN_STEARATE',
//   CARBOMER: 'CARBOMER',
//   XANTHAN_GUM: 'XANTHAN_GUM',

//   // ── Minéraux et sels ───────────────────────────────────────────────────────────
//   SODIUM_CHLORIDE: 'SODIUM_CHLORIDE',
//   MAGNESIUM_SULFATE: 'MAGNESIUM_SULFATE',
//   SODIUM_DEXTRAN_SULFATE: 'SODIUM_DEXTRAN_SULFATE',

//   // ── Peptides ─────────────────────────────────────────────────────────────────
//   PALMITOYL_OLIGOPEPTIDE: 'PALMITOYL_OLIGOPEPTIDE',

//   // ── Agents apaisants ─────────────────────────────────────────────────────────
//   GLUCOSAMINE_HCl: 'GLUCOSAMINE_HCl',
// } as const

//   ],

// }
