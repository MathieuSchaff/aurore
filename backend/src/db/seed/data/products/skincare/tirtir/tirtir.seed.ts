import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const TIRTIR_SEED: UnifiedProductSeed[] = [
  {
    slug: 'tirtir-azelaic-acid-12-serum',
    name: 'Azelaic Acid 12% Serum',
    brand: 'TIRTIR',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2995,
    description: `Sérum coréen à l'acide azélaïque 12% enrichi en céramides, zinc PCA, acide hyaluronique et extraits de plantes marines. Apaise les rougeurs, régule le sébum et renforce la barrière cutanée pour une peau nette et hydratée.`,
    notes:
      'Formule K-beauty multi-active avec Chondrus Crispus (algue rouge), Chlorella Vulgaris, extrait de canne à sucre et Ceramide NP pour renforcement de la barrière.',
    inci: 'WATER, AZELAIC ACID, PROPYLENE GLYCOL, SODIUM HYDROXIDE, PENTYLENE GLYCOL, PANTHENOL, SORBITOL, CHONDRUS CRISPUS EXTRACT, HYDROXYETHYLCELLULOSE, GLUCOSE, CHLORELLA VULGARIS EXTRACT, SACCHARUM OFFICINARUM EXTRACT, 1,2-HEXANEDIOL, FRUCTOOLIGOSACCHARIDES, FRUCTOSE, BUTYLENE GLYCOL, ETHYLHEXYLGLYCERIN, BIOSACCHARIDE GUM-1, XANTHAN GUM, TROMETHAMINE, TOCOPHEROL, ZINC PCA, BETAINE, DIPROPYLENE GLYCOL, HYALURONIC ACID/POLYISOPROPYLACRYLAMIDE COPOLYMER, CAPRYLYL/CAPRYL GLUCOSIDE, HYDROGENATED LECITHIN, CERAMIDE NP',
    url: 'https://www.zalando.fr/tirtir/',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_REACTIVE,
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
        concentrationValue: 12,
        concentrationUnit: '%',
        notes: 'Régule le sébum et apaise les rougeurs. Concentration intermédiaire efficace.',
      },
      {
        slug: INGREDIENT_SLUGS.CERAMIDE_NP,
        notes: 'Renforce la barrière cutanée et prévient la déshydratation transépidermique.',
      },
      { slug: INGREDIENT_SLUGS.ZINC_PCA, notes: 'Complément sebum-control et antibactérien.' },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: `Hydratation et repulpement. Compense l'effet desséchant potentiel de l'acide azélaïque.`,
      },
      {
        slug: INGREDIENT_SLUGS.CHONDRUS_CRISPUS,
        notes: `Extrait d'algue rouge. Filmogène, apaisant et riche en polysaccharides hydratants.`,
      },
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante. Protège la formule et la peau du stress oxydatif.',
      },
    ],
  },
]
