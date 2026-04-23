import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const ACM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'acm-rosakalm-creme-anti-rougeurs',
    name: 'Rosakalm Crème anti-rougeurs',
    brand: 'Laboratoire ACM',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1250,
    description:
      'Crème légère qui diminue les rougeurs et améliore la microcirculation. Soulage immédiatement les tiraillements.',
    notes:
      'Complexe RK* (olivier, argousier, thé vert) et Ruscus. Pigments verts pour un effet unifiant. Excellent rapport qualité/prix.',
    inci: 'WATER, GLYCERIN, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, SESAMUM INDICUM (SESAME) SEED OIL, LAURYL LAURATE, CETEARYL ALCOHOL, MICROCRYSTALLINE CELLULOSE, MANNITOL, RUSCUS ACULEATUS ROOT EXTRACT, SODIUM HYALURONATE, ASTER TRIPOLIUM EXTRACT, GLYCINE SOJA (SOYBEAN) OIL, SAMBUCUS NIGRA FLOWER EXTRACT, CAMELLIA SINENSIS LEAF EXTRACT, HIPPOPHAE RHAMNOIDES FRUIT EXTRACT, OLEA EUROPAEA (OLIVE) LEAF EXTRACT, TOCOPHEROL, CETEARYL GLUCOSIDE, CELLULOSE GUM, GLYCERYL STEARATE, POLYGLYCERYL-3 STEARATE, XANTHAN GUM, CAPRYLIC/CAPRIC TRIGLYCERIDE, MICA, TETRASODIUM GLUTAMATE DIACETATE, DEHYDROACETIC ACID, CITRIC ACID, BENZYL ALCOHOL, CI 77891 (TITANIUM DIOXIDE), CI 77289 (CHROMIUM HYDROXIDE GREEN), POTASSIUM SORBATE, SODIUM BENZOATE, PARFUM (FRAGRANCE)',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.COUPEROSE, TAG_SLUGS.FLUSHS],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.PIGMENTS_VERTS,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.BIO_NATUREL,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS, notes: 'Améliore la microcirculation' },
      { slug: INGREDIENT_SLUGS.ASTER_TRIPOLIUM, notes: 'Anti-inflammatoire et anti-rougeurs' },
      { slug: INGREDIENT_SLUGS.SAMBUCUS_NIGRA, notes: 'Apaisant et protecteur' },
      { slug: INGREDIENT_SLUGS.GREEN_TEA, notes: 'Complexe RK* : antioxydant' },
      { slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER, notes: 'Complexe RK* : protecteur' },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation immédiate' },
    ],
  },

  {
    slug: 'acm-azeane-creme-15',
    name: 'Azéane Crème Acide Azélaïque 15%',
    brand: 'ACM',
    kind: 'moisturizer',
    unit: 'tube',
    totalAmount: 30,
    amountUnit: 'g',
    priceCents: 1599,
    description: `Crème dermatologique à l'acide azélaïque 15% + niacinamide. Réduit taches, imperfections et rougeurs. Prouvée cliniquement : 94% des utilisateurs observent une atténuation des taches en moins de 2 semaines. Convient à tous types de peaux dès 10 ans, et aux femmes enceintes ou allaitantes.`,
    notes:
      'Association acide azélaïque 15% (antibactérien, kératolytique, anti-taches) + niacinamide (anti-inflammatoire, dépigmentant). Safe pendant la grossesse.',
    inci: 'WATER, AZELAIC ACID, OCTYLDODECYL MYRISTATE, ISONONYL ISONONANOATE, ISOSTEARYL ISOSTEARATE, CETYL ALCOHOL, GLYCERYL STEARATE, ETHOXYDIGLYCOL, GLYCERIN, COCO-CAPRYLATE/CAPRATE, NIACINAMIDE, XYLITOL, PEG-75 STEARATE, PENTYLENE GLYCOL, CETEARYL ALCOHOL, CETETH-20, STEARETH-20, GLYCERYL CAPRYLATE/CAPRATE',
    url: 'https://labo-acm.com',
    tags: {
      primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.TEINT_TERNE],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.MATIFIANT,
        TAG_SLUGS.ANTI_TACHES,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.GROSSESSE_COMPATIBLE,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        notes:
          '15% — antibactérien, kératolytique, anti-taches, anti-inflammatoire et sebum-control.',
      },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: 'Freine le transfert de mélanine, effet dépigmentant et anti-inflammatoire.',
      },
      {
        slug: INGREDIENT_SLUGS.XYLITOL,
        notes: 'Sucre-alcool humectant. Renforce le microbiome cutané et la barrière hydrique.',
      },
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
        notes:
          'Humectant de base. Maintient le confort cutané malgré la concentration élevée en acide azélaïque.',
      },
    ],
  },
  {
    slug: 'acm-novophane-protocole-anti-chute-chronique-in-out-300668',
    name: 'ACM Novophane Protocole Anti-Chute Chronique In & Out',
    brand: 'ACM',
    kind: 'exfoliant',
    unit: 'tube',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 5357,
    description: '',
    notes: '',
    inci: '',
    url: 'https://www.atida.fr/acm-novophane-protocole-anti-chute-chronique-in-out.html',
    imageUrl:
      'https://assets.atida.com/transform/af7b91dc-5e1b-4880-b977-34cb9cd5e332/ACM-Novophane-Protocole-Anti-Chute-Chronique-In-Out?io=transform:extend,width:600,height:600',
    tags: {
      primary: [],
      secondary: [TAG_SLUGS.EXFOLIATION, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'acm-novophane-chronic-lotion-anti-chute-100ml-286226',
    name: 'ACM Novophane Chronic Lotion Anti-Chute 100ml',
    brand: 'ACM',
    kind: 'exfoliant',
    unit: 'tube',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 2862,
    description: '',
    notes: '',
    inci: 'Aqua (Water), Alcohol Denat., Dipropylene Glycol, Propanediol, Butylene Glycol, Glycerin, PEG-40 Hydrogenated Castor Oil, Niacinamide, Pyridoxine HCL, Larix Europaea Wood Extract, Apigenin, Camellia Sinensis Leaf Extract, Glycine, Biotinoyl Tripeptide-1, 1,2-Hexanediol, Sodium Benzoate, PPG-26-Buteth-26, Sodium Metabisulfite, Zinc Chloride, Oleanolic Acid.',
    url: 'https://www.atida.fr/acm-novophane-chronic-lotion-anti-chute-100ml.html',
    imageUrl:
      'https://assets.atida.com/transform/63f5adc4-4c36-4d94-a992-5c32df7831ff/ACM-Novophane-Chronic-Lotion-Anti-Chute-100ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.HUMECTANT,
        TAG_SLUGS.SEBO_REGULATEUR,
        TAG_SLUGS.EXFOLIATION,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    slug: 'acm-novophane-60-gelules-259123',
    name: 'ACM Novophane 60 gélules',
    brand: 'ACM',
    kind: 'exfoliant',
    unit: 'tube',
    totalAmount: 60,
    amountUnit: 'g',
    priceCents: 1406,
    description: '',
    notes: '',
    inci: 'Pour la liste des ingrédients et des allergènes se référer à l’image produit.',
    url: 'https://www.atida.fr/novophane-60-gelules.html',
    imageUrl:
      'https://assets.atida.com/transform/291b6398-0eb8-45d5-b1a4-5e8bda813d51/ACM-Novophane-60-gelules?io=transform:extend,width:600,height:600',
    tags: {
      primary: [],
      secondary: [TAG_SLUGS.EXFOLIATION, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [],
  },
]
