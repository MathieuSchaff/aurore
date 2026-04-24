import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const VT_SEED: UnifiedProductSeed[] = [
  {
    slug: 'vt-azelaic-ampoule-a1',
    name: 'Ampoule Apaisante A1',
    brand: 'VT',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1905,
    description: `Ampoule apaisante à l'acide azélaïque(20%) enrichie en exosomes de Centella Asiatica. Régule la production de sébum, calme les rougeurs et affine le grain de peau. Formule légèrement acide pour équilibrer le pH, sans fragrance artificielle.`,
    notes:
      'Contient de la Cyanocobalamine (B12) et un complexe hyaluronique multi-poids (sodium hyaluronate, acide hyaluronique hydrolysé, sodium hyaluronate crosspolymer). Idéal peaux sensibles et acnéiques.',
    inci: 'WATER, PROPYLENE GLYCOL, AZELAIC ACID, TROMETHAMINE, 1,2-HEXANEDIOL, PANTHENOL, POLYGLYCERYL-10 LAURATE, ETHYLHEXYLGLYCERIN, XANTHAN GUM, CYANOCOBALAMIN, DIPOTASSIUM GLYCYRRHIZATE, LACTOBACILLUS/SOYMILK FERMENT FILTRATE, BUTYLENE GLYCOL, SODIUM HYALURONATE, XYLITYLGLUCOSIDE, ANHYDROXYLITOL, PENTYLENE GLYCOL, XYLITOL, MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF EXTRACT, HYDROXYPROPYLTRIMONIUM HYALURONATE, HOUTTUYNIA CORDATA EXTRACT, CENTELLA ASIATICA EXTRACT, TOCOPHEROL, MADECASSOSIDE, HYDROLYZED HYALURONIC ACID, SODIUM ACETYLATED HYALURONATE, DEXTRIN, HYALURONIC ACID, ASIATICOSIDE, HYDROLYZED SODIUM HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, POTASSIUM HYALURONATE',
    url: 'https://www.yesstyle.com/fr/tcuc.EUR/coc.FR/info.html/pid.1134366027?utm_source=GoogleAds&utm_campaign=1432964344&utm_term=&utm_content=61606046332_275208218560&utm_medium=Shopping&bac=J1ZE5O8M&mcg=paidsearch&gad_source=1&gad_campaignid=1432964344&gbraid=0AAAAAD3WTkkpBonIFgUbA8-3YKJlF8y5y&gclid=CjwKCAjw14zPBhAuEiwAP3-EbzJlAPZVo5iM0gstmvB2prSvmF_kdNYixKnrGJBW3-z7OCS3EAPsCBoCbO0QAvD_BwE',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.ANTI_ROUGEURS],
      secondary: [
        TAG_SLUGS.AMPOULE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.CICATRISATION,
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
        concentrationValue: 20,
        concentrationUnit: '%',
        notes: 'Régule la production de sébum, calme rougeurs, affine le grain de peau.',
      },
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: `Extrait de Cica sous forme d'exosomes nanoscopiques. Soin apaisant intense et réparateur.`,
      },
      {
        slug: INGREDIENT_SLUGS.MADECASSOSIDE,
        notes:
          'Triterpène de Centella. Anti-inflammatoire puissant et réparateur de la barrière cutanée.',
      },
      {
        slug: INGREDIENT_SLUGS.ASIATICOSIDE,
        notes:
          'Triterpène de Centella. Stimule la synthèse de collagène et apaise les irritations.',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes:
          'Complexe hyaluronique multi-poids (4 formes) pour hydratation profonde et surfacique.',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Provitamine B5. Hydratante, cicatrisante et apaisante.',
      },
      {
        slug: INGREDIENT_SLUGS.CYANOCOBALAMIN,
        notes: 'Vitamine B12. Apaise les rougeurs et régule la mélanogenèse.',
      },
      {
        slug: INGREDIENT_SLUGS.TEA_TREE,
        notes: `Antibactérien naturel. Renforce l'action anti-acné de l'acide azélaïque.`,
      },
    ],
  },
  {
    slug: 'vt-az-care-cleansing-oil',
    name: 'AZ Care Cleansing Oil',
    brand: 'VT',
    kind: 'cleanser',
    unit: 'pump',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 1789,
    description: `Huile démaquillante azélaïque enrichie d'un complexe 4 acides (AHA/BHA/PHA/LHA) et d'exosomes de Centella Asiatica. Élimine le maquillage, exfolie doucement et apaise. Formule aux 12 huiles végétales précieuses. Se transforme en émulsion au contact de l'eau.`,
    notes: `Contient Fragrance + huiles essentielles (yuzu, gingembre). À éviter peaux réactives. Contient Retinol (bas de liste) — ne pas superposer avec rétinol actif. Capryloyl Salicylic Acid = LHA.`,
    inci: 'ETHYLHEXYL PALMITATE, SORBETH-30 TETRAOLEATE, ISOPROPYL PALMITATE, CETYL ETHYLHEXANOATE, TRIETHYLHEXANOIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, DIISOSTEARYL MALATE, SORBITAN SESQUIOLEATE, FRAGRANCE, LITHOSPERMUM ERYTHRORHIZON ROOT EXTRACT, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, WATER, ARGANIA SPINOSA KERNEL OIL, CITRUS JUNOS FRUIT OIL, GLYCINE MAX (SOYBEAN) OIL, GLYCINE SOJA (SOYBEAN) OIL, ORYZA SATIVA (RICE) BRAN OIL, PANAX GINSENG SEED OIL, PROPANEDIOL, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) OIL, PUNICA GRANATUM SEED OIL, PYRUS MALUS (APPLE) SEED OIL, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, CAMELLIA JAPONICA SEED OIL, ALLANTOIN, AZELAIC ACID, CAPRYLOYL SALICYLIC ACID, GLUCONOLACTONE, MANDELIC ACID, PROPYLENE GLYCOL, SALICYLIC ACID, SQUALANE, PENTYLENE GLYCOL, ADANSONIA DIGITATA SEED OIL, BUTYLENE GLYCOL, CAMELLIA OLEIFERA SEED OIL, CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, HIPPOPHAE RHAMNOIDES OIL, MADECASSOSIDE, OLEA EUROPAEA (OLIVE) FRUIT OIL, PERSEA GRATISSIMA (AVOCADO) OIL, PRUNUS ARMENIACA (APRICOT) KERNEL OIL, RIBES NIGRUM (BLACK CURRANT) SEED OIL, 1,2-HEXANEDIOL, DECYL GLUCOSIDE, CENTELLA ASIATICA EXTRACT, MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF EXTRACT, PHOSPHOLIPIDS, RETINOL',
    url: 'https://www.yesstyle.com/fr/vt',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.GRAIN_PEAU, TAG_SLUGS.PORES_DILATES],
      secondary: [
        TAG_SLUGS.HUILE_DEMAQUILLANTE,
        TAG_SLUGS.NETTOYANT,
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.PEAU_SENSIBLE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.AZELAIC_ACID, notes: 'Actif azélaïque principal.' },
      {
        slug: INGREDIENT_SLUGS.CAPRYLOYL_SALICYLIC_ACID,
        notes: 'LHA lipophile — exfoliation douce, débouchage pores.',
      },
      { slug: INGREDIENT_SLUGS.PHA, notes: 'Gluconolactone — exfoliant doux, hydratant.' },
      { slug: INGREDIENT_SLUGS.MANDELIC_ACID, notes: 'AHA doux antibactérien.' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA classique — pores et sébum.' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Émollient léger.' },
      { slug: INGREDIENT_SLUGS.MADECASSOSIDE, notes: 'Anti-inflammatoire Cica.' },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Exosome Cica apaisant.' },
      {
        slug: INGREDIENT_SLUGS.RETINOL,
        notes: 'Bas de liste INCI — présence résiduelle. Ne pas combiner avec rétinol actif.',
      },
    ],
  },

  {
    slug: 'vt-az-care-toner-pad',
    name: 'AZ Care Toner Pad',
    brand: 'VT',
    kind: 'toner',
    unit: 'bottle',
    totalAmount: 180,
    amountUnit: 'ml',
    priceCents: 1708,
    description: `Disques toniques quotidiens à l'acide azélaïque. Régulent l'excès de sébum, exfolient doucement (AHA/BHA/PHA/LHA) et apaisent grâce aux exosomes Cica. pH légèrement acide. Côté texturé exfoliant + côté lisse apaisant. 60 pads + pince incluse.`,
    notes: `Formule sans parfum. Complexe hyaluronique 7 formes (sodium hyaluronate + 6 dérivés). Contenance en ml = volume liquide pour 60 pads.`,
    inci: 'WATER, BUTYLENE GLYCOL, GLYCERIN, METHYLPROPANEDIOL, 1,2-HEXANEDIOL, HYDROXYACETOPHENONE, ALLANTOIN, ETHYLHEXYLGLYCERIN, PANTHENOL, DISODIUM EDTA, XANTHAN GUM, SODIUM HYALURONATE, AZELAIC ACID, GLUCONOLACTONE, SALICYLIC ACID, CITRIC ACID, CAPRYLOYL SALICYLIC ACID, MADECASSOSIDE, CENTELLA ASIATICA EXTRACT, PROPANEDIOL, PROPYLENE GLYCOL, DIOSPYROS KAKI LEAF EXTRACT, MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF EXTRACT, VITIS VINIFERA (GRAPE) FRUIT EXTRACT, HYDROLYZED SODIUM HYALURONATE, HYDROLYZED HYALURONIC ACID, CARTHAMUS TINCTORIUS (SAFFLOWER) FLOWER EXTRACT, COFFEA ARABICA (COFFEE) SEED EXTRACT, POLYGONUM CUSPIDATUM ROOT EXTRACT, CAMELLIA SINENSIS LEAF EXTRACT, CASTANEA CRENATA (CHESTNUT) SHELL EXTRACT, ZANTHOXYLUM PIPERITUM FRUIT EXTRACT, SODIUM BENZOATE, SODIUM ACETYLATED HYALURONATE, HYDROXYPROPYLTRIMONIUM HYALURONATE, DIMETHYLSILANOL HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, PENTYLENE GLYCOL, HYALURONIC ACID, POTASSIUM HYALURONATE',
    url: 'https://www.yesstyle.com/fr/vt',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.GRAIN_PEAU, TAG_SLUGS.PORES_DILATES],
      secondary: [
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.AZELAIC_ACID, notes: 'Anti-acné, sébum, grain de peau.' },
      { slug: INGREDIENT_SLUGS.PHA, notes: 'Gluconolactone — exfoliant doux hydratant.' },
      { slug: INGREDIENT_SLUGS.SALICYLIC_ACID, notes: 'BHA — pores et sébum.' },
      {
        slug: INGREDIENT_SLUGS.CAPRYLOYL_SALICYLIC_ACID,
        notes: 'LHA lipophile — exfoliation douce.',
      },
      { slug: INGREDIENT_SLUGS.MADECASSOSIDE, notes: 'Anti-inflammatoire Cica.' },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Exosome Cica apaisant.' },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: "7 formes d'HA — hydratation multi-profondeur.",
      },
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Provitamine B5 apaisante.' },
    ],
  },
]
