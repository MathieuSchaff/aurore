import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const SKINCEUTICALS_SEED: UnifiedProductSeed[] = [
  {
    slug: 'skinceuticals-lip-repair-serum-gel',
    name: 'Sérum Gel Antioxydant Lip Repair',
    brand: 'SkinCeuticals',
    kind: 'lip-care',
    unit: 'tube',
    totalAmount: 10,
    amountUnit: 'ml',
    priceCents: 4489,
    description:
      'Soin émollient ultime pour les lèvres. Neutralise les dommages environnementaux (pollution, vent) grâce à des antioxydants puissants. Hydrate intensément, lisse et repulpe les lèvres desséchées tout en prévenant le vieillissement cutané.',
    notes:
      'Formule premium avec Silymarine (extrait de chardon-Marie), Vitamine E, Acide Hyaluronique et Hydroxyethyl Urée. Contient également Allantoïne apaisante et peptides régénérants. Texture gel fondante.',
    inci: 'WATER, HYDROGENATED POLYISOBUTENE, GLYCERIN, CERA MICROCRISTALLINA, DIMETHICONE, UNDECANE, TRIDECANE, PEG/PPG-18/18 DIMETHICONE, SILICA, ALCOHOL DENAT., TOCOPHERYL ACETATE, POLYMETHYLSILSESQUIOXANE, ETHYLENE PALMITATE, PHENOXYETHANOL, LAURYL PEG-9 POLYDIMETHYLSILOXYETHYL DIMETHICONE, TOCOPHEROL, MAGNESIUM SULFATE, DISTEARDIMONIUM HECTORITE, GLUCOSAMINE HCL, TRIBEHENIN, CAPRYLYL GLYCOL, ALLANTOIN, DISODIUM EDTA, HYDROXYETHYL UREA, SORBITAN ISOSTEARATE, SODIUM HYALURONATE, FAEX EXTRACT, BIOSACCHARIDE GUM-1, PALMITOYL OLIGOPEPTIDE, SILYBUM MARIANUM EXTRACT',
    url: 'https://www.skinceuticals.fr/lip-repair',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ANTI_AGE],
      secondary: [
        TAG_SLUGS.SOIN_LEVRES,
        TAG_SLUGS.ZONE_LEVRES,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.SOIN_LOCALISE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.TOCOPHEROL, notes: 'Vitamine E pure antioxydante et nourrissante.' },
      { slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE, notes: 'Forme stable de Vitamine E.' },
      {
        slug: INGREDIENT_SLUGS.CHARDON_MARIE,
        notes: 'Extrait de chardon-Marie antioxydant puissant.',
      },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation profonde et repulpante.' },
      {
        slug: INGREDIENT_SLUGS.HYDROXYETHYL_UREA,
        notes: `Dérivé de l'urée aux propriétés hydratantes supérieures.`,
      },
      { slug: INGREDIENT_SLUGS.ALLANTOIN, notes: 'Agent apaisant végétal.' },
      {
        slug: INGREDIENT_SLUGS.PALMITOYL_OLIGOPEPTIDE,
        notes: 'Peptide régénérant stimulant le collagène.',
      },
      { slug: INGREDIENT_SLUGS.GLUCOSAMINE_HCL, notes: `Précurseur de l'acide hyaluronique.` },
    ],
  },
]
