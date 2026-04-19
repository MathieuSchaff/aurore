import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

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
    description: 'Crème légère qui diminue les rougeurs et améliore la microcirculation. Soulage immédiatement les tiraillements.',
    notes: 'Complexe RK* (olivier, argousier, thé vert) et Ruscus. Pigments verts pour un effet unifiant. Excellent rapport qualité/prix.',
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
      { slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS, notes: 'Améliore la microcirculation',},
      { slug: INGREDIENT_SLUGS.ASTER_TRIPOLIUM, notes: 'Anti-inflammatoire et anti-rougeurs',},
      { slug: INGREDIENT_SLUGS.SAMBUCUS_NIGRA, notes: 'Apaisant et protecteur',},
      { slug: INGREDIENT_SLUGS.GREEN_TEA, notes: 'Complexe RK* : antioxydant',},
      { slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER, notes: 'Complexe RK* : protecteur',},
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation immédiate',},
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
    notes: 'Association acide azélaïque 15% (antibactérien, kératolytique, anti-taches) + niacinamide (anti-inflammatoire, dépigmentant). Safe pendant la grossesse.',
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
      { slug: INGREDIENT_SLUGS.AZELAIC_ACID, notes: '15% — antibactérien, kératolytique, anti-taches, anti-inflammatoire et sebum-control.',},
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Freine le transfert de mélanine, effet dépigmentant et anti-inflammatoire.',},
      { slug: INGREDIENT_SLUGS.XYLITOL, notes: 'Sucre-alcool humectant. Renforce le microbiome cutané et la barrière hydrique.',},
      { slug: INGREDIENT_SLUGS.GLYCERIN, notes: 'Humectant de base. Maintient le confort cutané malgré la concentration élevée en acide azélaïque.',},
    ],
  },
]
