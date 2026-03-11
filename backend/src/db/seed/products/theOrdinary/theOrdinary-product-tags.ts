import { TAG_SLUGS } from '../../tags/seed-tags'
import { TO_PRODUCT_SLUGS } from './theOrdinary'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Actions cibles & Bénéfices)
  secondary: string[] // Tags secondaires (Formats, pureté, types de peau)
  avoid: string[] // Tags à éviter/exclure
}

export const TO_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Niacinamide 10% + Zinc 1% : Régulation sébum + pores
  [TO_PRODUCT_SLUGS.TO_NIACINAMIDE_10_ZINC_1]: {
    primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.SEBO_REGULATEUR, TAG_SLUGS.ANTI_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.MATIFIANT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },

  // ── Hyaluronic Acid 2% + B5 : Hydratation multi-profondeur
  [TO_PRODUCT_SLUGS.TO_HYALURONIC_ACID_2_B5]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.HUMECTANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.CRUELTY_FREE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HYDRATATION,
    ],
    avoid: [],
  },

  // ── Caffeine Solution 5% + EGCG : Contour yeux décongestionnant
  [TO_PRODUCT_SLUGS.TO_CAFFEINE_5_EGCG]: {
    primary: [TAG_SLUGS.CERNES_POCHES, TAG_SLUGS.ANTI_OXYDANT],
    secondary: [
      TAG_SLUGS.CONTOUR_YEUX,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SOIN_YEUX,
    ],
    avoid: [],
  },

  // ── Azelaic Acid Suspension 10% : Anti-imperfections + éclaircissant
  [TO_PRODUCT_SLUGS.TO_AZELAIC_ACID_10]: {
    primary: [
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.HYPERPIGMENTATION,
    ],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },

  // ── Multi-Peptide + Copper Peptides 1% : Anti-âge avancé GHK-Cu
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDE_COPPER_1]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPULPANT, TAG_SLUGS.REPARATEUR],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },

  // ── Matrixyl 10% + HA : Boost collagène + rides/fermeté
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MATRIXYL_10_HA]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },

  // ── Multi-Peptides + HA Serum (ex-Buffet) : Multi-peptides complet
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDES_HA_EX_BUFFET]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },

  // ── Multi-Peptides Serum Yeux : Contour yeux + peptides + caféine
  [TO_PRODUCT_SLUGS.THE_ORDINARY_MULTI_PEPTIDES_YEUX]: {
    primary: [TAG_SLUGS.CERNES_POCHES, TAG_SLUGS.ANTI_AGE],
    secondary: [
      TAG_SLUGS.CONTOUR_YEUX,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.REPULPANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SOIN_YEUX,
    ],
    avoid: [],
  },

  // ── Sérum Éclat Multi-Antioxydant : Protection + éclat quotidien
  [TO_PRODUCT_SLUGS.THE_ORDINARY_ECLAT_MULTI_ANTIOXYDANT]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_OXYDANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HYPERPIGMENTATION,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },

  // ── Solution GF 15% (Facteurs de Croissance) : Anti-âge avancé
  [TO_PRODUCT_SLUGS.THE_ORDINARY_SOLUTION_GF_15]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },
}
