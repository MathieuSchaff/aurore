import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const MAD_ABOUT_SKIN_SEED: UnifiedProductSeed[] = [
  {
    slug: 'mad-about-skin-serum-copper-peptide',
    name: 'Sérum Copper Peptide',
    brand: 'MAD about skin',
    kind: 'serum',
    unit: 'pump',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2400,
    description:
      'Sérum 3% peptides cuivre (2 formes) + 4 peptides. Anti-âge global, raffermissant, réparateur.',
    notes: 'GHK-Cu + Copper Gluconate + Matrixyl-like. Texture aqueuse, jour/nuit, tous types.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, PENTYLENE GLYCOL, COPPER TRIPEPTIDE-1, COPPER GLUCONATE, PALMITOYL TRIPEPTIDE-1, PALMITOYL TETRAPEPTIDE-7, PALMITOYL TRIPEPTIDE-38, TRIPEPTIDE-1, SODIUM HYALURONATE, PANTHENOL, ALLANTOIN, CARBOMER, SODIUM HYDROXIDE, PHENOXYETHANOL, ETHYLHEXYLGLYCERIN',
    url: 'https://madaboutskin.fr',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPULPANT, TAG_SLUGS.BARRIERE_CUTANEE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ECLAT,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.COPPER_PEPTIDES,
        concentrationValue: 3,
        concentrationUnit: '%',
        notes: 'GHK-Cu : Régénération intense et synthèse de collagène',
      },
      {
        slug: INGREDIENT_SLUGS.PEPTIDES,
        notes: 'Complexe raffermissant type Matrixyl (4 formes différentes)',
      },
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Hydratation profonde et effet repulpant',
      },
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Vitamine B5 : Répare la barrière cutanée',
      },
    ],
  },
]
