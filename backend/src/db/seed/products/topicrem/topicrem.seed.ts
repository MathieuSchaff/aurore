import { TAG_SLUGS } from '../../tags/seed-tags'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../unified-types'

export const TOPICREM_SEED: UnifiedProductSeed[] = [
  {
    slug: 'topicrem-ur-10-creme-lissante-500ml',
    name: 'UR-10 Crème Lissante Anti-Rugosités',
    brand: 'Topicrem',
    kind: 'body-lotion',
    unit: 'pump',
    totalAmount: 500,
    amountUnit: 'ml',
    priceCents: 1678,
    description: `Crème corps lissante anti-rugosités pour les \"peaux de croco\". Concentration modérée en urée (10%) associée à la cire d'abeille pour rétablir l'hydratation, restaurer le film protecteur et nourrir intensément les peaux extra-sèches.`,
    notes: `10% d'urée - concentration adaptée pour un usage corporel régulier. Texture épaisse et nourrissante. Contient parfum. Ne pas appliquer sur le visage, les lésions ou les enfants <3 ans.`,
    inci: 'WATER, PARAFFINUM LIQUIDUM, UREA, CERA ALBA, CETEARYL ETHYLHEXANOATE, ISOPROPYL ISOSTEARATE, PALMITIC ACID, STEARIC ACID, ISOPROPYL MYRISTATE, PHENOXYETHANOL, GLYCERYL STEARATE, PEG-100 STEARATE, CARBOMER, CHLORPHENESIN, SODIUM HYDROXIDE, PARFUM',
    url: 'https://pharmacie-citypharma.fr/fr/topicrem-ur10-creme-lissante-a-rugosites-500ml',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.GRAIN_PEAU],
      secondary: [
        TAG_SLUGS.CREME_CORPS,
        TAG_SLUGS.LAIT_CORPS,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_ATOPIQUE,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.UREA, concentrationValue: 10, concentrationUnit: '%', notes: `Concentration modérée adaptée à l'usage corporel quotidien. Exfoliation douce + hydratation.`,},
      { slug: INGREDIENT_SLUGS.CIRE_ABEILLE, notes: `Cire d'abeille émolliente et protectrice. Restaure le film hydrolipidique des peaux extra-sèches.`,},
      { slug: INGREDIENT_SLUGS.CETEARYL_ALCOHOL, notes: 'Alcool gras émollient et émulsifiant. Contribue à la texture riche et nourrissante.',},
      { slug: INGREDIENT_SLUGS.GLYCERYL_STEARATE, notes: 'Émulsifiant et agent émollient. Stabilise la formule tout en apportant douceur.',},
    ],
  },

  {
    slug: 'topicrem-ultra-hydratant-creme-riche',
    name: 'Ultra Hydratant Crème Riche',
    brand: 'Topicrem',
    kind: 'moisturizer',
    unit: 'tube',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1089,
    description: `Crème hydratante éclat 24h pour peaux sensibles sèches à très sèches. Enrichie en actif anti-pollution et agents hydratants pour protéger des agressions extérieures et révéler l'éclat du teint. Texture onctueuse non grasse.`,
    notes: 'Formulation douce avec parfum floral sans allergènes. Contient urée à concentration modérée, beurre de karité et agents émollients. Fini doux et confortable. Testée sous contrôle dermatologique.',
    inci: 'WATER, ISOPROPYL ISOSTEARATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLYCERIN, PARAFFINUM LIQUIDUM, BUTYROSPERMUM PARKII BUTTER, POLYSORBATE 60, SORBITAN STEARATE, CETYL ALCOHOL, CERA ALBA, GLYCERYL STEARATE, PEG-100 STEARATE, UREA, OCTYLDODECYL PCA, XANTHAN GUM, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN, SODIUM POLYACRYLATE, TOCOPHEROL, CHLORPHENESIN, SODIUM HYDROXIDE, PARFUM',
    url: 'https://pharmacie-citypharma.fr/fr/topicrem-ultra-hydratant-creme-riche-40ml',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.TEINT_TERNE],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.TEXTURE_RICHE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.UREA, notes: 'Urée à concentration modérée. Hydratation et exfoliation douce visage.',},
      { slug: INGREDIENT_SLUGS.SHEA_BUTTER, notes: 'Beurre de karité nourrissant intense. Adapté aux peaux sensibles sèches à très sèches.',},
      { slug: INGREDIENT_SLUGS.CIRE_ABEILLE, notes: `Cire d'abeille protectrice et émolliente. Renforce la barrière cutanée.`,},
      { slug: INGREDIENT_SLUGS.CAPRYLIC_CAPRIC_TRIGLYCERIDE, notes: 'Triglycérides neutres émolients légers. Texture non grasse malgré la richesse.',},
      { slug: INGREDIENT_SLUGS.GLYCERIN, notes: `Humectant principal attirant l'eau et maintenant l'hydratation 24h.`,},
      { slug: INGREDIENT_SLUGS.TOCOPHEROL, notes: 'Vitamine E antioxydante. Protège des agressions extérieures (anti-pollution).',},
    ],
  },
]
