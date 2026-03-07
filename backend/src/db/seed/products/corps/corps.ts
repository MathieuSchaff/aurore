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
]
