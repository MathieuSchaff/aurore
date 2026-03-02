// ─── Slugs ────────────────────────────────────────────────

export const CORPS_PRODUCT_SLUGS = {
  CERAVE_SA_ANTI_RUGOSITES: 'cerave-creme-sa-anti-rugosites',
  CERAVE_BAUME_HYDRATANT: 'cerave-baume-hydratant',
  CERAVE_CREME_HYDRATANTE: 'cerave-creme-hydratante',
  CERAVE_LAIT_HYDRATANT: 'cerave-lait-hydratant',
  EUCERIN_UREAREPAIR_LOTION_10: 'eucerin-urearepair-plus-lotion-10',
  EUCERIN_UREAREPAIR_CREME_5: 'eucerin-urearepair-plus-creme-5',
  EUCERIN_ATOPICONTROL_BAUME: 'eucerin-atopicontrol-baume',
}

// ─── Data ─────────────────────────────────────────────────

export const CORPS_PRODUCT_DATA = [
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
