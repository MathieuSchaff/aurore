import type { CreateProductInput } from '@habit-tracker/shared'

export const LAB_BIARRITZ_PRODUCT_SLUGS = {
  // Visage – Anti-taches & anti-âge
  LABORATOIRES_BIARRITZ_SERUM_ANTI_TACHES: 'lab-biarritz-serum-anti-taches',
  LABORATOIRES_BIARRITZ_SERUM_REPULPANT: 'lab-biarritz-serum-repulpant',
  LABORATOIRES_BIARRITZ_CREME_NUIT_ANTI_TACHES: 'lab-biarritz-creme-nuit-anti-taches',

  // Visage – Hydratation & soin quotidien
  LABORATOIRES_BIARRITZ_CREME_VISAGE: 'lab-biarritz-creme-visage',
  LABORATOIRES_BIARRITZ_CREME_NUIT_REGENERANTE: 'lab-biarritz-creme-nuit-regenerante',

  // Réparation
  LABORATOIRES_BIARRITZ_CICA_REPA_CREME_REPARATRICE: 'lab-biarritz-cica-repa-creme-reparatrice',

  // Solaire – Visage
  LABORATOIRES_BIARRITZ_CREME_SOLAIRE_VISAGE_SPF50: 'lab-biarritz-creme-solaire-visage-spf50',
  LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50: 'lab-biarritz-creme-solaire-teinte-spf50',
  LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50_DOREE:
    'lab-biarritz-creme-solaire-teinte-spf50-doree',

  // Solaire – Corps
  LABORATOIRES_BIARRITZ_LAIT_SOLAIRE_SPF50: 'lab-biarritz-lait-solaire-spf50',

  // Ajouts fréquents / best-sellers (recommandés pour compléter)
  // LABORATOIRES_BIARRITZ_CREME_CORPS: 'lab-biarritz-creme-corps',
  // LABORATOIRES_BIARRITZ_EAU_NETTOYANTE_BEBE: 'lab-biarritz-eau-nettoyante-bebe',
  // LABORATOIRES_BIARRITZ_GEL_LAVANT_SURGRAS_BEBE: 'lab-biarritz-gel-lavant-surgras-bebe',
  // LABORATOIRES_BIARRITZ_CREME_HYDRATANTE_VISAGE: 'lab-biarritz-creme-hydratante-visage', // parfois appelée ainsi
  // LABORATOIRES_BIARRITZ_CICA_REPA_CREME_MAINS: 'lab-biarritz-cica-repa-creme-mains',
  // LABORATOIRES_BIARRITZ_SPRAY_SOLAIRE_SPF50: 'lab-biarritz-spray-solaire-spf50',
  // LABORATOIRES_BIARRITZ_HUILE_SECHE_SOLAIRE_SPF30: 'lab-biarritz-huile-seche-solaire-spf30',
}
export const LAB_BIARRITZ_PRODUCT_DATA: CreateProductInput[] = [
  {
    name: 'Crème solaire visage SPF50',
    brand: 'Laboratoires de Biarritz',
    kind: 'sunscreen',
    unit: 'tube',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_VISAGE_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2000,
    description:
      "Crème solaire bio visage SPF50 protectrice et hydratante. Association unique d'écrans minéraux et d'Alga-Gorria® (extrait antioxydant breveté d'algue rouge basque) pour protéger des UVA/UVB, prévenir les taches pigmentaires et le vieillissement cutané.",
    notes:
      "99,6% naturel. 20,8% bio. Certifiée ECOCERT. Texture légère, sans parfum, résistante à l'eau. Enrichie en aloe vera bio, huiles de prunes et tournesol bio. Pour peaux claires, fragiles et sensibles. Utilisable femme enceinte/allaitante. Non-toxique pour l'environnement marin (études prouvées).",
    inci: 'CAPRYLIC/CAPRIC TRIGLYCERIDE, COCONUT ALKANES, ZINC OXIDE, TITANIUM DIOXIDE, AQUA/WATER, ORYZA SATIVA POWDER, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, PRUNUS DOMESTICA SEED OIL, SORBITAN OLIVATE, POLYGLYCERYL-3 DIISOSTEARATE, GLYCERIN, HELIANTHUS ANNUUS SEED OIL, COCO-CAPRYLATE/CAPRATE, ALUMINA, STEARIC ACID, GLYCERYL CAPRYLATE, MAGNESIUM SULFATE, GELIDIUM SESQUIPEDALE EXTRACT, ALOE BARBADENSIS LEAF JUICE POWDER, PROPANEDIOL, TOCOPHEROL, SODIUM BENZOATE, POLYGLYCERYL-4 CAPRATE, POTASSIUM SORBATE',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'Crème solaire teintée SPF50 dorée',
    brand: 'Laboratoires de Biarritz',
    kind: 'sunscreen',
    unit: 'tube',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50_DOREE,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2000,
    description:
      "Crème solaire teintée bio SPF50 teinte Dorée. Protège des UVA/UVB et lumière bleue grâce à l'alliance filtres minéraux + Alga-Gorria®. Prévient les taches pigmentaires, unifie le teint avec couvrance modulable (pigments naturels), fini mat naturel.",
    notes:
      "100% naturel. 20,9% bio. COSMOS ORGANIC certifié ECOCERT. Texture légère, sans parfum, non comédogène, résistante à l'eau. Pour peaux claires, fragiles et sensibles. Femme enceinte/allaitante. Disponible en 3 teintes (Ivoire, Beige, Dorée) — mixables.",
    inci: 'CAPRYLIC/CAPRIC TRIGLYCERIDE, ZINC OXIDE, COCONUT ALKANES, TITANIUM DIOXIDE, AQUA/WATER, ORYZA SATIVA POWDER, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, PRUNUS DOMESTICA SEED OIL, POLYGLYCERYL-3 DIISOSTEARATE, GLYCERIN, SORBITAN OLIVATE, CI 77492, OCTYLDODECANOL, ALUMINA, COCO-CAPRYLATE/CAPRATE, STEARIC ACID, MAGNESIUM SULFATE, GELIDIUM SESQUIPEDALE EXTRACT, ALOE BARBADENSIS LEAF JUICE POWDER, GLYCERYL CAPRATE, PROPANEDIOL, CI 77491, TOCOPHEROL, CI 77499, POLYGLYCERYL-4 CAPRATE, JOJOBA ESTERS, TRIHYDROXYSTEARIN',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'Lait solaire SPF50',
    brand: 'Laboratoires de Biarritz',
    kind: 'sunscreen',
    unit: 'pump',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_LAIT_SOLAIRE_SPF50,
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 2400,
    description:
      'Lait solaire SPF50 visage et corps. Écrans minéraux + Alga-Gorria® (algue rouge basque brevetée) pour protection UVA/UVB et prévention du vieillissement cutané. Enrichi en beurre de karité et huile de noix de coco bio.',
    notes:
      "100% naturel. 20% bio. Certifié bio. Texture onctueuse, minimum de traces blanches, sans parfum, résistante à l'eau. Pour toute la famille dès 1 an, peaux sensibles. Femme enceinte/allaitante.",
    inci: 'CAPRYLIC/CAPRIC TRIGLYCERIDE, ZINC OXIDE, COCOS NUCIFERA OIL, COCONUT ALKANES, TITANIUM DIOXIDE, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, BUTYROSPERMUM PARKII BUTTER, POLYGLYCERYL-3 DIISOSTEARATE, HYDROGENATED VEGETABLE OIL, LAUROYL LYSINE, ALUMINA, COCO-CAPRYLATE/CAPRATE, STEARIC ACID, GLYCERYL CAPRYLATE, GELIDIUM SESQUIPEDALE EXTRACT, PROPANEDIOL, TOCOPHEROL, AQUA/WATER, POLYGLYCERYL-4 CAPRATE',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'Crème solaire teintée SPF50',
    brand: 'Laboratoires de Biarritz',
    kind: 'sunscreen',
    unit: 'tube',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2400,
    description:
      'Crème solaire teintée bio SPF50 — soin perfecteur haute performance. Protège des UVA/UVB et lumière bleue (Alga-Gorria® + filtres minéraux). Prévient les taches pigmentaires (masque grossesse, post-acné, solaires), unifie le teint, fini mat naturel.',
    notes:
      "100% naturel. 20,9% bio. Certifiée bio ECOCERT. Texture légère, sans parfum, non comédogène, résistante à l'eau. Pour peaux claires, fragiles et sensibles. Femme enceinte/allaitante. Disponible en 3 teintes (Ivoire, Beige, Dorée) — mixables.",
    inci: 'CAPRYLIC/CAPRIC TRIGLYCERIDE, ZINC OXIDE, COCONUT ALKANES, TITANIUM DIOXIDE, AQUA/WATER, ORYZA SATIVA POWDER, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, PRUNUS DOMESTICA SEED OIL, POLYGLYCERYL-3 DIISOSTEARATE, GLYCERIN, SORBITAN OLIVATE, CI 77492, OCTYLDODECANOL, ALUMINA, COCO-CAPRYLATE/CAPRATE, STEARIC ACID, MAGNESIUM SULFATE, GELIDIUM SESQUIPEDALE EXTRACT, ALOE BARBADENSIS LEAF JUICE POWDER, GLYCERYL CAPRATE, PROPANEDIOL, CI 77491, TOCOPHEROL, CI 77499, POLYGLYCERYL-4 CAPRATE, JOJOBA ESTERS, TRIHYDROXYSTEARIN',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'CICA REPA Crème réparatrice',
    brand: 'Laboratoires de Biarritz',
    kind: 'skincare',
    unit: 'tube',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CICA_REPA_CREME_REPARATRICE,
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1900,
    description:
      'Crème réparatrice et apaisante CICA REPA pour épidermes irrités, abîmés, réactifs (toute la famille dès nourrisson). Actif breveté Alga-Sendatu® (algue rouge basque) : favorise la réparation des couches superficielles et restaure la fonction barrière.',
    notes:
      '100% naturel. 57,8% bio. Certifiée bio. Effet "seconde peau", fini non gras, sans parfum, sans alcool, hypoallergénique. Indiquée pour : irritations, rougeurs, égratignures, post-épilation, post-rasage, brûlures superficielles, coups de soleil, post-actes dermatologiques (laser, peeling, dermabrasion…). Sur visage, corps et muqueuses externes. Sur lésions sèches non suintantes.',
    inci: 'AQUA/WATER, GLYCERIN, BORAGO OFFICINALIS SEED OIL, SIMMONDSIA CHINENSIS SEED OIL, SQUALANE, PROPANEDIOL, PRUNUS DOMESTICA SEED OIL, C12-16 ALCOHOLS, PENTYLENE GLYCOL, GELIDIUM SESQUIPEDALE EXTRACT, ALOE BARBADENSIS LEAF JUICE POWDER, CERAMIDE NP, SODIUM HYALURONATE, PALMITIC ACID, HYDROGENATED LECITHIN, TRIOLEIN, SODIUM LEVULINATE, XANTHAN GUM, TOCOPHEROL, SODIUM ANISATE, CITRIC ACID, GLYCERYL DIOLEATE, SODIUM PHYTATE',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'Crème de nuit régénérante',
    brand: 'Laboratoires de Biarritz',
    kind: 'skincare',
    unit: 'jar',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_NUIT_REGENERANTE,

    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2400,
    description:
      'Crème de nuit hydratante intense 24h avec Alga-Gorria® (antioxydant breveté algue rouge basque). Booste l\'hydratation nocturne, régénère et protège contre le vieillissement cutané. Effet "peau neuve", traits défatigués.',
    notes:
      '100% naturel. 25% bio. Certifiée bio ECOCERT. Texture douce enveloppante, parfum naturel léger (100% origine naturelle). Pour tous types de peau. Vegan. Actifs : acide hyaluronique, exopolysaccharide (stimule la physiologie nocturne), dérivés de sucres naturels, aloe vera bio.',
    inci: 'AQUA/WATER, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, OLUS OIL, SQUALANE, CETEARYL ALCOHOL, HYDROGENATED CASTOR OIL, MYRISTYL ALCOHOL, XYLITYLGLUCOSIDE, CETEARYL GLUCOSIDE, GELIDIUM SESQUIPEDALE EXTRACT, ALOE BARBADENSIS LEAF JUICE POWDER, ANHYDROXYLITOL, XYLITOL, SODIUM HYALURONATE, BISABOLOL, PARFUM, LINOLEIC ACID, SODIUM LEVULINATE, MYRISTYL GLUCOSIDE, PROPANEDIOL, XANTHAN GUM, GLYCERYL CAPRYLATE, SODIUM ANISATE, TOCOPHEROL, POLYGLYCERYL-4 CAPRATE, OLEIC ACID, CITRIC ACID, PALMITIC ACID, STEARIC ACID, PHENETHYL ALCOHOL, SACCHARIDE ISOMERATE, LINOLENIC ACID',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'La crème de Biarritz visage',
    brand: 'Laboratoires de Biarritz',
    kind: 'skincare',
    unit: 'jar',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_VISAGE,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1900,
    description:
      'Crème hydratante 24h Ocean Therapy pour visage, cou et décolleté. Acide hyaluronique (biofermentation, poids moléculaire moyen) + Alga-Gorria® breveté. Hydratation en surface et profondeur, repulpe, illumine, prévient les premières rides.',
    notes:
      '100% naturel. 26,8% bio. Certifiée bio ECOCERT. Texture riche et fondante légère, parfum frais naturel. Pour tous types de peau. Vegan. Disponible en 2 formats (15 ml et 50 ml).',
    inci: 'AQUA/WATER, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, OLUS OIL, SIMMONDSIA CHINENSIS SEED OIL, SQUALANE, CETEARYL OLIVATE, COCONUT ALKANES, SORBITAN OLIVATE, LAUROYL LYSINE, MYRISTYL MYRISTATE, HYDROGENATED CASTOR OIL, XYLITYLGLUCOSIDE, GELIDIUM SESQUIPEDALE EXTRACT, ALOE BARBADENSIS LEAF JUICE POWDER, SODIUM HYALURONATE, ANHYDROXYLITOL, XYLITOL, PARFUM, LINOLEIC ACID, OLEIC ACID, PALMITIC ACID, STEARIC ACID, LINOLENIC ACID, SODIUM LEVULINATE, PROPANEDIOL, TOCOPHEROL, COCO-CAPRYLATE/CAPRATE, XANTHAN GUM, SODIUM ANISATE, POLYGLYCERYL-4 CAPRATE, CITRIC ACID, ETHYL LAUROYL ARGINATE HCL, SODIUM PHYTATE, VANILLIN, BETA-CARYOPHYLLENE',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'Crème de nuit anti-taches',
    brand: 'Laboratoires de Biarritz',
    kind: 'skincare',
    unit: 'jar',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_NUIT_ANTI_TACHES,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2900,
    description:
      "Crème de nuit anti-taches avec trio d'algues exclusif dont Alga-Biotic® (brevet déposé Lab. Biarritz). Corrige les taches pigmentaires, stimule le renouvellement cellulaire (PHA exfoliant doux), action anti-récidive prouvée. Effet peau neuve dès la première nuit.",
    notes:
      '100% naturel. 21,9% bio. Certifiée bio. Texture onctueuse, parfum doux naturel. Vegan. Dès 28 nuits : taches visiblement estompées. Actifs : Alga-Biotic (module mélanogenèse + action prébiotique microbiome), Algue Iridescente (bloque chaîne pigmentaire), Algue Rouge (rééducation mélanocytes), PHA. Sur visage, cou, décolleté, mains.',
    inci: 'AQUA/WATER, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLUCONOLACTONE, GLYCERIN, BUTYROSPERMUM PARKII BUTTER, COCO-CAPRYLATE/CAPRATE, BEHENYL ALCOHOL, HELIANTHUS ANNUUS SEED OIL, MICROCRYSTALLINE CELLULOSE, C12-16 ALCOHOLS, ALOE BARBADENSIS LEAF JUICE POWDER, CYSTOSEIRA ABIES-MARINA EXTRACT, CYSTOSEIRA TAMARISCIFOLIA EXTRACT, PALMARIA PALMATA EXTRACT, PALMITIC ACID, HYDROGENATED LECITHIN, PARFUM, CITRIC ACID, XANTHAN GUM, SODIUM HYDROXIDE, SODIUM LEVULINATE, SODIUM CITRATE, MALTODEXTRIN, TOCOPHEROL, SODIUM ANISATE, PENTYLENE GLYCOL',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'Sérum repulpant',
    brand: 'Laboratoires de Biarritz',
    kind: 'skincare',
    unit: 'dropper',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_SERUM_REPULPANT,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2700,
    description:
      "Sérum hydratant intense 24h avec Alga-Gorria® breveté. Protège contre les agressions quotidiennes (lumière bleue, pollution, stress). Repulpe la peau, booste l'action des soins hydratants appliqués en complément. Traits défatigués.",
    notes:
      '100% naturel. 43,8% bio. Certifié bio. Pour visage et cou. Vegan. Actifs : acide hyaluronique, Ectoin (acide aminé, anti-pollution/lumière bleue), exopolysaccharide (tenseur), polysaccharide Pullulan (hydratant restructurant), Alteromonas Ferment Extract.',
    inci: 'AQUA/WATER, GLYCERIN, SQUALANE, OLUS OIL, XYLITYLGLUCOSIDE, GLYCERYL STEARATE CITRATE, ECTOIN, HYDROLYZED GLYCOSAMINOGLYCANS, GELIDIUM SESQUIPEDALE EXTRACT, ALOE BARBADENSIS LEAF JUICE POWDER, ANHYDROXYLITOL, XYLITOL, SODIUM HYALURONATE, ALTEROMONAS FERMENT EXTRACT, SODIUM LEVULINATE, POLYGLYCERYL-3 STEARATE, GLYCERYL CAPRYLATE, PROPANEDIOL, PARFUM, LINOLEIC ACID, HYDROGENATED LECITHIN, BIOSACCHARIDE GUM-1, SODIUM ANISATE, TOCOPHEROL, POLYGLYCERYL-4 CAPRATE, LYSOLECITHIN, SCLEROTIUM GUM, CITRIC ACID, SODIUM PHYTATE, OLEIC ACID, PULLULAN, XANTHAN GUM, PALMITIC ACID, PHENETHYL ALCOHOL, STEARIC ACID, SILICA, LINOLENIC ACID',
    url: 'https://www.laboratoires-biarritz.com',
  },
  {
    name: 'Sérum anti-taches',
    brand: 'Laboratoires de Biarritz',
    kind: 'skincare',
    unit: 'dropper',
    slug: LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_SERUM_ANTI_TACHES,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3800,
    description:
      "Sérum anti-taches avec trio d'algues exclusif dont Alga-Biotic® (brevet déposé Lab. Biarritz) + Vitamine C (Ascorbyl Glucoside). Réduit taille et intensité des taches dès 14 jours, illumine le teint, action anti-récidive prouvée. Rééducation des mélanocytes.",
    notes:
      '100% naturel. 28% bio. Certifié bio. Vegan. Actifs : Alga-Biotic (module mélanogenèse + prébiotique microbiome), Algue Iridescente (bloque chaîne pigmentaire), Algue Rouge (rééducation mémoire mélanocytes), Vitamine C (éclat). Sur visage, cou, décolleté, mains, cernes hyperpigmentés.',
    inci: 'AQUA/WATER, GLYCERIN, HELIANTHUS ANNUUS SEED OIL, OLUS OIL, TRIETHYL CITRATE, PENTYLENE GLYCOL, ASCORBYL GLUCOSIDE, ARGININE, ALOE BARBADENSIS LEAF JUICE POWDER, CYSTOSEIRA ABIES-MARINA EXTRACT, CYSTOSEIRA TAMARISCIFOLIA EXTRACT, PALMARIA PALMATA EXTRACT, PARFUM, SODIUM LEVULINATE, MICROCRYSTALLINE CELLULOSE, XANTHAN GUM, MALTODEXTRIN, LYSOLECITHIN, SODIUM ANISATE, SCLEROTIUM GUM, SODIUM PHYTATE, TOCOPHEROL, CITRIC ACID, SODIUM CITRATE',
    url: 'https://www.laboratoires-biarritz.com',
  },
]
