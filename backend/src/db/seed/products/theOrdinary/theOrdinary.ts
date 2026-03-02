export const TO_PRODUCT_SLUGS = {
  TO_CAFFEINE_5_EGCG: 'the-ordinary-caffeine-solution-5-egcg',
  TO_NIACINAMIDE_10_ZINC_1: 'the-ordinary-niacinamide-10-zinc-1',
  TO_HYALURONIC_ACID_2_B5: 'the-ordinary-hyaluronic-acid-2-b5',
  TO_AZELAIC_ACID_10: 'the-ordinary-azelaic-acid-suspension-10',
  THE_ORDINARY_MULTI_PEPTIDE_COPPER_1: 'the-ordinary-multi-peptide-plus-copper-peptides-1-percent',
  THE_ORDINARY_MULTI_PEPTIDES_HA_EX_BUFFET: 'the-ordinary-multi-peptides-plus-ha-serum-ex-buffet',
  THE_ORDINARY_MULTI_PEPTIDES_YEUX: 'the-ordinary-multi-peptides-serum-yeux',
  THE_ORDINARY_ECLAT_MULTI_ANTIOXYDANT: 'the-ordinary-serum-eclat-multi-antioxydant',
  THE_ORDINARY_SOLUTION_GF_15: 'the-ordinary-solution-gf-15-pourcent-facteurs-croissance',
  THE_ORDINARY_MATRIXYL_10_HA: 'the-ordinary-matrixyl-10-percent-plus-ha',
}

export const TO_PRODUCT_DATA = [
  {
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'dropper',
    slug: 'the-ordinary-niacinamide-10-zinc-1',
    totalAmount: 60,
    amountUnit: 'ml',
    priceCents: 1400,
    description:
      "Sérum haute concentration en vitamine B3 (niacinamide) et zinc pour réduire l'apparence des imperfections et l'excès de sébum.",
    notes:
      'Note: 4.6/5. pH 5.50-6.50. Sans alcool, sans huile, sans silicone. Aide à réguler la production de sébum.',
    inci: 'Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarin-dus Indica Seed Gum, Xanthan gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin.',
    url: 'https://theordinary.com',
  },
  {
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'dropper',
    slug: 'the-ordinary-hyaluronic-acid-2-b5',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 990,
    description:
      "Sérum d'acide hyaluronique pur offrant une hydratation multi-profondeur, soutenu par l'ajout de vitamine B5 pour une meilleure hydratation de surface.",
    notes:
      "Note: 4.6/5. Contient 3 formes d'acide hyaluronique de différents poids moléculaires. Texture légère.",
    inci: 'Aqua (Water), Sodium Hyaluronate, Pentylene Glycol, Propanediol, Sodium Hyaluronate Crosspolymer, Panthenol, Ahnfeltia Concinna Extract, Glycerin, Trisodium Ethylenediamine Disuccinate, Citric Acid, Isoceteth-20, Ethoxydiglycol, Ethylhexylglycerin, Hexylene Glycol, 1,2-Hexanediol, Phenoxyethanol, Caprylyl Glycol.',
    url: 'https://theordinary.com',
  },
  {
    name: 'Caffeine Solution 5% + EGCG',
    brand: 'The Ordinary',
    slug: TO_PRODUCT_SLUGS.TO_CAFFEINE_5_EGCG,
    kind: 'skincare',
    unit: 'dropper',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 700,
    description:
      'Sérum contour des yeux à 5% caféine + EGCG pour réduire poches, cernes et aspect fatigué.',
    notes: 'Texture aqueuse légère, appliquer matin/soir. Décongestionnant + antioxydant.',
    inci: 'AQUA, CAFFEINE, MALTODEXTRIN, GLYCERIN, PROPANEDIOL, EPIGALLOCATECHIN GALLATYL GLUCOSIDE, GALLYL GLUCOSIDE, HYALURONIC ACID, OXIDIZED GLUTATHIONE, MELANIN, GLYCINE SOJA SEED EXTRACT, PENTYLENE GLYCOL, HYDROXYETHYLCELLULOSE, POLYACRYLATE CROSSPOLYMER-6, XANTHAN GUM, LACTIC ACID, DEHYDROACETIC ACID, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, PROPYL GALLATE, DIMETHYL ISOSORBIDE, BENZYL ALCOHOL, 1,2-HEXANEDIOL, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL, CAPRYLYL GLYCOL',
    url: 'https://theordinary.com',
  },
  {
    name: 'Azelaic Acid Suspension 10%',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'pump',
    slug: TO_PRODUCT_SLUGS.TO_AZELAIC_ACID_10,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 800,
    description: 'Suspension 10% acide azélaïque minimaliste. Anti-imperfections, éclaircissant.',
    notes:
      'Prix ultra-bas mais texture épaisse collante qui pills, qualité variable selon lots. Pas optimal vs Anua.',
    inci: 'AQUA (WATER), AZELAIC ACID (10%), DIMETHICONE, ISONONYL ISONONANOATE, GLYCERIN, CETEARYL ALCOHOL, CETEARETH-20, POLYMETHYL METHACRYLATE, SODIUM HYDROXIDE, XANTHAN GUM, PHENOXYETHANOL, CHLORPHENESIN',
    url: 'https://theordinary.com',
  },

  {
    name: 'Multi-Peptide + Copper Peptides 1%',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'pump',
    slug: TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDE_COPPER_1,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3530,
    description:
      'Sérum multi-peptides + 1% Copper Tripeptide-1. Cible rides, élasticité, fermeté et protection antioxydante globale.',
    notes:
      "1% GHK-Cu + 7 peptides (Argireline, Matrixyl 3000/synthe'6, SYN-AKE...). Texture aqueuse, jour/nuit, tous types de peau.",
    inci: 'AQUA (WATER), GLYCERIN, LACTOCOCCUS FERMENT LYSATE, COPPER TRIPEPTIDE-1, ACETYL HEXAPEPTIDE-8, PENTAPEPTIDE-18, PALMITOYL TRIPEPTIDE-1, PALMITOYL TETRAPEPTIDE-7, PALMITOYL TRIPEPTIDE-38, DIPEPTIDE DIAMINOBUTYROYL BENZYLAMIDE DIACETATE, ACETYLARGINYLTRYPTOPHYL DIPHENYLGLYCINE, SODIUM HYALURONATE CROSSPOLYMER, SODIUM HYALURONATE, ALLANTOIN, GLYCINE, ALANINE, SERINE, VALINE, ISOLEUCINE, PROLINE, THREONINE, HISTIDINE, PHENYLALANINE, ARGININE, ASPARTIC ACID, TREHALOSE, FRUCTOSE, GLUCOSE, MALTOSE, UREA, SODIUM PCA, PCA, SODIUM LACTATE, CITRIC ACID, HYDROXYPROPYL CYCLODEXTRIN, SODIUM CHLORIDE, SODIUM HYDROXIDE, BUTYLENE GLYCOL, PENTYLENE GLYCOL, ACACIA SENEGAL GUM, XANTHAN GUM, CARBOMER, POLYSORBATE 20, DIMETHYL ISOSORBIDE, SODIUM BENZOATE, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL, CHLORPHENESIN',
    url: 'https://theordinary.com',
  },

  {
    name: 'Matrixyl 10% + HA',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'pump',
    slug: TO_PRODUCT_SLUGS.THE_ORDINARY_MATRIXYL_10_HA,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1250,
    description:
      'Sérum concentré 10% Matrixyl + HA pour cibler rides/ridules, fermeté et synthèse collagène.',
    notes:
      "Matrixyl 3000 + synthe'6. Texture aqueuse hydratante, jour/nuit, excellent rapport qualité/prix.",
    inci: 'AQUA (WATER), GLYCERIN, BUTYLENE GLYCOL, PALMITOYL TRIPEPTIDE-1, PALMITOYL TETRAPEPTIDE-7, PALMITOYL TRIPEPTIDE-38, SODIUM HYALURONATE, HYDROXYPROPYL CYCLODEXTRIN, PPG-26-BUTETH-26, PEG-40 HYDROGENATED CASTOR OIL, POLYACRYLATE CROSSPOLYMER-6, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, CARBOMER, POLYSORBATE 20, ETHOXYDIGLYCOL, PHENOXYETHANOL, CHLORPHENESIN',
    url: 'https://theordinary.com',
  },
  {
    name: 'Multi-Peptides + HA Serum (ex-Buffet)',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'pump',
    slug: TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDES_HA_EX_BUFFET,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2100,
    description:
      "Sérum multi-peptides + HA complet pour premiers signes de l'âge, ridules, élasticité et fermeté.",
    notes:
      '4 technologies peptidiques + probiotiques + HA multi-moléculaire + NMF. Texture aqueuse, jour/nuit.',
    inci: 'AQUA (WATER), GLYCERIN, LACTOCOCCUS FERMENT LYSATE, ACETYL HEXAPEPTIDE-8, PENTAPEPTIDE-18, PALMITOYL TRIPEPTIDE-1, PALMITOYL TETRAPEPTIDE-7, PALMITOYL TRIPEPTIDE-38, DIPEPTIDE DIAMINOBUTYROYL BENZYLAMIDE DIACETATE, ACETYLARGINYLTRYPTOPHYL DIPHENYLGLYCINE, SODIUM HYALURONATE CROSSPOLYMER, SODIUM HYALURONATE, ALLANTOIN, GLYCINE, ALANINE, SERINE, VALINE, ISOLEUCINE, PROLINE, THREONINE, HISTIDINE, PHENYLALANINE, ARGININE, ASPARTIC ACID, TREHALOSE, FRUCTOSE, GLUCOSE, MALTOSE, UREA, SODIUM PCA, PCA, SODIUM LACTATE, CITRIC ACID, HYDROXYPROPYL CYCLODEXTRIN, SODIUM CHLORIDE, SODIUM HYDROXIDE, BUTYLENE GLYCOL, PENTYLENE GLYCOL, ACACIA SENEGAL GUM, XANTHAN GUM, CARBOMER, POLYSORBATE 20, PPG-26-BUTETH-26, PEG-40 HYDROGENATED CASTOR OIL, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, ETHOXYDIGLYCOL, SODIUM BENZOATE, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL, CHLORPHENESIN',
    url: 'https://theordinary.com',
  },
  {
    name: 'Multi-Peptides Serum Yeux',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'pump',
    slug: TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDES_YEUX,
    totalAmount: 15,
    amountUnit: 'ml',
    priceCents: 2680,
    description:
      'Sérum contour yeux multi-peptides. Réduit ridules, cernes, poches et lisse le regard.',
    notes:
      "Matrixyl synthe'6 + Acetyl Tetrapeptide-5 + Myristoyl Nonapeptide-3 + caffeine + EGCG. Texture aqueuse légère, matin/soir.",
    inci: 'AQUA (WATER), GLYCERIN, BUTYLENE GLYCOL, PROPANEDIOL, DIPROPYLENE GLYCOL, ACETYL GLUCOSAMINE, NIACINAMIDE, PALMITOYL TRIPEPTIDE-38, ACETYL TETRAPEPTIDE-5, MYRISTOYL NONAPEPTIDE-3, DIPEPTIDE DIAMINOBUTYROYL BENZYLAMIDE DIACETATE, CAFFEINE, EPIGALLOCATECHIN GALLATYL GLUCOSIDE, GALLYL GLUCOSIDE, FRAXINUS EXCELSIOR BARK EXTRACT, SILANETRIOL, ARGININE, PENTYLENE GLYCOL, HYDROXYMETHOXYPHENYL DECANONE, PROPYL GALLATE, MALTODEXTRIN, HYDROXYPROPYL CYCLODEXTRIN, HYDROXYETHYLCELLULOSE, XANTHAN GUM, CITRIC ACID, GLYCOLIC ACID, SODIUM CITRATE, POLYSORBATE 20, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, DEHYDROACETIC ACID, ETHYLHEXYLGLYCERIN, BENZYL ALCOHOL, PHENOXYETHANOL, CHLORPHENESIN',
    url: 'https://theordinary.com',
  },
  {
    name: 'Sérum Éclat Multi-Antioxydant',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'pump',
    slug: TO_PRODUCT_SLUGS.THE_ORDINARY_ECLAT_MULTI_ANTIOXYDANT,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1680,
    description:
      'Sérum antioxydant quotidien pour protection environnementale, éclat, atténuation taches et texture lisse.',
    notes:
      'Ascorbyl Glucoside + Ergothioneine + EGCG + Tocotrienols + peptides. Texture aqueuse, usage jour.',
    inci: 'AQUA/WATER/EAU, PROPANEDIOL, ASCORBYL GLUCOSIDE, ERGOTHIONEINE, EPIGALLOCATECHIN GALLATYL GLUCOSIDE, ACETYL TETRAPEPTIDE-2, HEPTAPEPTIDE-6, TOCOTRIENOLS, TREMELLA FUCIFORMIS SPOROCARP EXTRACT, SPHINGOMONAS FERMENT EXTRACT, PANAX GINSENG ROOT EXTRACT, BIXA ORELLANA SEED EXTRACT, GLYCERIN, ISOCETETH-20, CITRIC ACID, SODIUM CITRATE, SODIUM HYDROXIDE, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL, CHLORPHENESIN',
    url: 'https://theordinary.com',
  },
  {
    name: 'Solution GF 15% (Facteurs de Croissance)',
    brand: 'The Ordinary',
    kind: 'skincare',
    unit: 'pump',
    slug: TO_PRODUCT_SLUGS.THE_ORDINARY_SOLUTION_GF_15,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1640,
    description:
      'Sérum 15% facteurs de croissance biotechnologiques pour vieillissement avancé, rides profondes, fermeté et réparation.',
    notes:
      'EGF/IGF/TGF mimics (Nicotiana Benthamiana). Texture aqueuse légère, jour/nuit, peaux matures.',
    inci: 'AQUA/WATER/EAU, BUTYLENE GLYCOL, NICOTIANA BENTHAMIANA HEXAPEPTIDE-40 SH-OLIGOPEPTIDE-1, NICOTIANA BENTHAMIANA HEXAPEPTIDE-40 SH-POLYPEPTIDE-76, NICOTIANA BENTHAMIANA OCTAPEPTIDE-30 SH-OLIGOPEPTIDE-2, SCLEROTIUM GUM, GLYCERIN, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, CITRIC ACID, SODIUM CITRATE, PHENOXYETHANOL, CHLORPHENESIN',
    url: 'https://theordinary.com',
  },
]
