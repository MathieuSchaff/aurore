import { TAG_SLUGS } from '../../tags/seed-tags'
import { TO_PRODUCT_SLUGS } from './theOrdinary'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Actions cibles & Bénéfices)
  secondary: string[] // Tags secondaires (Formats, pureté, types de peau)
  avoid: string[] // Tags à éviter/exclure
}

export const TO_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  [TO_PRODUCT_SLUGS.TO_NIACINAMIDE_10_ZINC_1]: {
    primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.SEBO_REGULATEUR],
    secondary: [
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.BRILLANCE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },

  [TO_PRODUCT_SLUGS.TO_HYALURONIC_ACID_2_B5]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.CRUELTY_FREE,
    ],
    avoid: [],
  },
  // Caffeine Solution 5% + EGCG – Contour des yeux décongestionnant / anti-cernes
  [TO_PRODUCT_SLUGS.TO_CAFFEINE_5_EGCG]: {
    primary: [TAG_SLUGS.CERNES_POCHES, TAG_SLUGS.ANTI_OXYDANT],
    secondary: [
      TAG_SLUGS.CONTOUR_YEUX,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // Azelaic Acid Suspension 10% – Anti-imperfections, éclaircissant
  [TO_PRODUCT_SLUGS.TO_AZELAIC_ACID_10]: {
    primary: [
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.HYPERPIGMENTATION,
    ],
    secondary: [
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
    ],
    avoid: [],
  },

  // Multi-Peptide + Copper Peptides 1% – Anti-âge avancé, réparation, GHK-Cu
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDE_COPPER_1]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [],
  },

  // Matrixyl 10% + HA – Boost collagène, rides et fermeté
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MATRIXYL_10_HA]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HUMECTANT,
    ],
    avoid: [],
  },

  // Multi-Peptides + HA Serum (ex-Buffet) – Multi-peptides complet
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDES_HA_EX_BUFFET]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT, TAG_SLUGS.DESHYDRATATION],
    secondary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.SERUM, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // Multi-Peptides Serum Yeux – Contour yeux peptides + caffeine
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDES_YEUX]: {
    primary: [TAG_SLUGS.CERNES_POCHES, TAG_SLUGS.ANTI_AGE],
    secondary: [TAG_SLUGS.CONTOUR_YEUX, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // Sérum Éclat Multi-Antioxydant – Protection quotidienne + éclat
  [TO_PRODUCT_SLUGS.THE_ORDINARY_ECLAT_MULTI_ANTIOXYDANT]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION],
    secondary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.SERUM, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // Solution GF 15% (Facteurs de Croissance) – Anti-âge avancé, réparation profonde
  [TO_PRODUCT_SLUGS.THE_ORDINARY_SOLUTION_GF_15]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPARATEUR],
    secondary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.SERUM, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },
}
