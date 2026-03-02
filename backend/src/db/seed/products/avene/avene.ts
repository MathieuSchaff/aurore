export const AVENE_PRODUCT_SLUGS = {
  // --- 1. HYGIÈNE & EAU THERMALE ---
  AVENE_THERMAL_SPRING_WATER: 'avene-eau-thermale',
  AVENE_CLEANANCE_GEL_NETTOYANT: 'avene-cleanance-gel-nettoyant',
  AVENE_XERACALM_HUILE_LAVANTE: 'avene-xeracalm-huile-lavante',

  // --- 2. SOINS APAISANTS & RÉPARATEURS ---
  AVENE_CICALFATE_CREME_REPARATRICE: 'avene-cicalfate-creme-reparatrice',
  AVENE_TOLERANCE_CONTROL_CREME: 'avene-tolerance-control-creme',
  AVENE_TOLERANCE_CONTROL_BAUME: 'avene-tolerance-control-baume',
  AVENE_ROSAMED: 'avene-antirougeurs-rosamed',

  // --- 3. HYDRATATION (HYDRANCE & XERACALM) ---
  AVENE_HYDRANCE_BOOST_SERUM: 'avene-hydrance-boost-serum-hydratant',
  AVENE_HYDRANCE_RICHE_CREME_HYDRATANTE: 'avene-hydrance-riche-creme-hydratante',
  AVENE_HYDRANCE_LIGHT_CREME_HYDRATANTE: 'avene-hydrance-light-creme-hydratante',
  AVENE_XERACALM_NUTRITION_BAUME: 'avene-xeracalm-nutrition-baume-hydratant',
  AVENE_XERACALM_AD_CREME_RELIPIDANTE: 'avene-xeracalm-ad-creme-relipidante',
  AVENE_XERACALM_AD_BAUME: 'avene-xeracalm-ad-baume-relipidant',

  // --- 4. IMPERFECTIONS (CLEANANCE) ---
  AVENE_CLEANANCE_COMEDOMED_SERUM_INTENSIF: 'avene-cleanance-comedomed-serum-intensif',
  AVENE_CLEANANCE_COMEDOMED_SOIN_INTENSIF_ANTI_IMPERFECTION:
    'avene-cleanance-comedomed-soin-anti-imperfection',

  // --- 5. ANTI-ÂGE & ÉCLAT ---
  AVENE_HYALURON_ACTIV_B3_SERUM: 'avene-hyaluron-activ-b3-serum-concentre',
  AVENE_HYALURON_ACTIV_B3_CREME_REGENERATION: 'avene-hyaluron-activ-b3-creme-regeneration',
  AVENE_VITAMIN_ACTIV_C_SERUM_ECLAT: 'avene-vitamin-activ-c-serum-eclat',

  // --- 6. GAMME PROCEDURE (NOUVEAUTÉS 2025-2026) ---
  AVENE_HYALURON_ACTIV_PROCEDURE_SERUM_TENSEUR: 'avene-hyaluron-activ-procedure-serum-tenseur',
  AVENE_HYALURON_ACTIV_PROCEDURE_CREME_MICRO_LIFT_YEUX_LEVRES:
    'avene-hyaluron-activ-procedure-creme-micro-lift-yeux-levres',
  AVENE_HYALURON_ACTIV_PROCEDURE_CREME_LIFTING_0_1_RETINAL:
    'avene-hyaluron-activ-procedure-creme-lifting-0-1-retinal',

  // --- 7. PROTECTION SOLAIRE ---
  AVENE_SUNSIMED_KA_SPF50: 'avene-solaire-sunsimed-ka-spf50-plus',
  AVENE_CLEANANCE_SPF50: 'avene-solaire-cleanance-solaire-spf50-plus',
  AVENE_TEINTEE_ANTI_LUMIERE_BLEUE_SPF50:
    'avene-solaires-creme-teinte-anti-lumiere-bleue-spf50-plus',
  AVENE_ULTRA_FLUID_INVISIBLE_SPF50: 'avene-ultra-fluid-invisible-spf50-plus',
  AVENE_ULTRA_FLUID_OIL_CONTROL_SPF50: 'avene-ultra-fluid-oil-control-spf50',
  AVENE_ULTRA_FLUID_ECLAT_RADIANCE_SPF50: 'avene-ultra-fluid-eclat-radiance-spf50-plus',
  AVENE_ULTRA_FLUID_PERFECTEUR_SPF50: 'avene-ultra-fluid-perfecteur-spf50-plus',
  AVENE_FLUIDE_ANTI_IMPERFECTION_SPF50: 'avene-fluide-anti-imperfection-spf50',
}
export const AVENE_PRODUCT_DATA = [
  {
    name: 'Hydrance BOOST Sérum concentré hydratant',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'dropper',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYDRANCE_BOOST_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2340,
    description:
      'Véritable booster intense d’hydratation du visage qui rétablit l’équilibre des peaux sensibles déshydratées pendant 48H.',
    notes:
      '96% d’ingrédients d’origine naturelle. Enrichi en Acide Hyaluronique et Vitamine B3 (Niacinamide). Texture gel d’eau ultra-légère et fraîche. +132% d’hydratation immédiate.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). PROPANEDIOL. GLYCERIN. PENTYLENE GLYCOL. DIGLYCERIN. 1,2-HEXANEDIOL. NIACINAMIDE. SODIUM HYALURONATE. BETAINE. CITRIC ACID. FRAGRANCE (PARFUM). PCA. POLYGLYCERYL-4 CAPRATE. SCLEROTIUM GUM. SODIUM CITRATE. SODIUM HYDROXIDE. WATER (AQUA)',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Tolérance CONTROL Baume apaisant restaurateur',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'tube',
    slug: AVENE_PRODUCT_SLUGS.AVENE_TOLERANCE_CONTROL_BAUME,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1765,
    description:
      'Baume ultra-calmant riche pour peaux hypersensibles, réactives, intolérantes ou allergiques. Calme la peau en 30 secondes.',
    notes:
      'Texture riche pour peaux sèches. Actif postbiotique D-Sensinose™. Sans parfum ni conservateur. Packaging Cosmétique Stérile®. Utilisable dès 2 ans.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). CAPRYLIC/CAPRIC TRIGLYCERIDE. GLYCERIN. CETEARYL ALCOHOL. BUTYROSPERMUM PARKII (SHEA) BUTTER (BUTYROSPERMUM PARKII BUTTER). SQUALANE. BEESWAX (CERA ALBA). CETEARYL GLUCOSIDE. CETYL ESTERS. AQUAPHILUS DOLOMIAE EXTRACT FILTRATE. ARGININE. CITRIC ACID. TROMETHAMINE. WATER (AQUA). XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Hyaluron Activ B3 Sérum Concentré Repulpant',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'dropper',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYALURON_ACTIV_B3_SERUM,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2589,
    description:
      'Sérum hautement concentré en acide hyaluronique pur (1,5%) et niacinamide (6%) pour agir sur la cause du vieillissement et raffermir la peau.',
    notes:
      'Formule minimaliste avec seulement 8 ingrédients. 94% d’origine naturelle. Effet tenseur immédiat et peau repulpée dès 4h. Sans parfum.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). NIACINAMIDE. GLYCERIN. PENTYLENE GLYCOL. SODIUM HYALURONATE. ADENOSINE. CITRIC ACID. SODIUM BENZOATE.',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Cleanance Comedomed+ Soin Intensif Anti-Imperfections',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_CLEANANCE_COMEDOMED_SOIN_INTENSIF_ANTI_IMPERFECTION,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1450,
    description:
      'Soin intensif nouvelle génération ciblant les boutons, points noirs et marques dès la racine avec une action anti-récidive 1 an.',
    notes:
      'Contient 25% de Comedoclastin™ et 4% de Niacinamide. Efficacité visible dès 5h. Texture gel-crème légère, fini non gras. Utilisable dès 9 ans.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). ISOPROPYL ALCOHOL. PEG-6. GLYCERIN. NIACINAMIDE. SILYBUM MARIANUM FRUIT EXTRACT. SILICA. POLYACRYLATE-13. POLYISOBUTENE. POLYSORBATE 20. SORBITAN ISOSTEARATE. WATER (AQUA)',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Cleanance Comedomed Sérum Intensif',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'bottle',
    slug: AVENE_PRODUCT_SLUGS.AVENE_CLEANANCE_COMEDOMED_SERUM_INTENSIF,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2999,
    description:
      "Sérum intensif anti-imperfections et anti-marques cicatricielles pour peaux à tendance acnéique. Formulé avec 30% d'actifs dermatologiques.",
    notes:
      "Idéal pour adultes et adolescents. Odeur d'alcool due à l'extraction de la Comedoclastin™ qui s'estompe rapidement.",
    inci: 'AQUA/WATER, ISOPROPYL ALCOHOL, PEG-6, GLYCERIN, GLYCOLIC ACID, SILYBUM MARIANUM FRUIT EXTRACT, ASCORBYL GLUCOSIDE, ACACIA SENEGAL GUM, BAKUCHIOL, BETA-CARYOPHYLLENE, CITRIC ACID, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, POLYSORBATE 60, SODIUM CITRATE, SODIUM HYDROXIDE, SORBITAN ISOSTEARATE, TOCOPHEROL, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Ultra Fluid Invisible SPF50',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'bottle',
    slug: AVENE_PRODUCT_SLUGS.AVENE_ULTRA_FLUID_INVISIBLE_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1389,
    description:
      'Haute protection solaire quotidienne à la texture ultra fluide, aussi légère que de l’eau. Fini 100% invisible et non collant.',
    notes:
      'Technologie [waterlike]. Protège contre les UVA, UVB et la lumière bleue (TriasorB). Sans parfum. Excellente base de maquillage.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). C12-15 ALKYL BENZOATE. DICAPRYLYL CARBONATE. DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE. WATER (AQUA). DIISOPROPYL ADIPATE. ETHYLHEXYL TRIAZONE. ORYZA SATIVA (RICE) STARCH (ORYZA SATIVA STARCH). PHENYLENE BIS-DIPHENYLTRIAZINE. BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE. POTASSIUM CETYL PHOSPHATE. C9-12 ALKANE. LAURYL GLUCOSIDE. POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE. GLYCERIN. TAPIOCA STARCH. TRIMETHYLPENTANEDIOL/ADIPIC ACID/GLYCERIN CROSSPOLYMER. BENZOIC ACID. CAPRYLIC/CAPRIC TRIGLYCERIDE. CAPRYLYL GLYCOL. CITRIC ACID. COCO-CAPRYLATE/CAPRATE. GLYCERYL LAURATE. GLYCINE SOJA (SOYBEAN) OIL (GLYCINE SOJA OIL). LENS ESCULENTA (LENTIL) SEED EXTRACT (LENS ESCULENTA SEED EXTRACT). PENTYLENE GLYCOL. PPG-1-PEG-9 LAURYL GLYCOL ETHER. RED 33 (CI 17200). SODIUM BENZOATE. SODIUM PHYTATE. TOCOPHEROL. TOCOPHERYL GLUCOSIDE. XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'XeraCalm Nutrition Baume Hydratant',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_XERACALM_NUTRITION_BAUME,
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 1990,
    description:
      'Soin quotidien haute tolérance pour peaux sèches à très sèches de toute la famille. Nourrit, hydrate et renforce la barrière cutanée.',
    notes:
      '95% d’ingrédients d’origine naturelle. Formule enrichie en huile de Chardon-Marie et Niacinamide.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). GLYCERIN. CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL (CARTHAMUS TINCTORIUS SEED OIL). PENTAERYTHRITYL TETRACAPRYLATE/TETRACAPRATE. POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE. ISOPROPYL PALMITATE. NIACINAMIDE. BEHENYL ALCOHOL. BENZOIC ACID. CAPRYLYL GLYCOL. HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL (HELIANTHUS ANNUUS SEED OIL). HYDROXYETHYLCELLULOSE. LAURYL GLUCOSIDE. SILYBUM MARIANUM SEED OIL. SODIUM CITRATE. SODIUM LAURYL GLUCOSE CARBOXYLATE. SODIUM STEAROYL GLUTAMATE. SORBIC ACID. TOCOPHEROL. WATER (AQUA). XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Hyaluron Activ Procedure Crème Micro-Lift Yeux & Lèvres',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'tube',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYALURON_ACTIV_PROCEDURE_CREME_MICRO_LIFT_YEUX_LEVRES,
    totalAmount: 15,
    amountUnit: 'ml',
    priceCents: 3099,
    description:
      'Soin anti-âge spécifique pour le contour des yeux et des lèvres qui cible et réduit les rides et les ridules.',
    notes: 'Contient 0.05% de Rétinal. Action micro-lift ciblée.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). CAPRYLIC/CAPRIC TRIGLYCERIDE. GLYCERIN. SQUALANE. BUTYROSPERMUM PARKII (SHEA) BUTTER (BUTYROSPERMUM PARKII BUTTER). CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL (CARTHAMUS TINCTORIUS SEED OIL). PENTAERYTHRITYL TETRACAPRYLATE/TETRACAPRATE. CETEARYL ALCOHOL. BEHENYL ALCOHOL. NIACINAMIDE. C20-22 ALKYL PHOSPHATE. C20-22 ALCOHOLS. ACACIA SENEGAL GUM. CETEARYL GLUCOSIDE. HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL (HELIANTHUS ANNUUS SEED OIL). RETINAL. SODIUM BENZOATE. SODIUM HYALURONATE. SODIUM HYDROXIDE. TOCOPHEROL. TOCOPHERYL GLUCOSIDE. XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Spray d’Eau Thermale Avène',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'aerosol',
    slug: AVENE_PRODUCT_SLUGS.AVENE_THERMAL_SPRING_WATER,
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 769,
    description:
      "Spray apaisant, fortifiant et rééquilibrant pour un confort immédiat. Diffuse une brume qui soulage les sensations d'inconfort sans dessécher la peau.",
    notes:
      'Convient à toute la famille (dès 0 mois). Idéal pour irritations, post-acte, rougeurs ou simplement pour se rafraîchir. Diminue la sensibilité cutanée de 64% dès la première semaine.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). NITROGEN',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Hyaluron Activ Procedure Crème Lifting 0.1% Rétinal',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYALURON_ACTIV_PROCEDURE_CREME_LIFTING_0_1_RETINAL,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 4317,
    description:
      "Crème anti-rides et liftante haute performance. Améliore l'éclat de la peau et réduit les rides grâce à une concentration de 0.1% en rétinal.",
    notes:
      'Texture crème de couleur jaune (ne colore pas la peau). Très appréciée pour sa tolérance sur peaux sensibles malgré la puissance du rétinal.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). CAPRYLIC/CAPRIC TRIGLYCERIDE. GLYCERIN. SQUALANE. BUTYROSPERMUM PARKII (SHEA) BUTTER (BUTYROSPERMUM PARKII BUTTER). CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL (CARTHAMUS TINCTORIUS SEED OIL). PENTAERYTHRITYL TETRACAPRYLATE/TETRACAPRATE. CETEARYL ALCOHOL. BEHENYL ALCOHOL. NIACINAMIDE. C20-22 ALKYL PHOSPHATE. C20-22 ALCOHOLS. ACACIA SENEGAL GUM. ADENOSINE. CETEARYL GLUCOSIDE. HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL (HELIANTHUS ANNUUS SEED OIL). RETINAL. SODIUM BENZOATE. SODIUM HYALURONATE. SODIUM HYDROXIDE. TERMINALIA CHEBULA FRUIT EXTRACT. TOCOPHEROL. TOCOPHERYL GLUCOSIDE. XANTHAN GUM',
    url: 'https://www.atida.fr',
  },
  {
    name: 'Hyaluron Activ Procedure Sérum Tenseur',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'dropper',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYALURON_ACTIV_PROCEDURE_SERUM_TENSEUR,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 4499,
    description:
      "Sérum concentré à effet tenseur immédiat formulé avec une solution de 10% d'Hexapeptide.",
    notes: 'Innovation de la gamme Procedure pour un effet lifting renforcé.',
    inci: '', // Non spécifié dans l'extrait
    url: 'https://www.atida.fr',
  },
  {
    name: 'XeraCalm A.D Crème Relipidante',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_XERACALM_AD_CREME_RELIPIDANTE,
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 2099,
    description:
      'Crème relipidante pour peaux sèches sujettes aux démangeaisons et irritations dues au dessèchement cutané.',
    notes: 'Diminue les démangeaisons. Nourrit en profondeur. Renforce le film hydrolipidique.',
    inci: 'AQUA/WATER, GLYCERIN, MINERAL OIL (PARAFFINUM LIQUIDUM), CETEARYL ALCOHOL, OENOTHERA BIENNIS (EVENING PRIMROSE) OIL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CETEARYL GLUCOSIDE, AQUAPHILUS DOLOMIAE EXTRACT, ARGININE, CARBOMER, EVENING PRIMROSE OIL/PALM OIL AMINOPROPANEDIOL ESTERS, GLYCINE, SODIUM HYDROXIDE, TOCOPHEROL',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Cleanance Gel Nettoyant',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_CLEANANCE_GEL_NETTOYANT,
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 991,
    description:
      "Gel nettoyant pour peaux grasses à imperfections, purifie et matifie la peau sans l'irriter.",
    notes: "Pour visage et corps. Réduit l'excès de sébum. Lutte contre boutons et points noirs.",
    inci: 'AQUA/WATER, ZINC COCETH SULFATE, LAURYL BETAINE, DECYL GLUCOSIDE, CETEARETH-60 MYRISTYL GLYCOL, PEG-7 GLYCERYL COCOATE, POLYSORBATE 20, CITRIC ACID, FRAGRANCE (PARFUM), GREEN 5 (CI 61570), ISOPROPYL ALCOHOL, PEG-40 HYDROGENATED CASTOR OIL, PEG-6, PPG-26-BUTETH-26, SILYBUM MARIANUM FRUIT EXTRACT, SODIUM BENZOATE, SODIUM CHLORIDE, SODIUM HYDROXIDE, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, YELLOW 5 (CI 19140), ZINC GLUCONATE',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Hydrance Riche Crème Hydratante',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'tube',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYDRANCE_RICHE_CREME_HYDRATANTE,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1448,
    description:
      'Crème hydratante riche pour peaux sensibles sèches à très sèches, offrant hydratation et apaisement.',
    notes: 'Texture onctueuse. Rend la peau souple et lumineuse.',
    inci: 'AQUA/WATER, MINERAL OIL (PARAFFINUM LIQUIDUM), GLYCERIN, ISOHEXADECANE, DIMETHICONE, CETEARYL ALCOHOL, CARTHAMUS TINCTORIUS SEED OIL, ISOCETYL STEAROYL STEARATE, TRIETHYLHEXANOIN, GLYCERYL STEARATE, PEG-100 STEARATE, 1-2 HEXANEDIOL, BUTYROSPERMUM PARKII (SHEA) BUTTER, CETEARYL GLUCOSIDE, BENZOIC ACID, BETA SITOSTEROL, BHT, DISODIUM EDTA, FRAGRANCE (PARFUM), POLYACRYLATE-13, POLYISOBUTENE, POLYSORBATE 20, SODIUM HYDROXIDE, SORBITAN ISOSTEARATE, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Hydrance Light Crème Hydratante',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'tube',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYDRANCE_LIGHT_CREME_HYDRATANTE,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1449,
    description:
      'Crème hydratante légère pour peaux sensibles normales à mixtes, offrant hydratation durable et sensation de confort.',
    notes: 'Texture légère non collante. Disponible en version teintée avec SPF 30.',
    inci: 'AQUA/WATER, GLYCERIN, PROPYLENE GLYCOL DICAPRYLATE/DICAPRATE, C14-22 ALCOHOLS, DIMETHICONE, ISOCETYL STEAROYL STEARATE, TRIETHYLHEXANOIN, 1,2-HEXANEDIOL, MICROCRYSTALLINE CELLULOSE, POTASSIUM CETYL PHOSPHATE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, BENZOIC ACID, C12-20 ALKYL GLUCOSIDE, FRAGRANCE (PARFUM), HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, PHYTOSTEROLS, POLYSORBATE 60, SCLEROTIUM GUM, SODIUM HYDROXIDE, SORBITAN ISOSTEARATE, SQUALANE',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Cicalfate + Crème Réparatrice Protectrice',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'tube',
    slug: AVENE_PRODUCT_SLUGS.AVENE_CICALFATE_CREME_REPARATRICE,
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1199,
    description:
      'Crème réparatrice pour peaux irritées et abîmées, accélère la cicatrisation et protège contre les bactéries.',
    notes: 'Non comédogène. Convient à nourrissons, enfants, adultes. Texture onctueuse.',
    inci: 'AQUA/WATER, CAPRYLIC/CAPRIC TRIGLYCERIDE, MINERAL OIL (PARAFFINUM LIQUIDUM), GLYCERIN, HYDROGENATED VEGETABLE OIL, ZINC OXIDE, PROPYLENE GLYCOL, POLYGLYCERYL-2 SESQUIISOSTEARATE, PEG-22/DODECYL GLYCOL COPOLYMER, ALUMINIUM STEARATE, AQUAPHILUS DOLOMIAE FERMENT FILTRATE, ARGININE, BEESWAX (CERA ALBA), COPPER SULFATE, MAGNESIUM STEARATE, MAGNESIUM SULFATE, MICROCRYSTALLINE WAX (CERA MICROCRISTALLINA), TROMETHAMINE, ZINC SULFATE',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Hyaluron Activ B3 Crème Régénération Cellulaire',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'jar',
    slug: AVENE_PRODUCT_SLUGS.AVENE_HYALURON_ACTIV_B3_CREME_REGENERATION,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 3226,
    description:
      'Crème régénérante pour peaux vieillissantes, repulpe, lisse et corrige les rides.',
    notes: '0.2% acide hyaluronique. 6% niacinamide. 92% ingrédients naturels. Texture veloutée.',
    inci: 'AQUA/WATER, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLYCERIN, NIACINAMIDE, CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL, BUTYROSPERMUM PARKII (SHEA) BUTTER, GLYCOL PALMITATE, ARACHIDYL ALCOHOL, CETEARYL ALCOHOL, CELLULOSE, GLYCERYL STEARATE, SODIUM HYALURONATE, ADENOSINE, ARACHIDYL GLUCOSIDE, BEHENYL ALCOHOL, CAPRYLYL GLYCOL, CETEARYL GLUCOSIDE, CITRIC ACID, DIMETHYL PHENETHYL ACETATE, FRAGRANCE (PARFUM), GERANYL ACETATE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, SODIUM BENZOATE, TOCOPHEROL, TOCOPHERYL GLUCOSIDE, TRIMETHYLCYCLOPENTENYL METHYLISOPENTENOL, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Xeracalm Ad Huile Lavante Relipidante',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_XERACALM_HUILE_LAVANTE,
    totalAmount: 750,
    amountUnit: 'ml',
    priceCents: 1800,
    description:
      "Huile lavante relipidante pour peaux très sèches sujettes à l'eczéma atopique et démangeaisons, nettoie en douceur et apaise.",
    notes:
      'Sans savon, sans parfum. pH physiologique. Respecte le microbiome. 86% ingrédients naturels.',
    inci: 'AQUA/WATER, GLYCERIN, HYDROGENATED STARCH HYDROLYSATE, DISODIUM COCOAMPHODIACETATE, DECYL GLUCOSIDE, POLYSORBATE 20, SODIUM CHLORIDE, CETEARETH-60 MYRISTYL GLYCOL, AQUAPHILUS DOLOMIAE EXTRACT, ARGININE, CITRIC ACID, COCO-GLUCOSIDE, EVENING PRIMROSE OIL/PALM OIL AMINOPROPANEDIOL ESTERS, GLYCERYL OLEATE, GLYCINE, HYDROGENATED VEGETABLE GLYCERIDES CITRATE, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, SODIUM BENZOATE, TOCOPHEROL, TRISODIUM ETHYLENEDIAMINE DISUCCINATE',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Vitamin Activ C Sérum Concentré Éclat',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'dropper',
    slug: AVENE_PRODUCT_SLUGS.AVENE_VITAMIN_ACTIV_C_SERUM_ECLAT,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3321,
    description:
      'Sérum concentré pour illuminer le teint, réduire les tâches brunes et lisser les rides.',
    notes: 'Texture pénétrante non grasse. Convient à tous types de peaux. Parfum subtil.',
    inci: 'PENTYLENE GLYCOL, CITRIC ACID, ASCORBYL GLUCOSIDE, SODIUM CITRATE, GLYCERYL BEHENATE, GLYCERYL DIBEHENATE, TRIBEHENIN, SODIUM HYALURONATE, PENTAERYTHRITYL TETRACAPRYLATE/TETRACAPRATE, AQUA/WATER, GLYCERIN, 1,2-HEXANEDIOL, NIACINAMIDE, CAPRYLIC/CAPRIC TRIGLYCERIDE, BUTYLENE GLYCOL, SODIUM DILAURAMIDOGLUTAMIDE, SODIUM HYDROXIDE, ACACIA SENEGAL GUM, XANTHAN GUM, BAKUCHIOL, TOCOPHERYL GLUCOSIDE, C9-12 ALKANE, COCO-CAPRYLATE/CAPRATE, PARFUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Solaire Cleanance Solaire SPF50+',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_CLEANANCE_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1299,
    description:
      'Protection solaire SPF50+ matifiante pour peaux grasses/acnéiques. Contrôle sébum, anti-imperfections, tolérance élevée.',
    notes:
      'Filtres chimiques + minéraux (Tinosorb M, Mexoryl SX/XL, Uvinul A Plus). Eau thermale apaisante, texture fluide non grasse. Sans parfum fort.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), C12-15 ALKYL BENZOATE, METHYLENE BIS-BENZOTRIAZOLYL TETRAMETHYLBUTYLPHENOL [NANO], CETEARYL ISONONANOATE, WATER (AQUA), DIISOPROPYL ADIPATE, ISODECYL NEOPENTANOATE, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, DIETHYLHEXYL BUTAMIDO TRIAZONE, POLYMETHYL METHACRYLATE, BUTYL METHOXYDIBENZOYLMETHANE, POTASSIUM CETYL PHOSPHATE, DECYL GLUCOSIDE, GLYCERYL LAURATE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, BENZOIC ACID, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, DISODIUM EDTA, FRAGRANCE (PARFUM), GLYCERYL BEHENATE, GLYCERYL DIBEHENATE, HYDROGENATED PALM GLYCERIDES, HYDROGENATED PALM KERNEL GLYCERIDES, PROPYLENE GLYCOL, SILICA, SODIUM HYDROXIDE, TOCOPHERYL GLUCOSIDE, TRIBEHENIN, XANTHAN GUM, ZINC GLUCONATE',
    url: 'https://www.eau-thermale-avene.fr',
  },

  {
    name: 'Fluide Anti-Imperfection SPF50',
    brand: 'Avène',
    slug: AVENE_PRODUCT_SLUGS.AVENE_FLUIDE_ANTI_IMPERFECTION_SPF50,
    kind: 'skincare',
    unit: 'tube',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 2400,
    description:
      'Fluide solaire SPF50+ léger pour peaux sensibles et à imperfections. Protège contre UVB/UVA et lumière bleue (TriAsorB™), régule le sébum, prévient les marques post-acné et corrige les imperfections.',
    notes:
      'Texture fluide non grasse, matifiante. Enrichi en gluconate de zinc anti-imperfections et eau thermale apaisante. Sans parfum.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), C12-15 ALKYL BENZOATE, DICAPRYLYL CARBONATE, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, WATER (AQUA), DIISOPROPYL ADIPATE, ETHYLHEXYL TRIAZONE, ORYZA SATIVA (RICE) STARCH (ORYZA SATIVA STARCH), PHENYLENE BIS-DIPHENYLTRIAZINE, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, POTASSIUM CETYL PHOSPHATE, C9-12 ALKANE, LAURYL GLUCOSIDE, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, GLYCERIN, TAPIOCA STARCH, TRIMETHYLPENTANEDIOL/ADIPIC ACID/GLYCERIN CROSSPOLYMER, BENZOIC ACID, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, CITRIC ACID, COCO-CAPRYLATE/CAPRATE, GLYCERYL LAURATE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL (HELIANTHUS ANNUUS SEED OIL), LENS ESCULENTA (LENTIL) SEED EXTRACT (LENS ESCULENTA SEED EXTRACT), PENTYLENE GLYCOL, PPG-1-PEG-9 LAURYL GLYCOL ETHER, RED 33 (CI 17200), SODIUM BENZOATE, SODIUM PHYTATE, TOCOPHEROL, TOCOPHERYL GLUCOSIDE, XANTHAN GUM, ZINC GLUCONATE',
    url: 'https://www.avene.fr',
  },

  {
    name: 'SunsiMed KA SPF50+',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_SUNSIMED_KA_SPF50,
    totalAmount: 80,
    amountUnit: 'ml',
    priceCents: 1799,
    description:
      'Protection SPF50+ très haute pour peaux à kératoses actiniques. Prévention photo-vieillissement et cancers cutanés.',
    notes:
      'Filtres large spectre + eau thermale + anti-oxydants. Texture crème non grasse, tolérance optimale peaux fragiles/sensibles.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), C12-15 ALKYL BENZOATE, METHYLENE BIS-BENZOTRIAZOLYL TETRAMETHYLBUTYLPHENOL [NANO], WATER (AQUA), CETEARYL ISONONANOATE, DIISOPROPYL ADIPATE, ISODECYL NEOPENTANOATE, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, DIETHYLHEXYL BUTAMIDO TRIAZONE, ALUMINUM STARCH OCTENYLSUCCINATE, BUTYL METHOXYDIBENZOYLMETHANE, POTASSIUM CETYL PHOSPHATE, DECYL GLUCOSIDE, C10-18 TRIGLYCERIDES, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, BENZOIC ACID, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, DISODIUM EDTA, GLYCERYL BEHENATE, GLYCERYL DIBEHENATE, GLYCERYL LAURATE, PROPYLENE GLYCOL, SILICA (NANO), SODIUM HYDROXIDE, TOCOPHERYL GLUCOSIDE, TRIBEHENIN, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Crème Teintée Anti-Lumière Bleue SPF50+',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_TEINTEE_ANTI_LUMIERE_BLEUE_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1299,
    description:
      'Crème teintée SPF50+ anti-lumière bleue/UV. Protection large spectre + anti-pollution, unifie teint.',
    notes:
      'Filtres chimiques/minéraux + pigments naturels. Texture crème légère teintée, eau thermale apaisante. Peaux sensibles.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), C12-15 ALKYL BENZOATE, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, ETHYLHEXYL TRIAZONE, GLYCERIN, PHENYLENE BIS-DIPHENYLTRIAZINE, WATER (AQUA), BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, TITANIUM DIOXIDE (CI 77891), POTASSIUM CETYL PHOSPHATE, MYRISTYL ALCOHOL, ORYZA SATIVA (RICE) STARCH, STEARYL ALCOHOL, ISONONYL ISONONANOATE, VP/EICOSENE COPOLYMER, ALUMINA, BENZOIC ACID, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, FRAGRANCE (PARFUM), GLYCERYL BEHENATE, GLYCERYL DIBEHENATE, IRON OXIDES (CI 77492) (CI 77491) (CI 77499), ISOPROPYL MYRISTATE, ISOPROPYL TITANIUM TRIISOSTEARATE, MYRISTYL GLUCOSIDE, POLYHYDROXYSTEARIC ACID, PPG-1-PEG-9 LAURYL GLYCOL ETHER, PROPYLENE CARBONATE, STEARALKONIUM HECTORITE, TOCOPHERYL GLUCOSIDE, TRIBEHENIN, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Ultra Fluid Oil Control SPF50',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_ULTRA_FLUID_OIL_CONTROL_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1369,
    description:
      'Fluide matifiant SPF50 contrôle brillance/peaux grasses. Absorption rapide, fini sec.',
    notes:
      'Filtres chimiques + amidon riz/tapioca + lentille exfoliante douce. Texture ultra-fluide non grasse, peaux mixtes/grasses.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), C12-15 ALKYL BENZOATE, DICAPRYLYL CARBONATE, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, WATER (AQUA), DIISOPROPYL ADIPATE, ETHYLHEXYL TRIAZONE, ORYZA SATIVA (RICE) STARCH, PHENYLENE BIS-DIPHENYLTRIAZINE, TAPIOCA STARCH, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, POTASSIUM CETYL PHOSPHATE, C9-12 ALKANE, LAURYL GLUCOSIDE, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, GLYCERIN, TRIMETHYLPENTANEDIOL/ADIPIC ACID/GLYCERIN CROSSPOLYMER, BENZOIC ACID, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, CITRIC ACID, COCO-CAPRYLATE/CAPRATE, ETHYLHEXYLGLYCERIN, GLYCERYL LAURATE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, LENS ESCULENTA (LENTIL) SEED EXTRACT, PENTYLENE GLYCOL, PPG-1-PEG-9 LAURYL GLYCOL ETHER, RED 33 (CI 17200), SODIUM BENZOATE, SODIUM PHYTATE, TOCOPHEROL, TOCOPHERYL GLUCOSIDE, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Ultra Fluid Éclat Radiance SPF50+',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_ULTRA_FLUID_ECLAT_RADIANCE_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1399,
    description:
      'Fluide SPF50+ éclat radiance pour peaux normales/mixtes. Illumine, matifie, protection large spectre.',
    notes:
      'Filtres chimiques + amidon riz + lentille + huiles végétales. Texture fluide glowy non grasse.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), C12-15 ALKYL BENZOATE, DICAPRYLYL CARBONATE, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, WATER (AQUA), DIISOPROPYL ADIPATE, ETHYLHEXYL TRIAZONE, ORYZA SATIVA (RICE) STARCH, PHENYLENE BIS-DIPHENYLTRIAZINE, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, POTASSIUM CETYL PHOSPHATE, C9-12 ALKANE, LAURYL GLUCOSIDE, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, GLYCERIN, TAPIOCA STARCH, TRIMETHYLPENTANEDIOL/ADIPIC ACID/GLYCERIN CROSSPOLYMER, BENZOIC ACID, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, CITRIC ACID, COCO-CAPRYLATE/CAPRATE, GLYCERYL LAURATE, GLYCINE SOJA (SOYBEAN) OIL, LENS ESCULENTA (LENTIL) SEED EXTRACT, PENTYLENE GLYCOL, PPG-1-PEG-9 LAURYL GLYCOL ETHER, RED 33 (CI 17200), SODIUM BENZOATE, SODIUM PHYTATE, TOCOPHEROL, TOCOPHERYL GLUCOSIDE, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Ultra Fluid Perfecteur SPF50+',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_ULTRA_FLUID_PERFECTEUR_SPF50,
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1549,
    description:
      'Fluide perfecteur SPF50+ teint parfait. Uniformise, matifie, protège des UV/lumière bleue.',
    notes:
      'Filtres chimiques + pigments + amidon riz + lentille. Texture fluide teintée légère, fini velours.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), C12-15 ALKYL BENZOATE, DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE, WATER (AQUA), ETHYLHEXYL TRIAZONE, ORYZA SATIVA (RICE) STARCH, PHENYLENE BIS-DIPHENYLTRIAZINE, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, POTASSIUM CETYL PHOSPHATE, LAURYL GLUCOSIDE, POLYGLYCERYL-2 DIPOLYHYDROXYSTEARATE, GLYCERIN, TAPIOCA STARCH, TRIMETHYLPENTANEDIOL/ADIPIC ACID/GLYCERIN CROSSPOLYMER, ALUMINA, BENZOIC ACID, CAPRYLIC/CAPRIC TRIGLYCERIDE, CAPRYLYL GLYCOL, CITRIC ACID, ETHYLHEXYLGLYCERIN, GLYCERYL LAURATE, IRON OXIDES (CI 77492) (CI 77491) (CI 77499), ISONONYL ISONONANOATE, ISOPROPYL MYRISTATE, ISOPROPYL TITANIUM TRIISOSTEARATE, LENS ESCULENTA (LENTIL) SEED EXTRACT, PENTYLENE GLYCOL, POLYHYDROXYSTEARIC ACID, PPG-1-PEG-9 LAURYL GLYCOL ETHER, PROPYLENE CARBONATE, SODIUM BENZOATE, SODIUM PHYTATE, STEARALKONIUM HECTORITE, TITANIUM DIOXIDE (CI 77891), TOCOPHEROL, TOCOPHERYL GLUCOSIDE, XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Tolérance Control Crème',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_TOLERANCE_CONTROL_CREME,
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1400,
    description:
      'Crème apaisante restauratrice haute tolérance pour peaux hypersensibles, intolérantes ou allergiques.',
    notes: 'Occlusion 7/10. Texture crème légère. D-Sensinose™ postbiotique ultra-calmante.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA), CAPRYLIC/CAPRIC TRIGLYCERIDE, ETHYLHEXYL PALMITATE, GLYCERIN, CETEARYL ALCOHOL, SQUALANE, CETEARYL GLUCOSIDE, CETYL ESTERS, AQUAPHILUS DOLOMIAE EXTRACT FILTRATE, ARGININE, BEESWAX (CERA ALBA), CITRIC ACID, TROMETHAMINE, WATER (AQUA), XANTHAN GUM',
    url: 'https://www.eau-thermale-avene.fr',
  },
  {
    name: 'Xeracalm A.D Baume Relipidant',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_XERACALM_AD_BAUME,
    totalAmount: 400,
    amountUnit: 'ml',
    priceCents: 1800,
    description:
      'Baume relipidant très riche pour peaux très sèches à tendance atopique, dès la naissance.',
    notes:
      'Occlusion 9/10. Texture baume très riche. I-modulia® + Cer-Omega apaisent démangeaisons et relipident durablement.',
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). MINERAL OIL (PARAFFINUM LIQUIDUM). GLYCERIN. CAPRYLIC/CAPRIC TRIGLYCERIDE. PEG-12. OENOTHERA BIENNIS (EVENING PRIMROSE) OIL. GLYCERYL STEARATE. MYRETH-3 MYRISTATE. PEG-100 STEARATE. POLYACRYLATE-13. AQUAPHILUS DOLOMIAE EXTRACT. ARGININE. CITRIC ACID. EVENING PRIMROSE OIL/PALM OIL AMINOPROPANEDIOL ESTERS. GLYCINE. POLYISOBUTENE. POLYSORBATE 20. SORBITAN ISOSTEARATE. TOCOPHEROL. WATER (AQUA)',
    url: 'https://www.eau-thermale-avene.fr',
  },

  {
    name: 'Antirougeurs Rosamed',
    brand: 'Avène',
    kind: 'skincare',
    unit: 'pump',
    slug: AVENE_PRODUCT_SLUGS.AVENE_ROSAMED,
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1850,
    description:
      'Concentré spécifique pour les rougeurs installées. Co-développé avec des dermatologues.',
    notes: `98% d'origine naturelle. Sans parfum.`,
    inci: 'AVENE THERMAL SPRING WATER (AVENE AQUA). OCTYLDODECANOL. GLYCERIN. MYRISTYL ALCOHOL. PENTYLENE GLYCOL. SILYBUM MARIANUM FRUIT EXTRACT. POTASSIUM CETYL PHOSPHATE. MYRISTYL GLUCOSIDE. CITRIC ACID. DIUTAN GUM. GLYCERYL BEHENATE. GLYCERYL DIBEHENATE. HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL. SODIUM BENZOATE. TOCOPHEROL. TRIBEHENIN. XANTHAN GUM',
  },
]
