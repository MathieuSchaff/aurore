import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const THE_INKEY_LIST_SEED: UnifiedProductSeed[] = [
  {
    slug: 'the-inkey-list-urea-10-hydratant',
    name: 'Urea 10% Hydratant',
    brand: 'The Inkey List',
    kind: 'moisturizer',
    unit: 'tube',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 1990,
    description: `Soin hydratant visage à 10% d'urée développé avec des dermatologues. Cible le dessèchement sévère en apportant une hydratation immédiate. Exfolie délicatement les rugosités tout en apaisant et nourrissant la peau très sèche.`,
    notes:
      'Formulation clean et minimaliste. Absorption rapide, non comédogène. Convient aux peaux sensibles. Contient huile de carthame et squalane pour renforcer la barrière cutanée. Sans parfum.',
    inci: 'WATER, UREA, CAPRYLIC/CAPRIC TRIGLYCERIDE, GLYCERIN, CETEARYL ALCOHOL, GLYCERYL STEARATE SE, AVENA SATIVA KERNEL FLOUR, CARTHAMUS TINCTORIUS SEED OIL, SQUALANE, PHENOXYETHANOL, BENZYL ALCOHOL, SODIUM CARBOMER, SODIUM STEAROYL GLUTAMATE, CITRIC ACID, ETHYLHEXYLGLYCERIN, SODIUM GLUCONATE, DEHYDROACETIC ACID',
    url: 'https://www.theinkeylist.com/products/urea',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.GRAIN_PEAU],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.TEXTURE_LEGERE,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.UREA,
        concentrationValue: 10,
        concentrationUnit: '%',
        notes: 'Concentration optimale pour visage: hydrate et exfolie délicatement sans agresser.',
      },
      {
        slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
        notes: `Farine d'avoine colloïdale apaisante. Idéale pour peaux sensibles et réactives.`,
      },
      {
        slug: INGREDIENT_SLUGS.SQUALANE,
        notes: 'Squalane végétal émollient léger. Renforce barrière sans effet gras.',
      },
      {
        slug: INGREDIENT_SLUGS.HUILE_CARTHAME,
        notes: 'Huile de carthame riche en acide linoléique. Nourrissante et réparatrice.',
      },
      {
        slug: INGREDIENT_SLUGS.CAPRYLIC_CAPRIC_TRIGLYCERIDE,
        notes: 'Triglycérides légers émolients. Texture fluide et absorption rapide.',
      },
      {
        slug: INGREDIENT_SLUGS.CETEARYL_ALCOHOL,
        notes: 'Alcool gras émollient et stabilisant. Texture crème confortable.',
      },
    ],
  },

  {
    slug: 'inkey-list-azelaic-acid-serum',
    name: 'Solution Anti-Rougeurs Acide Azélaïque 10%',
    brand: 'The Inkey List',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1900,
    description: `Développé en collaboration avec des dermatologues, ce sérum d'absorption rapide à l'acide azélaïque 10% réduit l'apparence des rougeurs, unifie le teint et apaise immédiatement la peau. Ses particules vertes fines masquent instantanément les rougeurs.`,
    notes: `Formule non-peluchante, sans occlusion. Contient de l'allantoin et de l'extrait de Gardenia Florida pour apaiser et protéger.`,
    inci: 'WATER, AZELAIC ACID, PROPANEDIOL, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, PHENOXYETHANOL, ACACIA SENEGAL GUM, XANTHAN GUM, ALLANTOIN, GLYCERIN, ETHYLHEXYLGLYCERIN, POLYSORBATE 60, SORBITAN ISOSTEARATE, MALTODEXTRIN, SODIUM HYDROXIDE, HYDROLYZED GARDENIA FLORIDA EXTRACT, GARDENIA FLORIDA FRUIT EXTRACT, POLYLYSINE',
    url: 'https://www.sephora.fr/marques/de-a-a-z/the-inkey-list-inkey/',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ECLAT],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PIGMENTS_VERTS,
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
        concentrationValue: 10,
        concentrationUnit: '%',
        notes: 'réduit les rougeurs, unifie le teint, apaise la peau.',
      },
      {
        slug: INGREDIENT_SLUGS.ALLANTOIN,
        notes: `Agent apaisant et kératolytique doux. Renforce la tolérance à l'acide azélaïque.`,
      },
      { slug: INGREDIENT_SLUGS.GLYCERIN, notes: 'Humectant pour maintenir le confort cutané.' },
    ],
  },
]
