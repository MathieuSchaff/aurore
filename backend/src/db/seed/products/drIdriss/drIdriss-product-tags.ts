import { TAG_SLUGS } from '../../tags/seed-tags'
import { DR_IDRISS_PRODUCT_SLUGS } from './drIdriss'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Problématiques cibles)
  secondary: string[] // Tags secondaires (Étapes, formats, propriétés)
  avoid: string[] // Tags à éviter/exclure
}

export const DR_IDRISS_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── The Depuffer ────────────────────────────────────────────────────────
  [DR_IDRISS_PRODUCT_SLUGS.DR_IDRISS_THE_DEPUFFER]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.CERNES_POCHES, TAG_SLUGS.FLUSHS],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.SOIN_YEUX,
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.ZONE_YEUX,
      TAG_SLUGS.MATIN,
    ],
    avoid: [],
  },

  // ── Major Fade Hyper Serum ──────────────────────────────────────────────
  [DR_IDRISS_PRODUCT_SLUGS.DR_IDRISS_MAJOR_FADE_HYPER_SERUM]: {
    primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Major Fade Active Seal ──────────────────────────────────────────────
  [DR_IDRISS_PRODUCT_SLUGS.DR_IDRISS_MAJOR_FADE_ACTIVE_SEAL]: {
    primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.REPULPANT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Major Fade Disco Block SPF 50 ────────────────────────────────────────
  [DR_IDRISS_PRODUCT_SLUGS.DR_IDRISS_MAJOR_FADE_DISCO_BLOCK]: {
    primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.CREME_SOLAIRE_TEINTEE,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Major Fade Flash Mask ───────────────────────────────────────────────
  [DR_IDRISS_PRODUCT_SLUGS.DR_IDRISS_MAJOR_FADE_FLASH_MASK]: {
    primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.TEINT_TERNE],
    secondary: [
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.MASQUE_HYDRATANT,
      TAG_SLUGS.EXFOLIANT_CHIMIQUE,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.MASQUE_HEBDO,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Left Un-Red Reducer Serum ───────────────────────────────────────────
  [DR_IDRISS_PRODUCT_SLUGS.DR_IDRISS_LEFT_UN_RED_REDUCER_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.FLUSHS],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Left Un-Red CalmBack Cream ──────────────────────────────────────────
  [DR_IDRISS_PRODUCT_SLUGS.DR_IDRISS_LEFT_UN_RED_CALMBACK_CREAM]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },
}
