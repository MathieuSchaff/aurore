import { TAG_SLUGS } from '../../tags/seed-tags'
import { AZELAIQUE_PRODUCT_SLUGS } from './azelaique'

interface ProductTagGroups {
  primary: string[] // Cibles thérapeutiques (Acné, Rosacée, Taches)
  secondary: string[] // Routine, galénique et actifs secondaires
  avoid: string[] // Contre-indications ou exclusions
}

export const AZELAIQUE_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Nine Less - A-Control 10% Azelaic Acid Serum
  [AZELAIQUE_PRODUCT_SLUGS.NINE_LESS_A_CONTROL_10]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.POST_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.REPARATEUR, // Mucine d'escargot + Centella
      TAG_SLUGS.ANTI_AGE, // Peptides
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },

  // ── Purito Seoul - Azelaic Kojic Tea Tree Serum
  [AZELAIQUE_PRODUCT_SLUGS.PURITO_AZELAIC_KOJIC_TEA_TREE]: {
    primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_ACNE],
    secondary: [TAG_SLUGS.SEBO_REGULATEUR, TAG_SLUGS.ECLAT, TAG_SLUGS.SERUM, TAG_SLUGS.SANS_PARFUM],
    avoid: [
      TAG_SLUGS.PEAU_REACTIVE, // Tea tree + Kojic peut être sensibilisant
    ],
  },

  // ── Nooance - Sérum Acide Azélaïque 15%
  [AZELAIQUE_PRODUCT_SLUGS.NOOANCE_AZELAIC_15]: {
    primary: [TAG_SLUGS.ROSACEE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // ── Allies of Skin - Azelaic & Kojic Advanced Clarifying Serum
  [AZELAIQUE_PRODUCT_SLUGS.ALLIES_OF_SKIN_AZELAIC_KOJIC]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES],
    secondary: [
      TAG_SLUGS.ANTI_AGE, // Bakuchiol
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_REACTIVE, // Formule ultra-complexe (Kojique + Bakuchiol + Azélaïque)
      TAG_SLUGS.GROSSESSE_COMPATIBLE, // Présence de Bakuchiol (souvent exclu par précaution)
    ],
  },

  // ── Dr Sam - Flawless Brightly 10% Azelaic Acid Serum
  [AZELAIQUE_PRODUCT_SLUGS.DR_SAM_FLAWLESS_BRIGHTLY]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.POST_ACNE],
    secondary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [],
  },
}
